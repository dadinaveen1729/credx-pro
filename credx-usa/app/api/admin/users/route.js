import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// GET - Retrieve all users for admin
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    
    const users = await db.collection('users')
      .find({})
      .sort({ created_at: -1 })
      .toArray();

    // Add signup method based on available data
    const usersWithMethods = users.map(user => ({
      ...user,
      signup_method: user.phone ? 'phone' : (user.avatar ? 'google' : 'email')
    }));

    return NextResponse.json({ users: usersWithMethods });
  } catch (error) {
    console.error('Admin Users Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve users' },
      { status: 500 }
    );
  }
}

// DELETE - Delete user (admin only)
export async function DELETE(request) {
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
    
    // Delete user and all related data
    await Promise.all([
      db.collection('users').deleteOne({ uid: user_id }),
      db.collection('payment_history').deleteMany({ user_id }),
      db.collection('user_bills').deleteMany({ user_id }),
      db.collection('notifications').deleteMany({ user_id }),
      db.collection('plaid_accounts').deleteMany({ user_id })
    ]);

    return NextResponse.json({
      success: true,
      message: 'User and all related data deleted successfully'
    });
  } catch (error) {
    console.error('Admin Delete User Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}