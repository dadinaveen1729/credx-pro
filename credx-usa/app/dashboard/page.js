'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, DollarSign, TrendingUp, Bell, Settings, LogOut, User,
  Plus, RefreshCw, Loader2, Mail, Gift, Brain, CheckCircle, AlertTriangle,
  Clock, BarChart3, Zap, ChevronDown, X, ExternalLink, Shield, Phone,
  Building2, FileText, Wallet, Star, Target, PiggyBank, ArrowRight,
  LayoutDashboard, Receipt, Bot, BellRing, LineChart, HelpCircle, Info
} from 'lucide-react';
import { toast } from 'sonner';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

// ── USER AVATAR / DROPDOWN ─────────────────────────────────────────────────
function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-3 py-2 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {user?.photoURL ? <img src={user.photoURL} className="w-8 h-8 rounded-full object-cover" alt="" /> : initials}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-white text-sm font-semibold leading-tight">{user?.displayName || 'My Account'}</div>
          <div className="text-gray-400 text-xs truncate max-w-[120px]">{user?.email}</div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute right-0 top-12 w-56 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl z-50 overflow-hidden"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="px-4 py-3 border-b border-gray-800">
              <div className="text-white font-semibold text-sm">{user?.displayName || 'User'}</div>
              <div className="text-gray-400 text-xs">{user?.email}</div>
              {user?.emailVerified === false && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3 text-amber-400" />
                  <span className="text-amber-400 text-xs">Email not verified</span>
                </div>
              )}
            </div>
            {[
              { icon: User, label: 'My Profile', action: () => { router.push('/dashboard/settings'); setOpen(false); } },
              { icon: Settings, label: 'Settings', action: () => { router.push('/dashboard/settings'); setOpen(false); } },
              { icon: HelpCircle, label: 'Help & Support', action: () => { router.push('/contact'); setOpen(false); } },
            ].map((item, i) => (
              <button key={i} onClick={item.action} className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm">
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
            <div className="border-t border-gray-800">
              <button
                onClick={() => { onLogout(); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors text-sm"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── ADD BILL MODAL ─────────────────────────────────────────────────────────
function AddBillModal({ onClose, onAdd, userId }) {
  const [form, setForm] = useState({ name: '', amount: '', due_date: '', card_type: 'credit_card', bank_name: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) { toast.error('Name and amount are required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_id: userId, amount: parseFloat(form.amount), status: 'pending' })
      });
      if (res.ok) {
        toast.success('Bill added!');
        onAdd();
        onClose();
      } else { toast.error('Failed to add bill'); }
    } catch { toast.error('Failed to add bill'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 w-full max-w-md" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-xl">Add Bill</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Bill Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Chase Sapphire, Verizon, etc." required className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Amount ($) *</label>
            <input type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" required className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Due Date</label>
            <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Bank / Provider</label>
            <input value={form.bank_name} onChange={e => setForm({ ...form, bank_name: e.target.value })} placeholder="Chase, Verizon, Comcast..." className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm" />
          </div>
          <div>
            <label className="text-gray-400 text-sm mb-1.5 block">Category</label>
            <select value={form.card_type} onChange={e => setForm({ ...form, card_type: e.target.value })} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 text-sm">
              <option value="credit_card">Credit Card</option>
              <option value="phone">Phone Bill</option>
              <option value="utility">Utility (Electric/Gas/Water)</option>
              <option value="internet">Internet / Cable</option>
              <option value="subscription">Subscription</option>
              <option value="insurance">Insurance</option>
              <option value="rent">Rent</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-700 text-gray-400 rounded-xl text-sm hover:border-gray-500 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-bold disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Add Bill'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── AI ADVISOR PANEL ───────────────────────────────────────────────────────
function AIAdvisorPanel({ user, bills, payments }) {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [chat, setChat] = useState([
    { role: 'assistant', text: `Hi ${user?.displayName?.split(' ')[0] || 'there'}! 👋 I'm your personal AI financial advisor. I have access to your bills, spending patterns, and payment history. What would you like to know?` }
  ]);

  const runAnalysis = async () => {
    setLoading(true);
    const userContext = `User: ${user?.displayName || user?.email}. Bills: ${JSON.stringify(bills?.slice(0, 10))}. Recent payments: ${JSON.stringify(payments?.slice(0, 5))}.`;
    try {
      const res = await fetch('/api/ai/financial-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Give me a comprehensive personal financial analysis based on my actual bills and payment data. Identify: 1) Highest priority bills to pay, 2) Estimated credit utilization, 3) Potential savings opportunities, 4) Specific recommendations for my situation.',
          user_id: user?.uid,
          context: userContext,
          bills, payments
        })
      });
      const data = await res.json();
      if (data.response) {
        setAnalysis(data.response);
        setChat(prev => [...prev, { role: 'assistant', text: data.response }]);
      } else { toast.error('AI advisor unavailable. Check your OpenAI API key.'); }
    } catch { toast.error('Failed to connect to AI advisor. Check OpenAI API key in Vercel env vars.'); }
    finally { setLoading(false); }
  };

  const sendQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion('');
    setChat(prev => [...prev, { role: 'user', text: q }]);
    setLoading(true);
    const userContext = `User bills: ${JSON.stringify(bills?.slice(0, 10))}. Payments: ${JSON.stringify(payments?.slice(0, 5))}.`;
    try {
      const res = await fetch('/api/ai/financial-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, user_id: user?.uid, context: userContext, bills, payments })
      });
      const data = await res.json();
      if (data.response) setChat(prev => [...prev, { role: 'assistant', text: data.response }]);
      else setChat(prev => [...prev, { role: 'assistant', text: 'Sorry, I could not get a response. Please check your OpenAI API key.' }]);
    } catch {
      setChat(prev => [...prev, { role: 'assistant', text: 'Connection failed. Make sure OPENAI_API_KEY is set in your Vercel environment variables.' }]);
    }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          <span className="text-white font-bold">AI Financial Advisor</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
        <button onClick={runAnalysis} disabled={loading} className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-60 transition-colors">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          Analyze My Data
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-80">
        {chat.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'assistant' ? 'bg-purple-600' : 'bg-orange-600'}`}>
              {msg.role === 'assistant' ? <Brain className="h-3.5 w-3.5 text-white" /> : <User className="h-3.5 w-3.5 text-white" />}
            </div>
            <div className={`rounded-2xl px-3 py-2 text-sm max-w-[80%] leading-relaxed ${msg.role === 'assistant' ? 'bg-gray-800 text-gray-200 rounded-tl-none' : 'bg-orange-600 text-white rounded-tr-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center"><Brain className="h-3.5 w-3.5 text-white" /></div>
            <div className="bg-gray-800 rounded-2xl rounded-tl-none px-3 py-2">
              <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendQuestion} className="flex gap-2">
        <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about your finances..." className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500 placeholder-gray-600" />
        <button type="submit" disabled={loading || !question.trim()} className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-xl disabled:opacity-60 transition-colors">
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

// ── DASHBOARD CONTENT ──────────────────────────────────────────────────────
function DashboardContent() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [userData, setUserData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [showAddBill, setShowAddBill] = useState(false);
  const [notifSettings, setNotifSettings] = useState({ email: true, sms: false, whatsapp: false, reminderDays: 3 });
  const [savingNotif, setSavingNotif] = useState(false);
  const [gmailConnecting, setGmailConnecting] = useState(false);

  useEffect(() => {
    if (!loading && !user) { router.push('/auth'); return; }
    if (user) loadData();
  }, [user, loading]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [billsRes, paymentsRes, userRes] = await Promise.allSettled([
        fetch(`/api/bills?user_id=${user.uid}`),
        fetch(`/api/stripe/payment?user_id=${user.uid}`),
        fetch(`/api/user?user_id=${user.uid}`)
      ]);
      if (billsRes.status === 'fulfilled' && billsRes.value.ok) {
        const d = await billsRes.value.json(); setBills(d.bills || []);
      }
      if (paymentsRes.status === 'fulfilled' && paymentsRes.value.ok) {
        const d = await paymentsRes.value.json(); setPayments(d.payments || []);
      }
      if (userRes.status === 'fulfilled' && userRes.value.ok) {
        const d = await userRes.value.json(); setUserData(d.user || null);
      }
    } catch (e) { console.error('Data load error:', e); }
    finally { setDataLoading(false); }
  };

  const handleLogout = async () => { await logout(); router.push('/'); };

  const connectGmail = async () => {
    setGmailConnecting(true);
    toast.info('Gmail integration requires OAuth setup in Google Cloud Console. Check Settings for instructions.');
    setTimeout(() => {
      setGmailConnecting(false);
      router.push('/dashboard/settings');
    }, 1500);
  };

  const saveNotifSettings = async () => {
    setSavingNotif(true);
    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.uid, notifications: notifSettings })
      });
      if (res.ok) toast.success('Notification settings saved!');
      else toast.error('Failed to save. Check your MongoDB connection.');
    } catch { toast.error('Failed to save settings. Check MongoDB connection.'); }
    finally { setSavingNotif(false); }
  };

  const markPaid = async (billId) => {
    try {
      const res = await fetch(`/api/bills`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bill_id: billId, status: 'paid', user_id: user.uid })
      });
      if (res.ok) { toast.success('Bill marked as paid!'); loadData(); }
      else toast.error('Failed to update bill');
    } catch { toast.error('Failed to update bill'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mb-3" />
        <p className="text-gray-400">Loading your dashboard...</p>
      </div>
    </div>
  );

  const pendingBills = bills.filter(b => b.status === 'pending');
  const totalDue = pendingBills.reduce((s, b) => s + (b.amount || 0), 0);
  const rewardPoints = userData?.total_rewards || (payments.length * 50);
  const creditScore = userData?.credit_score || 745;

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bills', label: 'Bills & AutoPay', icon: Receipt },
    { id: 'ai', label: 'AI Advisor', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'notifications', label: 'Alerts', icon: BellRing },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {showAddBill && <AddBillModal onClose={() => setShowAddBill(false)} onAdd={loadData} userId={user.uid} />}

      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-extrabold hidden sm:block">CREDX <span className="text-orange-500">USA</span></span>
            </button>
            <div className="hidden sm:flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-full px-3 py-1 text-xs text-gray-400">
              <LayoutDashboard className="h-3 w-3" /> Dashboard
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button onClick={() => setShowAddBill(true)} className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Plus className="h-4 w-4" /> Add Bill
            </motion.button>
            <button onClick={loadData} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors">
              <RefreshCw className={`h-4 w-4 ${dataLoading ? 'animate-spin' : ''}`} />
            </button>
            <UserDropdown user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome */}
        <motion.div className="mb-6" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-white">
            Welcome back, <span className="text-orange-400">{user?.displayName?.split(' ')[0] || 'there'}</span> 👋
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Here's your financial summary for today</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-2xl p-1.5 mb-6 overflow-x-auto">
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Due', value: `$${totalDue.toFixed(2)}`, sub: `${pendingBills.length} pending bills`, icon: DollarSign, color: 'from-red-500 to-orange-500', urgent: totalDue > 0 },
                { label: 'Rewards Points', value: `${rewardPoints.toLocaleString()} pts`, sub: `= $${(rewardPoints / 100).toFixed(2)} cashback`, icon: Gift, color: 'from-green-500 to-teal-500' },
                { label: 'Credit Score', value: creditScore, sub: creditScore >= 750 ? '⭐ Excellent' : creditScore >= 700 ? '✅ Good' : '⚠️ Fair', icon: TrendingUp, color: 'from-blue-500 to-indigo-500' },
                { label: 'Bills Paid', value: payments.length, sub: 'Total payments', icon: CheckCircle, color: 'from-purple-500 to-pink-500' },
              ].map((s, i) => (
                <motion.div key={i} variants={fadeUp} className={`bg-gray-900 border ${s.urgent ? 'border-orange-500/50' : 'border-gray-800'} rounded-2xl p-4`} whileHover={{ y: -2 }}>
                  <div className={`w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-white font-black text-2xl mb-0.5">{s.value}</div>
                  <div className="text-gray-500 text-xs">{s.label}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{s.sub}</div>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-5">
              {/* Upcoming bills */}
              <motion.div variants={fadeUp} className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white font-bold">Upcoming Bills</h2>
                  <button onClick={() => setActiveTab('bills')} className="text-orange-400 text-xs hover:text-orange-300">View all →</button>
                </div>
                {dataLoading ? (
                  <div className="flex items-center justify-center h-24"><Loader2 className="h-6 w-6 animate-spin text-gray-600" /></div>
                ) : pendingBills.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">All caught up! No pending bills.</p>
                    <button onClick={() => setShowAddBill(true)} className="mt-3 text-orange-400 text-sm hover:text-orange-300">+ Add a bill</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingBills.slice(0, 5).map((bill, i) => {
                      const daysUntil = bill.due_date ? Math.ceil((new Date(bill.due_date) - new Date()) / 86400000) : null;
                      const urgent = daysUntil !== null && daysUntil <= 3;
                      return (
                        <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${urgent ? 'border-red-500/30 bg-red-900/10' : 'border-gray-800 bg-gray-800/50'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${urgent ? 'bg-red-500/20' : 'bg-gray-700'}`}>
                              <CreditCard className={`h-4 w-4 ${urgent ? 'text-red-400' : 'text-gray-400'}`} />
                            </div>
                            <div>
                              <div className="text-white text-sm font-semibold">{bill.name || bill.bank_name}</div>
                              <div className="text-gray-400 text-xs">
                                {daysUntil !== null ? (urgent ? `⚠️ Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}` : `Due in ${daysUntil} days`) : 'No due date'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-white font-bold">${(bill.amount || 0).toFixed(2)}</span>
                            <button onClick={() => markPaid(bill._id || bill.id)} className="text-xs bg-green-600 hover:bg-green-500 text-white px-2.5 py-1 rounded-lg transition-colors">Pay</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Quick actions */}
              <motion.div variants={fadeUp} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h2 className="text-white font-bold mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  {[
                    { icon: Plus, label: 'Add Bill', action: () => setShowAddBill(true), color: 'bg-orange-600 hover:bg-orange-500' },
                    { icon: Mail, label: 'Connect Gmail', action: connectGmail, color: 'bg-red-600 hover:bg-red-500', loading: gmailConnecting },
                    { icon: Brain, label: 'AI Analysis', action: () => setActiveTab('ai'), color: 'bg-purple-600 hover:bg-purple-500' },
                    { icon: BarChart3, label: 'View Analytics', action: () => setActiveTab('analytics'), color: 'bg-blue-600 hover:bg-blue-500' },
                    { icon: Bell, label: 'Set Reminders', action: () => setActiveTab('notifications'), color: 'bg-pink-600 hover:bg-pink-500' },
                  ].map((a, i) => (
                    <button key={i} onClick={a.action} disabled={a.loading} className={`w-full flex items-center gap-3 ${a.color} text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-70`}>
                      {a.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <a.icon className="h-4 w-4" />}
                      {a.label}
                    </button>
                  ))}
                </div>

                {/* Credit score visual */}
                <div className="mt-5 p-4 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-800/30 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-xs">Credit Score</span>
                    <span className="text-blue-400 text-xs font-semibold">{creditScore >= 750 ? 'Excellent' : creditScore >= 700 ? 'Good' : 'Fair'}</span>
                  </div>
                  <div className="text-white font-black text-3xl mb-2">{creditScore}</div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${Math.min(100, ((creditScore - 300) / 550) * 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-gray-600 text-xs mt-1"><span>300</span><span>850</span></div>
                </div>
              </motion.div>
            </div>

            {/* Gmail connect banner */}
            <motion.div variants={fadeUp} className="mt-5 bg-gradient-to-r from-red-900/30 to-orange-900/30 border border-red-800/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <div className="text-white font-bold">Connect Gmail to Auto-Detect Bills</div>
                  <div className="text-gray-400 text-sm">AI will scan your emails to automatically find and import credit card statements and bills.</div>
                </div>
              </div>
              <button onClick={connectGmail} disabled={gmailConnecting} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors disabled:opacity-60">
                {gmailConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Connect Gmail
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* BILLS TAB */}
        {activeTab === 'bills' && (
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-white">Bills & AutoPay</h2>
              <button onClick={() => setShowAddBill(true)} className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                <Plus className="h-4 w-4" /> Add Bill
              </button>
            </motion.div>
            {dataLoading ? (
              <div className="flex items-center justify-center h-40"><Loader2 className="h-8 w-8 animate-spin text-gray-600" /></div>
            ) : bills.length === 0 ? (
              <motion.div variants={fadeUp} className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
                <Receipt className="h-14 w-14 text-gray-700 mx-auto mb-3" />
                <h3 className="text-white font-bold text-lg mb-2">No bills yet</h3>
                <p className="text-gray-400 text-sm mb-6">Add your credit card bills, utilities, and subscriptions to track them here.</p>
                <button onClick={() => setShowAddBill(true)} className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors">Add Your First Bill</button>
              </motion.div>
            ) : (
              <motion.div variants={stagger} className="space-y-3">
                {bills.map((bill, i) => {
                  const daysUntil = bill.due_date ? Math.ceil((new Date(bill.due_date) - new Date()) / 86400000) : null;
                  const isPaid = bill.status === 'paid';
                  return (
                    <motion.div key={i} variants={fadeUp} className={`flex items-center justify-between p-4 rounded-2xl border ${isPaid ? 'border-green-800/30 bg-green-900/10' : daysUntil !== null && daysUntil <= 3 ? 'border-red-500/30 bg-red-900/10' : 'border-gray-800 bg-gray-900'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isPaid ? 'bg-green-600/20' : 'bg-gray-800'}`}>
                          {isPaid ? <CheckCircle className="h-5 w-5 text-green-400" /> : <CreditCard className="h-5 w-5 text-orange-400" />}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{bill.name || bill.bank_name || 'Bill'}</div>
                          <div className="text-gray-400 text-xs">{bill.card_type || 'Credit Card'}{bill.bank_name ? ` · ${bill.bank_name}` : ''}</div>
                          {daysUntil !== null && !isPaid && (
                            <div className={`text-xs mt-0.5 font-medium ${daysUntil <= 3 ? 'text-red-400' : 'text-gray-500'}`}>
                              {daysUntil <= 0 ? '⚠️ Overdue!' : `Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-black text-lg ${isPaid ? 'text-green-400' : 'text-white'}`}>${(bill.amount || 0).toFixed(2)}</span>
                        {isPaid ? (
                          <span className="text-xs bg-green-600/20 text-green-400 px-2.5 py-1 rounded-lg border border-green-600/30">Paid ✓</span>
                        ) : (
                          <button onClick={() => markPaid(bill._id || bill.id)} className="text-xs bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* AI ADVISOR TAB */}
        {activeTab === 'ai' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-gray-900 border border-gray-800 rounded-2xl p-6" style={{ minHeight: 500 }}>
            <AIAdvisorPanel user={user} bills={bills} payments={payments} />
          </motion.div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {[
                { label: 'Total Billed', value: `$${bills.reduce((s, b) => s + (b.amount || 0), 0).toFixed(2)}`, sub: `${bills.length} bills tracked`, color: 'from-orange-500 to-red-500' },
                { label: 'Total Paid', value: `$${payments.reduce((s, p) => s + (p.amount || 0), 0).toFixed(2)}`, sub: `${payments.length} payments made`, color: 'from-green-500 to-teal-500' },
                { label: 'Rewards Earned', value: `${rewardPoints} pts`, sub: `= $${(rewardPoints / 100).toFixed(2)} cashback`, color: 'from-purple-500 to-indigo-600' },
              ].map((s, i) => (
                <motion.div key={i} variants={scaleIn} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className={`inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br ${s.color} rounded-xl mb-3`}>
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-white font-black text-2xl mb-0.5">{s.value}</div>
                  <div className="text-gray-500 text-sm">{s.label}</div>
                  <div className="text-gray-400 text-xs">{s.sub}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4">Bills by Category</h3>
              {bills.length === 0 ? (
                <p className="text-gray-500 text-sm">Add bills to see your spending breakdown.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(bills.reduce((acc, b) => {
                    const cat = b.card_type || 'other';
                    acc[cat] = (acc[cat] || 0) + (b.amount || 0);
                    return acc;
                  }, {})).map(([cat, total], i) => {
                    const allTotal = bills.reduce((s, b) => s + (b.amount || 0), 0);
                    const pct = allTotal > 0 ? Math.round((total / allTotal) * 100) : 0;
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300 capitalize">{cat.replace('_', ' ')}</span>
                          <span className="text-white font-semibold">${total.toFixed(2)} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="max-w-2xl">
            <h2 className="text-xl font-black text-white mb-5">Notification Settings</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
              {[
                { key: 'email', label: 'Email Notifications', desc: `Alerts sent to ${user?.email}`, icon: Mail },
                { key: 'sms', label: 'SMS Notifications', desc: 'Text alerts (requires Twilio)', icon: Phone },
                { key: 'whatsapp', label: 'WhatsApp Notifications', desc: 'WhatsApp alerts (requires Twilio)', icon: Phone },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{item.label}</div>
                      <div className="text-gray-500 text-xs">{item.desc}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${notifSettings[item.key] ? 'bg-orange-600' : 'bg-gray-700'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifSettings[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Remind me how many days before due date?</label>
                <select value={notifSettings.reminderDays} onChange={e => setNotifSettings(prev => ({ ...prev, reminderDays: parseInt(e.target.value) }))} className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500">
                  <option value={1}>1 day before</option>
                  <option value={3}>3 days before</option>
                  <option value={5}>5 days before</option>
                  <option value={7}>7 days before</option>
                </select>
              </div>
              <motion.button onClick={saveNotifSettings} disabled={savingNotif} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold disabled:opacity-60" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                {savingNotif ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : 'Save Settings'}
              </motion.button>

              <div className="bg-amber-900/20 border border-amber-600/30 rounded-xl p-4 text-sm">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="text-amber-300">
                    <strong>SMS & WhatsApp</strong> require your Twilio credentials in Vercel environment variables: <code className="bg-amber-900/40 px-1 rounded">TWILIO_ACCOUNT_SID</code>, <code className="bg-amber-900/40 px-1 rounded">TWILIO_AUTH_TOKEN</code>, <code className="bg-amber-900/40 px-1 rounded">TWILIO_PHONE_NUMBER</code>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-2xl space-y-5">
            <motion.div variants={fadeUp} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><User className="h-5 w-5 text-orange-400" /> Account Information</h2>
              <div className="space-y-3">
                {[
                  { label: 'Display Name', value: user?.displayName || 'Not set' },
                  { label: 'Email', value: user?.email },
                  { label: 'Email Verified', value: user?.emailVerified ? '✅ Verified' : '⚠️ Not verified — check your inbox' },
                  { label: 'Sign-in Method', value: user?.providerData?.[0]?.providerId === 'google.com' ? '🔵 Google' : user?.providerData?.[0]?.providerId === 'phone' ? '📱 Phone' : '📧 Email/Password' },
                  { label: 'Member Since', value: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : '—' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <span className="text-gray-400 text-sm">{row.label}</span>
                    <span className="text-white text-sm font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Mail className="h-5 w-5 text-red-400" /> Gmail Integration</h2>
              <p className="text-gray-400 text-sm mb-4">Connect your Gmail to automatically detect credit card statements and import bills.</p>
              <div className="bg-gray-800 rounded-xl p-4 text-sm text-gray-300 mb-4 space-y-1">
                <div className="font-semibold text-white mb-2">Setup required in Google Cloud Console:</div>
                <div>1. Go to <span className="text-orange-400">console.cloud.google.com</span></div>
                <div>2. Enable Gmail API</div>
                <div>3. Create OAuth 2.0 credentials</div>
                <div>4. Add to Vercel: <code className="bg-gray-700 px-1 rounded">GMAIL_CLIENT_ID</code>, <code className="bg-gray-700 px-1 rounded">GMAIL_CLIENT_SECRET</code></div>
              </div>
              <button onClick={connectGmail} className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                Connect Gmail
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-green-400" /> Security Settings</h2>
              <div className="space-y-3">
                {[
                  { label: '256-bit AES Encryption', status: true },
                  { label: 'Firebase Authentication', status: true },
                  { label: 'Two-Factor Authentication', status: user?.providerData?.length > 1 },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">{s.label}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${s.status ? 'bg-green-600/20 text-green-400' : 'bg-gray-700 text-gray-500'}`}>
                      {s.status ? '✅ Active' : 'Not set up'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="bg-red-900/20 border border-red-800/40 rounded-2xl p-5">
              <h3 className="text-red-400 font-bold mb-2">Sign Out</h3>
              <p className="text-gray-400 text-sm mb-4">You'll be signed out of all devices.</p>
              <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } } };

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}
