'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import PageHeader from '@/components/PageHeader';
import {
  User, Mail, BookOpen, Building2, Edit3, Save, X, Trophy, Share2,
  Copy, CheckCircle, Star, Egg, Target, Link as LinkIcon, Loader2
} from 'lucide-react';
import clsx from 'clsx';

const TOTAL_EASTER_EGGS = 7;

export default function ProfilePage() {
  const { user, isLoading, updateProfile, logout, refreshUser } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', bio: '', year_of_study: '', department: '', avatar_url: '' });

  useEffect(() => {
    if (!isLoading && !user) router.push('/auth');
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        bio: user.bio || '',
        year_of_study: user.year_of_study || '',
        department: user.department || '',
        avatar_url: user.avatar_url || '',
      });
      refreshUser();
    }
  }, [user?.id]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  const eggCount = user.easter_eggs_found?.length || 0;
  const eggPercent = Math.round((eggCount / TOTAL_EASTER_EGGS) * 100);
  const profilePercent = user.profile_percent || 0;

  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/auth?ref=${user.referral_code}`
    : '';

  const copyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      setEditing(false);
    } catch { /* ignore */ }
    setSaving(false);
  };

  // XP level calculation
  const level = Math.floor(user.xp_points / 100) + 1;
  const xpInLevel = user.xp_points % 100;

  const statCards = [
    { label: 'XP Points', value: user.xp_points, icon: Star, color: 'from-amber-500 to-yellow-500' },
    { label: 'Level', value: level, icon: Target, color: 'from-indigo-500 to-purple-500' },
    { label: 'Easter Eggs', value: `${eggCount}/${TOTAL_EASTER_EGGS}`, icon: Egg, color: 'from-pink-500 to-rose-500' },
    { label: 'Achievements', value: user.achievements_submitted || 0, icon: Trophy, color: 'from-emerald-500 to-teal-500' },
    { label: 'Referrals', value: user.referrals_count || 0, icon: Share2, color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div>
      <PageHeader
        title="Your Profile"
        subtitle={`Level ${level} Explorer`}
        description="Track your progress, discover easter eggs, and climb the leaderboard."
        gradient="from-indigo-500 via-purple-500 to-pink-500"
      />

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* ── Profile Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <span className="text-xs bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">
                    Level {level}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                    <Edit3 size={14} /> Edit
                  </button>
                ) : (
                  <>
                    <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-all">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                    </button>
                    <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all">
                      <X size={14} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {editing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'name', label: 'Name', icon: User },
                  { name: 'year_of_study', label: 'Year of Study', icon: BookOpen },
                  { name: 'department', label: 'Department', icon: Building2 },
                  { name: 'avatar_url', label: 'Avatar URL', icon: LinkIcon },
                ].map(f => (
                  <div key={f.name}>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">{f.label}</label>
                    <input
                      value={(form as any)[f.name]}
                      onChange={e => setForm(prev => ({ ...prev, [f.name]: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                {[
                  { label: 'Department', value: user.department || 'Not set' },
                  { label: 'Year', value: user.year_of_study || 'Not set' },
                  { label: 'Member since', value: new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                    <p className="font-medium text-gray-900 dark:text-white">{f.value}</p>
                  </div>
                ))}
                {user.bio && <p className="col-span-full text-gray-600 dark:text-gray-400 mt-1">{user.bio}</p>}
              </div>
            )}

            {/* Profile completion bar */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">Profile completion</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{profilePercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profilePercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>
            </div>
          </motion.div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {statCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-center"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2`}>
                  <s.icon size={18} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* ── XP Progress ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
          >
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Target size={18} className="text-indigo-500" /> Level Progress
            </h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Level {level}</span>
              <span className="text-gray-500">Level {level + 1}</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpInLevel}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">{xpInLevel}/100 XP to next level</p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { action: 'Discover easter egg', xp: '+25 XP' },
                { action: 'Complete profile', xp: '+50 XP' },
                { action: 'Submit achievement', xp: '+25 XP' },
                { action: 'Refer a friend', xp: '+50 XP' },
              ].map(x => (
                <div key={x.action} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                  <span className="font-bold text-emerald-500">{x.xp}</span>
                  <p className="text-gray-500 mt-0.5">{x.action}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Easter Egg Progress ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
          >
            <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Egg size={18} className="text-pink-500" /> Easter Egg Hunt
            </h3>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Found: {eggCount} / {TOTAL_EASTER_EGGS}</span>
              <span className="font-bold text-pink-500">{eggPercent}%</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${eggPercent}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'konami', name: '🎮 The Classic Code', hint: 'Remember the Konami Code? ↑↑↓↓←→←→BA' },
                { id: 'logo_click', name: '🖱️ Persistent Clicker', hint: 'The logo holds a secret for the persistent...' },
                { id: 'dark_secret', name: '🌙 Night Owl', hint: 'Toggle the lights... a few more times.' },
                { id: 'matrix', name: '💊 Red Pill', hint: 'Type "matrix" anywhere on the site.' },
                { id: 'footer_year', name: '📅 Time Traveler', hint: 'The footer has more than meets the eye...' },
                { id: 'spin_cursor', name: '🌀 Dizzy Dance', hint: 'Spin your mouse in circles really fast...' },
                { id: 'secret_page', name: '🗝️ Hidden Room', hint: 'Visit /secret — if you dare.' },
              ].map(egg => {
                const found = user.easter_eggs_found?.includes(egg.id);
                return (
                  <div
                    key={egg.id}
                    className={clsx(
                      'p-3 rounded-xl border transition-all',
                      found
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {found ? (
                        <CheckCircle size={16} className="text-emerald-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                      )}
                      <span className={clsx('text-sm font-semibold', found ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300')}>
                        {egg.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">{found ? 'Discovered! +25 XP' : egg.hint}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Referral Section ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl p-8 text-white"
          >
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Share2 size={20} /> Invite Friends, Earn XP
            </h3>
            <p className="text-white/80 text-sm mb-4">
              Share your referral link. You get +50 XP for each friend who joins. They get +25 XP bonus!
            </p>
            <div className="flex gap-2">
              <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-sm font-mono truncate border border-white/20">
                {referralUrl}
              </div>
              <button
                onClick={copyReferral}
                className="shrink-0 px-4 py-3 rounded-xl bg-white text-indigo-600 font-bold text-sm hover:bg-white/90 transition-all flex items-center gap-1.5"
              >
                {copied ? <><CheckCircle size={16} /> Copied!</> : <><Copy size={16} /> Copy</>}
              </button>
            </div>
            <p className="text-white/60 text-xs mt-3">
              Your code: <span className="font-mono font-bold text-white/90">{user.referral_code}</span> — {user.referrals_count || 0} friends joined
            </p>
          </motion.div>

          {/* Logout */}
          <div className="text-center">
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
