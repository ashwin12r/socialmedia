'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useOptionalAuth } from '@/lib/auth';
import { Sparkles, Lock, ArrowLeft, Trophy, Egg } from 'lucide-react';
import Link from 'next/link';

export default function SecretPage() {
  const auth = useOptionalAuth();
  const [triggered, setTriggered] = useState(false);
  const [stars, setStars] = useState<{ x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random stars
    const s = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setStars(s);

    // Trigger the easter egg
    if (auth?.user) {
      auth.discoverEasterEgg('secret_page');
    }
    setTriggered(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950">
      {/* Starfield */}
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.delay }}
        />
      ))}

      {/* Nebula glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative z-10 text-center max-w-lg mx-auto px-6"
      >
        {/* Spinning egg icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/40"
        >
          <Egg size={48} className="text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-black text-white mb-4"
        >
          You Found The{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Hidden Room
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-400 mb-4 text-lg"
        >
          Congratulations, explorer! Not many find their way here. 🎉
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-medium mb-8"
        >
          <Sparkles size={16} /> Easter Egg #7 — Secret Page Discovered! +25 XP
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left mb-8"
        >
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Trophy size={18} className="text-amber-400" /> Did you know?
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• The first computer programmer was Ada Lovelace (1843)</li>
            <li>• The name "bug" came from a real bug found in a computer (1947)</li>
            <li>• The E-Tech Social Hub was built with Next.js, Express.js & SQLite</li>
            <li>• There are 7 easter eggs hidden across this website</li>
            <li>• This page has its own starfield generated with pure CSS & Framer Motion</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all border border-white/10"
          >
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </motion.div>

        {!auth?.user && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-6 text-xs text-gray-500"
          >
            <Link href="/auth" className="text-indigo-400 hover:underline">Sign in</Link> to save this easter egg to your profile!
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
