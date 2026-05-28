'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, X, ArrowRight, Star, Smartphone, Shield, ChevronDown } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
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
            <button key={label} onClick={() => router.push(href)} className={`text-sm font-medium transition-colors hover:text-orange-400 ${href === '/pricing' ? 'text-orange-400' : 'text-gray-400'}`}>{label}</button>
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

export default function PricingPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);

  const plans = [
    {
      name: 'Free Forever',
      price: '$0',
      period: '/forever',
      badge: null,
      desc: 'Perfect for getting started with credit management',
      highlight: false,
      included: ['Link up to 3 credit cards', 'Basic bill tracking', 'Payment reminders', 'Credit utilization monitoring', 'Email support', 'Mobile app access', 'Basic fraud alerts'],
      limited: ['Limited to 3 connected accounts', 'Standard support response time'],
      cta: 'Get Started Free',
    },
    {
      name: 'CREDX Pro',
      price: '$9.99',
      period: '/month',
      badge: '⭐ Most Popular',
      desc: 'Advanced features for serious credit management',
      highlight: true,
      included: ['Unlimited credit card connections', 'Advanced bill categorization', 'Automated payment scheduling', 'AI-powered spending insights', 'Premium fraud protection', 'Priority customer support', 'Gmail statement parsing', 'Custom payment notifications', 'Detailed credit reports', 'Reward optimization tips'],
      limited: [],
      cta: 'Start Free Trial',
      note: '14-day free trial • Cancel anytime',
    },
    {
      name: 'CREDX Business',
      price: '$29.99',
      period: '/month',
      badge: null,
      desc: 'Comprehensive solution for business owners',
      highlight: false,
      included: ['Everything in Pro', 'Business expense tracking', 'Team member access', 'Advanced analytics dashboard', 'Tax preparation support', 'Dedicated account manager', 'Custom integrations', 'White-label options', 'API access', 'Enterprise security'],
      limited: [],
      cta: 'Contact Sales',
    },
  ];

  const testimonials = [
    { name: 'Sarah Johnson', role: 'Marketing Manager', company: 'Tech Startup', text: 'CREDX USA helped me organize my finances and improve my credit score by 120 points in 6 months. The automated reminders saved me hundreds in late fees.' },
    { name: 'Michael Chen', role: 'Software Engineer', company: 'Fortune 500', text: 'Finally, a fintech app that actually works as advertised. The dashboard is clean, the integrations are solid, and the fraud detection caught a suspicious charge last month.' },
    { name: 'Emily Rodriguez', role: 'Small Business Owner', company: 'Local Restaurant', text: 'The business plan helps me track both personal and business expenses. The tax preparation features alone save me thousands each year.' },
  ];

  const faqs = [
    { q: 'Is CREDX USA really free?', a: 'Yes! Our core features are completely free forever. You can connect up to 3 credit cards, track bills, get payment reminders, and monitor your credit utilization without paying anything.' },
    { q: 'Can I cancel my subscription anytime?', a: 'Absolutely. You can upgrade, downgrade, or cancel your subscription at any time from your dashboard. There are no long-term contracts or cancellation fees.' },
    { q: 'How secure is my financial data?', a: 'We use bank-level 256-bit SSL encryption and partner with Plaid for secure bank connections. We never store your banking passwords and are SOC 2 compliant.' },
    { q: 'Which banks do you support?', a: 'We support over 11,000 financial institutions in the US through our Plaid integration, including all major banks, credit unions, and credit card companies.' },
    { q: 'Do you offer student discounts?', a: 'Yes! Students with a valid .edu email address get 50% off CREDX Pro for up to 4 years. Contact our support team to apply your discount.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, debit cards, and PayPal through our secure Stripe payment processing.' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <PageNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/8 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-orange-400 text-sm font-medium">💰 Simple Pricing</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-black mb-6">
              Start Free,{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Upgrade When Ready</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-300 text-xl max-w-2xl mx-auto mb-4">
              CREDX USA is free to use forever. Upgrade to Pro for advanced features like unlimited account connections, AI insights, and premium support.
            </motion.p>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Always Free Core Features — Credit monitoring, payment reminders, and basic bill tracking will always be free. No hidden fees, no trials that expire.</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-24 bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {plans.map((plan, i) => (
              <motion.div key={i} variants={scaleIn}
                className={`relative rounded-3xl p-8 flex flex-col ${plan.highlight ? 'bg-gradient-to-b from-orange-600 to-red-700 shadow-2xl shadow-orange-500/40 scale-105' : 'bg-gray-900 border border-gray-800'}`}
                whileHover={{ y: -4 }}>
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 font-bold text-xs px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">{plan.badge}</div>
                )}
                <div className={`text-sm font-semibold mb-2 ${plan.highlight ? 'text-orange-200' : 'text-gray-400'}`}>{plan.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-orange-200' : 'text-gray-500'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-orange-100' : 'text-gray-400'}`}>{plan.desc}</p>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${plan.highlight ? 'text-orange-200' : 'text-gray-500'}`}>What's Included:</div>
                <ul className="space-y-2.5 mb-4 flex-1">
                  {plan.included.map((f, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <CheckCircle className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-orange-200' : 'text-green-400'}`} />
                      <span className={`text-sm ${plan.highlight ? 'text-white/90' : 'text-gray-300'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.limited.length > 0 && (
                  <>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-3 text-gray-500">Limitations:</div>
                    <ul className="space-y-2 mb-6">
                      {plan.limited.map((l, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <X className="h-4 w-4 flex-shrink-0 mt-0.5 text-gray-600" />
                          <span className="text-sm text-gray-500">{l}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <motion.button
                  onClick={() => plan.name === 'CREDX Business' ? router.push('/contact') : router.push('/auth?mode=signup')}
                  className={`w-full py-3.5 rounded-full font-bold text-sm transition-all mt-4 ${plan.highlight ? 'bg-white text-orange-600 hover:bg-orange-50' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/30'}`}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {plan.cta}
                </motion.button>
                {plan.note && <p className={`text-xs text-center mt-3 ${plan.highlight ? 'text-orange-200' : 'text-gray-500'}`}>{plan.note}</p>}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mobile app */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Smartphone className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black mb-4">Download the CREDX USA Mobile App</h2>
            <p className="text-gray-400 mb-8">Manage your credit and bills on the go with our native mobile apps for iOS and Android.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {['App Store', 'Google Play'].map(store => (
                <div key={store} className="flex items-center gap-3 bg-gray-800 border border-gray-700 text-white px-6 py-3 rounded-xl">
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Coming soon to</div>
                    <div className="font-bold">{store}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> 4.8/5 Rating</div>
              <div className="flex items-center gap-1.5"><Smartphone className="h-4 w-4" /> 50K+ Downloads</div>
              <div className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-green-400" /> Bank-Level Security</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-3">Loved by 50,000+ Americans</h2>
            <p className="text-gray-400">See what our users say about CREDX USA</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={scaleIn} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/30 transition-colors" whileHover={{ y: -4 }}>
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />)}</div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <div className="text-white font-bold text-sm">{t.name}</div>
                  <div className="text-gray-500 text-xs">{t.role} · {t.company}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-400">Everything you need to know about CREDX USA pricing</p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-white font-semibold">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-red-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black text-white mb-4">Ready to Take Control of Your Finances?</h2>
            <p className="text-orange-100 text-lg mb-8">Start with our free plan and upgrade when you're ready for more advanced features</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button onClick={() => router.push('/auth?mode=signup')} className="flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                Start Free Forever <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button onClick={() => router.push('/contact')} className="border-2 border-white/40 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-white/80 transition-colors" whileHover={{ scale: 1.03 }}>
                Contact Sales
              </motion.button>
            </div>
            <p className="text-orange-200 text-sm mt-4">No credit card required • Cancel anytime • 14-day free trial for Pro features</p>
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
