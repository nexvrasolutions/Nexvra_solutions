'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

type Step = 'request' | 'reset';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputClass =
    'w-full rounded-lg border border-black/10 bg-[#f8f8f8] px-3 py-3 outline-none transition focus:border-[#a4ff00]';

  async function requestCode(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Unable to send the code.');
      setNotice(`${data.message} Enter it below along with your new password.`);
      setStep('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
    setLoading(false);
  }

  async function resetPassword(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: code.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Unable to reset the password.');
      setNotice(`${data.message} Redirecting to sign in...`);
      setTimeout(() => router.replace('/admin/login'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-6 text-center">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-[#5c9400]">Nexvra</div>
          <h1 className="mt-3 text-2xl font-bold text-[#0a0a0a]">Reset your password</h1>
          <p className="mt-2 text-sm text-black/60">
            {step === 'request'
              ? 'Enter your admin email and we will send a 6-digit code to it.'
              : 'Enter the code from your email and choose a new password.'}
          </p>
        </div>

        {notice ? (
          <p role="status" className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            {notice}
          </p>
        ) : null}
        {error ? (
          <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        {step === 'request' ? (
          <form onSubmit={requestCode} className="space-y-5">
            <div>
              <label htmlFor="fp-email" className="mb-2 block text-sm font-medium text-black/70">
                Email
              </label>
              <input
                id="fp-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#0a0a0a] px-4 py-3 font-medium text-white transition hover:bg-black disabled:opacity-60"
            >
              {loading ? 'Sending code...' : 'Send reset code'}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-5">
            <div>
              <label htmlFor="fp-code" className="mb-2 block text-sm font-medium text-black/70">
                6-digit code
              </label>
              <input
                id="fp-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className={`${inputClass} tracking-[0.4em]`}
                placeholder="123456"
                required
              />
            </div>
            <div>
              <label htmlFor="fp-password" className="mb-2 block text-sm font-medium text-black/70">
                New password
              </label>
              <div className="relative">
                <input
                  id="fp-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-11`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-black/50 hover:text-black"
                >
                  {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-black/50">At least 8 characters.</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#0a0a0a] px-4 py-3 font-medium text-white transition hover:bg-black disabled:opacity-60"
            >
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
            <button
              type="button"
              onClick={() => { setStep('request'); setCode(''); setPassword(''); setError(''); setNotice(''); }}
              className="w-full text-sm text-black/60 hover:text-black"
            >
              Use a different email
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link href="/admin/login" className="text-sm font-medium text-[#5c9400] hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
