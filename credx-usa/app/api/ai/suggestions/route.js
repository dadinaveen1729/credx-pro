// Auto-pay Suggestion Engine with AI Recommendations
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

function calculateOptimalPaymentStrategy(bills, userFinancials, paymentHistory) {
  const suggestions = [];
  const currentDate = new Date();
  
  // Sort bills by priority (due date, interest rate, amount)
  const prioritizedBills = bills.sort((a, b) => {
    const aDays = Math.ceil((new Date(a.due_date) - currentDate) / (1000 * 60 * 60 * 24));
    const bDays = Math.ceil((new Date(b.due_date) - currentDate) / (1000 * 60 * 60 * 24));
    
    // Urgent bills first (due in 3 days or less)
    if (aDays <= 3 && bDays > 3) return -1;
    if (bDays <= 3 && aDays > 3) return 1;
    
    // Then by estimated interest rate
    const aRate = getEstimatedAPR(a.issuer);
    const bRate = getEstimatedAPR(b.issuer);
    if (Math.abs(aRate - bRate) > 2) return bRate - aRate;
    
    // Finally by amount (larger first for maximum impact)
    return b.amount - a.amount;
  });

  // Analyze user's payment patterns
  const avgMonthlyPayments = calculateAverageMonthlyPayments(paymentHistory);
  const paymentFrequency = analyzePaymentFrequency(paymentHistory);
  const preferredDays = getPreferredPaymentDays(paymentHistory);

  for (const bill of prioritizedBills) {
    const daysUntilDue = Math.ceil((new Date(bill.due_date) - currentDate) / (1000 * 60 * 60 * 24));
    const suggestion = generateBillSuggestion(bill, daysUntilDue, userFinancials, paymentFrequency, preferredDays);
    suggestions.push(suggestion);
  }

  // Generate overall financial strategy
  const overallStrategy = generateOverallStrategy(bills, userFinancials, avgMonthlyPayments);

  return {
    bill_suggestions: suggestions,
    overall_strategy: overallStrategy,
    total_bills_due: bills.reduce((sum, bill) => sum + bill.amount, 0),
    potential_savings: calculatePotentialSavings(suggestions),
    rewards_opportunity: calculateRewardsOpportunity(bills)
  };
}

function getEstimatedAPR(issuer) {
  // Estimated APR rates by issuer (for calculation purposes)
  const aprRates = {
    chase: 18.24,
    amex: 17.99,
    capitalone: 19.99,
    citi: 18.49,
    bankofamerica: 17.74,
    wells: 18.24,
    discover: 16.99,
    usbank: 17.49
  };
  return aprRates[issuer] || 18.0;
}

function calculateAverageMonthlyPayments(paymentHistory) {
  if (!paymentHistory || paymentHistory.length === 0) return 0;
  
  const monthlyTotals = {};
  paymentHistory.forEach(payment => {
    const month = new Date(payment.created_at).toISOString().slice(0, 7); // YYYY-MM
    monthlyTotals[month] = (monthlyTotals[month] || 0) + payment.amount;
  });
  
  const months = Object.keys(monthlyTotals);
  if (months.length === 0) return 0;
  
  return Object.values(monthlyTotals).reduce((sum, total) => sum + total, 0) / months.length;
}

function analyzePaymentFrequency(paymentHistory) {
  if (!paymentHistory || paymentHistory.length < 3) return 'irregular';
  
  const intervals = [];
  for (let i = 1; i < paymentHistory.length; i++) {
    const prevDate = new Date(paymentHistory[i-1].created_at);
    const currDate = new Date(paymentHistory[i].created_at);
    intervals.push(Math.abs(currDate - prevDate) / (1000 * 60 * 60 * 24));
  }
  
  const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  
  if (avgInterval <= 10) return 'frequent';
  if (avgInterval <= 20) return 'bi_weekly';
  if (avgInterval <= 35) return 'monthly';
  return 'irregular';
}

function getPreferredPaymentDays(paymentHistory) {
  if (!paymentHistory || paymentHistory.length === 0) return [];
  
  const dayFrequency = {};
  paymentHistory.forEach(payment => {
    const day = new Date(payment.created_at).getDate();
    dayFrequency[day] = (dayFrequency[day] || 0) + 1;
  });
  
  return Object.entries(dayFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([day]) => parseInt(day));
}

