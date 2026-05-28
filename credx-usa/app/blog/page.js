'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Clock, ArrowRight, Mail, Search, BookOpen, TrendingUp, Building2, Star } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } };

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
            <button key={label} onClick={() => router.push(href)} className={`text-sm font-medium transition-colors hover:text-orange-400 ${href === '/blog' ? 'text-orange-400' : 'text-gray-400'}`}>{label}</button>
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

const categories = ['All Posts', 'Credit Tips', 'Bill Management', 'Financial Wellness', 'Company News'];

const posts = [
  {
    id: 1, featured: true,
    category: 'Company News', author: 'Dadi Naveen', date: 'December 10, 2024', readTime: '8 min read',
    title: 'Why I Built CREDX USA – A Story About Debt, Dignity, and Dreams',
    excerpt: "When I moved to the U.S. as a student, I knew how hard it was to manage finances in a new land. Hidden fees. Missed due dates. Overwhelming interest rates. No real help. I watched friends spiral into debt not because they were irresponsible—but because the system was built that way.",
    likes: 0, comments: 0,
  },
  {
    id: 2, featured: false,
    category: 'Credit Tips', author: 'CREDX Editorial Team', date: 'December 8, 2024', readTime: '5 min read',
    title: '5 Credit Score Myths That Are Costing You Money',
    excerpt: 'Separating fact from fiction in the world of credit scores. Learn what really affects your score and what\'s just marketing hype.',
    likes: 247, comments: 18,
  },
  {
    id: 3, featured: false,
    category: 'Bill Management', author: 'Sarah Johnson', date: 'December 5, 2024', readTime: '7 min read',
    title: 'The Complete Guide to Automating Your Bill Payments',
    excerpt: 'Set up a foolproof system that ensures you never miss a payment again. Step-by-step instructions for every major bank.',
    likes: 156, comments: 12,
  },
  {
    id: 4, featured: false,
    category: 'Financial Wellness', author: 'Michael Chen', date: 'December 3, 2024', readTime: '6 min read',
    title: 'How Gen Z is Revolutionizing Credit Management',
    excerpt: 'Young Americans are taking control of their financial futures with technology. Here\'s how they\'re doing it differently.',
    likes: 189, comments: 23,
  },
  {
    id: 5, featured: false,
    category: 'Credit Tips', author: 'CREDX Editorial Team', date: 'November 28, 2024', readTime: '4 min read',
    title: 'Understanding Credit Utilization: The 30% Rule Explained',
    excerpt: 'Why keeping your credit utilization below 30% is crucial for your credit score, and how to manage it effectively.',
    likes: 203, comments: 15,
  },
  {
    id: 6, featured: false,
    category: 'Financial Wellness', author: 'Dr. Emily Rodriguez', date: 'November 25, 2024', readTime: '9 min read',
    title: 'The Psychology of Financial Stress: Breaking the Cycle',
    excerpt: 'How financial anxiety affects your decision-making and practical strategies to overcome it.',
    likes: 178, comments: 31,
  },
  {
    id: 7, featured: false,
    category: 'Company News', author: 'Dadi Naveen', date: 'November 20, 2024', readTime: '3 min read',
    title: 'CREDX USA Reaches 50,000 Users Milestone',
    excerpt: "A look at our journey from startup to serving 50,000+ Americans and what's next for our platform.",
    likes: 312, comments: 45,
  },
];

const categoryColors = {
  'Credit Tips': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Bill Management': 'bg-green-500/10 text-green-400 border-green-500/20',
  'Financial Wellness': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Company News': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

export default function BlogPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'blog_page' })
      });
    } catch (e) {}
    setSubscribed(true);
    setEmail('');
  };

  const filtered = activeCategory === 'All Posts' ? posts : posts.filter(p => p.category === activeCategory);
  const featured = posts.find(p => p.featured);
  const regular = filtered.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <PageNav />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
              <BookOpen className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">📝 Financial Insights</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-black mb-4">
              CREDX USA <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Blog</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-400 text-xl">Expert insights, credit tips, and stories from the front lines of financial wellness</motion.p>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div className="flex flex-wrap gap-2 justify-center" variants={stagger} initial="hidden" animate="visible">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              variants={scaleIn}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {cat} {cat === 'All Posts' && `(${posts.length})`}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Featured post */}
      {activeCategory === 'All Posts' && featured && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <motion.div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            Featured Story
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-8 lg:p-12 hover:border-orange-500/40 transition-colors cursor-pointer group"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            whileHover={{ y: -4 }}
            onClick={() => router.push(`/blog/${featured.id}`)}
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${categoryColors[featured.category]}`}>{featured.category}</span>
              <span className="text-gray-500 text-sm">{featured.author}</span>
              <span className="text-gray-600 text-sm">·</span>
              <span className="text-gray-500 text-sm flex items-center gap-1"><Clock className="h-3 w-3" />{featured.date}</span>
              <span className="text-gray-500 text-sm">{featured.readTime}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors leading-snug">{featured.title}</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">{featured.excerpt}</p>
            <motion.button
              className="flex items-center gap-2 text-orange-400 font-semibold hover:text-orange-300 transition-colors"
              whileHover={{ x: 4 }}
              onClick={() => router.push(`/blog/${featured.id}`)}
            >
              Read Full Story <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Articles grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {regular.length > 0 && (
          <>
            <motion.div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {regular.length} articles found
            </motion.div>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {regular.map((post, i) => (
                <motion.div
                  key={post.id}
                  variants={scaleIn}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/40 transition-all cursor-pointer group flex flex-col"
                  whileHover={{ y: -4 }}
                  onClick={() => router.push(`/blog/${post.id}`)}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full border ${categoryColors[post.category]}`}>{post.category}</span>
                    <span className="text-gray-600 text-xs">{post.readTime}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3 group-hover:text-orange-400 transition-colors leading-snug flex-1">{post.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-600 mt-auto pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.date}</div>
                    {post.likes > 0 && <span>{post.likes} likes · {post.comments} comments</span>}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* Newsletter */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Mail className="h-10 w-10 text-orange-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black mb-3">Stay Updated with CREDX USA</h2>
            <p className="text-gray-400 mb-8">Get the latest financial insights, credit tips, and company updates delivered to your inbox</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-600 text-sm"
              />
              <motion.button
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-lg"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                onClick={handleSubscribe}
              >
                {subscribed ? '✓ Subscribed!' : 'Subscribe'}
              </motion.button>
            </div>
            <p className="text-gray-600 text-xs mt-3">Join 15,000+ readers. No spam, unsubscribe anytime.</p>
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
