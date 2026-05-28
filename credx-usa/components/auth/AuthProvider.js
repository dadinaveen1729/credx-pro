'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  initializeApp, getApps, getApp
} from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { toast } from 'sonner';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phoneVerification, setPhoneVerification] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          try {
            await fetch('/api/user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                uid: firebaseUser.uid,
                firebase_uid: firebaseUser.uid,
                email: firebaseUser.email,
                display_name: firebaseUser.displayName,
                phone: firebaseUser.phoneNumber,
                photo_url: firebaseUser.photoURL,
                provider: firebaseUser.providerData[0]?.providerId || 'firebase'
              })
            });
          } catch (e) { console.log('Backend sync failed (non-critical):', e.message); }
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error('Auth state error:', e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    getRedirectResult(auth).then(result => {
      if (result?.user) toast.success('Signed in with Google!');
    }).catch(e => console.log('Redirect result:', e.message));

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      return result;
    } catch (error) {
      const msg = error.code === 'auth/user-not-found' ? 'No account with that email. Sign up first.'
        : error.code === 'auth/wrong-password' ? 'Wrong password. Try again.'
        : error.code === 'auth/invalid-email' ? 'Invalid email address.'
        : error.code === 'auth/too-many-requests' ? 'Too many attempts. Try again later.'
        : error.message;
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email, password, displayName) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) await updateProfile(result.user, { displayName });
      // Send verification email
      try {
        await sendEmailVerification(result.user);
        toast.success('Account created! Check your email to verify your address.');
      } catch (e) {
        toast.success('Account created successfully!');
      }
      return result;
    } catch (error) {
      const msg = error.code === 'auth/email-already-in-use' ? 'An account with this email already exists. Sign in instead.'
        : error.code === 'auth/weak-password' ? 'Password must be at least 6 characters.'
        : error.code === 'auth/invalid-email' ? 'Invalid email address.'
        : error.message;
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      try {
        const result = await signInWithPopup(auth, provider);
        toast.success(`Welcome, ${result.user.displayName || 'there'}!`);
        return result;
      } catch (popupError) {
        if (['auth/popup-blocked', 'auth/popup-closed-by-user', 'auth/cancelled-popup-request'].includes(popupError.code)) {
          toast.info('Redirecting to Google...');
          await signInWithRedirect(auth, provider);
          return null;
        }
        throw popupError;
      }
    } catch (error) {
      toast.error(error.message || 'Google sign in failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phoneNumber) => {
    try {
      setLoading(true);
      // Clean up any existing verifier
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) {}
        window.recaptchaVerifier = null;
      }
      // Clear the container
      const container = document.getElementById('recaptcha-container');
      if (container) container.innerHTML = '';

      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: () => {},
        'expired-callback': () => {
          toast.error('reCAPTCHA expired. Please try again.');
          if (window.recaptchaVerifier) {
            try { window.recaptchaVerifier.clear(); } catch (e) {}
            window.recaptchaVerifier = null;
          }
        }
      });

      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setPhoneVerification(confirmationResult);
      toast.success('Verification code sent to your phone!');
      return confirmationResult;
    } catch (error) {
      const msg = error.code === 'auth/invalid-phone-number' ? 'Invalid phone number. Use format: +1 (555) 000-0000'
        : error.code === 'auth/too-many-requests' ? 'Too many SMS attempts. Wait before trying again.'
        : error.code === 'auth/unauthorized-domain' ? 'Phone auth not enabled for this domain yet.'
        : error.message;
      toast.error(msg);
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) {}
        window.recaptchaVerifier = null;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneCode = async (code) => {
    try {
      if (!phoneVerification) throw new Error('No phone verification in progress');
      setLoading(true);
      const result = await phoneVerification.confirm(code);
      setPhoneVerification(null);
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) {}
        window.recaptchaVerifier = null;
      }
      toast.success('Phone verified! Welcome to CREDX USA.');
      return result;
    } catch (error) {
      const msg = error.code === 'auth/invalid-verification-code' ? 'Wrong code. Check your SMS and try again.'
        : error.code === 'auth/code-expired' ? 'Code expired. Request a new one.'
        : error.message;
      toast.error(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setPhoneVerification(null);
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) {}
        window.recaptchaVerifier = null;
      }
      toast.success('Signed out. See you soon!');
    } catch (error) {
      toast.error('Sign out failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, phoneVerification, signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithPhone, verifyPhoneCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
