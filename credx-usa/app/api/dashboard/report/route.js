// Dashboard Report Generation API
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(process.env.MONGO_URL);
  await client.connect();
  const db = client.db(process.env.DB_NAME || 'credxusa');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const report_type = searchParams.get('type') || 'financial_summary';

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get user data
    const user = await db.collection('users').findOne({ 
      $or: [
        { firebase_uid: user_id },
        { uid: user_id }
      ]
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get payment history
    const payments = await db.collection('payment_history')
      .find({ user_id: user_id })
      .sort({ created_at: -1 })
      .limit(50)
      .toArray();

    // Get bills
    const bills = await db.collection('bills')
      .find({ user_id: user_id })
      .sort({ due_date: 1 })
      .toArray();

    // Get Plaid accounts
    const plaidAccounts = await db.collection('plaid_accounts')
      .find({ user_id: user_id })
      .toArray();

    // Generate report data
    const totalPayments = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const totalRewards = payments.reduce((sum, payment) => sum + (payment.rewards_earned || 0), 0);
    const upcomingBills = bills.filter(bill => new Date(bill.due_date) > new Date()).length;

    const reportData = {
      user_info: {
        name: user.display_name || user.email,
        email: user.email,
        member_since: user.created_at || new Date().toISOString(),
        signup_method: user.signup_method || 'email'
      },
      financial_summary: {
        total_payments: totalPayments,
        total_rewards_earned: totalRewards,
        upcoming_bills: upcomingBills,
        linked_accounts: plaidAccounts.length,
        payment_count: payments.length
      },
      recent_payments: payments.slice(0, 10).map(payment => ({
        date: payment.created_at,
        amount: payment.amount,
        description: payment.description || 'Payment',
        rewards_earned: payment.rewards_earned || 0,
        status: payment.status || 'completed'
      })),
      upcoming_bills: bills.filter(bill => new Date(bill.due_date) > new Date()).slice(0, 5).map(bill => ({
        name: bill.name,
        amount: bill.amount,
        due_date: bill.due_date,
        category: bill.category || 'general'
      })),
      account_summary: plaidAccounts.map(account => ({
        name: account.name || 'Credit Account',
        type: account.account_type || 'credit',
        balance: account.balance || 0,
        last_updated: account.updated_at || new Date().toISOString()
      })),
      generated_at: new Date().toISOString(),
      report_type: report_type
    };

    return NextResponse.json({
      success: true,
      report: reportData,
      download_url: `/api/dashboard/report/download?user_id=${user_id}&type=${report_type}`
    });

  } catch (error) {
    console.error('Report Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, report_type = 'financial_summary', email_report = false } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Generate report (reuse GET logic)
    const reportResponse = await GET(new Request(`${request.url}?user_id=${user_id}&type=${report_type}`));
    const reportData = await reportResponse.json();

    if (email_report && reportData.success) {
      // TODO: Send email with report (integrate with SendGrid)
      console.log('Email report requested for user:', user_id);
    }

    return NextResponse.json({
      success: true,
      message: 'Report generated successfully',
      report_id: `RPT_${Date.now()}`,
      report: reportData.report
    });

  } catch (error) {
    console.error('Report Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report', details: error.message },
      { status: 500 }
    );
  }
}