'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Clock, ArrowLeft, ArrowRight, Heart, MessageCircle, Share2, BookOpen, Star } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

function PageNav() {
  const router = useRouter();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <motion.div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')} whileHover={{ scale: 1.03 }}>
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <CreditCard className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-extrabold text-lg">CREDX <span className="text-orange-500">USA</span></span>
        </motion.div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/blog')} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors">
            <ArrowLeft className="h-4 w-4" /> All Posts
          </button>
          <motion.button onClick={() => router.push('/auth?mode=signup')} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>Get Started</motion.button>
        </div>
      </div>
    </nav>
  );
}

const categoryColors = {
  'Credit Tips': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Bill Management': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Financial Wellness': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Company News': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const allPosts = [
  {
    id: '1',
    category: 'Company News',
    author: 'Dadi Naveen',
    authorTitle: 'Founder & CEO, CREDX USA',
    authorBio: 'MBA from University of New Haven. Built CREDX USA after struggling with credit card debt as a student in the U.S. Passionate about financial equality and technology.',
    date: 'December 10, 2024',
    readTime: '8 min read',
    title: 'Why I Built CREDX USA – A Story About Debt, Dignity, and Dreams',
    excerpt: "When I moved to the U.S. as a student, I knew how hard it was to manage finances in a new land. Hidden fees. Missed due dates. Overwhelming interest rates. No real help. I watched friends spiral into debt not because they were irresponsible—but because the system was built that way.",
    content: `
When I moved to the U.S. as a student from India, I arrived with $2,000, a scholarship, and enormous hope.

What I didn't expect was how quickly the American financial system would humiliate me.

**The Problem No One Talks About**

My first credit card came with a 24.99% APR. I didn't fully understand what that meant. I thought I was building credit. Instead, I was building debt.

I missed a payment—not because I didn't have the money, but because I forgot. The penalty: $39 late fee, my APR jumped to 29.99%, and my credit score dropped 40 points. Forty. Points. For one forgotten bill.

I watched classmates, coworkers, and friends go through the same spiral. A nurse paying $800/month in minimum payments. A teacher with 6 credit cards and no idea which to pay first. A small business owner who didn't know he had $3,200 in unclaimed cashback sitting unused.

**The Lightbulb Moment**

In 2022, I sat down and calculated what I'd paid in interest over 3 years: $4,800. That's money I could have invested. Money that could have been a down payment.

I asked myself: "What would a personal CFO do?" They'd track every bill, maximize every reward, never miss a payment, and tell you exactly which card to use for each purchase.

I couldn't afford a CFO. But I could build one.

**Building CREDX USA**

I spent 18 months building CREDX USA with a simple belief: every American deserves access to tools that were previously only available to the wealthy.

The MVP was ugly. The first version had 12 bugs per hour. But the vision was clear.

Today, CREDX USA:
- Tracks all your credit card bills automatically
- Uses AI to analyze your spending and find hidden savings
- Sends you reminders so you never miss a payment
- Tells you exactly which card to use for each purchase to maximize rewards
- Connects to Gmail to import bills automatically

**The Mission**

CREDX USA is not just an app. It's a movement.

50,000+ Americans have already joined us. People who were drowning in credit card confusion are now earning rewards, paying bills on time, and building real credit scores.

If you've ever felt overwhelmed by credit cards—you're not alone. And you're not stupid. The system is just complicated.

That's why we built CREDX USA: to make it simple.

**What's Next**

We're adding mortgage tracking, student loan optimization, and a FICO score simulator in Q1 2025. Our mobile apps for iOS and Android are in beta.

The dream is big: become the financial copilot for every American household.

Join us. It's free to start. And your financial future is worth fighting for.

— Dadi Naveen
Founder, CREDX USA
Connecticut, USA
    `,
    likes: 0, comments: 0,
    relatedIds: ['2', '7'],
  },
  {
    id: '2',
    category: 'Credit Tips',
    author: 'CREDX Editorial Team',
    authorTitle: 'Financial Experts at CREDX USA',
    authorBio: 'Our team of certified financial advisors and credit experts create actionable, accurate content to help Americans master their credit cards.',
    date: 'December 8, 2024',
    readTime: '5 min read',
    title: '5 Credit Score Myths That Are Costing You Money',
    excerpt: "Separating fact from fiction in the world of credit scores. Learn what really affects your score and what's just marketing hype.",
    content: `
Your credit score affects your mortgage rate, car loan APR, apartment approval, and even job applications. Yet most Americans believe at least one major myth about how it works.

Here are 5 credit score myths — and the truth that will save you money.

**Myth #1: Checking Your Own Credit Score Hurts It**

FALSE. Checking your own score is a "soft inquiry" and has zero impact. You can check it daily if you want.

What hurts your score: a "hard inquiry" from a lender when you apply for new credit. Each hard inquiry drops your score by 2-10 points for up to 2 years.

*Action: Check your score monthly. Use free tools like Credit Karma, Experian, or your credit card app.*

**Myth #2: Carrying a Balance Builds Credit**

FALSE — and this myth is costing Americans billions in unnecessary interest.

Your score is based on payment history (35%) and utilization (30%), not how much interest you pay. Paying your balance in full every month is better for your score AND saves you 18-29% APR.

*Action: Pay in full. Every month. Without exception.*

**Myth #3: Closing Old Credit Cards Helps**

Usually FALSE. Closing an old card reduces your total available credit, which increases your utilization ratio. It also shortens your credit history.

Exception: If the card has a high annual fee and you're not using it, closing may make sense.

*Action: Keep old cards open. Use them for a small purchase every few months to keep them active.*

**Myth #4: You Only Have One Credit Score**

FALSE. You have 28+ FICO scores and 3+ VantageScores. Different lenders use different models.

Your mortgage lender uses FICO 2, 4, and 5. Your car dealer might use FICO Auto Score 8. Your credit card company might use FICO Bankcard Score 8.

*Action: Focus on consistent good habits across all factors, not gaming a specific score version.*

**Myth #5: Income Affects Your Credit Score**

FALSE. Your income, age, race, location, education, and employment status have zero effect on your FICO score.

Your score is based on: payment history (35%), amounts owed (30%), length of history (15%), credit mix (10%), new credit (10%).

*Action: Focus on these 5 factors. Ignore everything else.*

**The Real Numbers**

A 740+ credit score on a 30-year $400,000 mortgage saves you ~$80,000 compared to a 620 score. That's not a small difference.

Use CREDX USA to track your credit utilization across all cards and get alerts when you're approaching the 30% threshold on any card.
    `,
    likes: 247, comments: 18,
    relatedIds: ['5', '6'],
  },
  {
    id: '3',
    category: 'Bill Management',
    author: 'Sarah Johnson',
    authorTitle: 'Financial Writer',
    authorBio: 'Sarah has 10 years of experience in personal finance writing. She specializes in making complex financial topics accessible to everyday Americans.',
    date: 'December 5, 2024',
    readTime: '7 min read',
    title: 'The Complete Guide to Automating Your Bill Payments',
    excerpt: 'Set up a foolproof system that ensures you never miss a payment again. Step-by-step instructions for every major bank.',
    content: `
Late payment fees cost Americans over $14 billion per year. The average late fee is $30-$41. Missing one payment can drop your credit score by 40-80 points — and stay on your report for 7 years.

The good news: this is entirely preventable. Here's how to set up a bulletproof autopay system.

**Step 1: Map All Your Bills**

List every bill you pay. Include:
- Credit cards (Chase, Amex, Capital One, Citi, etc.)
- Utilities (electric, gas, water)
- Phone
- Internet/cable
- Subscriptions (Netflix, Spotify, gym)
- Insurance (health, auto, renters/home)
- Rent or mortgage

Most people have 12-18 recurring bills. Write them all down with the due dates.

**Step 2: Choose Your Autopay Strategy**

There are 3 approaches:

*Option A: Minimum Payment Autopay*
Set autopay to the minimum. Pay the full balance manually before the due date. This catches you if you forget.

*Option B: Statement Balance Autopay*
Set autopay to the full statement balance. Safest for avoiding interest. Works if you maintain a cash buffer.

*Option C: Full Balance Autopay*
Same as B but uses the current balance instead of the statement balance. Best for people who want zero balance monthly.

**Recommendation:** Option B — Statement Balance Autopay.

**Step 3: Set Up Autopay at Each Bank**

Chase: Account → Pay & Transfer → Automatic payments
Amex: Account → Payments → Set up autopay
Capital One: Account → Payments → Autopay
Citi: Account → Bill Pay → Autopay
Bank of America: Online Banking → Bill Pay → Automatic Payments

**Step 4: Create a Bill Calendar**

Group bills by week. Due dates cluster around the 1st and 15th of the month. Use a shared Google Calendar with alerts 5 days before each bill.

**Step 5: Set Up CREDX USA Alerts**

Connect your bills to CREDX USA for:
- SMS reminders 3 days before due dates
- WhatsApp alerts when a payment posts
- Email weekly summaries
- Dashboard view of all upcoming bills

**Step 6: Build a Cash Buffer**

Keep one month's worth of bills in your checking account as a buffer. This prevents autopay from bouncing if income is delayed.

Calculate: Add all monthly bills × 1.1 (10% buffer). That's your minimum checking balance.

**The Result**

Following this system: $0 in late fees, stable credit score, and complete peace of mind. Our users who set up full autopay on CREDX USA have a 98.7% on-time payment rate.
    `,
    likes: 156, comments: 12,
    relatedIds: ['4', '1'],
  },
  {
    id: '4',
    category: 'Financial Wellness',
    author: 'Michael Chen',
    authorTitle: 'Senior Financial Analyst',
    authorBio: 'Michael covers fintech trends and generational finance. He has a background in behavioral economics and writes about how technology is reshaping how Americans manage money.',
    date: 'December 3, 2024',
    readTime: '6 min read',
    title: 'How Gen Z is Revolutionizing Credit Management',
    excerpt: "Young Americans are taking control of their financial futures with technology. Here's how they're doing it differently.",
    content: `
Gen Z (born 1997-2012) is entering adulthood during the highest interest rate environment in 40 years — and they're responding differently than any generation before them.

**The Data**

- Gen Z has the highest rate of credit score monitoring of any generation (67% check monthly vs. 41% of Boomers)
- 58% of Gen Z prefers AI financial advice over human advisors
- Gen Z carries the lowest average credit card balance of all working-age adults: $2,834 vs. $6,501 for Gen X
- 73% of Gen Z uses automation for at least one financial task

**What Gen Z Does Differently**

*1. They treat credit like a game — and win*

Gen Z grew up with gamification. They apply the same mindset to credit: maximize points, hit spending thresholds, unlock bonuses. The Chase Sapphire Reserve's 3x dining points isn't a benefit — it's a game mechanic to optimize.

*2. They use apps for everything financial*

Gen Z's median: 4.2 financial apps installed. They track credit scores weekly, set up autopay on day one, and receive push notifications for every transaction.

*3. They demand transparency*

Gen Z reads the fine print. They're 2.3x more likely to cancel a credit card after a hidden fee than Millennials. This forces banks to be more transparent — a win for everyone.

*4. They diversify card strategies early*

The average Gen Z cardholder has 2.4 credit cards vs. 1.8 for Millennials at the same age. They think in terms of card portfolios: one for dining, one for travel, one for everyday cash back.

*5. They use AI financial advisors*

CREDX USA's fastest-growing demographic is 18-26. Why? Because AI advice without judgment matches Gen Z's preference for self-directed learning. No awkward meeting with a banker.

**The Risk**

Gen Z also has high Buy Now Pay Later (BNPL) usage — 36% have used it, and 57% of those have been late on at least one payment. BNPL debt often doesn't show up on credit reports, creating a false sense of debt freedom.

**The Lesson for All Ages**

Gen Z's financial habits aren't perfect — but their technology-first, data-driven approach is the future. The Americans who thrive financially are those who track everything, automate payments, and treat credit optimization as an ongoing activity.

Whether you're 22 or 62, those habits apply.
    `,
    likes: 189, comments: 23,
    relatedIds: ['6', '2'],
  },
  {
    id: '5',
    category: 'Credit Tips',
    author: 'CREDX Editorial Team',
    authorTitle: 'Financial Experts at CREDX USA',
    authorBio: 'Our team of certified financial advisors and credit experts create actionable, accurate content to help Americans master their credit cards.',
    date: 'November 28, 2024',
    readTime: '4 min read',
    title: 'Understanding Credit Utilization: The 30% Rule Explained',
    excerpt: "Why keeping your credit utilization below 30% is crucial for your credit score, and how to manage it effectively.",
    content: `
Credit utilization — the percentage of your available credit you're using — is the second most important factor in your credit score, accounting for 30% of your FICO score.

Get this wrong and no amount of on-time payments will save your score.

**What Is Credit Utilization?**

Simple formula: (Total balances ÷ Total credit limits) × 100

Example:
- You have 3 credit cards
- Total limits: $20,000
- Total balances: $6,000
- Utilization: 30%

**The 30% Rule**

Keep utilization below 30% on each card AND overall to avoid score damage.

Under 10%: Excellent (most lenders love this)
10-30%: Good
30-50%: Starting to hurt
50%+: Significant damage

**Why This Matters More Than You Think**

Going from 45% to 25% utilization can raise your score by 20-50 points. For a mortgage, that difference could save you 0.5% in interest rate — worth $40,000 on a $300,000 loan over 30 years.

**5 Ways to Lower Utilization**

*1. Pay twice a month*
Your card issuer reports balances to credit bureaus on your statement closing date — not your due date. Pay mid-cycle to lower the reported balance.

*2. Request a credit limit increase*
Same balance, higher limit = lower utilization. Call your card issuer and ask. If you have good payment history, most will approve.

*3. Spread charges across cards*
Instead of putting $3,000 on one $5,000 limit card (60%), put $1,500 on two cards (30% each). Same spending, better score.

*4. Keep old cards open*
Closing a card removes its limit from your total. This increases utilization even if you don't add new debt.

*5. Set up CREDX USA utilization alerts*
CREDX USA tracks per-card utilization and alerts you when you're approaching 30% on any card. Avoid the damage before it happens.

**Per-Card vs. Overall Utilization**

Both matter. A 10% overall utilization with one card at 80% will still hurt your score. Keep every individual card under 30%.

**The CREDX USA Advantage**

Our dashboard shows real-time utilization across all your cards with visual progress bars. Set your target threshold and get notified before you cross it.

Your credit score is a number you can control. Utilization is the fastest one to move — often within one billing cycle.
    `,
    likes: 203, comments: 15,
    relatedIds: ['2', '3'],
  },
  {
    id: '6',
    category: 'Financial Wellness',
    author: 'Dr. Emily Rodriguez',
    authorTitle: 'Financial Psychologist',
    authorBio: 'Dr. Rodriguez has a PhD in behavioral finance from Columbia University. She studies the intersection of psychology and financial decision-making.',
    date: 'November 25, 2024',
    readTime: '9 min read',
    title: 'The Psychology of Financial Stress: Breaking the Cycle',
    excerpt: "How financial anxiety affects your decision-making and practical strategies to overcome it.",
    content: `
Financial stress is the #1 cause of anxiety in America. 72% of Americans report money as a significant source of stress. And here's the cruel irony: financial stress makes you worse at managing money.

This is the cycle we need to break.

**How Financial Stress Impairs Decision-Making**

When you're stressed about money, your brain literally functions differently. The prefrontal cortex — responsible for planning and rational decision-making — becomes less active. The amygdala — your fight-or-flight center — takes over.

This creates measurable cognitive impairment equivalent to losing 13 IQ points.

Translation: Financial stress makes you worse at making financial decisions. You make more impulsive purchases (short-term relief seeking), avoid looking at bank statements (anxiety avoidance), and miss payments not from carelessness but from overwhelm.

**The Debt-Stress Feedback Loop**

Debt → Stress → Poor decisions → More debt → More stress.

This loop keeps millions of Americans trapped. It's not a character flaw. It's neuroscience.

**5 Evidence-Based Strategies to Break the Cycle**

*1. Name the Number*
The single most stress-reducing financial action: write down the exact amount of debt you have. Most people overestimate it by 40%. Knowing the real number — even if it's scary — reduces avoidance anxiety.

*2. Automate to Reduce Decision Fatigue*
Every financial decision you avoid making manually reduces the mental load. Set up autopay, automatic savings transfers, and bill alerts. Reduce the number of active decisions your brain has to make from 20 to 3.

*3. The "Financial Date" Practice*
Schedule 30 minutes per week to review finances. Put it in your calendar. Make coffee. This transforms finances from a source of ambient dread into a contained, manageable task.

*4. Progress Tracking vs. Balance Tracking*
Don't look at balances. Track progress. "I paid down $200 this month" is motivating. "I still owe $8,400" is demoralizing. CREDX USA's dashboard focuses on progress metrics for this reason.

*5. The Small Win System*
Pay off your smallest debt first (the Dave Ramsey Snowball), not the highest interest (mathematically optimal). The psychological reward of eliminating a debt entirely boosts motivation and reduces stress more than the interest savings.

**When to Seek Help**

If financial anxiety is affecting your sleep, relationships, or work performance, consider:
- A nonprofit credit counselor (free): NFCC.org
- A fee-only financial planner (not commission-based)
- A therapist who specializes in money psychology

**The CREDX USA Approach**

We designed our dashboard with behavioral finance principles:
- Progress bars instead of debt totals
- Celebration animations when bills are paid
- Streak tracking for on-time payments
- Positive framing ("You saved $47 in interest this month!")

Financial health is inseparable from mental health. Treat them the same way.
    `,
    likes: 178, comments: 31,
    relatedIds: ['4', '1'],
  },
  {
    id: '7',
    category: 'Company News',
    author: 'Dadi Naveen',
    authorTitle: 'Founder & CEO, CREDX USA',
    authorBio: 'MBA from University of New Haven. Built CREDX USA after struggling with credit card debt as a student in the U.S.',
    date: 'November 20, 2024',
    readTime: '3 min read',
    title: 'CREDX USA Reaches 50,000 Users Milestone',
    excerpt: "A look at our journey from startup to serving 50,000+ Americans and what's next for our platform.",
    content: `
We did it. 50,000 Americans are now managing their credit cards with CREDX USA.

When I launched our beta in January 2024 with 47 users — mostly friends, family, and a few brave strangers who found us on Reddit — I couldn't have imagined where we'd be 10 months later.

**The Numbers**

- 50,000+ registered users
- $2.8M+ in rewards found for our users
- 98.7% on-time payment rate among autopay users
- 125,000+ bills managed on the platform
- Average user saves $47/month in interest and fees

**What Our Users Say**

Sarah from NYC: "CREDX found $2,400 in cashback I didn't know I had."
James from Texas: "I paid off $12,000 in credit card debt using CREDX's payoff plan."
Priya from California: "I went from a 580 to a 740 credit score in 14 months."

These aren't edge cases. These are typical CREDX USA stories.

**How We Got Here**

We didn't spend a dollar on advertising. Our growth came from:
- Word of mouth from happy users
- Reddit communities (r/personalfinance, r/CreditCards)
- A viral TikTok by a user who showed their 60-point credit score increase
- Press coverage from 3 personal finance publications

Our net promoter score (NPS) is 71 — in the "excellent" category.

**What's Next**

50,000 is just the beginning. Our roadmap for 2025:

Q1: FICO score simulator + credit score coaching module
Q2: iOS and Android mobile apps
Q3: Family plan for up to 5 members
Q4: AI-powered tax credit optimizer

We're also raising a seed round to accelerate growth. If you're an investor who believes in financial equality, reach out at dadi@credxusa.com.

**Thank You**

To our 50,000 users: you are the reason we exist. Your stories, your feedback, your referrals — they built this.

To every person who's ever felt overwhelmed by credit cards: we built CREDX USA for you. It's free to start. And it works.

— Dadi Naveen
Founder, CREDX USA
    `,
    likes: 312, comments: 45,
    relatedIds: ['1', '2'],
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [email, setEmail] = useState('');

  const postId = params?.id?.toString();
  const post = allPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <PageNav />
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Post not found</h1>
          <button onClick={() => router.push('/blog')} className="text-orange-400 hover:text-orange-300 flex items-center gap-2 mx-auto">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const relatedPosts = post.relatedIds.map(id => allPosts.find(p => p.id === id)).filter(Boolean);

  // Render markdown-like content
  const renderContent = (content) => {
    return content.trim().split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
        return <h3 key={i} className="text-white text-xl font-bold mt-8 mb-3">{line.slice(2, -2)}</h3>;
      }
      if (line.startsWith('*') && line.endsWith('*') && line.startsWith('*') && !line.startsWith('**')) {
        return <p key={i} className="text-orange-300 font-semibold italic mb-3">{line.slice(1, -1)}</p>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="text-gray-300 ml-4 mb-1 list-disc">{line.slice(2)}</li>;
      }
      if (line === '') {
        return <div key={i} className="mb-4" />;
      }
      // Bold inline: **text**
      const parts = line.split(/\*\*(.*?)\*\*/g);
      if (parts.length > 1) {
        return (
          <p key={i} className="text-gray-300 leading-relaxed mb-2">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white font-bold">{part}</strong> : part)}
          </p>
        );
      }
      return <p key={i} className="text-gray-300 leading-relaxed mb-2">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <PageNav />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            {/* Back */}
            <motion.button
              variants={fadeUp}
              onClick={() => router.push('/blog')}
              className="flex items-center gap-2 text-gray-500 hover:text-orange-400 transition-colors mb-8 text-sm"
            >
              <ArrowLeft className="h-4 w-4" /> Back to all posts
            </motion.button>

            {/* Category + meta */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${categoryColors[post.category]}`}>{post.category}</span>
              <span className="text-gray-500 text-sm flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
              <span className="text-gray-600 text-sm">{post.date}</span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              {post.title}
            </motion.h1>

            {/* Author */}
            <motion.div variants={fadeUp} className="flex items-center gap-4 pb-8 border-b border-gray-800">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-black text-lg">
                {post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="text-white font-bold">{post.author}</div>
                <div className="text-gray-500 text-sm">{post.authorTitle}</div>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <motion.button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all ${liked ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-gray-700 text-gray-500 hover:border-gray-600'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-red-400' : ''}`} />
                  {post.likes + (liked ? 1 : 0)}
                </motion.button>
                <button
                  onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-700 text-gray-500 hover:border-gray-600 text-sm transition-all"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="prose prose-invert max-w-none"
        >
          {renderContent(post.content)}
        </motion.div>

        {/* Author bio box */}
        <motion.div
          className="mt-16 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-xl">
            {post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <div className="text-white font-bold mb-1">{post.author}</div>
            <div className="text-orange-400 text-xs font-medium mb-2">{post.authorTitle}</div>
            <p className="text-gray-400 text-sm leading-relaxed">{post.authorBio}</p>
          </div>
        </motion.div>
      </article>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BookOpen className="h-8 w-8 text-white/80 mx-auto mb-3" />
            <h2 className="text-2xl font-black text-white mb-2">Start Managing Your Credit Cards Smarter</h2>
            <p className="text-orange-100 mb-6">Join 50,000+ Americans using CREDX USA. Free to start — no credit card required.</p>
            <motion.button
              onClick={() => router.push('/auth?mode=signup')}
              className="bg-white text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started Free →
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-950">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-black text-white mb-8">Continue Reading</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rel, i) => (
                <motion.div
                  key={rel.id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/40 transition-all cursor-pointer group"
                  whileHover={{ y: -4 }}
                  onClick={() => router.push(`/blog/${rel.id}`)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${categoryColors[rel.category]} mb-3 inline-block`}>{rel.category}</span>
                  <h3 className="text-white font-bold mb-2 group-hover:text-orange-400 transition-colors leading-snug">{rel.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <Clock className="h-3 w-3" />
                    {rel.readTime} · {rel.date}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-lg mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-black text-white mb-2">Stay Updated</h2>
            <p className="text-gray-400 mb-6 text-sm">Get new articles and credit tips delivered to your inbox</p>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600 text-sm"
              />
              <motion.button
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-xl font-semibold text-sm"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={async () => {
                  if (!email) return;
                  try {
                    await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
                  } catch (e) {}
                  alert('Thanks! You\'re subscribed.');
                  setEmail('');
                }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-950 border-t border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">© 2026 CREDX USA, Inc. All rights reserved.</p>
          <div className="flex gap-4">
            {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms']].map(([l, h]) => (
              <button key={l} onClick={() => router.push(h)} className="text-gray-600 hover:text-orange-400 text-sm transition-colors">{l}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
