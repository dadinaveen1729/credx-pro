'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Phone, Eye, EyeOff, Shield, CheckCircle, Loader2,
  ArrowRight, CreditCard, Brain, Gift, Lock, AlertTriangle, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

// Google SVG icon
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function EnhancedAuthForm() {
  const {
    user, loading, phoneVerification,
    signInWithEmail, signUpWithEmail, signInWithGoogle,
    signInWithPhone, verifyPhoneCode
  } = useAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams?.get('mode') === 'signup' ? 'signup' : 'signin';

  const [authMode, setAuthMode] = useState(initialMode);
  const [authTab, setAuthTab] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domainError, setDomainError] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', displayName: '', phone: '' });
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    if (user && !loading) router.push('/dashboard');
  }, [user, loading, router]);

  const handleInput = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (authMode === 'signup' && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setIsSubmitting(true);
      if (authMode === 'signin') {
        await signInWithEmail(formData.email, formData.password);
      } else {
        await signUpWithEmail(formData.email, formData.password, formData.displayName);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsSubmitting(true);
      setDomainError(false);
      await signInWithGoogle();
    } catch (error) {
      console.error('Google auth error:', error);
      if (error?.code === 'auth/unauthorized-domain') setDomainError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneAuth = async (e) => {
    e.preventDefault();
    if (!formData.phone) { toast.error('Please enter a phone number'); return; }
    try {
      setIsSubmitting(true);
      await signInWithPhone(formData.phone);
    } catch (error) {
      console.error('Phone auth error:', error);
      if (error?.code === 'auth/unauthorized-domain') setDomainError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length < 6) { toast.error('Please enter the 6-digit code'); return; }
    try {
      setIsSubmitting(true);
      await verifyPhoneCode(verificationCode);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-8 w-8 mx-auto mb-3 text-green-500" />
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* LEFT: Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-orange-600 via-red-600 to-pink-700 p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <motion.button onClick={() => router.push('/')} className="flex items-center gap-2 text-white/70 hover:text-white mb-12 text-sm" whileHover={{ x: -2 }}>
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </motion.button>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-extrabold text-2xl">CREDX USA</span>
          </div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Master your credit cards.<br />
            <span className="text-yellow-300">Save thousands.</span>
          </h2>
          <p className="text-white/70 text-lg mb-10">Join Americans using AI to optimize credit cards and build wealth.</p>
          <div className="space-y-4">
            {[
              { icon: Brain, text: 'AI-powered financial advisor included free' },
              { icon: Gift, text: 'Find hidden rewards across all your cards' },
              { icon: Shield, text: 'Bank-level 256-bit encryption' },
              { icon: CreditCard, text: 'Support for 500+ credit cards' }
            ].map((item, i) => (
              <motion.div key={i} className="flex items-center gap-3 text-white/90" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-300" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Your data is safe</div>
              <div className="text-white/60 text-xs">256-bit AES · SOC 2 Compliant</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <span className="text-white font-extrabold text-xl">CREDX USA</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              {authMode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-gray-400">
              {authMode === 'signin' ? 'Sign in to your CREDX USA dashboard' : 'Join CREDX USA — free for early users'}
            </p>
          </div>

          {/* Domain error warning */}
          <AnimatePresence>
            {domainError && (
              <motion.div className="mb-6 p-4 bg-amber-900/30 border border-amber-600/50 rounded-xl flex gap-3" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-amber-300 font-semibold text-sm mb-1">Firebase domain not yet authorized</div>
                  <div className="text-amber-400/80 text-xs leading-relaxed">
                    To fix: Firebase Console → Authentication → Authorized domains → Add <code className="bg-amber-900/50 px-1 rounded">credx-usa-live-main.vercel.app</code>
                    <br /><strong>Use email + password for now</strong> — it works without that setup.
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google Sign In */}
          <motion.button onClick={handleGoogleAuth} disabled={isSubmitting} className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all shadow-sm disabled:opacity-60 mb-6" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : <GoogleIcon />}
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-600 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Tab switcher */}
          <div className="flex bg-gray-900 rounded-xl p-1 mb-6">
            {[{ id: 'email', label: 'Email', icon: Mail }, { id: 'phone', label: 'Phone', icon: Phone }].map(tab => (
              <button key={tab.id} onClick={() => setAuthTab(tab.id)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${authTab === tab.id ? 'bg-orange-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}>
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Email form */}
          <AnimatePresence mode="wait">
            {authTab === 'email' && (
              <motion.form key="email" onSubmit={handleEmailAuth} className="space-y-4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                {authMode === 'signup' && (
                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">Full Name</label>
                    <input type="text" name="displayName" value={formData.displayName} onChange={handleInput} placeholder="John Smith" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-700" />
                  </div>
                )}
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Email address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInput} placeholder="you@example.com" required className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-700" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">Password</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInput} placeholder="Min. 6 characters" required className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-700" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                {authMode === 'signup' && (
                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInput} placeholder="Repeat password" required className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-700" />
                  </div>
                )}
                <motion.button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-60" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{authMode === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight className="h-5 w-5" /></>}
                </motion.button>
              </motion.form>
            )}

            {/* Phone form */}
            {authTab === 'phone' && (
              <motion.div key="phone" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {!phoneVerification ? (
                  <form onSubmit={handlePhoneAuth} className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-1.5 block">Phone number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInput} placeholder="+1 (555) 000-0000" required className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-700" />
                      <p className="text-gray-600 text-xs mt-1.5">Include country code (e.g. +1 for USA)</p>
                    </div>
                    <div id="recaptcha-container" className="flex justify-center" />
                    <motion.button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3.5 rounded-xl disabled:opacity-60" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Send Code <ArrowRight className="h-5 w-5" /></>}
                    </motion.button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCode} className="space-y-4">
                    <div className="text-center mb-2">
                      <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Phone className="h-6 w-6 text-orange-400" />
                      </div>
                      <p className="text-gray-300 text-sm">Enter the 6-digit code sent to</p>
                      <p className="text-white font-semibold">{formData.phone}</p>
                    </div>
                    <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-700" />
                    <motion.button type="submit" disabled={isSubmitting || verificationCode.length < 6} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3.5 rounded-xl disabled:opacity-60" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Verify & Sign In'}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">{authMode === 'signin' ? "Don't have an account? " : 'Already have an account? '}</span>
            <button onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} className="text-orange-400 hover:text-orange-300 font-semibold text-sm">
              {authMode === 'signin' ? 'Sign up free' : 'Sign in'}
            </button>
          </div>

          <p className="mt-6 text-center text-gray-700 text-xs">
            By continuing you agree to our{' '}
            <button onClick={() => router.push('/terms')} className="text-gray-500 hover:text-gray-400 underline">Terms</button>
            {' '}and{' '}
            <button onClick={() => router.push('/privacy')} className="text-gray-500 hover:text-gray-400 underline">Privacy Policy</button>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
