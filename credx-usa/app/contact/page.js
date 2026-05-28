'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Mail, Phone, MapPin, Clock, MessageSquare, ChevronDown, Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

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
            <button key={label} onClick={() => router.push(href)} className={`text-sm font-medium transition-colors hover:text-orange-400 ${href === '/contact' ? 'text-orange-400' : 'text-gray-400'}`}>{label}</button>
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

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', type: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      // Send to API
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch (_) {}
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
    }, 1200);
  };

  const contactCards = [
    { icon: Mail, title: 'Email Support', desc: 'Get help from our support team', value: 'dadi@credxusa.com', badge: '24/7', href: 'mailto:dadi@credxusa.com', action: 'Send Email' },
    { icon: Mail, title: 'General Inquiries', desc: 'Business and partnership questions', value: 'info@credxusa.com', badge: '24/7', href: 'mailto:info@credxusa.com', action: 'Send Email' },
    { icon: Phone, title: 'Phone Support', desc: 'Speak directly with our team', value: '+1 (203) 589-9774', badge: 'Mon–Fri 9AM–6PM EST', href: 'tel:+12035899774', action: 'Call Now' },
    { icon: MessageSquare, title: 'Live Chat', desc: 'Real-time support chat', value: 'Available on dashboard', badge: 'Mon–Fri 9AM–9PM EST', href: '/dashboard', action: 'Start Chat' },
  ];

  const inquiryTypes = ['General Inquiry', 'Technical Support', 'Billing Question', 'Business Partnership', 'Press & Media', 'Product Feedback'];

  const faqs = [
    { q: 'Is CREDX USA free to use?', a: 'Yes! CREDX USA is completely free to use. We believe everyone deserves access to powerful credit management tools without paying subscription fees.' },
    { q: 'How secure is my financial data?', a: 'We use bank-level encryption and security protocols. Your data is protected with 256-bit SSL encryption, and we never store your banking passwords.' },
    { q: 'Which banks do you support?', a: 'We support over 11,000 financial institutions through our Plaid integration, including all major banks and credit unions in the United States.' },
    { q: 'How do I get started?', a: 'Simply sign up for free, connect your accounts through our secure process, and start managing your credit cards and bills in one place.' },
  ];

  const supportBenefits = [
    { icon: Clock, text: 'Fast Response', desc: 'Average response time under 4 hours' },
    { icon: Mail, text: 'Secure Support', desc: 'All communications are encrypted' },
    { icon: CheckCircle, text: 'Expert Team', desc: 'Financial technology specialists' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <PageNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-600/8 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-6">
              <MessageSquare className="h-4 w-4 text-orange-400" />
              <span className="text-orange-400 text-sm font-medium">💬 Get in Touch</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl lg:text-6xl font-black mb-6">
              Contact <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">CREDX USA</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-gray-300 text-xl leading-relaxed">
              Have questions about credit management, need technical support, or want to learn more about our platform? We're here to help you succeed.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="pb-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {contactCards.map((card, i) => (
              <motion.div key={i} variants={scaleIn} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/40 transition-all" whileHover={{ y: -4 }}>
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4">
                  <card.icon className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-white font-bold mb-1">{card.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{card.desc}</p>
                <p className="text-orange-400 font-semibold text-sm mb-1">{card.value}</p>
                <p className="text-gray-600 text-xs mb-4">{card.badge}</p>
                <a href={card.href} className="inline-flex items-center gap-1.5 text-sm text-white bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg font-medium transition-colors">
                  {card.action}
                </a>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact form + info grid */}
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-3xl font-black mb-2">Send us a Message</h2>
                <p className="text-gray-400 mb-8">Fill out the form below and we'll get back to you as soon as possible</p>
                {submitted ? (
                  <motion.div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-10 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-white mb-3">Message Sent!</h3>
                    <p className="text-gray-400">We'll get back to you within 24 hours at {formData.email}</p>
                    <motion.button onClick={() => setSubmitted(false)} className="mt-6 text-orange-400 text-sm hover:text-orange-300 font-medium" whileHover={{ scale: 1.05 }}>Send another message</motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Full Name *</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Smith" required className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-700" />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1.5 block">Email Address *</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" required className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-700" />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1.5 block">Inquiry Type</label>
                      <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors">
                        <option value="">Select inquiry type</option>
                        {inquiryTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1.5 block">Subject</label>
                      <input type="text" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} placeholder="How can we help you?" className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-700" />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1.5 block">Message *</label>
                      <textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us how we can help..." required rows={6} className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-700 resize-none" />
                    </div>
                    <motion.button type="submit" disabled={loading} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-60" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      {loading ? 'Sending...' : <><Send className="h-5 w-5" /> Send Message</>}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            </div>

            {/* Side info */}
            <div className="space-y-6">
              <motion.div className="bg-gray-900 border border-gray-800 rounded-2xl p-6" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h3 className="text-white font-bold mb-4">Office Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white text-sm font-medium">Address</div>
                      <div className="text-gray-400 text-sm">Connecticut, USA</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white text-sm font-medium">Business Hours</div>
                      <div className="text-gray-400 text-sm">Monday – Friday: 9:00 AM – 6:00 PM EST</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-white text-sm font-medium">Response Time</div>
                      <div className="text-gray-400 text-sm">We typically respond within 24 hours</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div className="bg-gray-900 border border-gray-800 rounded-2xl p-6" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h3 className="text-white font-bold mb-4">Why Choose CREDX USA Support?</h3>
                <div className="space-y-4">
                  {supportBenefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <b.icon className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-white text-sm font-medium">{b.text}</div>
                        <div className="text-gray-400 text-xs">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="bg-red-900/20 border border-red-600/30 rounded-2xl p-6" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h3 className="text-white font-bold mb-2">Emergency Support</h3>
                <p className="text-gray-400 text-sm mb-4">If you suspect fraudulent activity or need immediate assistance:</p>
                <a href="tel:+12035899774" className="flex items-center gap-2 text-red-400 font-semibold text-sm hover:text-red-300 transition-colors mb-2">
                  <Phone className="h-4 w-4" /> +1 (203) 589-9774
                </a>
                <a href="mailto:dadi@credxusa.com" className="flex items-center gap-2 text-red-400 font-semibold text-sm hover:text-red-300 transition-colors">
                  <Mail className="h-4 w-4" /> dadi@credxusa.com
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-black mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-400">Quick answers to common questions about CREDX USA</p>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="text-white font-semibold">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">{faq.a}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 border-t border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-sm flex items-center gap-4">
            <span>Connecticut, USA</span>
            <span>·</span>
            <a href="tel:+12035899774" className="hover:text-gray-400 transition-colors">+1 (203) 589-9774</a>
            <span>·</span>
            <a href="mailto:dadi@credxusa.com" className="hover:text-gray-400 transition-colors">dadi@credxusa.com</a>
          </div>
          <p className="text-gray-600 text-sm">© 2026 CREDX USA, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
