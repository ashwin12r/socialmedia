'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, Zap, Users, Trophy, Calendar, Star,
  ChevronRight, Megaphone, Code, Cpu, Shield, Brain, Palette, Share2
} from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import ClubCard from '@/components/ClubCard';
import SocialPostCard from '@/components/SocialPostCard';
import ScrollReveal from '@/components/ScrollReveal';
import ParticleBackground from '@/components/ParticleBackground';
import LoadingSpinner from '@/components/LoadingSpinner';
import { fetchClubs, fetchAnnouncements, fetchSocialPosts, fetchStats } from '@/lib/api';

export default function HomePage() {
  const { data: clubs, isLoading: clubsLoading } = useQuery({ queryKey: ['clubs'], queryFn: fetchClubs });
  const { data: announcements } = useQuery({ queryKey: ['announcements', { limit: 4 }], queryFn: () => fetchAnnouncements({ limit: 4 }) });
  const { data: socialPosts } = useQuery({ queryKey: ['social-posts', { limit: 6 }], queryFn: () => fetchSocialPosts({ limit: 6 }) });
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });

  return (
    <div className="relative">
      <ParticleBackground />

      {/* ═══════════════════ HERO SECTION ═══════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute top-1/4 left-1/4 w-64 h-64 border border-indigo-500/10 rounded-full" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 45, repeat: Infinity, ease: 'linear' }} className="absolute top-1/3 right-1/4 w-96 h-96 border border-purple-500/10 rounded-full" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] border border-pink-500/5 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8">
              <Sparkles size={16} className="animate-pulse" />
              Welcome to the Future of Tech Community
              <Sparkles size={16} className="animate-pulse" />
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
            <span className="text-gray-900 dark:text-white block">E-Tech</span>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent block animate-gradient-x">Social Hub</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Where innovation meets community. Explore our clubs, celebrate achievements, and be part of a vibrant tech ecosystem that shapes the future.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/clubs" className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-lg shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-500 hover:-translate-y-1 flex items-center gap-2">
              Explore Our Clubs
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className="px-8 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-lg hover:border-indigo-500 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-500 hover:-translate-y-1">
              About the Department
            </Link>
          </motion.div>

          {/* Floating icons */}
          <div className="absolute inset-0 pointer-events-none hidden lg:block">
            {[
              { Icon: Code, x: '10%', y: '20%', delay: 1 },
              { Icon: Cpu, x: '85%', y: '25%', delay: 1.5 },
              { Icon: Shield, x: '5%', y: '70%', delay: 2 },
              { Icon: Brain, x: '90%', y: '65%', delay: 2.5 },
              { Icon: Palette, x: '15%', y: '45%', delay: 1.8 },
              { Icon: Share2, x: '80%', y: '45%', delay: 1.3 },
            ].map(({ Icon, x, y, delay }, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.4, scale: 1 }} transition={{ delay, duration: 0.5, type: 'spring' }} className="absolute animate-float" style={{ left: x, top: y, animationDelay: `${delay}s` }}>
                <div className="p-3 rounded-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 shadow-xl">
                  <Icon size={24} className="text-indigo-500/60" />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2 text-gray-400">
              <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
              <ChevronRight size={20} className="rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ STATS SECTION ═══════════════════ */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedCounter end={stats?.clubs || 6} suffix="+" label="Active Clubs" icon={<Users size={24} />} color="from-indigo-500 to-purple-500" />
            <AnimatedCounter end={stats?.members || 200} suffix="+" label="Members" icon={<Star size={24} />} color="from-amber-500 to-orange-500" />
            <AnimatedCounter end={stats?.events || 50} suffix="+" label="Events Held" icon={<Calendar size={24} />} color="from-emerald-500 to-teal-500" />
            <AnimatedCounter end={stats?.achievements || 30} suffix="+" label="Achievements" icon={<Trophy size={24} />} color="from-pink-500 to-rose-500" />
          </div>
        </div>
      </section>

      {/* ═══════════════════ CLUBS HIGHLIGHT ═══════════════════ */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
                <Zap size={14} /> Our Community
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Explore Our <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Clubs</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">From coding to robotics, cybersecurity to design — find your tribe and build something amazing together.</p>
            </div>
          </ScrollReveal>
          {clubsLoading ? <LoadingSpinner text="Loading clubs..." /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs?.map((club: any, i: number) => <ClubCard key={club.id} club={club} index={i} />)}
            </div>
          )}
          <ScrollReveal delay={0.3}>
            <div className="text-center mt-12">
              <Link href="/clubs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group">
                View All Clubs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════ ANNOUNCEMENTS PREVIEW ═══════════════════ */}
      <section className="py-20 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">
                  <Megaphone size={14} /> Latest Updates
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Announcements</h2>
              </div>
              <Link href="/announcements" className="hidden sm:inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium hover:gap-2 transition-all">
                View all <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements?.map((ann: any, i: number) => (
              <ScrollReveal key={ann.id} delay={i * 0.1}>
                <div className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ann.tag === 'Important' ? 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400' : ann.tag === 'Event' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                      {ann.tag}
                    </div>
                    {ann.is_pinned === 1 && <span className="text-amber-500 text-xs font-medium">📌 Pinned</span>}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{ann.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{ann.content}</p>
                  <p className="text-xs text-gray-400 mt-3">
                    {new Date(ann.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {ann.club_name && ` • ${ann.club_name}`}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SOCIAL MEDIA POSTS ═══════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 text-sm font-medium mb-4">
                <Share2 size={14} /> Stay Connected
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Latest from <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Social Media</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialPosts?.map((post: any, i: number) => <SocialPostCard key={post.id} post={post} index={i} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA SECTION ═══════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
              <div className="relative z-10 px-8 py-16 md:py-20 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Got an Achievement to Share?</h2>
                <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">We celebrate every win — big or small. Let us know about your achievements and we&apos;ll feature them for the whole department to see!</p>
                <Link href="/submit-achievement" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-indigo-600 font-semibold text-lg shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:-translate-y-1 group">
                  Submit Your Achievement <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
