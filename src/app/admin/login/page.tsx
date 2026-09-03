'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('bte-admin-token', data.token);
        localStorage.setItem('bte-admin-user', data.username);
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Access Denied: Invalid credentials.');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0F2341 50%, #0A1628 100%)' }}>
      <div className="w-full max-w-md px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ backgroundColor: '#00D4AA' }}>
              <span className="text-white text-2xl font-bold">BTE</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Blockchain Trust Enterprise</h1>
            <p className="text-sm text-slate-500 mt-1">Supervisor Control Terminal</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#00D4AA] focus:border-[#00D4AA] outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: loading ? '#009977' : '#00D4AA' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#00BF99'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#00D4AA'; }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Establishing Connection...
                </span>
              ) : (
                'Establish Connection Securely'
              )}
            </button>
          </form>

          <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Authorized personnel only. Contact your administrator for access credentials.
            </p>
          </div>

          {/* Back to site */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-slate-500 hover:text-[#00D4AA] transition-colors">
              &larr; Back to public site
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
