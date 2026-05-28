// Firebase Cloud Function for Scheduled Notifications
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

async function sendNotification(user, notificationType, data) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.firebase_uid || user.uid,
        type: 'whatsapp',
        message_type: notificationType,
        data: data
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Notification send error:', error);
    return false;
  }
}

async function sendEmailNotification(user, subject, content) {
  try {
    // This would integrate with SendGrid when enabled
    console.log(`Email notification: ${subject} to ${user.email}`);
    console.log(`Content: ${content}`);
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

function generateNotificationMessage(bill, daysUntilDue, user) {
  const templates = {
    urgent: `🚨 URGENT: Hi ${user.display_name || user.email?.split('@')[0]}, your ${bill.name} payment of $${bill.amount} is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}! Avoid late fees - pay now at credxusa.com/payment?bill_id=${bill._id}`,
    
    reminder: `💳 Hi ${user.display_name || user.email?.split('@')[0]}, friendly reminder: your ${bill.name} payment of $${bill.amount} is due on ${new Date(bill.due_date).toLocaleDateString()}. Pay early and earn ${Math.floor(bill.amount / 10) * 1000} points! credxusa.com/dashboard`,
    
    morning_summary: `🌅 Good morning ${user.display_name || user.email?.split('@')[0]}! You have {bill_count} payment{bill_count !== 1 ? 's' : ''} due soon totaling ${bill_total}. Stay on top of your finances with CREDX USA! credxusa.com/dashboard`,
    
    overdue: `⚠️ OVERDUE: ${user.display_name || user.email?.split('@')[0]}, your ${bill.name} payment of $${bill.amount} was due on ${new Date(bill.due_date).toLocaleDateString()}. Pay now to avoid additional fees: credxusa.com/payment?bill_id=${bill._id}`,
    
    autopay_reminder: `🤖 AutoPay Update: Hi ${user.display_name || user.email?.split('@')[0]}, we successfully paid your ${bill.name} ($${bill.amount}) today. You earned ${Math.floor(bill.amount / 10) * 1000} points! View details: credxusa.com/dashboard`
  };

  return templates;
}

async function processScheduledNotifications() {
  const { db } = await connectToDatabase();
  const results = {
    processed: 0,
    sent: 0,
    errors: 0,
    users_notified: new Set(),
    notifications_sent: []
  };

  try {
    // Get current time in EST
    const now = new Date();
    const estNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    // Check if it's around 8 AM EST (7-9 AM range for flexibility)
    const hour = estNow.getHours();
    const isNotificationTime = hour >= 7 && hour <= 9;

    // Get all users with notification preferences
    const users = await db.collection('users').find({
      $or: [
        { firebase_uid: { $exists: true } },
        { uid: { $exists: true } }
      ]
    }).toArray();

    for (const user of users) {
      try {
        const userId = user.firebase_uid || user.uid;
        
        // Get user's notification settings
        const settings = await db.collection('notification_settings').findOne({
          $or: [
            { user_id: userId },
            { firebase_uid: userId }
          ]
        });

        // Skip if notifications disabled
        if (settings && (!settings.whatsapp_notifications?.bill_reminders && !settings.email_notifications?.bill_reminders)) {
          continue;
        }

        // Get user's unpaid bills
        const bills = await db.collection('bills').find({
          user_id: userId,
          status: { $ne: 'paid' }
        }).sort({ due_date: 1 }).toArray();

        if (bills.length === 0) continue;

        const currentDate = new Date();
        const urgentBills = [];
        const upcomingBills = [];
        const overdueBills = [];

        bills.forEach(bill => {
          const dueDate = new Date(bill.due_date);
          const daysUntilDue = Math.ceil((dueDate - currentDate) / (1000 * 60 * 60 * 24));

          if (daysUntilDue < 0) {
            overdueBills.push({ ...bill, daysOverdue: Math.abs(daysUntilDue) });
          } else if (daysUntilDue <= 3) {
            urgentBills.push({ ...bill, daysUntilDue });
          } else if (daysUntilDue <= 7) {
            upcomingBills.push({ ...bill, daysUntilDue });
          }
        });

        // Send overdue notifications (priority)
        for (const bill of overdueBills) {
          const templates = generateNotificationMessage(bill, -bill.daysOverdue, user);
          const success = await sendNotification(user, 'bill_overdue', {
            bill_name: bill.name,
            amount: bill.amount,
            days_overdue: bill.daysOverdue,
            custom_message: templates.overdue
          });

          if (success) {
            results.sent++;
            results.users_notified.add(userId);
            results.notifications_sent.push({
              type: 'overdue',
              user_email: user.email,
              bill_name: bill.name,
              amount: bill.amount
            });
          } else {
            results.errors++;
          }
          results.processed++;
        }

        // Send urgent notifications
        for (const bill of urgentBills) {
          const templates = generateNotificationMessage(bill, bill.daysUntilDue, user);
          const notificationType = bill.daysUntilDue <= 1 ? 'urgent' : 'reminder';
          const success = await sendNotification(user, 'bill_reminder', {
            bill_name: bill.name,
            amount: bill.amount,
            days_until_due: bill.daysUntilDue,
            custom_message: templates[notificationType]
          });

          if (success) {
            results.sent++;
            results.users_notified.add(userId);
            results.notifications_sent.push({
              type: 'urgent',
              user_email: user.email,
              bill_name: bill.name,
              amount: bill.amount,
              days_until_due: bill.daysUntilDue
            });
          } else {
            results.errors++;
          }
          results.processed++;
        }

        // Send morning summary if it's notification time and user has multiple bills
        if (isNotificationTime && (urgentBills.length + upcomingBills.length) >= 2) {
          const billCount = urgentBills.length + upcomingBills.length;
          const billTotal = (urgentBills.concat(upcomingBills)).reduce((sum, bill) => sum + bill.amount, 0);
          
          const templates = generateNotificationMessage(null, 0, user);
          const summaryMessage = templates.morning_summary
            .replace('{bill_count}', billCount)
            .replace('{bill_total}', `$${billTotal.toFixed(2)}`);

          const success = await sendNotification(user, 'daily_summary', {
            bill_count: billCount,
            total_amount: billTotal,
            custom_message: summaryMessage
          });

          if (success) {
            results.sent++;
            results.users_notified.add(userId);
            results.notifications_sent.push({
              type: 'morning_summary',
              user_email: user.email,
              bill_count: billCount,
              total_amount: billTotal
            });
          } else {
            results.errors++;
          }
          results.processed++;
        }

        // Send weekly summary (Sundays at 8 AM)
        if (isNotificationTime && estNow.getDay() === 0 && settings?.email_notifications?.weekly_summary) {
          const emailContent = `
            <h2>Weekly Financial Summary - CREDX USA</h2>
            <p>Hi ${user.display_name || user.email?.split('@')[0]},</p>
            
            <h3>Bills Due This Week:</h3>
            <ul>
              ${upcomingBills.map(bill => `
                <li>${bill.name}: $${bill.amount} due ${new Date(bill.due_date).toLocaleDateString()}</li>
              `).join('')}
            </ul>
            
            <h3>Urgent Actions:</h3>
            ${urgentBills.length > 0 ? `
              <p style="color: #dc2626;">You have ${urgentBills.length} urgent payment(s) due within 3 days!</p>
            ` : `
              <p style="color: #16a34a;">No urgent payments - you're on track!</p>
            `}
            
            <p>Manage all your bills at <a href="https://credxusa.com/dashboard">credxusa.com/dashboard</a></p>
            
            <p>Best regards,<br>CREDX USA Team</p>
          `;

          const emailSuccess = await sendEmailNotification(
            user, 
            'Weekly Financial Summary - CREDX USA',
            emailContent
          );

          if (emailSuccess) {
            results.sent++;
            results.notifications_sent.push({
              type: 'weekly_summary',
              user_email: user.email,
              upcoming_bills: upcomingBills.length,
              urgent_bills: urgentBills.length
            });
          }
          results.processed++;
        }

      } catch (userError) {
        console.error(`Error processing user ${user.email}:`, userError);
        results.errors++;
      }
    }

    // Log the run
    await db.collection('notification_runs').insertOne({
      run_at: new Date().toISOString(),
      est_time: estNow.toISOString(),
      hour: hour,
      is_notification_time: isNotificationTime,
      results: {
        ...results,
        users_notified: Array.from(results.users_notified)
      },
      total_users_checked: users.length
    });

  } catch (error) {
    console.error('Scheduled notification error:', error);
    results.errors++;
  }

  return results;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const force_run = searchParams.get('force_run') === 'true';
    const test_mode = searchParams.get('test_mode') === 'true';

    if (test_mode) {
      // Return sample notification data for testing
      return NextResponse.json({
        success: true,
        test_mode: true,
        message: 'Scheduled notification system is operational',
        current_time: new Date().toISOString(),
        est_time: new Date().toLocaleString("en-US", {timeZone: "America/New_York"}),
        next_run: 'Daily at 8:00 AM EST'
      });
    }

    // Check if it's the right time or forced run
    const now = new Date();
    const estNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const hour = estNow.getHours();
    const isNotificationTime = hour >= 7 && hour <= 9;

    if (!force_run && !isNotificationTime) {
      return NextResponse.json({
        success: true,
        message: 'Not notification time (7-9 AM EST)',
        current_est_time: estNow.toISOString(),
        current_hour: hour,
        next_run: 'Tomorrow at 8:00 AM EST'
      });
    }

    // Run scheduled notifications
    const results = await processScheduledNotifications();

    return NextResponse.json({
      success: true,
      message: 'Scheduled notifications processed',
      run_time: new Date().toISOString(),
      results: {
        ...results,
        users_notified: Array.from(results.users_notified).length,
        notifications_sent: results.notifications_sent
      }
    });

  } catch (error) {
    console.error('Scheduled Notification Error:', error);
    return NextResponse.json(
      { error: 'Failed to process scheduled notifications', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, user_id, notification_type } = body;

    if (action === 'test_user_notifications') {
      if (!user_id) {
        return NextResponse.json({ error: 'User ID is required for testing' }, { status: 400 });
      }

      const { db } = await connectToDatabase();
      
      // Get user and their bills
      const user = await db.collection('users').findOne({
        $or: [{ firebase_uid: user_id }, { uid: user_id }]
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const bills = await db.collection('bills').find({
        user_id: user_id,
        status: { $ne: 'paid' }
      }).sort({ due_date: 1 }).toArray();

      if (bills.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No unpaid bills found for testing',
          user: user.email
        });
      }

      // Send test notification for first bill
      const testBill = bills[0];
      const daysUntilDue = Math.ceil((new Date(testBill.due_date) - new Date()) / (1000 * 60 * 60 * 24));
      
      const templates = generateNotificationMessage(testBill, daysUntilDue, user);
      const success = await sendNotification(user, 'bill_reminder', {
        bill_name: testBill.name,
        amount: testBill.amount,
        days_until_due: daysUntilDue,
        custom_message: templates.reminder
      });

      return NextResponse.json({
        success: success,
        message: success ? 'Test notification sent successfully' : 'Failed to send test notification',
        test_data: {
          user_email: user.email,
          bill_name: testBill.name,
          amount: testBill.amount,
          days_until_due: daysUntilDue
        }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Scheduled Notification Action Error:', error);
    return NextResponse.json(
      { error: 'Failed to process notification action', details: error.message },
      { status: 500 }
    );
  }
}