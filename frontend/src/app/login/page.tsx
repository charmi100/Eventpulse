'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('https://eventpulse-backend-b9ld.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      router.push('/');
    } catch {
      setError('Server error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060608] text-white relative overflow-hidden">

      {/* glow background */}
      <div className="absolute w-[600px] h-[600px] bg-pink-600/20 blur-[120px] rounded-full -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full bottom-0 right-0" />

      <div className="relative w-full max-w-sm p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">

        <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-white/40 mb-6">Sign in to continue</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-red-400 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-red-500 font-semibold hover:scale-[1.03] transition"
          >
            {loading ? 'Signing in...' : 'Login →'}
          </button>
        </form>

        <p className="text-sm text-white/40 mt-6 text-center">
          No account? <a href="/register" className="text-pink-500">Create one</a>
        </p>
      </div>
    </div>
  );
}