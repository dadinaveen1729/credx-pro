import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET - Retrieve all payments for admin
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    const payments = await db.collection('payment_history')
      .find({})
      .sort({ created_at: -1 })
      .limit(100)
      .toArray();

    // Enrich with user emails
    const enrichedPayments = await Promise.all(
      payments.map(async (payment) => {
        const user = await db.collection('users').findOne({ uid: payment.user_id });
        return {
          ...payment,
          user_email: user?.email || 'Unknown'
        };
      })
    );

    return NextResponse.json({ payments: enrichedPayments });
  } catch (error) {
    console.error('Admin Payments Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve payments' },
      { status: 500 }
    );
  }
}