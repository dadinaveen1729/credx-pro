'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Brain, Mail, Phone, MapPin, CheckCircle, ArrowRight, Users, TrendingUp, Target, Heart, Lightbulb, Award, ExternalLink, Bell, Gift, Star, Zap } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } };
const slideLeft = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
const slideRight = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };

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
            <button key={label} onClick={() => router.push(href)} className={`text-sm font-medium transition-colors hover:text-orange-400 ${href === '/about' ? 'text-orange-400' : 'text-gray-400'}`}>{label}</button>
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

export default function AboutPage() {
  const router = useRouter();

  const stats = [
    { value: '50,000+', label: 'Americans Served', icon: Users },
    { value: '150+', label: 'Avg Credit Score Increase', icon: TrendingUp },
    { value: '99.9%', label: 'Fraud Detection Rate', icon: Shield },
    { value: '$2.3M', label: 'Fees Saved for Users', icon: Target },
  ];

  const problems = [
    '1 in 3 Americans pay late fees each year',
    'The average household loses $138–$238/month in interest and penalty charges',
    'Over 45% of Gen Z have no idea how credit utilization impacts their score',
  ];

  const timeline = [
    { year: '2019', title: 'The Problem Discovered', desc: "As a graduate student, I watched friends struggle with credit card debt and late fees. The system wasn't built for regular people." },
    { year: '2020–2023', title: 'Building Expertise', desc: 'Gained experience at Amazon, Infosys, and NYU. Learned how data and automation could solve real financial problems.' },
    { year: '2024', title: 'CREDX USA Born', desc: 'Launched CREDX USA with a mission to eliminate credit stress for Gen Z and millennials across America.' },
    { year: '2025–2026', title: 'Growing Impact', desc: 'Now serving 50,000+ Americans with AI-powered credit management and automated bill payments.' },
  ];

  const values = [
    { icon: Shield, title: 'Security First', desc: 'Bank-level encryption and security protocols protect your financial data with zero compromises.' },
    { icon: Heart, title: 'Human-Centered', desc: 'Every feature is designed with real people in mind, not just numbers on a spreadsheet.' },
    { icon: Lightbulb, title: 'Innovation', desc: 'We use cutting-edge AI and automation to solve financial problems that have plagued Americans for decades.' },
    { icon: Award, title: 'Results-Driven', desc: 'Every tool and feature is built to deliver measurable improvements to your financial health.' },
  ];

  const whatWeDo = [
    { icon: CreditCard, title: 'Links All Your Credit Cards', desc: 'One-click integration with all major banks via secure Plaid technology' },
    { icon: CheckCircle, title: 'Automates Payments', desc: 'Smart payment scheduling via Stripe to ensure you never miss a due date' },
    { icon: Shield, title: 'Detects Fraud with AI', desc: 'Advanced machine learning algorithms monitor for suspicious activity 24/7' },
    { icon: Bell, title: 'Sends Smart Reminders', desc: 'Intelligent notifications that learn your habits and preferences' },
    { icon: Gift, title: 'Rewards On-Time Payments', desc: 'Earn cashback and points for maintaining good credit habits' },
    { icon: Mail, title: 'Parses Gmail Bills', desc: 'Automatically extracts bill information from your email for complete visibility' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <PageNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-orange-950/20" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-orange-600/8 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-orange-400 text-sm font-medium">🚀 Our Story</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-black mb-6 max-w-4xl">
              About <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">CREDX USA</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-300 text-xl max-w-3xl mb-6 leading-relaxed">
              Empowering America's Credit Journey — One Payment at a Time
            </motion.p>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-3xl mb-4">
              CREDX USA was born from frustration — the kind that comes from late fees, missed due dates, sky-high interest rates, and the silent anxiety of managing too many credit cards with too little help.
            </motion.p>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-3xl">
              As an immigrant and data analyst, I — Dadi Naveen — experienced the overwhelming reality of America's complex credit system firsthand.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-8" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {stats.map((s, i) => (
              <motion.div key={i} variants={scaleIn} className="text-center text-white">
                <s.icon className="h-7 w-7 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-black mb-1">{s.value}</div>
                <div className="text-orange-100 text-sm font-medium">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={slideLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-4xl font-black mb-6">The Problem We're Solving</h2>
              <div className="space-y-4 mb-8">
                {problems.map((p, i) => (
                  <motion.div key={i} className="flex items-start gap-3 bg-red-900/20 border border-red-800/30 rounded-xl p-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-400 text-xs font-bold">!</span>
                    </div>
                    <span className="text-gray-300">{p}</span>
                  </motion.div>
                ))}
              </div>
              <p className="text-gray-400 text-lg italic">"I knew there had to be a better way."</p>
            </motion.div>
            <motion.div variants={slideRight} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-2xl">DN</div>
                  <div>
                    <div className="text-white font-bold text-xl">Dadi Naveen</div>
                    <div className="text-gray-400 text-sm">Founder & CEO, CREDX USA</div>
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-4">Meet the Founder</h3>
                <ul className="space-y-2.5 text-sm">
                  {["Master's in Business Analytics, University of New Haven", "Certifications from Harvard & Stanford", "4+ years at Amazon, Infosys, and NYU", "Based in Connecticut, USA"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-gray-300">
                      <CheckCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-gray-700 flex flex-wrap gap-3">
                  <a href="mailto:dadi@credxusa.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors">
                    <Mail className="h-4 w-4" /> dadi@credxusa.com
                  </a>
                  <a href="tel:+12035899774" className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors">
                    <Phone className="h-4 w-4" /> +1 (203) 589-9774
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Quote */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="text-6xl text-orange-500 font-serif mb-6">"</div>
            <blockquote className="text-2xl lg:text-3xl font-bold text-white leading-relaxed mb-6">
              I built CREDX USA because I've seen how financial stress silently eats away at people's peace of mind — late fees, high interest, missed due dates. As an immigrant, student, and now founder, I've lived that pain. CREDX is my way of fixing it.
            </blockquote>
            <p className="text-gray-400 text-lg mb-4">
              "Our mission? To give every American full control over their credit life — with transparency, automation, and support that feels human."
            </p>
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">DN</div>
              <span className="text-gray-300 font-semibold">— Dadi Naveen, Founder & CEO</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What CREDX does */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-4">What is CREDX USA?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">CREDX is your personal credit co-pilot — a smart, secure platform that transforms how you manage your financial life.</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {whatWeDo.map((w, i) => (
              <motion.div key={i} variants={scaleIn} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-orange-500/40 transition-colors" whileHover={{ y: -4 }}>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                  <w.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2">{w.title}</h3>
                <p className="text-gray-400 text-sm">{w.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.p className="text-center text-gray-500 mt-8 italic" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            We built it for real people with real stress, not just finance geeks. This isn't just an app. It's a movement.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-4">Our Journey</h2>
            <p className="text-gray-400">From problem to solution, here's how CREDX USA came to life</p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 to-red-500 opacity-30" />
            <div className="space-y-10">
              {timeline.map((t, i) => (
                <motion.div key={i} className="relative pl-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="absolute left-0 top-1 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-black text-xs text-center shadow-lg shadow-orange-500/30">
                    <span className="leading-tight">{t.year.replace('–', '\n')}</span>
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="text-orange-400 text-xs font-semibold mb-1">{t.year}</div>
                    <h3 className="text-white font-bold text-lg mb-2">{t.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl font-black mb-4">Our Values</h2>
            <p className="text-gray-400">The principles that guide everything we do at CREDX USA</p>
          </motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {values.map((v, i) => (
              <motion.div key={i} variants={scaleIn} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center hover:border-orange-500/40 transition-colors" whileHover={{ y: -4 }}>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-white font-bold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission + CTA */}
      <section className="py-20 bg-gradient-to-br from-orange-600 to-red-700">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-white mb-4">Our Mission</h2>
            <p className="text-orange-100 text-xl mb-6">To reduce debt, increase financial literacy, and empower the next generation with smarter credit tools.</p>
            <p className="text-orange-200 mb-10">From the dorms of Connecticut to the dashboards of 50,000+ users, CREDX is rewriting how Americans manage credit — and we're just getting started.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button onClick={() => router.push('/auth?mode=signup')} className="flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                Join Our Mission <ArrowRight className="h-5 w-5" />
              </motion.button>
              <motion.button onClick={() => router.push('/contact')} className="border-2 border-white/40 text-white px-8 py-4 rounded-full font-semibold text-lg hover:border-white/80 transition-colors" whileHover={{ scale: 1.03 }}>
                Get In Touch
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
