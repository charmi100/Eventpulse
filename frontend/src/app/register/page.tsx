'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://eventpulse-backend-b9ld.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
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
    <div className="min-h-screen grid md:grid-cols-2 bg-[#050507] text-white">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center px-16 bg-gradient-to-br from-purple-900/40 to-black">

        <h1 className="text-5xl font-bold leading-tight mb-6">
          Discover.<br />Create.<br />
          <span className="text-purple-400">Experience.</span>
        </h1>

        <p className="text-white/40 max-w-sm">
          EventPulse helps you explore what's happening around you and create unforgettable moments.
        </p>

        <div className="mt-10 flex gap-4 text-sm text-white/30">
          <span>📍 Live events</span>
          <span>⚡ Real-time</span>
          <span>⭐ Reviews</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6">

        <div className="w-full max-w-md">

          <h2 className="text-3xl font-semibold mb-2">Create account</h2>
          <p className="text-white/40 mb-6">Join EventPulse</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              required
            />

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-purple-500 outline-none"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 font-semibold hover:scale-[1.03] transition"
            >
              {loading ? 'Creating...' : 'Create Account →'}
            </button>
          </form>

          <p className="text-sm text-white/40 mt-6 text-center">
            Already have an account? <a href="/login" className="text-purple-400">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}