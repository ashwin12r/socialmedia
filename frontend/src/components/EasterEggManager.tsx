'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOptionalAuth } from '@/lib/auth';
import { Egg, Star, X } from 'lucide-react';

// ═══════════════════════════════════════════════════════
// EASTER EGG DEFINITIONS:
// 1. konami       — Konami code: ↑↑↓↓←→←→BA
// 2. logo_click   — Click the navbar logo 7 times
// 3. dark_secret  — Toggle dark/light 5 times rapidly
// 4. matrix       — Type "matrix" anywhere on the site
// 5. footer_year  — Click the year in footer 3 times
// 6. spin_cursor  — Spin mouse in fast circles
// 7. secret_page  — Visit /secret
// ═══════════════════════════════════════════════════════

interface Toast {
  id: string;
  eggName: string;
  xp: number;
}

export default function EasterEggManager() {
  const auth = useOptionalAuth();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [matrixMode, setMatrixMode] = useState(false);

  // Keep a local set of discovered eggs (for non-logged-in and logged-in users)
  const localEggs = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Sync from auth
    if (auth?.user?.easter_eggs_found) {
      auth.user.easter_eggs_found.forEach(e => localEggs.current.add(e));
    }
  }, [auth?.user?.easter_eggs_found]);

  const eggNames: Record<string, string> = {
    konami: '🎮 The Classic Code',
    logo_click: '🖱️ Persistent Clicker',
    dark_secret: '🌙 Night Owl',
    matrix: '💊 Red Pill',
    footer_year: '📅 Time Traveler',
    spin_cursor: '🌀 Dizzy Dance',
    secret_page: '🗝️ Hidden Room',
  };

  const triggerEgg = useCallback(async (eggId: string) => {
    if (localEggs.current.has(eggId)) return;
    localEggs.current.add(eggId);

    let xp = 25;
    if (auth?.user) {
      const result = await auth.discoverEasterEgg(eggId);
      if (result) xp = result.xpEarned;
      else return; // Already found on server
    }

    // Show toast
    const toast: Toast = { id: eggId, eggName: eggNames[eggId] || eggId, xp };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== eggId)), 4000);

    // Special effects per egg
    if (eggId === 'matrix') {
      setMatrixMode(true);
      setTimeout(() => setMatrixMode(false), 5000);
    }
  }, [auth]);

  // ── 1. Konami Code ──
  useEffect(() => {
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.key === konamiSequence[index] || e.key.toLowerCase() === konamiSequence[index]) {
        index++;
        if (index === konamiSequence.length) {
          triggerEgg('konami');
          index = 0;
        }
      } else {
        index = 0;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [triggerEgg]);

  // ── 2. Logo Click (7 times) ──
  useEffect(() => {
    let clicks = 0;
    let timer: NodeJS.Timeout;
    const handler = () => {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => (clicks = 0), 3000);
      if (clicks >= 7) {
        triggerEgg('logo_click');
        clicks = 0;
      }
    };
    // Attach to nav logo
    const logo = document.querySelector('[data-logo]');
    logo?.addEventListener('click', handler);
    return () => logo?.removeEventListener('click', handler);
  }, [triggerEgg]);

  // ── 3. Dark mode toggle 5 times ──
  useEffect(() => {
    let toggles = 0;
    let timer: NodeJS.Timeout;
    const handler = () => {
      toggles++;
      clearTimeout(timer);
      timer = setTimeout(() => (toggles = 0), 4000);
      if (toggles >= 5) {
        triggerEgg('dark_secret');
        toggles = 0;
      }
    };
    const btn = document.querySelector('[data-theme-toggle]');
    btn?.addEventListener('click', handler);
    return () => btn?.removeEventListener('click', handler);
  }, [triggerEgg]);

  // ── 4. Type "matrix" anywhere ──
  useEffect(() => {
    let buffer = '';
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;
      buffer += e.key.toLowerCase();
      if (buffer.length > 20) buffer = buffer.slice(-20);
      if (buffer.includes('matrix')) {
        triggerEgg('matrix');
        buffer = '';
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [triggerEgg]);

  // ── 5. Footer year click (3 times) ──
  useEffect(() => {
    let clicks = 0;
    let timer: NodeJS.Timeout;
    const handler = () => {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => (clicks = 0), 2000);
      if (clicks >= 3) {
        triggerEgg('footer_year');
        clicks = 0;
      }
    };
    const el = document.querySelector('[data-footer-year]');
    el?.addEventListener('click', handler);
    return () => el?.removeEventListener('click', handler);
  }, [triggerEgg]);

  // ── 6. Spin cursor (via InteractiveCursor callback) ──
  useEffect(() => {
    const setCb = (window as any).__cursorSetSpinCallback;
    if (setCb) {
      setCb(() => triggerEgg('spin_cursor'));
    }
    // Retry after a tick in case cursor mounts later
    const t = setTimeout(() => {
      const setCb2 = (window as any).__cursorSetSpinCallback;
      if (setCb2) setCb2(() => triggerEgg('spin_cursor'));
    }, 2000);
    return () => clearTimeout(t);
  }, [triggerEgg]);

  return (
    <>
      {/* Easter egg toast notifications */}
      <div className="fixed bottom-6 right-6 z-[10000] flex flex-col gap-3">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl p-4 shadow-2xl shadow-purple-500/30 min-w-[280px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Egg size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Easter Egg Found!</p>
                  <p className="text-white/80 text-xs">{toast.eggName}</p>
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
                  <Star size={12} className="text-yellow-300" />
                  <span className="font-bold text-xs">+{toast.xp} XP</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Matrix rain effect */}
      <AnimatePresence>
        {matrixMode && <MatrixRain />}
      </AnimatePresence>
    </>
  );
}

// ── Matrix Rain Effect ──
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ETECHソシアルハブ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9995] pointer-events-none"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
}
