import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { user_id } = await request.json();
    
    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    const user = await db.collection('users').findOne({ uid: user_id });
    
    if (!user || !user.plaid_access_token) {
      // Return empty accounts array instead of error for better UX
      return NextResponse.json({ 
        accounts: [],
        message: 'No linked accounts found. Connect your first account to get started.' 
      });
    }

    try {
      const accountsResponse = await plaidClient.accountsGet({
        access_token: user.plaid_access_token
      });

      const accounts = accountsResponse.data.accounts.map(account => ({
        id: account.account_id,
        name: account.name,
        type: account.type,
        subtype: account.subtype,
        balance: account.balances.current,
        available: account.balances.available,
        credit_limit: account.balances.limit,
        utilization: account.balances.limit && account.balances.current ? 
          ((account.balances.current / account.balances.limit) * 100).toFixed(2) : 0
      }));

      return NextResponse.json({ accounts });
    } catch (plaidError) {
      console.error('Plaid API Error:', plaidError);
      
      // Handle common Plaid errors gracefully
      if (plaidError.error_code === 'ITEM_LOGIN_REQUIRED') {
        return NextResponse.json({ 
          accounts: [],
          error: 'Account needs to be reconnected',
          reconnect_required: true
        });
      }
      
      return NextResponse.json({ 
        accounts: [],
        error: 'Unable to fetch account data. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Accounts API Error:', error);
    return NextResponse.json(
      { 
        accounts: [],
        error: 'Failed to retrieve accounts. Please try again.'
      },
      { status: 500 }
    );
  }
}