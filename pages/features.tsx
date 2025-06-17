
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const features = [
  { title: "Unified Credit Hub", description: "Link and manage all your cards and credit lines with real-time insights.", icon: "💳" },
  { title: "Smart Bill Payments", description: "Set up one-tap auto-pay with overdraft protection and due reminders.", icon: "💡" },
  { title: "AI Fraud Detection", description: "We monitor anomalies and hidden fees to keep your money safe.", icon: "🧠" },
  { title: "Instant Credit Approval", description: "Get approved for short-term credit lines in under 2 minutes.", icon: "⚡" },
  { title: "Rewards & Cashback", description: "Earn every time you pay a bill—redeem via our in-app store.", icon: "🎁" },
  { title: "P2P Lending", description: "Borrow or lend money securely with smart matching and risk scores.", icon: "🔁" },
  { title: "Secure by Design", description: "256-bit encryption, MFA, and secure cloud infrastructure.", icon: "🔒" },
  { title: "Real Support, 24/7", description: "Talk to a bot—or a human. We’re always here for you.", icon: "💬" },
];

export default function FeaturesPage() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-gray-900 to-black text-white px-6 py-20 pt-28">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-16 bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text animate-pulse">All Features</h1>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {features.map((f) => (
            <div key={f.title} className="group bg-gradient-to-br from-gray-900 to-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <span className="text-3xl">{f.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold mb-1 group-hover:text-green-400 transition-colors duration-200">{f.title}</h2>
                  <p className="text-slate-400 text-sm">{f.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-20 text-center text-sm text-slate-500 space-y-2">
          <p>Founder & CEO: <strong>Mr. Dadi</strong></p>
          <p>Contact: <a href="tel:2035899774" className="underline text-blue-400">203-589-9774</a></p>
          <p>Email: <a href="mailto:dnave1@unh.newhaven.edu" className="underline text-blue-400">dnave1@unh.newhaven.edu</a></p>
        </div>
      </div>
      <Footer />
    </>
  );
}
