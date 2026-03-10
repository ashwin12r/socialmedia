'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface Trail {
  x: number;
  y: number;
  id: number;
}

export default function InteractiveCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [spinDetected, setSpinDetected] = useState(false);
  const trailId = useRef(0);
  const angleHistory = useRef<number[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 28 });

  const onSpinDetected = useRef<(() => void) | null>(null);

  const setSpinCallback = useCallback((cb: () => void) => {
    onSpinDetected.current = cb;
  }, []);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);

      // Trail effect
      trailId.current++;
      setTrails(prev => [...prev.slice(-12), { x: e.clientX, y: e.clientY, id: trailId.current }]);

      // Spin detection: track angle changes
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        const angle = Math.atan2(dy, dx);
        angleHistory.current.push(angle);
        if (angleHistory.current.length > 30) {
          angleHistory.current.shift();
          // Check for a full spin (2*PI worth of angle changes)
          let totalAngle = 0;
          for (let i = 1; i < angleHistory.current.length; i++) {
            let diff = angleHistory.current[i] - angleHistory.current[i - 1];
            // Normalize
            while (diff > Math.PI) diff -= 2 * Math.PI;
            while (diff < -Math.PI) diff += 2 * Math.PI;
            totalAngle += diff;
          }
          if (Math.abs(totalAngle) > 2 * Math.PI * 1.5) {
            if (!spinDetected) {
              setSpinDetected(true);
              onSpinDetected.current?.();
              setTimeout(() => {
                setSpinDetected(false);
                angleHistory.current = [];
              }, 3000);
            }
          }
        }
      }
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    const handleDown = () => setIsClicking(true);
    const handleUp = () => setIsClicking(false);
    const handleLeave = () => setIsVisible(false);
    const handleEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mousedown', handleDown);
    document.addEventListener('mouseup', handleUp);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseenter', handleEnter);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseenter', handleEnter);
    };
  }, [cursorX, cursorY, spinDetected]);

  // Clean up old trails
  useEffect(() => {
    const timer = setInterval(() => {
      setTrails(prev => prev.slice(-8));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Expose spin callback globally for EasterEgg component
  useEffect(() => {
    (window as any).__cursorSetSpinCallback = setSpinCallback;
    return () => { delete (window as any).__cursorSetSpinCallback; };
  }, [setSpinCallback]);

  if (!isVisible) return null;

  return (
    <>
      {/* CSS to hide default cursor */}
      <style jsx global>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>

      {/* Trail dots */}
      {trails.map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0.6, scale: 0.5 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: t.x - 3,
            top: t.y - 3,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: `hsl(${235 + (i * 5)}, 80%, 65%)`,
          }}
        />
      ))}

      {/* Outer ring */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full border-2 border-indigo-400/50 mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovering ? 48 : isClicking ? 20 : 32,
          height: isHovering ? 48 : isClicking ? 20 : 32,
          borderColor: spinDetected ? 'rgba(236, 72, 153, 0.8)' : isHovering ? 'rgba(139, 92, 246, 0.6)' : 'rgba(99, 102, 241, 0.5)',
          rotate: spinDetected ? 360 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed pointer-events-none z-[9999] rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isClicking ? 8 : 6,
          height: isClicking ? 8 : 6,
          backgroundColor: spinDetected ? '#ec4899' : isHovering ? '#8b5cf6' : '#6366f1',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      />

      {/* Spin effect burst */}
      {spinDetected && (
        <motion.div
          className="fixed pointer-events-none z-[9997]"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ opacity: 0.8, scale: 0.5 }}
          animate={{ opacity: 0, scale: 3 }}
          transition={{ duration: 1 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500/30 to-purple-500/30 blur-xl" />
        </motion.div>
      )}
    </>
  );
}
