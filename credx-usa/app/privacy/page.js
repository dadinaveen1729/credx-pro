'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Lock, Eye, Database, Mail, Phone, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

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
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      </div>
    </nav>
  );
}

function Section({ title, icon: Icon, children }) {
  const [open, setOpen] = useState(true);
  return (
    <motion.div className="border border-gray-800 rounded-2xl overflow-hidden mb-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left bg-gray-900 hover:bg-gray-800 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
            <Icon className="h-4 w-4 text-orange-400" />
          </div>
          <span className="text-white font-bold text-lg">{title}</span>
        </div>
        {open ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>
      {open && <div className="p-6 pt-0 bg-gray-900 text-gray-400 text-sm leading-relaxed space-y-3">{children}</div>}
    </motion.div>
  );
}

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <PageNav />
      <section className="pt-28 pb-12 bg-gradient-to-b from-gray-900 to-gray-950 text-center">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
            <Shield className="h-4 w-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Your Privacy Matters</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl font-black mb-4">Privacy Policy</motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg mb-2">Last Updated: December 10, 2024 · Effective: December 10, 2024</motion.p>
          <motion.p variants={fadeUp} className="text-gray-500 text-sm max-w-2xl mx-auto">
            CREDX USA, Inc. ("CREDX USA", "we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use credxusa.com and our mobile applications.
          </motion.p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <Section title="1. Information We Collect" icon={Database}>
          <p><strong className="text-white">Account Information:</strong> Name, email address, phone number, and password (hashed — never stored in plain text) when you create an account.</p>
          <p><strong className="text-white">Financial Information:</strong> Credit card bill amounts, due dates, payment history, and bank account metadata (via Plaid). We do NOT store your full card numbers, CVV, or bank login credentials.</p>
          <p><strong className="text-white">Usage Data:</strong> Pages visited, features used, time spent, and interactions with our AI advisor — used to improve our service.</p>
          <p><strong className="text-white">Device Information:</strong> IP address, browser type, operating system, and device identifiers for security and fraud prevention.</p>
          <p><strong className="text-white">Communication Data:</strong> Emails you send us, support tickets, and feedback you provide.</p>
          <p><strong className="text-white">Gmail Data (if connected):</strong> We only read credit card statement emails to extract bill amounts. We never read personal emails or store email content beyond what's needed to import your bills.</p>
        </Section>

        <Section title="2. How We Use Your Information" icon={Eye}>
          <p>We use your information to:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li>Provide, maintain, and improve the CREDX USA platform</li>
            <li>Track and manage your credit card bills and payments</li>
            <li>Send payment reminders via SMS, WhatsApp, and email</li>
            <li>Power our AI Financial Advisor with your anonymized spending data</li>
            <li>Process payments through Stripe (we never see your raw card data — Stripe handles it)</li>
            <li>Detect fraud and prevent unauthorized access</li>
            <li>Send product updates, security alerts, and account notifications</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p className="mt-3"><strong className="text-white">We do NOT:</strong> Sell your personal data to third parties. Use your financial data for advertising. Share your information with data brokers.</p>
        </Section>

        <Section title="3. Data Sharing & Third Parties" icon={Lock}>
          <p>We share limited data only with trusted service providers necessary to operate our platform:</p>
          <ul className="list-disc ml-4 space-y-2 mt-2">
            <li><strong className="text-white">Firebase (Google):</strong> Authentication and user management</li>
            <li><strong className="text-white">MongoDB Atlas:</strong> Encrypted database storage</li>
            <li><strong className="text-white">Stripe:</strong> Payment processing — PCI DSS Level 1 compliant</li>
            <li><strong className="text-white">Plaid:</strong> Bank account linking — SOC 2 Type II certified</li>
            <li><strong className="text-white">Twilio:</strong> SMS and WhatsApp notifications</li>
            <li><strong className="text-white">OpenAI:</strong> AI financial advice — only anonymized, aggregated data is shared</li>
          </ul>
          <p className="mt-3">We may disclose data if required by law, court order, or to protect the rights and safety of our users.</p>
        </Section>

        <Section title="4. Data Security" icon={Shield}>
          <p><strong className="text-white">Encryption:</strong> All data is encrypted in transit (TLS 1.3) and at rest (AES-256).</p>
          <p><strong className="text-white">Authentication:</strong> We use Firebase Authentication with multi-factor authentication support.</p>
          <p><strong className="text-white">No Card Storage:</strong> We never store full credit card numbers. Payments are tokenized by Stripe.</p>
          <p><strong className="text-white">Bank Security:</strong> Bank credentials are handled exclusively by Plaid — we never see your banking username or password.</p>
          <p><strong className="text-white">Access Controls:</strong> Only authorized CREDX USA personnel with a legitimate need can access user data, and all access is logged.</p>
          <p className="mt-2 text-orange-400 text-xs">⚠️ No system is 100% secure. Please use a strong, unique password and enable two-factor authentication.</p>
        </Section>

        <Section title="5. Your Rights & Choices" icon={Mail}>
          <p>You have the right to:</p>
          <ul className="list-disc ml-4 space-y-1">
            <li><strong className="text-white">Access:</strong> Request a copy of your personal data at any time</li>
            <li><strong className="text-white">Correct:</strong> Update inaccurate data via your account settings</li>
            <li><strong className="text-white">Delete:</strong> Request deletion of your account and all associated data</li>
            <li><strong className="text-white">Opt-out:</strong> Unsubscribe from marketing emails at any time</li>
            <li><strong className="text-white">Portability:</strong> Request an export of your data in a readable format</li>
            <li><strong className="text-white">Restrict:</strong> Limit how we process your data in certain circumstances</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, email <strong className="text-orange-400">privacy@credxusa.com</strong> or <strong className="text-orange-400">dadi@credxusa.com</strong>. We will respond within 30 days.</p>
        </Section>

        <Section title="6. Cookies & Tracking" icon={Eye}>
          <p>We use essential cookies to keep you logged in and remember your preferences. We use analytics cookies (anonymized) to understand how users interact with our platform so we can improve it.</p>
          <p>We do NOT use advertising or tracking cookies. We do NOT sell cookie data.</p>
          <p>You can disable cookies in your browser settings, but some features may not work correctly.</p>
        </Section>

        <Section title="7. Children's Privacy" icon={Shield}>
          <p>CREDX USA is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us immediately at dadi@credxusa.com and we will delete it.</p>
        </Section>

        <Section title="8. California Privacy Rights (CCPA)" icon={Shield}>
          <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):</p>
          <ul className="list-disc ml-4 space-y-1 mt-2">
            <li>Right to know what personal information we collect and how it's used</li>
            <li>Right to delete your personal information</li>
            <li>Right to opt-out of the sale of your personal information (we do not sell personal information)</li>
            <li>Right to non-discrimination for exercising your CCPA rights</li>
          </ul>
          <p className="mt-2">To submit a CCPA request: email <strong className="text-orange-400">privacy@credxusa.com</strong></p>
        </Section>

        <Section title="9. Data Retention" icon={Database}>
          <p>We retain your data for as long as your account is active or as needed to provide services. When you delete your account:</p>
          <ul className="list-disc ml-4 space-y-1 mt-2">
            <li>Personal data is deleted within 30 days</li>
            <li>Anonymized, aggregated data may be retained for analytics</li>
            <li>We may retain certain data as required by law (e.g., financial records for 7 years)</li>
          </ul>
        </Section>

        <Section title="10. Contact Us" icon={Mail}>
          <p>For privacy questions, data requests, or concerns:</p>
          <p><strong className="text-white">Email:</strong> privacy@credxusa.com | dadi@credxusa.com</p>
          <p><strong className="text-white">Phone:</strong> +1 (203) 589-9774</p>
          <p><strong className="text-white">Address:</strong> CREDX USA, Inc., Connecticut, USA</p>
          <p className="mt-3 text-xs text-gray-600">This Privacy Policy may be updated periodically. We will notify you of significant changes via email or a prominent notice on our website. Continued use of CREDX USA after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm mb-4">© 2026 CREDX USA, Inc. · Built with ❤️ for Americans</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => router.push('/terms')} className="text-orange-400 hover:text-orange-300 text-sm transition-colors">Terms of Service</button>
            <button onClick={() => router.push('/contact')} className="text-orange-400 hover:text-orange-300 text-sm transition-colors">Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  );
}
