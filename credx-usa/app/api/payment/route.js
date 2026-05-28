import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { amount, currency = 'usd', user_id, bill_id, bill_name, payment_method = 'card' } = await request.json();
    
    if (!amount || !user_id) {
      return NextResponse.json(
        { error: 'Amount and user ID are required' },
        { status: 400 }
      );
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: [payment_method],
      metadata: {
        user_id,
        bill_id: bill_id || '',
        bill_name: bill_name || '',
        source: 'credx_usa_bill_payment'
      },
      description: `CREDX USA - ${bill_name || 'Bill Payment'}: $${amount}`
    });

    // Log payment attempt in database
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    await db.collection('payment_attempts').insertOne({
      id: uuidv4(),
      user_id,
      bill_id,
      bill_name,
      amount,
      currency,
      payment_intent_id: paymentIntent.id,
      status: 'initiated',
      created_at: new Date(),
      metadata: {
        source: 'credx_bill_payment'
      }
    });

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      success: true
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const payment_intent_id = searchParams.get('payment_intent_id');
    
    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    let query = { user_id };
    if (payment_intent_id) {
      query.payment_intent_id = payment_intent_id;
    }
    
    const payments = await db.collection('payment_attempts')
      .find(query)
      .sort({ created_at: -1 })
      .limit(20)
      .toArray();
    
    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Payment retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payments' },
      { status: 500 }
    );
  }
}