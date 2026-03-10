'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles,
  Loader2, AlertCircle, Gift, CheckCircle
} from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

function AuthPageInner() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', referral_code: '' });
  const { login, register, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pre-fill referral code from URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setForm(f => ({ ...f, referral_code: ref }));
      setMode('signup');
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.push('/profile');
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password, form.referral_code || undefined);
      }
      router.push('/profile');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm';

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                E-Tech Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-2xl shadow-black/5 dark:shadow-black/30 backdrop-blur-xl">
          {/* Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-8">
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={clsx(
                  'flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 relative',
                  mode === m
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                {mode === m && (
                  <motion.div
                    layoutId="auth-tab"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{m === 'login' ? 'Sign In' : 'Sign Up'}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {mode === 'login' ? 'Welcome back!' : 'Join the community'}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {mode === 'login'
                  ? 'Sign in to track your achievements and discover secrets'
                  : 'Create an account to unlock gamification features'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={handleChange}
                    className={clsx(inputClass, 'pr-11')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {mode === 'signup' && (
                  <div className="relative">
                    <Gift size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="referral_code"
                      placeholder="Referral code (optional)"
                      value={form.referral_code}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm"
                  >
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={clsx(
                    'w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2',
                    loading
                      ? 'bg-gray-400 cursor-wait'
                      : 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5'
                  )}
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                  ) : mode === 'login' ? (
                    <><Sparkles size={18} /> Sign In</>
                  ) : (
                    <><ArrowRight size={18} /> Create Account</>
                  )}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Fun tip */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <Sparkles size={12} className="text-amber-400" />
              Tip: This website has hidden easter eggs — can you find them all?
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>}>
      <AuthPageInner />
    </Suspense>
  );
}
