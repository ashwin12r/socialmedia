'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOptionalAuth } from '@/lib/auth';
import { Egg, Trophy, Star, Share2, ChevronUp, User, Target, X } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

const TOTAL_EGGS = 7;

export default function GamificationWidget() {
  const auth = useOptionalAuth();
  const [open, setOpen] = useState(false);

  if (!auth?.user) {
    // Show a subtle nudge to log in
    return (
      <div className="fixed bottom-6 left-6 z-[9990] hidden lg:block">
        <Link href="/auth">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center gap-2 text-sm font-medium"
          >
            <Egg size={18} />
            <span>Find Easter Eggs!</span>
          </motion.div>
        </Link>
      </div>
    );
  }

  const eggCount = auth.user.easter_eggs_found?.length || 0;
  const eggPercent = Math.round((eggCount / TOTAL_EGGS) * 100);
  const level = Math.floor(auth.user.xp_points / 100) + 1;

  return (
    <div className="fixed bottom-6 left-6 z-[9990] hidden lg:block">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute bottom-16 left-0 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold">
                    {auth.user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{auth.user.name}</p>
                    <p className="text-white/70 text-xs">Level {level}</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/20 transition-colors">
                  <X size={14} />
                </button>
              </div>
              {/* XP Bar */}
              <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-white/80 transition-all" style={{ width: `${auth.user.xp_points % 100}%` }} />
              </div>
              <p className="text-white/60 text-[10px] mt-1">{auth.user.xp_points} XP total</p>
            </div>

            {/* Stats */}
            <div className="p-4 space-y-3">
              {/* Easter eggs */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <Egg size={12} className="text-pink-500" /> Easter Eggs
                  </span>
                  <span className="font-bold text-pink-500">{eggCount}/{TOTAL_EGGS}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all" style={{ width: `${eggPercent}%` }} />
                </div>
              </div>

              {/* Profile */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                    <User size={12} className="text-indigo-500" /> Profile
                  </span>
                  <span className="font-bold text-indigo-500">{auth.user.profile_percent || 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all" style={{ width: `${auth.user.profile_percent || 0}%` }} />
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { icon: Trophy, label: 'Achieved', value: auth.user.achievements_submitted || 0, color: 'text-amber-500' },
                  { icon: Share2, label: 'Referrals', value: auth.user.referrals_count || 0, color: 'text-blue-500' },
                  { icon: Star, label: 'XP', value: auth.user.xp_points, color: 'text-yellow-500' },
                ].map(s => (
                  <div key={s.label} className="text-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <s.icon size={14} className={clsx('mx-auto mb-0.5', s.color)} />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{s.value}</p>
                    <p className="text-[10px] text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block text-center py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              >
                View Full Profile →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={clsx(
          'relative flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-white text-sm font-medium transition-all',
          'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 shadow-indigo-500/25'
        )}
      >
        <Target size={18} />
        <span>Lv.{level}</span>
        <div className="w-px h-4 bg-white/30" />
        <span className="flex items-center gap-1">
          <Egg size={14} /> {eggCount}/{TOTAL_EGGS}
        </span>
        <ChevronUp size={14} className={clsx('transition-transform', open && 'rotate-180')} />

        {/* Pulse when new egg found */}
        {eggCount > 0 && eggCount < TOTAL_EGGS && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-400"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
}