function generateBillSuggestion(bill, daysUntilDue, userFinancials, frequency, preferredDays) {
  const suggestion = {
    bill_id: bill._id || bill.id,
    bill_name: bill.name,
    amount: bill.amount,
    due_date: bill.due_date,
    days_until_due: daysUntilDue,
    priority: 'medium',
    action: 'pay_now',
    reasoning: [],
    autopay_recommendation: false,
    optimal_payment_date: null,
    rewards_earned: Math.floor(bill.amount / 10) * 1000
  };

  // Determine priority
  if (daysUntilDue <= 3) {
    suggestion.priority = 'urgent';
    suggestion.action = 'pay_immediately';
    suggestion.reasoning.push('Bill is due within 3 days - immediate payment required to avoid late fees');
  } else if (daysUntilDue <= 7) {
    suggestion.priority = 'high';
    suggestion.action = 'pay_soon';
    suggestion.reasoning.push('Bill is due within a week - schedule payment soon');
  } else if (daysUntilDue <= 14) {
    suggestion.priority = 'medium';
    suggestion.action = 'schedule_payment';
    suggestion.reasoning.push('Good time to schedule payment to avoid last-minute rush');
  } else {
    suggestion.priority = 'low';
    suggestion.action = 'monitor';
    suggestion.reasoning.push('Bill not due soon - monitor and plan payment');
  }

  // AutoPay recommendation
  if (frequency === 'monthly' || frequency === 'bi_weekly') {
    suggestion.autopay_recommendation = true;
    suggestion.reasoning.push('Your regular payment pattern suggests AutoPay would be beneficial');
  }

  // Optimal payment date recommendation
  if (preferredDays.length > 0 && daysUntilDue > 7) {
    const dueDate = new Date(bill.due_date);
    const paymentDate = new Date(dueDate);
    paymentDate.setDate(dueDate.getDate() - 5); // 5 days before due date
    
    // Adjust to preferred day if possible
    const preferredDay = preferredDays[0];
    if (Math.abs(paymentDate.getDate() - preferredDay) <= 3) {
      paymentDate.setDate(preferredDay);
    }
    
    suggestion.optimal_payment_date = paymentDate.toISOString();
    suggestion.reasoning.push(`Recommended payment date: ${paymentDate.toLocaleDateString()} (based on your payment preferences)`);
  }

  // APR-based recommendations
  const apr = getEstimatedAPR(bill.issuer);
  if (apr > 20) {
    suggestion.reasoning.push(`High APR (${apr}%) - prioritize this payment to minimize interest`);
    if (suggestion.priority === 'medium') suggestion.priority = 'high';
  }

  // Large amount warnings
  if (bill.amount > 1000) {
    suggestion.reasoning.push('Large payment amount - ensure sufficient funds are available');
  }

  return suggestion;
}

