// Gmail Statement Parsing API
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

// Gmail API integration for statement parsing
async function getGmailAccessToken(refreshToken) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GMAIL_CLIENT_ID,
        client_secret: process.env.GMAIL_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Gmail token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Gmail token refresh error:', error);
    throw error;
  }
}

async function searchGmailMessages(accessToken, query) {
  try {
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to search Gmail messages');
    }

    return await response.json();
  } catch (error) {
    console.error('Gmail search error:', error);
    throw error;
  }
}

async function getGmailMessage(accessToken, messageId) {
  try {
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get Gmail message');
    }

    return await response.json();
  } catch (error) {
    console.error('Gmail message retrieval error:', error);
    throw error;
  }
}

function parseStatementFromEmail(emailData) {
  const subject = emailData.payload?.headers?.find(h => h.name === 'Subject')?.value || '';
  const fromEmail = emailData.payload?.headers?.find(h => h.name === 'From')?.value || '';
  const date = emailData.payload?.headers?.find(h => h.name === 'Date')?.value || '';
  
  // Extract email body
  let body = '';
  if (emailData.payload?.body?.data) {
    body = Buffer.from(emailData.payload.body.data, 'base64').toString();
  } else if (emailData.payload?.parts) {
    for (const part of emailData.payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        body = Buffer.from(part.body.data, 'base64').toString();
        break;
      }
    }
  }

  // Bank/Card issuer detection patterns
  const issuers = {
    chase: /chase|jpmorgan/i,
    amex: /american express|amex/i,
    capitalone: /capital one/i,
    citi: /citibank|citi/i,
    bankofamerica: /bank of america|bofa/i,
    wells: /wells fargo/i,
    discover: /discover/i,
    usbank: /u\.?s\.? bank/i
  };

  let detectedIssuer = 'unknown';
  for (const [key, pattern] of Object.entries(issuers)) {
    if (pattern.test(fromEmail) || pattern.test(subject) || pattern.test(body)) {
      detectedIssuer = key;
      break;
    }
  }

  // Amount extraction patterns
  const amountPatterns = [
    /(?:balance|amount due|total|payment)[\s:]*\$?([\d,]+\.?\d*)/gi,
    /\$\s*([\d,]+\.?\d*)\s*(?:due|owed|balance)/gi,
    /minimum payment[:\s]*\$?([\d,]+\.?\d*)/gi
  ];

  let extractedAmount = null;
  for (const pattern of amountPatterns) {
    const matches = body.matchAll(pattern);
    for (const match of matches) {
      const amount = parseFloat(match[1].replace(/,/g, ''));
      if (amount > 0 && amount < 50000) { // Reasonable range
        extractedAmount = amount;
        break;
      }
    }
    if (extractedAmount) break;
  }

  // Due date extraction patterns
  const dueDatePatterns = [
    /due date[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    /payment due[:\s]*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    /by (\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi
  ];

  let extractedDueDate = null;
  for (const pattern of dueDatePatterns) {
    const matches = body.matchAll(pattern);
    for (const match of matches) {
      try {
        const dateStr = match[1];
        const date = new Date(dateStr);
        if (!isNaN(date.getTime()) && date > new Date()) {
          extractedDueDate = date.toISOString();
          break;
        }
      } catch (e) {
        // Invalid date, continue
      }
    }
    if (extractedDueDate) break;
  }

  return {
    issuer: detectedIssuer,
    amount: extractedAmount,
    due_date: extractedDueDate,
    raw_subject: subject,
    raw_from: fromEmail,
    parsed_at: new Date().toISOString(),
    confidence: calculateConfidence(detectedIssuer, extractedAmount, extractedDueDate)
  };
}

function calculateConfidence(issuer, amount, dueDate) {
  let confidence = 0;
  if (issuer !== 'unknown') confidence += 40;
  if (amount !== null) confidence += 40;
  if (dueDate !== null) confidence += 20;
  return confidence;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const force_refresh = searchParams.get('force_refresh') === 'true';

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get user's Gmail settings
    const user = await db.collection('users').findOne({ 
      $or: [{ firebase_uid: user_id }, { uid: user_id }]
    });

    if (!user || !user.gmail_refresh_token) {
      return NextResponse.json({ 
        error: 'Gmail not connected. Please connect your Gmail account first.' 
      }, { status: 404 });
    }

    // Check if we have recent data and don't force refresh
    if (!force_refresh) {
      const recentStatements = await db.collection('parsed_statements')
        .find({ 
          user_id: user_id,
          parsed_at: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
        })
        .sort({ parsed_at: -1 })
        .toArray();

      if (recentStatements.length > 0) {
        return NextResponse.json({
          success: true,
          cached: true,
          statements: recentStatements,
          message: 'Using cached data from last 24 hours'
        });
      }
    }

    // Get fresh Gmail access token
    const accessToken = await getGmailAccessToken(user.gmail_refresh_token);

    // Search for credit card statements
    const searchQueries = [
      'from:(chase.com) OR from:(americanexpress.com) OR from:(capitalone.com) statement',
      'subject:(statement ready) OR subject:(credit card bill)',
      'from:(citi.com) OR from:(bankofamerica.com) OR from:(wellsfargo.com) statement',
      'subject:(payment due) OR subject:(minimum payment)'
    ];

    const allStatements = [];

    for (const query of searchQueries) {
      try {
        const searchResults = await searchGmailMessages(accessToken, query);
        
        if (searchResults.messages) {
          // Limit to recent messages (last 3 months)
          const recentMessages = searchResults.messages.slice(0, 20);
          
          for (const message of recentMessages) {
            try {
              const emailData = await getGmailMessage(accessToken, message.id);
              const parsedStatement = parseStatementFromEmail(emailData);
              
              if (parsedStatement.confidence >= 60) { // Only high-confidence parses
                const statementData = {
                  ...parsedStatement,
                  user_id: user_id,
                  gmail_message_id: message.id,
                  source: 'gmail_parsing'
                };

                // Save to database
                await db.collection('parsed_statements').updateOne(
                  { gmail_message_id: message.id, user_id: user_id },
                  { $set: statementData },
                  { upsert: true }
                );

                allStatements.push(statementData);
              }
            } catch (messageError) {
              console.error('Error processing message:', messageError);
              // Continue with next message
            }
          }
        }
      } catch (queryError) {
        console.error('Error with search query:', queryError);
        // Continue with next query
      }
    }

    // Auto-create bills from parsed statements
    for (const statement of allStatements) {
      if (statement.amount && statement.due_date) {
        const billData = {
          user_id: user_id,
          name: `${statement.issuer.charAt(0).toUpperCase() + statement.issuer.slice(1)} Credit Card`,
          amount: statement.amount,
          due_date: statement.due_date,
          category: 'credit_card',
          issuer: statement.issuer,
          status: 'pending',
          source: 'gmail_parsing',
          created_at: new Date().toISOString()
        };

        await db.collection('bills').updateOne(
          { 
            user_id: user_id,
            issuer: statement.issuer,
            amount: statement.amount,
            due_date: statement.due_date
          },
          { $set: billData },
          { upsert: true }
        );
      }
    }

    return NextResponse.json({
      success: true,
      statements: allStatements,
      bills_created: allStatements.filter(s => s.amount && s.due_date).length,
      total_parsed: allStatements.length
    });

  } catch (error) {
    console.error('Gmail Parsing Error:', error);
    return NextResponse.json(
      { error: 'Failed to parse Gmail statements', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, action, gmail_auth_code } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    if (action === 'connect_gmail') {
      // Exchange auth code for refresh token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GMAIL_CLIENT_ID,
          client_secret: process.env.GMAIL_CLIENT_SECRET,
          code: gmail_auth_code,
          grant_type: 'authorization_code',
          redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/gmail/callback`
        })
      });

      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange Gmail auth code');
      }

      const tokenData = await tokenResponse.json();

      // Save refresh token to user profile
      await db.collection('users').updateOne(
        { $or: [{ firebase_uid: user_id }, { uid: user_id }] },
        { 
          $set: { 
            gmail_refresh_token: tokenData.refresh_token,
            gmail_connected_at: new Date().toISOString()
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Gmail connected successfully. You can now parse your credit card statements.'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Gmail Connect Error:', error);
    return NextResponse.json(
      { error: 'Failed to connect Gmail', details: error.message },
      { status: 500 }
    );
  }
}