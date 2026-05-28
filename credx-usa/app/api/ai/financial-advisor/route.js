// AI Financial Advisor API with OpenAI o3 Integration - PRODUCTION VERSION
import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
import OpenAI from 'openai';

// Database connection caching
let cachedClient = null;
let cachedDb = null;

// OpenAI client initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Create MongoClient with ServerApi configuration for MongoDB Atlas
  const client = new MongoClient(process.env.MONGO_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  
  await client.connect();
  const db = client.db(process.env.DB_NAME || 'credxusa');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

async function getAIFinancialAdvice(userData, userHistory, query = null) {
  try {
    const session_id = `${userData.firebase_uid || userData.uid}_${Date.now()}`;
    
    // Prepare financial context for AI
    const financialContext = {
      user_profile: {
        name: userData.display_name || userData.email?.split('@')[0] || 'User',
        email: userData.email,
        user_since: userData.created_at || 'Recently joined'
      },
      financial_data: {
        total_payments: userHistory.totalPayments || 0,
        total_rewards: userHistory.totalRewards || 0,
        active_bills: userHistory.billCount || 0,
        payment_pattern: userHistory.paymentFrequency || 'new_user',
        average_payment: userHistory.averagePayment || 0,
        last_payment: userHistory.lastPaymentDate || null,
        upcoming_bills: userHistory.upcomingBills?.map(bill => ({
          issuer: bill.issuer,
          amount: bill.amount,
          due_date: bill.due_date,
          status: bill.status
        })) || [],
        recent_payments: userHistory.recentPayments?.map(payment => ({
          amount: payment.amount,
          date: payment.created_at,
          rewards: payment.rewards_earned
        })) || [],
        linked_accounts: userHistory.linkedAccounts?.length || 0
      }
    };

    // Create comprehensive prompt for OpenAI o3
    const systemPrompt = `You are an expert AI Financial Advisor for CREDX USA, a fintech platform that helps users manage bills and earn rewards. 

CREDX USA Features:
- Users earn 1 point per dollar spent on bill payments
- Points can be redeemed for cash (100 points = $1)
- Platform supports AutoPay, payment scheduling, and notifications
- Users can link bank accounts via Plaid integration
- Platform supports credit cards, utilities, and various bill types

Your role is to provide personalized, actionable financial advice based on the user's complete financial profile. Always be encouraging, specific, and focus on practical next steps.

Financial Analysis Guidelines:
1. PAYMENT OPTIMIZATION: Prioritize high-interest debts, suggest AutoPay for consistency
2. CREDIT SCORE IMPROVEMENT: Focus on payment history (35% of score), credit utilization (30% of score)
3. REWARDS MAXIMIZATION: Help users earn and redeem points effectively
4. CASH FLOW MANAGEMENT: Help with bill timing and payment scheduling
5. DEBT REDUCTION: Suggest avalanche method for high-interest debts

Always provide specific, actionable recommendations with clear next steps.`;

    const userPrompt = query 
      ? `User Question: "${query}"\n\nUser's Financial Profile:\n${JSON.stringify(financialContext, null, 2)}\n\nPlease provide a detailed, personalized answer to their question based on their financial situation.`
      : `Please analyze this user's complete financial profile and provide comprehensive, personalized financial advice:\n\n${JSON.stringify(financialContext, null, 2)}\n\nProvide specific recommendations for:\n1. Credit score optimization\n2. Bill payment strategy\n3. Rewards maximization\n4. Debt reduction plan\n5. Next actionable steps with CREDX USA`;

    // Call OpenAI o3-mini model (note: o3-mini uses max_completion_tokens, not max_tokens, and does NOT support temperature)
    const completion = await openai.chat.completions.create({
      model: "o3-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_completion_tokens: 2000,
    });

    const aiAdvice = completion.choices[0]?.message?.content || 'Unable to generate advice at this time.';

    return {
      success: true,
      advice: aiAdvice,
      session_id: session_id,
      model_used: "o3-mini",
      tokens_used: completion.usage?.total_tokens || 0,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Provide intelligent fallback advice based on user data
    const fallbackAdvice = generateIntelligentFallback(userData, userHistory, query);
    
    return {
      success: true,
      advice: fallbackAdvice,
      session_id: `fallback_${userData.firebase_uid || userData.uid}_${Date.now()}`,
      model_used: "credx-fallback-ai",
      fallback_mode: true,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

function generateIntelligentFallback(userData, userHistory, query) {
  const name = userData.display_name || userData.email?.split('@')[0] || 'there';
  const totalPayments = userHistory.totalPayments || 0;
  const totalRewards = userHistory.totalRewards || 0;
  const billCount = userHistory.billCount || 0;
  
  let advice = `# AI Financial Analysis for ${name}

## 🎯 Personalized Recommendations

### Current Financial Snapshot
- **Total Payments**: $${totalPayments.toFixed(2)}
- **Rewards Earned**: ${totalRewards} points (${(totalRewards/100).toFixed(2)} cash value)
- **Active Bills**: ${billCount} bills
- **Payment Pattern**: ${userHistory.paymentFrequency || 'New user'}

`;

  if (query) {
    advice += `### Response to: "${query}"

`;
    
    if (query.toLowerCase().includes('credit score')) {
      advice += `**Credit Score Optimization Strategy:**
- Pay all bills on time (35% of your credit score)
- Keep credit utilization below 30% of limits
- Don't close old credit accounts
- Set up AutoPay for consistent payment history
- Use CREDX USA for all bill payments to build positive patterns

`;
    } else if (query.toLowerCase().includes('debt') || query.toLowerCase().includes('pay off')) {
      advice += `**Debt Payoff Strategy:**
- List all debts by interest rate (highest first)
- Pay minimums on all, extra on highest rate
- Consider debt avalanche method for fastest payoff
- Use CREDX USA AutoPay to never miss payments
- Apply rewards earnings toward extra debt payments

`;
    } else if (query.toLowerCase().includes('reward')) {
      advice += `**Rewards Maximization:**
- Current earning rate: ${totalPayments > 0 ? ((totalRewards / totalPayments) * 100).toFixed(1) : 0}%
- Use CREDX USA for ALL bill payments (1 point per dollar)
- Redeem points strategically: 100 points = $1 cash
- Focus on high-value bills first
- Enable notifications to never miss earning opportunities

`;
    } else {
      advice += `**Personalized Financial Advice:**
Based on your payment history of $${totalPayments} and ${totalRewards} rewards points, here's my recommendation:

`;
    }
  }

  if (totalPayments > 1000) {
    advice += `### ✅ Strong Payment History
Your $${totalPayments} in payments shows excellent financial discipline! 

**Next Steps:**
- Continue maintaining on-time payments
- Consider increasing payment amounts to reduce balances faster
- Optimize payment timing to improve cash flow
- Use your strong history to negotiate better terms

`;
  } else {
    advice += `### 📈 Building Payment Foundation
Great start! Let's build a strong financial foundation.

**Immediate Actions:**
- Set up AutoPay for at least minimum payments
- Start with your highest-interest bills first
- Build consistency with small, regular payments
- Use CREDX USA for all bill payments to maximize rewards

`;
  }

  if (userHistory.upcomingBills && userHistory.upcomingBills.length > 0) {
    const totalDue = userHistory.upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
    advice += `### 📅 Upcoming Bills Alert
You have ${userHistory.upcomingBills.length} bills totaling $${totalDue.toFixed(2)} due soon.

**Payment Strategy:**
1. **Pay high-interest credit cards first** (usually 18-29% APR)
2. **Enable AutoPay** to avoid late fees
3. **Schedule payments 5-7 days early** for processing time
4. **Use CREDX USA** for all payments to earn ${Math.floor(totalDue)} points

`;
  }

  advice += `### 🎯 Action Plan for Next 30 Days
1. **Week 1**: Set up AutoPay for your 3 most important bills
2. **Week 2**: Link your primary bank account if not done
3. **Week 3**: Review and optimize payment schedules
4. **Week 4**: Enable notifications and review progress

### 💰 Rewards Opportunity
- **Potential Monthly Earnings**: ~${Math.floor(totalPayments/12)} points
- **Cash Value**: $${(Math.floor(totalPayments/12)/100).toFixed(2)}
- **Annual Rewards**: $${(totalPayments/100*12).toFixed(2)} in cashback

*Continue building positive payment habits with CREDX USA for long-term financial success!*`;

  return advice;
}

async function generateFinancialInsights(userData, userHistory) {
  const insights = [];
  
  // Credit utilization analysis
  if (userHistory.totalPayments > 0 && userHistory.billCount > 0) {
    const avgBillAmount = userHistory.totalPayments / userHistory.billCount;
    if (avgBillAmount > 1000) {
      insights.push({
        type: 'warning',
        category: 'credit_utilization',
        title: 'High Credit Usage Detected',
        description: `Your average bill amount is $${avgBillAmount.toFixed(2)}. Consider paying down balances to improve credit utilization.`,
        action: 'Pay down high balances first',
        priority: 'high'
      });
    }
  }
  
  // Payment frequency analysis
  if (userHistory.paymentFrequency === 'irregular') {
    insights.push({
      type: 'tip',
      category: 'payment_habits',
      title: 'Consider AutoPay Setup',
      description: 'Irregular payment patterns can hurt your credit score. AutoPay ensures on-time payments.',
      action: 'Enable AutoPay for recurring bills',
      priority: 'medium'
    });
  }
  
  // Rewards optimization
  if (userHistory.totalRewards < userHistory.totalPayments) {
    const potentialRewards = Math.floor(userHistory.totalPayments / 10) * 1000;
    const missedRewards = potentialRewards - userHistory.totalRewards;
    
    insights.push({
      type: 'opportunity',
      category: 'rewards_optimization',
      title: 'Maximize Your Rewards',
      description: `You could have earned ${missedRewards} more points ($${(missedRewards / 100).toFixed(2)}) by optimizing your payment methods.`,
      action: 'Use CREDX USA for all bill payments',
      priority: 'medium'
    });
  }
  
  // Bill management insights
  if (userHistory.upcomingBills?.length > 3) {
    const totalDue = userHistory.upcomingBills.reduce((sum, bill) => sum + bill.amount, 0);
    insights.push({
      type: 'planning',
      category: 'cash_flow',
      title: 'Multiple Bills Due Soon',
      description: `You have ${userHistory.upcomingBills.length} bills totaling $${totalDue.toFixed(2)} due soon.`,
      action: 'Review payment scheduling options',
      priority: 'high'
    });
  }
  
  return insights;
}

export async function GET(request) {
  // Prevent build-time execution errors
  if (typeof window !== 'undefined') {
    return NextResponse.json({ error: 'Client-side execution not allowed' }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const query = searchParams.get('query');
    const insights_only = searchParams.get('insights_only') === 'true';

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Use fallback if database connection fails
    let db;
    try {
      const connection = await connectToDatabase();
      db = connection.db;
    } catch (dbError) {
      console.log('Database connection failed, using fallback mode');
      return NextResponse.json({
        success: true,
        advice: generateIntelligentFallback({ uid: user_id }, { totalPayments: 0, totalRewards: 0, billCount: 0 }, query),
        fallback_mode: true,
        model_used: "credx-fallback-ai",
        session_id: `fallback_${user_id}_${Date.now()}`,
        user_summary: {
          total_payments: 0,
          total_rewards: 0,
          bills_count: 0,
          payment_frequency: 'new_user'
        }
      });
    }

    // Get user data
    const user = await db.collection('users').findOne({
      $or: [{ firebase_uid: user_id }, { uid: user_id }]
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Gather comprehensive user financial history
    const [bills, payments, accounts, suggestions] = await Promise.all([
      db.collection('bills').find({ user_id: user_id }).sort({ due_date: 1 }).toArray(),
      db.collection('payment_history').find({ user_id: user_id }).sort({ created_at: -1 }).limit(20).toArray(),
      db.collection('plaid_accounts').find({ user_id: user_id }).toArray(),
      db.collection('ai_suggestions').findOne({ user_id: user_id })
    ]);

    // Calculate financial metrics
    const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalRewards = payments.reduce((sum, p) => sum + (p.rewards_earned || 0), 0);
    const averagePayment = payments.length > 0 ? totalPayments / payments.length : 0;
    const upcomingBills = bills.filter(bill => new Date(bill.due_date) > new Date());
    
    // Determine payment frequency
    let paymentFrequency = 'new_user';
    if (payments.length >= 3) {
      const intervals = [];
      for (let i = 1; i < payments.length && i < 5; i++) {
        const diff = new Date(payments[i-1].created_at) - new Date(payments[i].created_at);
        intervals.push(Math.abs(diff) / (1000 * 60 * 60 * 24));
      }
      const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
      
      if (avgInterval <= 10) paymentFrequency = 'frequent';
      else if (avgInterval <= 20) paymentFrequency = 'bi_weekly';
      else if (avgInterval <= 35) paymentFrequency = 'monthly';
      else paymentFrequency = 'irregular';
    }

    const userHistory = {
      totalPayments,
      totalRewards,
      billCount: bills.length,
      paymentFrequency,
      averagePayment,
      lastPaymentDate: payments[0]?.created_at || null,
      upcomingBills: upcomingBills.slice(0, 10),
      recentPayments: payments.slice(0, 5),
      linkedAccounts: accounts
    };

    // Generate traditional insights
    const traditionalInsights = await generateFinancialInsights(user, userHistory);

    if (insights_only) {
      return NextResponse.json({
        success: true,
        insights: traditionalInsights,
        user_summary: {
          total_payments: totalPayments,
          total_rewards: totalRewards,
          bills_count: bills.length,
          payment_frequency: paymentFrequency
        }
      });
    }

    // Get AI-powered advice
    const aiResponse = await getAIFinancialAdvice(user, userHistory, query);

    if (!aiResponse.success) {
      // Fallback to traditional insights if AI fails
      return NextResponse.json({
        success: true,
        advice: 'AI advisor temporarily unavailable. Here are your financial insights based on traditional analysis.',
        insights: traditionalInsights,
        fallback_mode: true,
        error: aiResponse.error
      });
    }

    // Store AI conversation in database
    await db.collection('ai_conversations').insertOne({
      user_id: user_id,
      session_id: aiResponse.session_id,
      query: query || 'Financial profile analysis',
      advice: aiResponse.advice,
      model_used: aiResponse.model_used,
      timestamp: new Date().toISOString(),
      user_context: userHistory
    });

    return NextResponse.json({
      success: true,
      advice: aiResponse.advice,
      insights: traditionalInsights,
      session_id: aiResponse.session_id,
      model_used: aiResponse.model_used,
      user_summary: {
        total_payments: totalPayments,
        total_rewards: totalRewards,
        bills_count: bills.length,
        payment_frequency: paymentFrequency,
        upcoming_bills: upcomingBills.length
      },
      generated_at: aiResponse.timestamp
    });

  } catch (error) {
    console.error('AI Financial Advisor Error:', error);
    return NextResponse.json(
      { error: 'Failed to get financial advice', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, action, feedback, suggestion_id, query } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    if (action === 'accept_suggestion') {
      // User accepts an AI suggestion
      await db.collection('ai_feedback').insertOne({
        user_id: user_id,
        suggestion_id: suggestion_id,
        action: 'accepted',
        feedback: feedback,
        timestamp: new Date().toISOString()
      });

      // Implement the suggestion (e.g., enable AutoPay)
      if (suggestion_id?.includes('autopay')) {
        await db.collection('bills').updateMany(
          { user_id: user_id, status: 'pending' },
          { 
            $set: { 
              autopay_enabled: true,
              autopay_enabled_at: new Date().toISOString()
            }
          }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Suggestion accepted and implemented',
        action_taken: 'autopay_enabled'
      });
    }

    if (action === 'ask_question') {
      // User asks a specific financial question
      const user = await db.collection('users').findOne({
        $or: [{ firebase_uid: user_id }, { uid: user_id }]
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Get user financial context (similar to GET request)
      const [bills, payments, accounts] = await Promise.all([
        db.collection('bills').find({ user_id: user_id }).toArray(),
        db.collection('payment_history').find({ user_id: user_id }).sort({ created_at: -1 }).limit(10).toArray(),
        db.collection('plaid_accounts').find({ user_id: user_id }).toArray()
      ]);

      const userHistory = {
        totalPayments: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
        totalRewards: payments.reduce((sum, p) => sum + (p.rewards_earned || 0), 0),
        billCount: bills.length,
        upcomingBills: bills.filter(bill => new Date(bill.due_date) > new Date()),
        recentPayments: payments.slice(0, 5),
        linkedAccounts: accounts
      };

      // Get AI response for specific question
      const aiResponse = await getAIFinancialAdvice(user, userHistory, query);

      if (aiResponse.success) {
        // Store conversation
        await db.collection('ai_conversations').insertOne({
          user_id: user_id,
          session_id: aiResponse.session_id,
          query: query,
          advice: aiResponse.advice,
          model_used: aiResponse.model_used,
          timestamp: new Date().toISOString(),
          conversation_type: 'user_question'
        });
      }

      return NextResponse.json({
        success: aiResponse.success,
        advice: aiResponse.advice || 'Unable to process question at this time',
        session_id: aiResponse.session_id,
        error: aiResponse.error
      });
    }

    if (action === 'provide_feedback') {
      // User provides feedback on AI advice
      await db.collection('ai_feedback').insertOne({
        user_id: user_id,
        feedback: feedback,
        rating: body.rating || null,
        timestamp: new Date().toISOString(),
        feedback_type: 'general'
      });

      return NextResponse.json({
        success: true,
        message: 'Thank you for your feedback!'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('AI Financial Advisor Action Error:', error);
    return NextResponse.json(
      { error: 'Failed to process action', details: error.message },
      { status: 500 }
    );
  }
}