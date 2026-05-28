// Bank CSV Upload and Statement Processing API
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

function parseCSVContent(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV file must have at least a header row and one data row');
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  const transactions = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const transaction = {};
      headers.forEach((header, index) => {
        transaction[header] = values[index];
      });
      transactions.push(transaction);
    }
  }

  return { headers, transactions };
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function detectCSVFormat(headers, transactions) {
  const formats = {
    chase: {
      patterns: ['transaction date', 'post date', 'description', 'category', 'type', 'amount'],
      confidence: 0
    },
    amex: {
      patterns: ['date', 'description', 'card member', 'account #', 'amount'],
      confidence: 0
    },
    capitalone: {
      patterns: ['transaction date', 'posted date', 'card no.', 'description', 'category', 'debit', 'credit'],
      confidence: 0
    },
    citi: {
      patterns: ['status', 'date', 'description', 'debit', 'credit'],
      confidence: 0
    },
    bankofamerica: {
      patterns: ['posted date', 'reference number', 'payee', 'address', 'amount'],
      confidence: 0
    },
    wells: {
      patterns: ['date', 'amount', 'description', 'type'],
      confidence: 0
    },
    discover: {
      patterns: ['trans. date', 'post date', 'description', 'amount', 'category'],
      confidence: 0
    },
    generic: {
      patterns: ['date', 'description', 'amount'],
      confidence: 0
    }
  };

  // Check each format against headers
  Object.keys(formats).forEach(bank => {
    const patterns = formats[bank].patterns;
    let matches = 0;

    patterns.forEach(pattern => {
      if (headers.some(header => header.includes(pattern))) {
        matches++;
      }
    });

    formats[bank].confidence = (matches / patterns.length) * 100;
  });

  // Return the format with highest confidence
  const detectedFormat = Object.entries(formats)
    .sort(([,a], [,b]) => b.confidence - a.confidence)[0];

  return {
    bank: detectedFormat[0],
    confidence: detectedFormat[1].confidence,
    headers_found: headers
  };
}

function extractTransactionData(transaction, format) {
  const extracted = {
    date: null,
    description: '',
    amount: 0,
    category: '',
    type: 'debit',
    raw_data: transaction
  };

  // Date extraction based on format
  const dateFields = ['date', 'transaction date', 'posted date', 'post date', 'trans. date'];
  for (const field of dateFields) {
    if (transaction[field]) {
      try {
        extracted.date = new Date(transaction[field]).toISOString();
        break;
      } catch (e) {
        // Invalid date, continue
      }
    }
  }

  // Description extraction
  const descFields = ['description', 'payee', 'merchant', 'reference'];
  for (const field of descFields) {
    if (transaction[field] && transaction[field].trim()) {
      extracted.description = transaction[field].trim();
      break;
    }
  }

  // Amount extraction
  const amountFields = ['amount', 'debit', 'credit'];
  for (const field of amountFields) {
    if (transaction[field]) {
      const amount = parseFloat(transaction[field].replace(/[\$,]/g, ''));
      if (!isNaN(amount) && amount !== 0) {
        extracted.amount = Math.abs(amount);
        extracted.type = amount < 0 || field === 'debit' ? 'debit' : 'credit';
        break;
      }
    }
  }

  // Category extraction
  if (transaction['category'] || transaction['type']) {
    extracted.category = transaction['category'] || transaction['type'];
  }

  return extracted;
}

function detectBillPayments(transactions) {
  const billPatterns = [
    { pattern: /credit card|cc payment|payment/i, category: 'credit_card_payment' },
    { pattern: /electric|utility|power|energy/i, category: 'utilities' },
    { pattern: /phone|wireless|cellular|verizon|at&t|t-mobile/i, category: 'phone' },
    { pattern: /internet|cable|wifi|comcast|xfinity/i, category: 'internet' },
    { pattern: /insurance|geico|state farm|allstate/i, category: 'insurance' },
    { pattern: /rent|mortgage|housing/i, category: 'housing' },
    { pattern: /subscription|netflix|spotify|prime/i, category: 'subscriptions' }
  ];

  const detectedBills = [];

  transactions.forEach(transaction => {
    if (transaction.type === 'debit' && transaction.amount > 10) {
      for (const { pattern, category } of billPatterns) {
        if (pattern.test(transaction.description)) {
          detectedBills.push({
            ...transaction,
            bill_category: category,
            is_recurring: isLikelyRecurring(transaction, transactions),
            suggested_autopay: transaction.amount < 500 && isLikelyRecurring(transaction, transactions)
          });
          break;
        }
      }
    }
  });

  return detectedBills;
}

function isLikelyRecurring(transaction, allTransactions) {
  const similarTransactions = allTransactions.filter(t => 
    t.description === transaction.description &&
    Math.abs(t.amount - transaction.amount) < 5 &&
    t.date !== transaction.date
  );

  return similarTransactions.length >= 2;
}

