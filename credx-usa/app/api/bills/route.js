import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

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
    
    // Get user's bills
    const bills = await db.collection('user_bills')
      .find({ user_id })
      .sort({ due_date: 1 })
      .toArray();
    
    // If no bills exist, create sample bills for demo
    if (bills.length === 0) {
      const sampleBills = [
        {
          id: uuidv4(),
          user_id,
          name: 'Chase Sapphire Credit Card',
          company: 'Chase Bank',
          amount: 285.50,
          due_date: '2024-12-15',
          category: 'credit_card',
          status: 'upcoming',
          auto_pay: false,
          created_at: new Date()
        },
        {
          id: uuidv4(),
          user_id,
          name: 'ConEd Electric Bill',
          company: 'Consolidated Edison',
          amount: 89.25,
          due_date: '2024-12-20',
          category: 'utility',
          status: 'upcoming',
          auto_pay: true,
          created_at: new Date()
        },
        {
          id: uuidv4(),
          user_id,
          name: 'Verizon Wireless',
          company: 'Verizon',
          amount: 78.99,
          due_date: '2024-12-25',
          category: 'phone',
          status: 'upcoming',
          auto_pay: false,
          created_at: new Date()
        }
      ];
      
      await db.collection('user_bills').insertMany(sampleBills);
      return NextResponse.json({ bills: sampleBills });
    }
    
    return NextResponse.json({ bills });
  } catch (error) {
    console.error('Bills retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve bills' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { user_id, name, company, amount, due_date, category, auto_pay = false } = await request.json();
    
    if (!user_id || !name || !amount || !due_date) {
      return NextResponse.json(
        { error: 'User ID, name, amount, and due date are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    const newBill = {
      id: uuidv4(),
      user_id,
      name,
      company: company || '',
      amount: parseFloat(amount),
      due_date,
      category: category || 'other',
      status: 'upcoming',
      auto_pay: Boolean(auto_pay),
      created_at: new Date()
    };
    
    await db.collection('user_bills').insertOne(newBill);
    
    return NextResponse.json({ 
      success: true, 
      bill: newBill,
      message: 'Bill added successfully' 
    });
  } catch (error) {
    console.error('Bill creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create bill' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { bill_id, user_id, status, auto_pay } = await request.json();
    
    if (!bill_id || !user_id) {
      return NextResponse.json(
        { error: 'Bill ID and user ID are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    const updateData = {
      updated_at: new Date()
    };
    
    if (status !== undefined) updateData.status = status;
    if (auto_pay !== undefined) updateData.auto_pay = Boolean(auto_pay);
    
    const result = await db.collection('user_bills').updateOne(
      { id: bill_id, user_id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Bill not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Bill updated successfully' 
    });
  } catch (error) {
    console.error('Bill update error:', error);
    return NextResponse.json(
      { error: 'Failed to update bill' },
      { status: 500 }
    );
  }
}