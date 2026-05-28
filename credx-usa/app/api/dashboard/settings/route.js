// Notification Settings API
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

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get user notification settings
    let settings = await db.collection('notification_settings').findOne({ 
      $or: [
        { user_id: user_id },
        { firebase_uid: user_id }
      ]
    });

    if (!settings) {
      // Create default settings if none exist
      settings = {
        user_id: user_id,
        email_notifications: {
          bill_reminders: true,
          payment_confirmations: true,
          fraud_alerts: true,
          weekly_summary: true,
          marketing: false
        },
        sms_notifications: {
          bill_reminders: true,
          payment_confirmations: true,
          fraud_alerts: true,
          urgent_only: false
        },
        whatsapp_notifications: {
          bill_reminders: true,
          payment_confirmations: true,
          fraud_alerts: true,
          daily_summary: false
        },
        reminder_timing: {
          bill_reminder_days: 3, // Days before due date
          morning_summary: true,
          evening_summary: false,
          timezone: 'America/New_York'
        },
        frequency: {
          bill_reminders: 'daily', // daily, weekly, off
          fraud_alerts: 'immediate',
          account_updates: 'weekly'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      await db.collection('notification_settings').insertOne(settings);
    }

    return NextResponse.json({
      success: true,
      settings: settings
    });

  } catch (error) {
    console.error('Notification Settings Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification settings', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { user_id, settings } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!settings) {
      return NextResponse.json({ error: 'Settings object is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Update notification settings
    const updateData = {
      ...settings,
      user_id: user_id,
      updated_at: new Date().toISOString()
    };

    const result = await db.collection('notification_settings').updateOne(
      { user_id: user_id },
      { 
        $set: updateData,
        $setOnInsert: { created_at: new Date().toISOString() }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully',
      modified_count: result.modifiedCount,
      upserted_id: result.upsertedId
    });

  } catch (error) {
    console.error('Notification Settings Update Error:', error);
    return NextResponse.json(
      { error: 'Failed to update notification settings', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, action, notification_type } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    if (action === 'test_notification') {
      // Send test notification
      const testMessage = {
        user_id: user_id,
        type: notification_type || 'email',
        message_type: 'test',
        data: {
          test_message: 'This is a test notification from CREDX USA',
          timestamp: new Date().toISOString()
        }
      };

      // Send via notifications API
      const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testMessage)
      });

      if (notificationResponse.ok) {
        return NextResponse.json({
          success: true,
          message: `Test ${notification_type} notification sent successfully`
        });
      } else {
        const errorData = await notificationResponse.json();
        return NextResponse.json({
          error: 'Failed to send test notification',
          details: errorData.error
        }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Notification Settings Action Error:', error);
    return NextResponse.json(
      { error: 'Failed to perform notification action', details: error.message },
      { status: 500 }
    );
  }
}