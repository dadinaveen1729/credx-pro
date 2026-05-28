'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import {
  Shield, CreditCard, Brain, Bell, TrendingUp, Zap, Star, ChevronRight,
  CheckCircle, ArrowRight, Menu, X, DollarSign, Gift, BarChart3,
  Smartphone, Lock, Globe, Users, Award, Clock, Target, Sparkles,
  Mail, Phone, MapPin, ExternalLink, ChevronDown, Play, Wallet,
  Building2, PiggyBank, AlertCircle, RefreshCw, LineChart
} from 'lucide-react';

// ─── ANIMATION VARIANTS ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } }
};
const slideLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};
const slideRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: 'easeOut' } }
};

// ─── 3D CREDIT CARD COMPONENT ──────────────────────────────────────────────
function CreditCard3D({ card, index }) {
  const [hovered, setHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setRotateY(((e.clientX - cx) / rect.width) * 20);
    setRotateX(-((e.clientY - cy) / rect.height) * 20);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      className="relative cursor-pointer select-none"
      initial={{ opacity: 0, y: 60, rotateZ: index % 2 === 0 ? -5 : 5 }}
      animate={{ opacity: 1, y: 0, rotateZ: 0 }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: 'easeOut' }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: hovered ? 'none' : 'transform 0.5s ease'
      }}
    >
      <div
        className="relative w-72 h-44 rounded-2xl p-6 shadow-2xl overflow-hidden"
        style={{ background: card.gradient }}
      >
        {/* Shimmer overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
            backgroundSize: '200% 200%'
          }}
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
        />
        {/* Card chip */}
        <div className="w-10 h-7 bg-yellow-400 rounded-md mb-4 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-2 h-1.5 bg-yellow-600 rounded-sm opacity-60" />
            ))}
          </div>
        </div>
        <div className="text-white font-mono text-sm tracking-widest mb-3 opacity-90">
          {card.number}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <div className="text-white/60 text-xs uppercase tracking-wider">Card Holder</div>
            <div className="text-white font-semibold text-sm">{card.name}</div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-xs uppercase tracking-wider">Rewards</div>
            <div className="text-white font-bold">{card.rewards}</div>
          </div>
        </div>
        {/* Bank logo area */}
        <div className="absolute top-4 right-4 flex gap-1">
          <div className="w-7 h-7 rounded-full opacity-80" style={{ background: card.logoColor1 }} />
          <div className="w-7 h-7 rounded-full opacity-80 -ml-3" style={{ background: card.logoColor2 }} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── ANIMATED COUNTER ──────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

// ─── FLOATING PARTICLES ────────────────────────────────────────────────────
function FloatingParticles() {
  const particles = [...Array(20)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 8 + 5
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-orange-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut', delay: p.id * 0.3 }}
        />
      ))}
    </div>
  );
}

