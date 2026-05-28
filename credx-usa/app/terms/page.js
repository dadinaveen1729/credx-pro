'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Shield, FileText, AlertCircle, DollarSign, Ban, Scale, Mail, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

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

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <PageNav />
      <section className="pt-28 pb-12 bg-gradient-to-b from-gray-900 to-gray-950 text-center">
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
            <FileText className="h-4 w-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-medium">Legal Agreement</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl lg:text-5xl font-black mb-4">Terms of Service</motion.h1>
          <motion.p variants={fadeUp} className="text-gray-400 text-lg mb-2">Last Updated: December 10, 2024 · Effective: December 10, 2024</motion.p>
          <motion.p variants={fadeUp} className="text-gray-500 text-sm max-w-2xl mx-auto">
            Please read these Terms of Service carefully before using CREDX USA. By accessing or using our platform, you agree to be bound by these terms. If you do not agree, do not use CREDX USA.
          </motion.p>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-400 font-bold mb-1">Important Notice</p>
              <p className="text-gray-400 text-sm">CREDX USA is a financial management tool, NOT a bank, financial advisor, or licensed investment advisor. We are not responsible for financial decisions you make based on information provided by our platform. Always consult a licensed financial professional for major financial decisions.</p>
            </div>
          </div>
        </div>

        <Section title="1. Acceptance of Terms" icon={FileText}>
          <p>By creating an account, accessing, or using CREDX USA ("Service"), you ("User", "you") agree to these Terms of Service and our Privacy Policy. These terms constitute a legally binding agreement between you and CREDX USA, Inc. ("Company", "we", "us").</p>
          <p>You must be at least 18 years old and a resident of the United States to use CREDX USA. By using our Service, you represent and warrant that you meet these requirements.</p>
          <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the modified terms. We will notify you of material changes via email.</p>
        </Section>

        <Section title="2. Description of Service" icon={Shield}>
          <p>CREDX USA provides:</p>
          <ul className="list-disc ml-4 space-y-1 mt-2">
            <li>Credit card bill tracking and management</li>
            <li>AI-powered financial insights and suggestions (not professional financial advice)</li>
            <li>Payment reminders via SMS, WhatsApp, and email</li>
            <li>Bank account linking through Plaid for transaction monitoring</li>
            <li>Rewards optimization analysis</li>
            <li>Gmail integration for automatic bill import</li>
            <li>Payment processing via Stripe</li>
          </ul>
          <p className="mt-3"><strong className="text-white">CREDX USA is NOT:</strong> A bank, credit union, or financial institution. A licensed financial advisor, broker, or investment advisor. Responsible for decisions made based on AI suggestions. Affiliated with any credit card company or bank.</p>
        </Section>

        <Section title="3. User Accounts & Responsibilities" icon={Shield}>
          <p>You are responsible for:</p>
          <ul className="list-disc ml-4 space-y-1 mt-2">
            <li>Maintaining the confidentiality of your login credentials</li>
            <li>All activity that occurs under your account</li>
            <li>Providing accurate and current information</li>
            <li>Notifying us immediately of any unauthorized account access at dadi@credxusa.com</li>
            <li>Using the Service only for lawful purposes</li>
          </ul>
          <p className="mt-3">You may not share your account with others. Each account is for individual use only (except Family plan accounts). We reserve the right to terminate accounts that violate these terms.</p>
        </Section>

        <Section title="4. Financial Data & AI Disclaimer" icon={AlertCircle}>
          <p><strong className="text-white">AI Financial Advisor Disclaimer:</strong> Our AI advisor provides general financial information and suggestions based on your data. This does NOT constitute professional financial advice. The AI is not a licensed financial advisor, CPA, or attorney.</p>
          <p>We make no guarantee that AI suggestions will improve your credit score, reduce your debt, or increase your savings. Results vary based on individual circumstances.</p>
          <p><strong className="text-white">Data Accuracy:</strong> You are responsible for verifying that bill amounts and due dates entered into CREDX USA are accurate. We are not responsible for missed payments due to incorrect data entry.</p>
          <p><strong className="text-white">No Guarantee of Outcomes:</strong> CREDX USA does not guarantee any specific financial outcomes, credit score improvements, rewards earnings, or debt reduction results.</p>
        </Section>

        <Section title="5. Payments & Subscriptions" icon={DollarSign}>
          <p><strong className="text-white">Free Plan:</strong> Available at no cost with limited features as described on our pricing page.</p>
          <p><strong className="text-white">Pro Plan ($9.99/month):</strong> Billed monthly. Cancel anytime. No refunds for partial months.</p>
          <p><strong className="text-white">Family Plan ($19.99/month):</strong> Up to 5 users. Billed monthly. Cancel anytime.</p>
          <p><strong className="text-white">Payments:</strong> All payments are processed by Stripe. We do not store your payment card information. Stripe's terms and privacy policy apply to payment processing.</p>
          <p><strong className="text-white">Refunds:</strong> We offer a 14-day money-back guarantee for first-time subscribers to paid plans. After 14 days, all charges are non-refundable. To request a refund, email dadi@credxusa.com within 14 days of your first charge.</p>
          <p><strong className="text-white">Price Changes:</strong> We reserve the right to change pricing with 30 days notice to existing subscribers.</p>
        </Section>

        <Section title="6. Prohibited Uses" icon={Ban}>
          <p>You may NOT use CREDX USA to:</p>
          <ul className="list-disc ml-4 space-y-1 mt-2">
            <li>Engage in any illegal activity or violate any laws</li>
            <li>Attempt to hack, reverse engineer, or scrape our platform</li>
            <li>Create multiple accounts to circumvent plan limitations</li>
            <li>Use another person's financial information without authorization</li>
            <li>Transmit spam, malware, or malicious code</li>
            <li>Impersonate another person or entity</li>
            <li>Resell or sublicense our Service without written permission</li>
            <li>Use automated bots or scripts to access our Service</li>
          </ul>
          <p className="mt-3">Violation of these terms may result in immediate account termination without refund and may be reported to law enforcement.</p>
        </Section>

        <Section title="7. Intellectual Property" icon={FileText}>
          <p>All content, features, and functionality of CREDX USA — including but not limited to text, graphics, logos, button icons, images, audio clips, software, and the arrangement thereof — are owned by CREDX USA, Inc. and are protected by U.S. and international copyright, trademark, and other intellectual property laws.</p>
          <p>You may not copy, reproduce, distribute, or create derivative works from any part of our Service without explicit written permission.</p>
          <p><strong className="text-white">Your Data:</strong> You retain ownership of all data you input into CREDX USA. By using our Service, you grant us a limited license to process your data to provide the Service.</p>
        </Section>

        <Section title="8. Limitation of Liability" icon={Scale}>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, CREDX USA AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR:</p>
          <ul className="list-disc ml-4 space-y-1 mt-2">
            <li>Any indirect, incidental, special, or consequential damages</li>
            <li>Loss of profits, data, or goodwill</li>
            <li>Financial losses resulting from actions taken based on AI suggestions</li>
            <li>Missed payments or late fees due to platform outages or errors</li>
            <li>Unauthorized access to your account by third parties</li>
            <li>Any damages exceeding the amount paid to us in the 12 months prior to the claim</li>
          </ul>
          <p className="mt-3">Some jurisdictions do not allow exclusion of certain warranties or limitation of liability, so some of the above may not apply to you.</p>
        </Section>

        <Section title="9. Indemnification" icon={Shield}>
          <p>You agree to indemnify, defend, and hold harmless CREDX USA, Inc. and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
          <ul className="list-disc ml-4 space-y-1 mt-2">
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Any content you submit to our platform</li>
          </ul>
        </Section>

        <Section title="10. Termination" icon={Ban}>
          <p><strong className="text-white">By You:</strong> You may cancel your account at any time through your account settings or by emailing dadi@credxusa.com.</p>
          <p><strong className="text-white">By Us:</strong> We reserve the right to suspend or terminate your account immediately, without notice, if you violate these Terms or if we believe continued access poses a risk to other users or our platform.</p>
          <p>Upon termination, your right to use the Service ceases immediately. We will delete your personal data per our Privacy Policy.</p>
        </Section>

        <Section title="11. Governing Law & Disputes" icon={Scale}>
          <p>These Terms are governed by the laws of the State of Connecticut, USA, without regard to conflict of law principles.</p>
          <p><strong className="text-white">Dispute Resolution:</strong> Any disputes shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to binding arbitration under the American Arbitration Association rules in Connecticut.</p>
          <p><strong className="text-white">Class Action Waiver:</strong> You agree to resolve disputes with CREDX USA individually. You waive the right to participate in class action lawsuits.</p>
        </Section>

        <Section title="12. Contact" icon={Mail}>
          <p>For legal inquiries or questions about these Terms:</p>
          <p><strong className="text-white">Email:</strong> legal@credxusa.com | dadi@credxusa.com</p>
          <p><strong className="text-white">Phone:</strong> +1 (203) 589-9774</p>
          <p><strong className="text-white">Address:</strong> CREDX USA, Inc., Connecticut, USA</p>
        </Section>

        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm mb-4">© 2026 CREDX USA, Inc. · Built with ❤️ for Americans</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => router.push('/privacy')} className="text-orange-400 hover:text-orange-300 text-sm transition-colors">Privacy Policy</button>
            <button onClick={() => router.push('/contact')} className="text-orange-400 hover:text-orange-300 text-sm transition-colors">Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  );
}
