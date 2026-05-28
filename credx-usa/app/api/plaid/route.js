import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import clientPromise from '@/lib/mongodb';

// GET /api/plaid - Handle account retrieval
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    
    if (!user_id) {
      return NextResponse.json(
        { 
          error: 'User ID is required',
          details: 'Please provide user_id as query parameter'
        },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    const user = await db.collection('users').findOne({ uid: user_id });
    
    if (!user || !user.plaid_access_token) {
      return NextResponse.json(
        { 
          error: 'No linked accounts found',
          details: 'User has no linked bank accounts. Please link an account first.'
        },
        { status: 404 }
      );
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
      
      if (plaidError.error_code === 'ITEM_LOGIN_REQUIRED') {
        return NextResponse.json({ 
          error: 'Account needs to be reconnected',
          details: 'Please reconnect your bank account',
          reconnect_required: true
        }, { status: 400 });
      }
      
      return NextResponse.json({ 
        error: 'Unable to fetch account data',
        details: 'Please try again later or contact support'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('GET /api/plaid Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve accounts',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// POST /api/plaid - Handle link token creation and token exchange
export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (!action) {
      return NextResponse.json(
        { 
          error: 'Action parameter is required',
          details: 'Please specify action=link-token or action=exchange-token'
        },
        { status: 400 }
      );
    }

    if (action === 'link-token') {
      return await handleLinkTokenCreation(request);
    } else if (action === 'exchange-token') {
      return await handleTokenExchange(request);
    } else {
      return NextResponse.json(
        { 
          error: 'Invalid action',
          details: 'Supported actions: link-token, exchange-token'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('POST /api/plaid Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}

async function handleLinkTokenCreation(request) {
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
    
    // Ensure user exists
    const user = await db.collection('users').findOne({ uid: user_id });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Correct Plaid API request format for 2025
    const request_obj = {
      client_id: process.env.PLAID_CLIENT_ID,
      secret: process.env.PLAID_SECRET,
      user: {
        client_user_id: user_id
      },
      client_name: 'CREDX USA',
      products: ['auth', 'transactions'],
      country_codes: ['US'],
      language: 'en',
      webhook: `${process.env.NEXT_PUBLIC_BASE_URL}/api/plaid/webhook`
      // redirect_uri removed - needs to be configured in Plaid dashboard first
    };

    const response = await plaidClient.linkTokenCreate(request_obj);
    
    return NextResponse.json({
      link_token: response.data.link_token,
      expiration: response.data.expiration,
      request_id: response.data.request_id,
      success: true
    });
  } catch (error) {
    console.error('Plaid Link Token Error:', error);
    
    // Handle Plaid API errors properly
    if (error.response && error.response.data) {
      const plaidError = error.response.data;
      console.error('Plaid Error Details:', {
        error_type: plaidError.error_type,
        error_code: plaidError.error_code,
        error_message: plaidError.error_message,
        display_message: plaidError.display_message,
        request_id: plaidError.request_id,
        status: error.response.status
      });
      return NextResponse.json(
        { 
          error: 'Failed to create link token',
          details: plaidError.error_message || plaidError.display_message || 'Please check Plaid configuration',
          plaid_error_code: plaidError.error_code,
          plaid_error_type: plaidError.error_type
        },
        { status: 500 }
      );
    } else {
      console.error('Non-Plaid Error:', error.message);
      return NextResponse.json(
        { 
          error: 'Failed to create link token',
          details: error.message || 'Please check Plaid configuration'
        },
        { status: 500 }
      );
    }
  }
}

async function handleTokenExchange(request) {
  try {
    const { public_token, user_id } = await request.json();
    
    if (!public_token || !user_id) {
      return NextResponse.json(
        { 
          error: 'Public token and user ID are required',
          details: 'Please provide both public_token and user_id in request body'
        },
        { status: 400 }
      );
    }

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token
    });
    
    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // Store access token in database
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    await db.collection('users').updateOne(
      { uid: user_id },
      {
        $set: {
          plaid_access_token: accessToken,
          plaid_item_id: itemId,
          updated_at: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Account linked successfully',
      details: 'Bank account has been successfully connected to your profile'
    });
  } catch (error) {
    console.error('Plaid Exchange Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to exchange token',
        details: error.message || 'Please try linking your account again'
      },
      { status: 500 }
    );
  }
}