// ─── NAVIGATION ────────────────────────────────────────────────────────────
function SiteNavigation({ scrolled }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' : 'bg-transparent'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.03 }}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <span className={`text-xl font-extrabold tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              CREDX <span className="text-orange-500">USA</span>
            </span>
          </motion.div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <motion.button
                key={link.label}
                onClick={() => link.id ? scrollTo(link.id) : router.push(link.href)}
                className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                  scrolled ? 'text-gray-700' : 'text-white/90'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              onClick={() => router.push('/auth')}
              className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-orange-600' : 'text-white/90 hover:text-white'}`}
              whileHover={{ scale: 1.05 }}
            >
              Sign In
            </motion.button>
            <motion.button
              onClick={() => router.push('/auth?mode=signup')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-orange-500/30 hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started Free
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-100 shadow-xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={() => link.id ? scrollTo(link.id) : router.push(link.href)}
                  className="text-gray-700 font-medium text-left hover:text-orange-600 py-1"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { router.push('/auth'); setMobileOpen(false); }}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold"
              >
                Get Started Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const cards = [
    { gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', number: '•••• •••• •••• 4242', name: 'Chase Sapphire', rewards: '52,340 pts', logoColor1: '#E53935', logoColor2: '#FB8C00' },
    { gradient: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)', number: '•••• •••• •••• 8821', name: 'Amex Platinum', rewards: '$842 cash', logoColor1: '#1976D2', logoColor2: '#42A5F5' },
    { gradient: 'linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)', number: '•••• •••• •••• 1337', name: 'Capital One', rewards: '28,100 pts', logoColor1: '#E53935', logoColor2: '#C62828' },
  ];

  const features = [
    { icon: Brain, title: 'AI Financial Advisor', description: 'Personalized advice powered by OpenAI. Analyzes spending patterns, optimizes rewards, and builds custom payoff strategies.', color: 'from-purple-500 to-indigo-600', badge: 'AI Powered' },
    { icon: CreditCard, title: 'Smart Bill Management', description: 'Track all credit card bills in one dashboard. Never miss a payment with automated reminders 3 days before due dates.', color: 'from-orange-500 to-red-500', badge: 'Core Feature' },
    { icon: Gift, title: 'Rewards Maximizer', description: 'Automatically optimize cashback and points across all cards. Earn up to 5x more rewards with smart card selection.', color: 'from-green-500 to-teal-500', badge: 'Save More' },
    { icon: Zap, title: 'Instant Payments', description: 'Pay all credit card bills in one click via Stripe. Split payments or pay minimum, full, or custom amounts.', color: 'from-yellow-500 to-orange-500', badge: 'Fast' },
    { icon: Bell, title: 'Smart Alerts', description: 'SMS, WhatsApp, and email reminders. Know when bills are due, rewards expire, and which card to use.', color: 'from-pink-500 to-rose-500', badge: 'Multi-channel' },
    { icon: BarChart3, title: 'Spending Analytics', description: 'Beautiful charts showing spending by category, card, and month. Identify patterns and cut wasteful expenses.', color: 'from-blue-500 to-cyan-500', badge: 'Insights' },
    { icon: Mail, title: 'Gmail Bill Parser', description: 'Connect Gmail to auto-import bill statements. AI reads your credit card emails and adds bills automatically.', color: 'from-red-500 to-pink-500', badge: 'Auto-import' },
    { icon: Lock, title: 'Bank-Level Security', description: '256-bit AES encryption, SOC 2 compliant data handling, and zero-knowledge architecture.', color: 'from-slate-600 to-gray-700', badge: 'Secure' }
  ];

  const steps = [
    { num: '01', title: 'Sign Up Free', desc: 'Create your account with Google, email, or phone in under 60 seconds. No credit card required.' },
    { num: '02', title: 'Add Your Cards', desc: 'Add all your credit cards — Chase, Amex, Capital One, Citi, and 500+ more. Import bills from Gmail.' },
    { num: '03', title: 'Get AI Insights', desc: 'Our AI analyzes your spending, finds unused rewards, and gives a personalized payoff plan.' },
    { num: '04', title: 'Pay & Save', desc: 'Pay all bills in one click. Earn CREDX points. Watch your credit score climb.' }
  ];

  const plans = [
    {
      name: 'Free', price: '$0', period: '/month', desc: 'Perfect to get started',
      features: ['Up to 3 credit cards', 'Basic bill tracking', 'Email reminders', 'Manual bill entry', 'Basic spending charts'],
      cta: 'Get Started Free', highlight: false
    },
    {
      name: 'Pro', price: '$9.99', period: '/month', desc: 'For serious credit card users',
      features: ['Unlimited credit cards', 'AI Financial Advisor', 'Gmail auto-import', 'SMS & WhatsApp alerts', 'Rewards optimizer', 'Priority support', 'Advanced analytics', 'Payment automation'],
      cta: 'Start 14-Day Trial', highlight: true, badge: 'Most Popular'
    },
    {
      name: 'Family', price: '$19.99', period: '/month', desc: 'Up to 5 family members',
      features: ['Everything in Pro', '5 user accounts', 'Family spending dashboard', 'Shared bill management', 'Family rewards pooling', 'Dedicated advisor'],
      cta: 'Start Free Trial', highlight: false
    }
  ];

  const testimonials = [
    { name: 'Sarah M.', role: 'Software Engineer, NYC', text: 'CREDX USA helped me find $2,400 in unclaimed rewards across my 6 cards. The AI advisor told me exactly which card to use for each purchase.', rating: 5, avatar: 'SM' },
    { name: 'James K.', role: 'Small Business Owner, TX', text: 'I was paying $180/month in credit card interest. After 3 months with CREDX, I paid everything off using their payoff strategy. Life-changing.', rating: 5, avatar: 'JK' },
    { name: 'Priya R.', role: 'Marketing Manager, CA', text: 'The Gmail integration is magic. It automatically imports all my credit card bills and I never miss a payment. Worth every penny of the Pro plan.', rating: 5, avatar: 'PR' },
  ];

  const stats = [
    { value: 125000, suffix: '+', label: 'Bills Managed', icon: CreditCard },
    { value: 2800000, prefix: '$', suffix: '+', label: 'Rewards Found', icon: Gift },
    { value: 98, suffix: '%', label: 'On-time Payment Rate', icon: CheckCircle },
    { value: 15, suffix: ' min', label: 'Average Setup Time', icon: Clock },
  ];

  const blogPosts = [
    { title: 'How to Never Pay Credit Card Interest Again', date: 'May 18, 2026', category: 'Tips', read: '5 min read' },
    { title: 'The Best Credit Cards for Travel Rewards in 2026', date: 'May 10, 2026', category: 'Reviews', read: '8 min read' },
    { title: 'How AI is Transforming Personal Finance', date: 'May 2, 2026', category: 'AI', read: '6 min read' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 z-[100] origin-left"
        style={{ scaleX }}
      />

      <SiteNavigation scrolled={scrolled} />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-orange-600/10 blur-3xl" />
        <FloatingParticles />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
                <Sparkles className="h-4 w-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-medium">🚀 Trusted by 50,000+ Americans</span>
              </motion.div>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-3 mb-6">
                <div className="flex -space-x-2">
                  {['SM', 'JK', 'PR', 'MR', 'AL'].map((initials, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-950 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <span className="text-gray-400 text-xs">4.9/5 from 2,100+ reviews</span>
                </div>
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-black leading-[1.1] mb-6">
                The Smartest Way to{' '}
                <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                  Manage Credit Cards
                </span>{' '}
                in America
              </motion.h1>

              <motion.p variants={fadeUp} className="text-xl text-gray-300 mb-8 leading-relaxed">
                CREDX USA is your AI-powered credit card command center. Track bills, maximize rewards,
                pay smarter, and get personalized financial advice — all in one beautiful dashboard.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-10">
                <motion.button
                  onClick={() => router.push('/auth?mode=signup')}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Start Free — No Card Required
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
                <motion.button
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.03 }}
                >
                  <Play className="h-5 w-5" />
                  See How It Works
                </motion.button>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                {['Free to start', 'Bank-level security', 'Cancel anytime', '500+ cards supported'].map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>{t}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: 3D cards */}
            <div className="relative hidden lg:flex flex-col gap-4 items-center">
              <motion.div
                className="relative"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {cards.map((card, i) => (
                  <div key={i} className={`${i > 0 ? '-mt-24' : ''}`} style={{ zIndex: cards.length - i }}>
                    <CreditCard3D card={card} index={i} />
                  </div>
                ))}
              </motion.div>

              {/* Floating AI badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-4 shadow-2xl"
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 1, type: 'spring', stiffness: 200 }}
              >
                <Brain className="h-6 w-6 text-white mb-1" />
                <div className="text-white font-bold text-sm">AI Insight</div>
                <div className="text-purple-200 text-xs">+$420 rewards found</div>
              </motion.div>

              {/* Floating notification */}
              <motion.div
                className="absolute -top-8 -left-4 bg-white rounded-xl p-3 shadow-2xl flex items-center gap-3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-gray-900 font-semibold text-xs">Bill Paid!</div>
                  <div className="text-gray-500 text-xs">Chase — $234.50</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-500"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={scaleIn} className="text-center text-white">
                <stat.icon className="h-7 w-7 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-black mb-1">
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-orange-100 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
              <Zap className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">Everything You Need</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Powerful Features,{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Simple Interface
              </span>
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Everything you need to master your credit cards — from bill tracking to AI-powered rewards optimization
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 cursor-default"
                whileHover={{ y: -4 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <div className="inline-flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5 mb-3">
                  <span className="text-xs text-gray-400">{f.badge}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PAY ANY BILL ─────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-4">
              <Wallet className="h-4 w-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Pay Any Bill, Anytime, Anywhere</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black mb-4 text-white">
              One Platform.{' '}
              <span className="bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                All Your Bills.
              </span>
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              From credit cards to utilities — manage and pay every bill in one place. No more juggling apps.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: CreditCard, label: 'Credit Cards', color: 'from-orange-500 to-red-500', sub: 'Chase, Amex, Citi...' },
              { icon: Zap, label: 'Utilities', color: 'from-yellow-500 to-orange-500', sub: 'Electric, Gas, Water' },
              { icon: Smartphone, label: 'Phone Bills', color: 'from-blue-500 to-cyan-500', sub: 'AT&T, Verizon, T-Mobile' },
              { icon: Globe, label: 'Internet', color: 'from-purple-500 to-indigo-500', sub: 'Comcast, Spectrum' },
              { icon: Building2, label: 'Rent & HOA', color: 'from-teal-500 to-green-500', sub: 'Any landlord' },
              { icon: Shield, label: 'Insurance', color: 'from-pink-500 to-rose-500', sub: 'Health, Auto, Home' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="group bg-gray-800 border border-gray-700 rounded-2xl p-5 text-center hover:border-orange-500/40 transition-all cursor-default"
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-white font-bold text-sm mb-1">{item.label}</div>
                <div className="text-gray-500 text-xs leading-tight">{item.sub}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-12 bg-gradient-to-r from-green-900/40 to-teal-900/40 border border-green-500/20 rounded-2xl p-8 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {[
                { value: '500+', label: 'Billers supported' },
                { value: '$0', label: 'Payment fees' },
                { value: '2 sec', label: 'Pay in seconds' },
                { value: '100%', label: 'On-time guarantee' },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-black text-green-400">{stat.value}</div>
                  <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Up and Running in{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">15 Minutes</span>
            </h2>
            <p className="text-gray-400 text-xl">Four simple steps to transform your credit card life</p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-4 gap-8"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} className="relative text-center">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-500/30 text-white font-black text-xl"
                    whileInView={{ rotate: [0, 360] }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {step.num}
                  </motion.div>
                  <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AI SECTION ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6">
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium">AI Financial Advisor</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                Your Personal{' '}
                <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  AI Money Coach
                </span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Powered by OpenAI, our AI advisor analyzes every transaction, finds hidden savings,
                and gives you a step-by-step plan to get out of debt and maximize rewards.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Personalized debt payoff strategies (avalanche & snowball)',
                  'Which card to use for each spending category',
                  'Reward point optimization across all your cards',
                  'Spending pattern analysis and budget recommendations'
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
              <motion.button
                onClick={() => router.push('/auth?mode=signup')}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl shadow-purple-500/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Try AI Advisor Free
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </motion.div>

            <motion.div variants={slideRight} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center gap-3">
                  <Brain className="h-6 w-6 text-white" />
                  <span className="text-white font-bold">CREDX AI Advisor</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/80 text-sm">Online</span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex-shrink-0 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 text-gray-300 text-sm">
                      Hi! I analyzed your 3 credit cards. You have <span className="text-orange-400 font-bold">$2,840 in unused rewards</span> and I found a way to save $180/month on interest. Want to see your personalized plan?
                    </div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex-shrink-0" />
                    <div className="bg-orange-600 rounded-2xl rounded-tr-none p-4 text-white text-sm">
                      Yes! Show me how to maximize my Chase Sapphire rewards.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex-shrink-0 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 text-gray-300 text-sm">
                      Great choice! Chase Sapphire earns 3x on dining. Shift restaurant purchases to this card and earn an extra <span className="text-green-400 font-bold">4,200 points/month</span> worth ~$63.
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-xl">
                    <span className="text-gray-500 text-sm flex-1">Ask anything about your finances...</span>
                    <motion.div
                      className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => router.push('/auth?mode=signup')}
                    >
                      <ArrowRight className="h-4 w-4 text-white" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              Simple,{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Transparent Pricing
              </span>
            </h2>
            <p className="text-gray-400 text-xl">Start free. Upgrade when you're ready.</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className={`relative rounded-3xl p-8 ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-orange-600 to-red-700 shadow-2xl shadow-orange-500/40 scale-105'
                    : 'bg-gray-800 border border-gray-700'
                }`}
                whileHover={{ y: -4 }}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 font-bold text-xs px-4 py-1.5 rounded-full shadow-lg">
                    {plan.badge}
                  </div>
                )}
                <div className={`text-sm font-semibold mb-2 ${plan.highlight ? 'text-orange-200' : 'text-gray-400'}`}>
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-orange-200' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-orange-100' : 'text-gray-400'}`}>{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle className={`h-4 w-4 flex-shrink-0 ${plan.highlight ? 'text-orange-200' : 'text-green-400'}`} />
                      <span className={`text-sm ${plan.highlight ? 'text-white/90' : 'text-gray-300'}`}>{feat}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  onClick={() => router.push('/auth?mode=signup')}
                  className={`w-full py-3 rounded-full font-bold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-white text-orange-600 hover:bg-orange-50'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg hover:shadow-orange-500/30'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-4">
              Real People,{' '}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Real Results</span>
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/30 transition-all"
                whileHover={{ y: -4 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ─────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-4xl font-black mb-2">
                From Our{' '}
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Blog</span>
              </h2>
              <p className="text-gray-400">Credit card tips from our financial experts</p>
            </motion.div>
            <motion.button
              onClick={() => router.push('/blog')}
              className="hidden md:flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium"
              whileHover={{ x: 4 }}
            >
              View all posts <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {blogPosts.map((post, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-orange-500/30 transition-all cursor-pointer group"
                whileHover={{ y: -4 }}
                onClick={() => router.push('/blog')}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-orange-500/10 text-orange-400 text-xs font-medium px-3 py-1 rounded-full">{post.category}</span>
                  <span className="text-gray-500 text-xs">{post.read}</span>
                </div>
                <h3 className="text-white font-bold mb-3 group-hover:text-orange-400 transition-colors leading-snug">{post.title}</h3>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Clock className="h-3 w-3" />
                  {post.date}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MOBILE APP ───────────────────────────────────────────────── */}
      <section id="mobile-app" className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <motion.div className="relative z-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Smartphone className="h-12 w-12 text-white/80 mx-auto mb-4" />
              <h2 className="text-4xl font-black text-white mb-4">CREDX USA Mobile App</h2>
              <p className="text-orange-100 text-xl mb-8 max-w-2xl mx-auto">
                Manage your credit cards on the go. Coming soon to iOS and Android.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-3 bg-black/30 backdrop-blur border border-white/20 text-white px-6 py-3 rounded-xl">
                  <div className="text-left">
                    <div className="text-xs opacity-70">Coming soon to</div>
                    <div className="font-bold">App Store</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-black/30 backdrop-blur border border-white/20 text-white px-6 py-3 rounded-xl">
                  <div className="text-left">
                    <div className="text-xs opacity-70">Coming soon to</div>
                    <div className="font-bold">Google Play</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden bg-gray-950">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-950/60 via-gray-950 to-red-950/60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-3xl" />
        <FloatingParticles />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">Start Your Financial Journey Today</span>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
              Ready to Transform Your{' '}
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                Financial Future?
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-300 text-xl mb-4 max-w-2xl mx-auto leading-relaxed">
              Smart. Secure. AI-Driven. Your Financial Co-Pilot is ready.
            </motion.p>
            <motion.p variants={fadeUp} className="text-gray-500 text-base mb-10">
              Join 50,000+ Americans building better financial lives with CREDX USA. Free forever for the first 1,000 users.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <motion.button
                onClick={() => router.push('/auth?mode=signup')}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl shadow-orange-500/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started Free — No Card Required
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button
                onClick={() => router.push('/contact')}
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.03 }}
              >
                Talk to Our Team
              </motion.button>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              {['✅ Free forever plan', '🔒 Bank-level security', '🤖 AI-powered insights', '📱 iOS & Android coming soon'].map(item => (
                <span key={item}>{item}</span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-extrabold">CREDX USA</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                The AI-powered credit card management platform built for Americans.
              </p>
            </div>
            {[
              { title: 'Product', links: [{ label: 'Features', href: '/features' }, { label: 'Pricing', href: '/pricing' }, { label: 'AI Advisor', href: '/ai-advisor' }, { label: 'Blog', href: '/blog' }] },
              { title: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }, { label: 'Careers', href: '/about' }] },
              { title: 'Legal', links: [{ label: 'Privacy Policy', href: '/privacy' }, { label: 'Terms of Service', href: '/terms' }] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <button onClick={() => router.push(link.href)} className="text-gray-500 hover:text-orange-400 text-sm transition-colors">
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-gray-600 text-sm">© 2026 CREDX USA, Inc. All rights reserved. CREDX USA is not a bank.</p>
              <p className="text-gray-700 text-xs mt-1">Built with ❤️ for Americans — by Dadi Naveen, Connecticut, USA</p>
            </div>
            <div className="flex items-center gap-4 text-gray-600 text-xs">
              <Lock className="h-3 w-3" />
              <span>256-bit encryption</span>
              <span>•</span>
              <Shield className="h-3 w-3" />
              <span>SOC 2 Compliant</span>
              <span>•</span>
              <span>🇺🇸 Made in USA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