function generateOverallStrategy(bills, userFinancials, avgMonthlyPayments) {
  const totalDue = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const urgentBills = bills.filter(bill => {
    const daysUntilDue = Math.ceil((new Date(bill.due_date) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7;
  });

  const strategy = {
    recommended_approach: 'balanced',
    monthly_payment_plan: null,
    autopay_candidates: [],
    priority_actions: [],
    financial_health_score: 75
  };

  // Determine strategy approach
  if (urgentBills.length > 2) {
    strategy.recommended_approach = 'urgent_first';
    strategy.priority_actions.push('Focus on paying urgent bills first to avoid late fees');
  } else if (totalDue > avgMonthlyPayments * 2) {
    strategy.recommended_approach = 'gradual_payment';
    strategy.priority_actions.push('Consider spreading payments over time to manage cash flow');
  } else {
    strategy.recommended_approach = 'pay_all_early';
    strategy.priority_actions.push('You can afford to pay all bills early - maximizes credit score impact');
  }

  // AutoPay candidates
  bills.forEach(bill => {
    if (bill.amount < 500 && bill.issuer !== 'unknown') {
      strategy.autopay_candidates.push({
        bill_name: bill.name,
        amount: bill.amount,
        reasoning: 'Small, regular amount - good AutoPay candidate'
      });
    }
  });

  // Monthly payment plan
  if (avgMonthlyPayments > 0) {
    strategy.monthly_payment_plan = {
      average_monthly: avgMonthlyPayments,
      current_month_due: totalDue,
      variance: totalDue - avgMonthlyPayments,
      recommendation: totalDue > avgMonthlyPayments * 1.5 ? 
        'This month is higher than average - plan accordingly' :
        'Normal spending month compared to your history'
    };
  }

  return strategy;
}

function calculatePotentialSavings(suggestions) {
  let savings = 0;
  suggestions.forEach(suggestion => {
    if (suggestion.priority === 'urgent' && suggestion.action === 'pay_immediately') {
      savings += 25; // Typical late fee avoided
    }
    if (suggestion.autopay_recommendation) {
      savings += 10; // Estimated monthly savings from never missing payments
    }
  });
  return savings;
}

function calculateRewardsOpportunity(bills) {
  const totalRewards = bills.reduce((sum, bill) => sum + Math.floor(bill.amount / 10) * 1000, 0);
  return {
    total_points: totalRewards,
    cash_value: totalRewards / 100, // 1000 points = $10
    message: `Earn ${totalRewards} points ($${(totalRewards / 100).toFixed(2)}) by paying these bills through CREDX USA`
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const include_paid = searchParams.get('include_paid') === 'true';

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get user's unpaid bills
    const billQuery = { 
      user_id: user_id,
      ...(include_paid ? {} : { status: { $ne: 'paid' } })
    };
    
    const bills = await db.collection('bills')
      .find(billQuery)
      .sort({ due_date: 1 })
      .toArray();

    if (bills.length === 0) {
      return NextResponse.json({
        success: true,
        suggestions: {
          bill_suggestions: [],
          overall_strategy: {
            recommended_approach: 'no_bills',
            message: 'No unpaid bills found. Great job staying on top of your finances!'
          },
          total_bills_due: 0,
          potential_savings: 0,
          rewards_opportunity: { total_points: 0, cash_value: 0 }
        }
      });
    }

    // Get user's financial data
    const user = await db.collection('users').findOne({
      $or: [{ firebase_uid: user_id }, { uid: user_id }]
    });

    const userFinancials = {
      total_rewards: user?.total_rewards || 0,
      total_payments: user?.total_payments || 0,
      account_created: user?.created_at || new Date().toISOString()
    };

    // Get payment history
    const paymentHistory = await db.collection('payment_history')
      .find({ user_id: user_id })
      .sort({ created_at: -1 })
      .limit(50)
      .toArray();

    // Generate AI suggestions
    const suggestions = calculateOptimalPaymentStrategy(bills, userFinancials, paymentHistory);

    // Store suggestions for future reference
    await db.collection('ai_suggestions').updateOne(
      { user_id: user_id },
      {
        $set: {
          ...suggestions,
          generated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      suggestions: suggestions,
      bills_analyzed: bills.length,
      user_payment_pattern: paymentHistory.length > 0 ? 'established' : 'new_user'
    });

  } catch (error) {
    console.error('AI Suggestions Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate payment suggestions', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, action, bill_id, preference } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    if (action === 'accept_autopay_suggestion') {
      // Enable AutoPay for the suggested bill
      await db.collection('bills').updateOne(
        { _id: bill_id, user_id: user_id },
        { 
          $set: { 
            autopay_enabled: true,
            autopay_enabled_at: new Date().toISOString()
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'AutoPay enabled for this bill'
      });
    }

    if (action === 'update_preferences') {
      // Update user's payment preferences based on AI suggestions
      await db.collection('users').updateOne(
        { $or: [{ firebase_uid: user_id }, { uid: user_id }] },
        {
          $set: {
            payment_preferences: {
              ...preference,
              updated_at: new Date().toISOString()
            }
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Payment preferences updated'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('AI Suggestions Action Error:', error);
    return NextResponse.json(
      { error: 'Failed to process suggestion action', details: error.message },
      { status: 500 }
    );
  }
}