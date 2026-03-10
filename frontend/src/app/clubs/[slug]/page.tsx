'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchClub } from '@/lib/api';
import MemberCard from '@/components/MemberCard';
import Lightbox from '@/components/Lightbox';
import ScrollReveal from '@/components/ScrollReveal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';
import {
  Users, Trophy, Image as ImageIcon, Link as LinkIcon, Calendar,
  Instagram, Twitter, Linkedin, Youtube, ArrowLeft, Star, Target, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const socialIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  instagram: Instagram, twitter: Twitter, linkedin: Linkedin, youtube: Youtube,
};

export default function ClubDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: club, isLoading, error } = useQuery({
    queryKey: ['club', slug],
    queryFn: () => fetchClub(slug),
  });

  if (isLoading) return <div className="pt-32"><LoadingSpinner text="Loading club details..." /></div>;
  if (error || !club) {
    return (
      <div className="pt-32 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Club not found</h1>
        <Link href="/clubs" className="text-indigo-600 dark:text-indigo-400 hover:underline">← Back to clubs</Link>
      </div>
    );
  }

  const activities = club.activities ? club.activities.split(',').map((a: string) => a.trim()) : [];

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 right-0 h-full" style={{ background: `linear-gradient(135deg, ${club.color}10, transparent 60%)` }} />
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ backgroundColor: club.color }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/clubs" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to all clubs
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-xl" style={{ backgroundColor: club.color }}>
              {club.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">{club.name}</h1>
              {club.tagline && <p className="text-xl italic mb-4" style={{ color: club.color }}>&ldquo;{club.tagline}&rdquo;</p>}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <span className="flex items-center gap-1"><Users size={16} /> {club.member_count} members</span>
                {club.founded_year && <span className="flex items-center gap-1"><Calendar size={16} /> Founded {club.founded_year}</span>}
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">{club.description}</p>
              
              {/* Social links */}
              {club.social_links && Object.keys(club.social_links).length > 0 && (
                <div className="flex gap-3 mt-6">
                  {Object.entries(club.social_links).map(([platform, url]) => {
                    const Icon = socialIcons[platform] || LinkIcon;
                    return (
                      <a key={platform} href={url as string} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-indigo-500 transition-all duration-300 hover:scale-110">
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Activities */}
      {activities.length > 0 && (
        <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Target size={28} style={{ color: club.color }} /> Core Activities
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map((activity: string, i: number) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-transparent hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: club.color }} />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{activity}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Members */}
      {club.members && club.members.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Users size={28} style={{ color: club.color }} /> Our Team
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {club.members.map((member: any, i: number) => (
                <MemberCard key={member.id} member={member} index={i} color={club.color} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Achievements */}
      {club.achievements && club.achievements.length > 0 && (
        <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <Trophy size={28} style={{ color: club.color }} /> Achievements
              </h2>
            </ScrollReveal>
            <div className="space-y-4">
              {club.achievements.map((ach: any, i: number) => (
                <ScrollReveal key={ach.id} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${club.color}15` }}>
                      <Star size={20} style={{ color: club.color }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{ach.title}</h3>
                      {ach.description && <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{ach.description}</p>}
                      {ach.date && <p className="text-xs text-gray-400 mt-2">{new Date(ach.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {club.gallery && club.gallery.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                <ImageIcon size={28} style={{ color: club.color }} /> Gallery
              </h2>
            </ScrollReveal>
            <Lightbox images={club.gallery} />
          </div>
        </section>
      )}
    </div>
  );
}