function generateInsights(transactions, billPayments) {
  const insights = [];
  
  // Spending analysis
  const totalSpending = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const categorySpending = {};
  transactions.forEach(t => {
    if (t.type === 'debit' && t.category) {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    }
  });

  const topCategory = Object.entries(categorySpending)
    .sort(([,a], [,b]) => b - a)[0];

  if (topCategory) {
    insights.push({
      type: 'spending_insight',
      title: 'Top Spending Category',
      description: `You spent $${topCategory[1].toFixed(2)} on ${topCategory[0]}`,
      actionable: topCategory[1] > totalSpending * 0.3
    });
  }

  // Bill payment insights
  if (billPayments.length > 0) {
    const recurringBills = billPayments.filter(b => b.is_recurring);
    const autoPayCandidates = billPayments.filter(b => b.suggested_autopay);

    insights.push({
      type: 'bill_insight',
      title: 'Recurring Bills Detected',
      description: `Found ${recurringBills.length} recurring bills totaling $${recurringBills.reduce((sum, b) => sum + b.amount, 0).toFixed(2)}`,
      actionable: autoPayCandidates.length > 0,
      action_suggestion: `Consider enabling AutoPay for ${autoPayCandidates.length} bills`
    });
  }

  // Credit card payment patterns
  const creditCardPayments = transactions.filter(t => 
    t.type === 'debit' && /credit card|cc payment/i.test(t.description)
  );

  if (creditCardPayments.length > 0) {
    const avgPayment = creditCardPayments.reduce((sum, p) => sum + p.amount, 0) / creditCardPayments.length;
    insights.push({
      type: 'credit_insight',
      title: 'Credit Card Payment Pattern',
      description: `Average payment: $${avgPayment.toFixed(2)}, ${creditCardPayments.length} payments found`,
      actionable: true,
      action_suggestion: 'Track these payments in CREDX USA for rewards'
    });
  }

  return insights;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const csvFile = formData.get('csv_file');
    const user_id = formData.get('user_id');
    const bank_name = formData.get('bank_name') || 'unknown';

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!csvFile) {
      return NextResponse.json({ error: 'CSV file is required' }, { status: 400 });
    }

    // Read CSV content
    const csvContent = await csvFile.text();
    
    if (!csvContent || csvContent.trim().length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 });
    }

    // Parse CSV
    const { headers, transactions } = parseCSVContent(csvContent);
    
    if (transactions.length === 0) {
      return NextResponse.json({ error: 'No valid transactions found in CSV' }, { status: 400 });
    }

    // Detect format
    const detectedFormat = detectCSVFormat(headers, transactions);
    
    if (detectedFormat.confidence < 50) {
      return NextResponse.json({
        error: 'CSV format not recognized',
        details: 'Please ensure your CSV contains columns like: Date, Description, Amount',
        headers_found: headers
      }, { status: 400 });
    }

    // Extract transaction data
    const extractedTransactions = transactions.map(t => 
      extractTransactionData(t, detectedFormat)
    ).filter(t => t.date && t.amount > 0);

    // Detect bill payments
    const billPayments = detectBillPayments(extractedTransactions);

    // Generate insights
    const insights = generateInsights(extractedTransactions, billPayments);

    // Save to database
    const { db } = await connectToDatabase();

    const uploadRecord = {
      user_id: user_id,
      bank_name: bank_name,
      detected_format: detectedFormat,
      total_transactions: extractedTransactions.length,
      bill_payments_found: billPayments.length,
      insights: insights,
      uploaded_at: new Date().toISOString(),
      file_name: csvFile.name,
      processed: true
    };

    const uploadResult = await db.collection('csv_uploads').insertOne(uploadRecord);

    // Save extracted transactions
    const transactionRecords = extractedTransactions.map(t => ({
      ...t,
      user_id: user_id,
      upload_id: uploadResult.insertedId,
      source: 'csv_upload',
      created_at: new Date().toISOString()
    }));

    if (transactionRecords.length > 0) {
      await db.collection('uploaded_transactions').insertMany(transactionRecords);
    }

    // Create bills from detected bill payments
    const createdBills = [];
    for (const bill of billPayments) {
      if (bill.is_recurring) {
        const billData = {
          user_id: user_id,
          name: bill.description,
          amount: bill.amount,
          category: bill.bill_category,
          status: 'completed', // Since it's from past transactions
          source: 'csv_upload',
          autopay_suggested: bill.suggested_autopay,
          created_at: new Date().toISOString(),
          transaction_date: bill.date
        };

        const billResult = await db.collection('bills').insertOne(billData);
        createdBills.push(billResult.insertedId);
      }
    }

    return NextResponse.json({
      success: true,
      upload_id: uploadResult.insertedId,
      summary: {
        bank_detected: detectedFormat.bank,
        confidence: detectedFormat.confidence,
        total_transactions: extractedTransactions.length,
        bill_payments_found: billPayments.length,
        bills_created: createdBills.length,
        recurring_bills: billPayments.filter(b => b.is_recurring).length,
        autopay_candidates: billPayments.filter(b => b.suggested_autopay).length
      },
      insights: insights,
      next_steps: [
        'Review detected bill payments in your dashboard',
        'Consider enabling AutoPay for recurring bills',
        'Set up reminders for upcoming payments'
      ]
    });

  } catch (error) {
    console.error('CSV Upload Error:', error);
    return NextResponse.json(
      { error: 'Failed to process CSV file', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const upload_id = searchParams.get('upload_id');

    if (!user_id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    if (upload_id) {
      // Get specific upload details
      const upload = await db.collection('csv_uploads').findOne({
        _id: upload_id,
        user_id: user_id
      });

      if (!upload) {
        return NextResponse.json({ error: 'Upload not found' }, { status: 404 });
      }

      const transactions = await db.collection('uploaded_transactions')
        .find({ upload_id: upload_id, user_id: user_id })
        .sort({ date: -1 })
        .toArray();

      return NextResponse.json({
        success: true,
        upload: upload,
        transactions: transactions
      });
    } else {
      // Get all uploads for user
      const uploads = await db.collection('csv_uploads')
        .find({ user_id: user_id })
        .sort({ uploaded_at: -1 })
        .toArray();

      return NextResponse.json({
        success: true,
        uploads: uploads,
        total_uploads: uploads.length
      });
    }

  } catch (error) {
    console.error('CSV Upload Retrieval Error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve upload data', details: error.message },
      { status: 500 }
    );
  }
}