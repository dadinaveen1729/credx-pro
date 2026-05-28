import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import clientPromise from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET - Retrieve payment history
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    
    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    const payments = await db.collection('payment_history')
      .find({ user_id })
      .sort({ created_at: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ 
      payments: payments.map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        description: payment.description,
        card_last4: payment.card_last4,
        card_brand: payment.card_brand,
        created_at: payment.created_at,
        bill_id: payment.bill_id,
        rewards_earned: payment.rewards_earned || 0
      }))
    });
  } catch (error) {
    console.error('Payment History Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payment history' },
      { status: 500 }
    );
  }
}

// POST - Create payment intent for bill payment
export async function POST(request) {
  try {
    const { amount, user_id, bill_id, description, card_id } = await request.json();
    
    if (!amount || !user_id) {
      return NextResponse.json(
        { error: 'Amount and user ID are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    // Get user details
    const user = await db.collection('users').findOne({ 
      $or: [
        { uid: user_id },
        { firebase_uid: user_id }
      ]
    });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        user_id,
        bill_id: bill_id || '',
        description: description || 'Bill Payment'
      },
      description: description || `CREDX USA - Bill Payment for ${user.email}`,
      receipt_email: user.email
    });

    // Calculate rewards (1 point per dollar spent)
    const rewardsEarned = Math.floor(amount);

    // Store payment record
    const paymentRecord = {
      id: paymentIntent.id,
      user_id,
      amount,
      currency: 'usd',
      status: 'pending',
      description: description || 'Bill Payment',
      bill_id: bill_id || null,
      client_secret: paymentIntent.client_secret,
      rewards_earned: rewardsEarned,
      created_at: new Date(),
      updated_at: new Date()
    };

    await db.collection('payment_history').insertOne(paymentRecord);

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount,
      rewards_earned: rewardsEarned,
      message: 'Payment intent created successfully'
    });
  } catch (error) {
    console.error('Stripe Payment Error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update payment status (webhook or confirmation)
export async function PUT(request) {
  try {
    const { payment_intent_id, status, card_last4, card_brand } = await request.json();
    
    if (!payment_intent_id || !status) {
      return NextResponse.json(
        { error: 'Payment intent ID and status are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    // Update payment record
    const updateData = {
      status,
      updated_at: new Date()
    };

    if (card_last4) updateData.card_last4 = card_last4;
    if (card_brand) updateData.card_brand = card_brand;

    const result = await db.collection('payment_history').updateOne(
      { id: payment_intent_id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // If payment succeeded, update user rewards
    if (status === 'succeeded') {
      const payment = await db.collection('payment_history').findOne({ id: payment_intent_id });
      if (payment && payment.rewards_earned) {
        await db.collection('users').updateOne(
          { uid: payment.user_id },
          { 
            $inc: { 
              total_rewards: payment.rewards_earned,
              lifetime_spending: payment.amount
            },
            $set: { updated_at: new Date() }
          }
        );
      }

      // If bill payment, mark bill as paid
      if (payment.bill_id) {
        await db.collection('user_bills').updateOne(
          { id: payment.bill_id, user_id: payment.user_id },
          { 
            $set: { 
              status: 'paid',
              paid_date: new Date(),
              updated_at: new Date()
            }
          }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    console.error('Payment Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    );
  }
}