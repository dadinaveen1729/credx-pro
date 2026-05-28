'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CreditCard, Shield, Smartphone, Bell, BarChart3, Zap, Gift,
  CheckCircle, ArrowRight, Lock, Mail, Brain, Building2, Wallet,
  RefreshCw, AlertTriangle, LineChart, Users
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } };

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
        <div className="hidden md:flex items-center gap-6">
          {[['Features', '/features'], ['Pricing', '/pricing'], ['About', '/about'], ['Blog', '/blog'], ['Contact', '/contact']].map(([label, href]) => (
            <button key={label} onClick={() => router.push(href)} className={`text-sm font-medium transition-colors hover:text-orange-400 ${href === '/features' ? 'text-orange-400' : 'text-gray-400'}`}>{label}</button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/auth')} className="text-gray-400 hover:text-white text-sm font-medium">Sign In</button>
          <motion.button onClick={() => router.push('/auth?mode=signup')} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>Get Started</motion.button>
        </div>
      </div>
    </nav>
  );
}

export default function FeaturesPage() {
  const router = useRouter();

  const features = [
    {
      icon: CreditCard, title: 'Smart Credit Card Management', category: 'Credit Management',
      color: 'from-orange-500 to-red-500',
      desc: 'Link all your U.S. credit cards in seconds with bank-level security via Plaid integration.',
      bullets: ['Connect 11,000+ banks and credit unions', 'Real-time balance and utilization tracking', 'Automatic payment due date alerts', 'Credit limit monitoring and warnings']
    },
    {
      icon: Bell, title: 'Automated Bill Tracking', category: 'Bill Management',
      color: 'from-blue-500 to-cyan-500',
      desc: 'Never miss another payment with intelligent bill detection and tracking across all categories.',
      bullets: ['Phone, electricity, water, rent, internet bills', 'Gmail integration for automatic bill detection', 'Smart categorization and organization', 'Payment history and analytics']
    },
    {
      icon: Zap, title: 'One-Click Payments', category: 'Payments',
      color: 'from-yellow-500 to-orange-500',
      desc: 'Pay any bill instantly with secure Stripe integration and automated payment scheduling.',
      bullets: ['Instant Stripe-powered payments', 'AutoPay setup for recurring bills', 'Payment confirmation and receipts', 'Multi-payment method support']
    },
    {
      icon: Bell, title: 'Smart Notifications', category: 'Alerts',
      color: 'from-pink-500 to-rose-500',
      desc: 'Get timely reminders via email, SMS, and push notifications to never miss a payment.',
      bullets: ['Customizable reminder timing', 'Multiple notification channels', 'Calendar integration and sync', 'Snooze and reschedule options']
    },
    {
      icon: BarChart3, title: 'Financial Analytics', category: 'Analytics',
      color: 'from-purple-500 to-indigo-600',
      desc: 'Understand your spending patterns with detailed charts and AI-powered insights.',
      bullets: ['Monthly spending breakdowns', 'Credit utilization trends', 'Payment history analysis', 'Personalized recommendations']
    },
    {
      icon: Gift, title: 'Cashback & Rewards', category: 'Rewards',
      color: 'from-green-500 to-teal-500',
      desc: 'Earn points for responsible credit usage and redeem them for bill payments.',
      bullets: ['Points for on-time payments', 'Cashback redemption system', 'Leaderboard and achievements', 'Bonus reward opportunities']
    },
    {
      icon: Shield, title: 'AI Fraud Detection', category: 'Security',
      color: 'from-slate-500 to-gray-700',
      desc: 'Advanced machine learning algorithms monitor your accounts 24/7 for suspicious activity.',
      bullets: ['Real-time fraud monitoring', 'Suspicious transaction alerts', 'Account security scoring', 'Instant notification system']
    },
    {
      icon: Smartphone, title: 'Mobile-First Design', category: 'Mobile',
      color: 'from-violet-500 to-purple-600',
      desc: 'Access your financial dashboard anywhere with our fully responsive mobile experience.',
      bullets: ['Native mobile app experience', 'Touch-optimized interface', 'Offline data access', 'Cross-device synchronization']
    },
    {
      icon: Mail, title: 'Gmail Statement Parser', category: 'Automation',
      color: 'from-red-500 to-pink-500',
      desc: 'Automatically extract bill information from your email statements using AI.',
      bullets: ['Automatic statement detection', 'Balance and due date extraction', 'Smart categorization', 'Historical data analysis']
    },
  ];

  const security = [
    { icon: Lock, title: '256-bit SSL Encryption', desc: 'Bank-level encryption protects all your financial data' },
    { icon: Shield, title: 'Zero Password Storage', desc: 'We never store your banking passwords or credentials' },
    { icon: CheckCircle, title: 'SOC 2 Compliant', desc: 'Meets the highest security standards for financial services' },
  ];

  const partners = [
    { emoji: '🏦', name: 'Plaid', desc: 'Secure bank connectivity for 11,000+ financial institutions' },
    { emoji: '💳', name: 'Stripe', desc: 'Industry-leading payment processing with instant settlements' },
    { emoji: '🔥', name: 'Firebase', desc: "Google's platform for authentication and real-time data sync" },
    { emoji: '📧', name: 'Gmail API', desc: 'Smart email parsing for automatic bill detection' },
  ];

  const steps = [
    { num: '1', title: 'Create Your Account', desc: 'Sign up with your email, Google, or Apple ID. Takes 30 seconds and it\'s completely free.' },
    { num: '2', title: 'Connect Your Accounts', desc: 'Securely link your credit cards and banks through our Plaid integration. Your data stays protected.' },
    { num: '3', title: 'Start Managing', desc: 'View your dashboard, set up payments, enable alerts, and start earning rewards immediately.' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <PageNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/30" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-600/8 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
              <Zap className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">⚡ Powerful Features</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-black mb-6">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Master Your Credit</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-300 text-xl max-w-3xl mx-auto mb-10">
              CREDX USA combines powerful financial tools with intelligent automation to help Americans take control of their credit cards, bills, and financial future.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button onClick={() => router.push('/auth?mode=signup')} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold shadow-2xl shadow-orange-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                Try Free Now <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button onClick={() => router.push('/pricing')} className="flex items-center gap-2 border border-gray-700 text-white px-8 py-4 rounded-full font-semibold hover:border-orange-500/50 transition-colors" whileHover={{ scale: 1.03 }}>
                View Pricing
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-4">Complete Financial Control at Your Fingertips</h2>
            <p className="text-gray-400 text-lg">Discover how CREDX USA transforms the way Americans manage their finances</p>
          </motion.div>
          <div className="space-y-8">
            {features.map((f, i) => (
              <motion.div key={i} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4">
                    <span className="text-gray-400 text-xs font-medium">{f.category}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">{f.title}</h3>
                  <p className="text-gray-400 mb-5 leading-relaxed">{f.desc}</p>
                  <ul className="space-y-2.5">
                    {f.bullets.map((b, j) => (
                      <li key={j} className="flex items-center gap-2.5">
                        <CheckCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <motion.div
                    className={`bg-gradient-to-br ${f.color} rounded-3xl p-10 flex items-center justify-center shadow-2xl aspect-square max-w-sm mx-auto`}
                    whileHover={{ scale: 1.03, rotate: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <f.icon className="h-24 w-24 text-white/80" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Cards supported */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-4">Manage All Your Credit Cards</h2>
            <p className="text-gray-400 text-lg">Connect and manage all major US credit cards in one secure dashboard</p>
          </motion.div>
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { name: 'Chase Sapphire', network: 'Visa', points: '2-3x Points', color: 'from-blue-900 to-blue-800' },
              { name: 'American Express Gold', network: 'Amex', points: '4x Points', color: 'from-yellow-700 to-yellow-600' },
              { name: 'Capital One Venture', network: 'Visa', points: '2x Miles', color: 'from-red-900 to-red-800' },
              { name: 'Discover It', network: 'Discover', points: '5% Cash Back', color: 'from-orange-800 to-orange-700' },
              { name: 'Wells Fargo Active', network: 'Visa', points: '2% Cash Back', color: 'from-red-900 to-red-700' },
              { name: 'Citi Custom Cash', network: 'Mastercard', points: '5% Cash Back', color: 'from-blue-800 to-blue-700' },
              { name: 'Apple Card', network: 'Mastercard', points: '3% Cash Back', color: 'from-gray-700 to-gray-600' },
              { name: 'Bank of America', network: 'Visa', points: '3% Cash Back', color: 'from-red-800 to-red-900' },
            ].map((card, i) => (
              <motion.div key={i} variants={scaleIn} className={`bg-gradient-to-br ${card.color} rounded-2xl p-4 relative overflow-hidden group cursor-default`} whileHover={{ scale: 1.04, y: -4 }}>
                <motion.div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
                <div className="text-white/60 text-xs mb-1">{card.network}</div>
                <div className="text-white font-mono text-xs mb-2 opacity-70">•••• ••••</div>
                <div className="text-white font-bold text-xs leading-tight">{card.name}</div>
                <div className="mt-2 text-yellow-300 text-xs font-semibold">{card.points}</div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { icon: Lock, text: 'Bank-level encryption for all your card data' },
              { icon: Gift, text: 'Never miss earning rewards on your spending' },
              { icon: Bell, text: 'Real-time notifications for all transactions' },
              { icon: CreditCard, text: 'Works with all major US credit cards' },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-start gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
                <item.icon className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bill categories */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-4">Pay Any Bill, Anytime, Anywhere</h2>
            <p className="text-gray-400 text-lg">From utilities to subscriptions, manage all your recurring payments in one place</p>
          </motion.div>
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { emoji: '📱', title: 'Phone Bills', desc: 'Verizon, T-Mobile, AT&T' },
              { emoji: '⚡', title: 'Utilities', desc: 'Electric, Gas, Water' },
              { emoji: '💳', title: 'Credit Cards', desc: 'All major banks' },
              { emoji: '🌐', title: 'Internet', desc: 'Xfinity, Spectrum, Cox' },
              { emoji: '📺', title: 'Subscriptions', desc: 'Netflix, Spotify, Prime' },
              { emoji: '🛡️', title: 'Insurance', desc: 'Auto, Home, Health' },
              { emoji: '🎓', title: 'Education', desc: 'School, College Fees' },
              { emoji: '✈️', title: 'Travel', desc: 'Flights, Hotels, Events' },
            ].map((item, i) => (
              <motion.div key={i} variants={scaleIn} className="bg-gray-800 border border-gray-700 rounded-2xl p-5 text-center hover:border-orange-500/40 transition-colors" whileHover={{ y: -4 }}>
                <div className="text-3xl mb-3">{item.emoji}</div>
                <div className="text-white font-bold text-sm mb-1">{item.title}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-4">Bank-Level Security You Can Trust</h2>
            <p className="text-gray-400 text-lg">Your financial data is protected with the same security standards used by major banks</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {security.map((s, i) => (
              <motion.div key={i} variants={scaleIn} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 text-center hover:border-orange-500/30 transition-colors" whileHover={{ y: -4 }}>
                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <s.icon className="h-7 w-7 text-green-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Partners */}
          <motion.div className="text-center mb-8" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 className="text-2xl font-black mb-2">Powered by Industry Leaders</h3>
            <p className="text-gray-400">We partner with the most trusted names in fintech</p>
          </motion.div>
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {partners.map((p, i) => (
              <motion.div key={i} variants={scaleIn} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center hover:border-orange-500/30 transition-colors" whileHover={{ y: -3 }}>
                <div className="text-3xl mb-3">{p.emoji}</div>
                <div className="text-white font-bold text-sm mb-1">{p.name}</div>
                <div className="text-gray-500 text-xs">{p.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-4">Get Started in <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">3 Simple Steps</span></h2>
            <p className="text-gray-400">Setting up your financial command center takes less than 5 minutes</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {steps.map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <motion.div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-black text-2xl shadow-2xl shadow-orange-500/30"
                  whileInView={{ rotate: [0, 360] }} transition={{ duration: 0.7, delay: i * 0.1 }} viewport={{ once: true }}>
                  {s.num}
                </motion.div>
                <h3 className="text-white font-bold text-xl mb-3">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black text-white mb-4">Ready to Take Control of Your Credit?</h2>
            <p className="text-orange-100 text-lg mb-8">Join 50,000+ Americans who trust CREDX USA to manage their financial lives</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button onClick={() => router.push('/auth?mode=signup')} className="flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg shadow-2xl" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                Get Started Free <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button onClick={() => router.push('/contact')} className="flex items-center justify-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-white/80 transition-colors" whileHover={{ scale: 1.03 }}>
                Talk to Our Team
              </motion.button>
            </div>
            <p className="text-orange-200 text-sm mt-4">No credit card required • Always free • Bank-level security</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
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
