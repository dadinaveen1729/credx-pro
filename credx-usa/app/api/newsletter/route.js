import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('credxusa');
    const col = db.collection('newsletter_subscribers');

    await col.updateOne(
      { email: email.toLowerCase().trim() },
      {
        $set: {
          email: email.toLowerCase().trim(),
          subscribed_at: new Date(),
          source: 'blog'
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Subscribed!' });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ success: true, message: 'Subscribed!' });
  }
}
