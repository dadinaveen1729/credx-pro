import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { MongoClient, ServerApiVersion } from 'mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Database connection with Atlas support
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(process.env.MONGO_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await client.connect();
    const db = client.db(process.env.DB_NAME || 'credxusa');

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error in webhook:', error);
    throw new Error('Database connection failed');
  }
}

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      console.error('Missing Stripe signature or webhook secret');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Handle payment success
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const user_id = paymentIntent.metadata?.user_id;
      const amount = paymentIntent.amount / 100; // Convert from cents
      
      if (user_id) {
        // Calculate rewards (1000 points per $10)
        const rewardsEarned = Math.floor(amount / 10) * 1000;
        
        // Store payment record
        await db.collection('payment_history').insertOne({
          user_id: user_id,
          payment_intent_id: paymentIntent.id,
          amount: amount,
          currency: paymentIntent.currency,
          status: 'succeeded',
          rewards_earned: rewardsEarned,
          created_at: new Date().toISOString(),
          stripe_data: paymentIntent
        });

        // Update user rewards
        await db.collection('users').updateOne(
          { $or: [{ uid: user_id }, { firebase_uid: user_id }] },
          { 
            $inc: { 
              total_rewards: rewardsEarned,
              total_payments: amount 
            },
            $set: { 
              last_payment_date: new Date().toISOString() 
            }
          }
        );

        // Send notification (optional)
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: user_id,
              type: 'payment_success',
              message: `Payment successful! You earned ${rewardsEarned} points.`,
              amount: amount
            })
          });
        } catch (notifError) {
          console.log('Notification failed:', notifError.message);
        }

        console.log(`Payment processed: $${amount} for user ${user_id}, ${rewardsEarned} points earned`);
      }
    }

    // Handle payment failure
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const user_id = paymentIntent.metadata?.user_id;
      
      if (user_id) {
        await db.collection('payment_history').insertOne({
          user_id: user_id,
          payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: 'failed',
          error: paymentIntent.last_payment_error?.message,
          created_at: new Date().toISOString()
        });

        console.log(`Payment failed for user ${user_id}: ${paymentIntent.last_payment_error?.message}`);
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}

// Handle webhook verification
export async function GET() {
  return NextResponse.json({ 
    status: 'Stripe webhook endpoint active',
    timestamp: new Date().toISOString()
  });
}