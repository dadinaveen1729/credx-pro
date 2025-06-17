
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-black/80 backdrop-blur text-white px-6 py-4 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">CREDX</Link>
        <div className="space-x-6 text-sm">
          <Link href="/features">Features</Link>
          <Link href="/payments">Payments</Link>
          <Link href="/about">About</Link>
          <Link href="/support">Support</Link>
          <Link href="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
}
