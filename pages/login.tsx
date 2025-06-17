
import { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center pt-24">
        <div className="bg-slate-800 p-8 rounded-xl w-80 shadow-lg">
          <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 rounded bg-slate-700"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-2 rounded bg-slate-700"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          <button className="w-full bg-green-500 hover:bg-green-600 py-2 rounded">Sign In</button>
        </div>
      </div>
      <Footer />
    </>
  );
}
