import { NextResponse } from 'next/server';
import twilio from 'twilio';
import { MongoClient, ServerApiVersion } from 'mongodb';

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Database connection
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const mongoClient = new MongoClient(process.env.MONGO_URL, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    await mongoClient.connect();
    const db = mongoClient.db(process.env.DB_NAME || 'credxusa');

    cachedClient = mongoClient;
    cachedDb = db;

    return { client: mongoClient, db };
  } catch (error) {
    console.error('MongoDB connection error in notifications:', error);
    throw new Error('Database connection failed');
  }
}

// Message templates
const messageTemplates = {
  bill_reminder: (bill) => `🔔 CREDX USA: Your ${bill.issuer} bill of $${bill.amount} is due on ${new Date(bill.due_date).toLocaleDateString()}. Pay now to earn rewards!`,
  payment_success: (data) => `✅ CREDX USA: Payment successful! $${data.amount} paid. You earned ${data.rewards || 0} points!`,
  fraud_alert: () => `🚨 CREDX USA: Suspicious activity detected on your account. Please review your recent transactions.`,
  welcome: () => `🎉 Welcome to CREDX USA! Start managing your bills and earning rewards today!`,
  autopay_enabled: (bill) => `💳 CREDX USA: AutoPay enabled for ${bill.issuer}. Your bill will be paid automatically.`
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, type, phone, message, bill_data, amount, rewards } = body;

    if (!user_id || !type) {
      return NextResponse.json({ 
        error: 'user_id and type are required' 
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get user data if phone not provided
    let userPhone = phone;
    if (!userPhone) {
      const user = await db.collection('users').findOne({
        $or: [{ uid: user_id }, { firebase_uid: user_id }]
      });
      userPhone = user?.phone;
    }

    if (!userPhone) {
      return NextResponse.json({ 
        error: 'Phone number not found for user' 
      }, { status: 400 });
    }

    // Generate message
    let messageText = message;
    if (!messageText && messageTemplates[type]) {
      switch (type) {
        case 'bill_reminder':
          messageText = messageTemplates[type](bill_data);
          break;
        case 'payment_success':
          messageText = messageTemplates[type]({ amount, rewards });
          break;
        case 'autopay_enabled':
          messageText = messageTemplates[type](bill_data);
          break;
        default:
          messageText = messageTemplates[type]();
      }
    }

    if (!messageText) {
      messageText = `CREDX USA: Notification for ${type}`;
    }

    // Send WhatsApp message
    let twilioResponse;
    try {
      twilioResponse = await client.messages.create({
        body: messageText,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: `whatsapp:${userPhone}`
      });
    } catch (twilioError) {
      console.error('Twilio error:', twilioError);
      
      // Fallback to SMS if WhatsApp fails
      try {
        twilioResponse = await client.messages.create({
          body: messageText,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: userPhone
        });
      } catch (smsError) {
        console.error('SMS fallback error:', smsError);
        throw new Error(`Both WhatsApp and SMS failed: ${smsError.message}`);
      }
    }

    // Log notification
    await db.collection('notifications').insertOne({
      user_id: user_id,
      type: type,
      phone: userPhone,
      message: messageText,
      status: 'sent',
      message_id: twilioResponse.sid,
      created_at: new Date().toISOString(),
      twilio_data: {
        sid: twilioResponse.sid,
        status: twilioResponse.status,
        direction: twilioResponse.direction
      }
    });

    return NextResponse.json({
      success: true,
      message_id: twilioResponse.sid,
      status: 'sent',
      message: messageText
    });

  } catch (error) {
    console.error('Notification error:', error);
    
    // Log failed notification
    try {
      const { db } = await connectToDatabase();
      await db.collection('notifications').insertOne({
        user_id: body?.user_id || 'unknown',
        type: body?.type || 'unknown',
        phone: body?.phone || 'unknown',
        message: body?.message || 'Failed to send',
        status: 'failed',
        error: error.message,
        created_at: new Date().toISOString()
      });
    } catch (logError) {
      console.error('Failed to log notification error:', logError);
    }

    return NextResponse.json(
      { error: 'Failed to send notification', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({ 
        error: 'user_id is required' 
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const notifications = await db.collection('notifications')
      .find({ user_id: user_id })
      .sort({ created_at: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      success: true,
      notifications: notifications
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve notifications', details: error.message },
      { status: 500 }
    );
  }
}