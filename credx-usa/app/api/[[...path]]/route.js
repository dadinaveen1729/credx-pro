import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
import Stripe from 'stripe';

// Initialize Stripe with environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Database connection with proper error handling
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Use MongoDB Atlas connection string from environment
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
    console.error('MongoDB connection error:', error);
    throw new Error('Database connection failed');
  }
}

export async function GET(request, { params }) {
  try {
    const { path } = params;
    const { searchParams } = new URL(request.url);
    
    // Health check endpoint
    if (path?.[0] === 'health') {
      return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          stripe: 'configured',
          api: 'operational'
        }
      });
    }

    // User management endpoints
    if (path?.[0] === 'user') {
      const { db } = await connectToDatabase();
      const user_id = searchParams.get('user_id');
      
      if (!user_id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }

      const user = await db.collection('users').findOne({
        $or: [{ firebase_uid: user_id }, { uid: user_id }]
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ user });
    }

    // Stripe payment intent creation
    if (path?.[0] === 'stripe' && path?.[1] === 'create-payment-intent') {
      const amount = searchParams.get('amount');
      const currency = searchParams.get('currency') || 'usd';
      const user_id = searchParams.get('user_id');

      if (!amount || !user_id) {
        return NextResponse.json({ 
          error: 'Amount and user_id are required' 
        }, { status: 400 });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(amount) * 100), // Convert to cents
        currency: currency,
        metadata: { user_id }
      });

      return NextResponse.json({
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id
      });
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { path } = params;
    const body = await request.json();

    // User creation/update endpoint
    if (path?.[0] === 'user') {
      const { uid, firebase_uid, email, display_name, phone } = body;

      if (!uid && !firebase_uid) {
        return NextResponse.json({ 
          error: 'uid or firebase_uid is required' 
        }, { status: 400 });
      }

      const { db } = await connectToDatabase();
      
      const userData = {
        uid: uid || firebase_uid,
        firebase_uid: firebase_uid || uid,
        email,
        display_name,
        phone,
        updated_at: new Date().toISOString(),
        total_rewards: 0,
        total_payments: 0
      };

      const result = await db.collection('users').replaceOne(
        { $or: [{ uid: uid || firebase_uid }, { firebase_uid: firebase_uid || uid }] },
        { ...userData, created_at: new Date().toISOString() },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        user_id: uid || firebase_uid,
        operation: result.upsertedCount > 0 ? 'created' : 'updated'
      });
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });

  } catch (error) {
    console.error('API POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { path } = params;
    const body = await request.json();

    if (path?.[0] === 'user') {
      const { user_id, ...updateData } = body;

      if (!user_id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }

      const { db } = await connectToDatabase();
      
      const result = await db.collection('users').updateOne(
        { $or: [{ uid: user_id }, { firebase_uid: user_id }] },
        { 
          $set: {
            ...updateData,
            updated_at: new Date().toISOString()
          }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });

  } catch (error) {
    console.error('API PUT Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { path } = params;
    const { searchParams } = new URL(request.url);

    if (path?.[0] === 'user') {
      const user_id = searchParams.get('user_id');

      if (!user_id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
      }

      const { db } = await connectToDatabase();
      
      const result = await db.collection('users').deleteOne({
        $or: [{ uid: user_id }, { firebase_uid: user_id }]
      });

      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 });

  } catch (error) {
    console.error('API DELETE Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}