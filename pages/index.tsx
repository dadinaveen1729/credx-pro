
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 to-black text-white flex flex-col items-center justify-center pt-24">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">The Future of Credit<br/>In Your Pocket</h1>
        <p className="text-slate-300 text-lg md:text-2xl max-w-2xl text-center mb-10">
          Manage cards, pay bills, earn rewards, and access instant credit. One elegant app.
        </p>
        <Link href="/features" className="bg-green-500 hover:bg-green-600 transition px-8 py-3 rounded-full font-semibold">
          Explore Features
        </Link>
      </main>
      <Footer />
    </>
  );
}
