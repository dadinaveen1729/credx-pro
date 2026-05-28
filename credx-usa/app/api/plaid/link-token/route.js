import { NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';

export async function POST(request) {
  try {
    const { user_id } = await request.json();
    
    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const request_obj = {
      user: {
        client_user_id: user_id
      },
      client_name: 'CREDX USA',
      products: ['transactions', 'liabilities'],
      country_codes: ['US'],
      language: 'en',
      webhook: process.env.NEXT_PUBLIC_BASE_URL + '/api/plaid/webhook',
      link_customization_name: 'default',
      account_filters: {
        depository: {
          account_subtypes: ['checking', 'savings']
        },
        credit: {
          account_subtypes: ['credit card']
        }
      }
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
    return NextResponse.json(
      { 
        error: 'Failed to create link token',
        details: error.message
      },
      { status: 500 }
    );
  }
}