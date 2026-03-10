'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchClub, fetchSocialPosts } from '@/lib/api';
import MemberCard from '@/components/MemberCard';
import SocialPostCard from '@/components/SocialPostCard';
import Lightbox from '@/components/Lightbox';
import ScrollReveal from '@/components/ScrollReveal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';
import { Share2, Eye, Target, Users, Trophy, Image as ImageIcon, Star, Sparkles, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

export default function SocialMediaClubPage() {
  const { data: club, isLoading } = useQuery({
    queryKey: ['club', 'social-media-club'],
    queryFn: () => fetchClub('social-media-club'),
  });
  const { data: socialPosts } = useQuery({
    queryKey: ['social-posts', { club_id: 'club-smc' }],
    queryFn: () => fetchSocialPosts({ club_id: 'club-smc', limit: 6 }),
  });

  if (isLoading) return <div className="pt-32"><LoadingSpinner text="Loading Social Media Club..." /></div>;

  const members = club?.members || [];
  const leads = members.filter((m: any) => m.role === 'Lead');
  const coLeads = members.filter((m: any) => m.role === 'Co-Lead');
  const regularMembers = members.filter((m: any) => m.role === 'Member');

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-indigo-500/5" />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 blur-3xl" />
          <motion.div animate={{ scale: [1, 0.8, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 mb-6 shadow-2xl shadow-purple-500/25">
              <Share2 size={40} className="text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Social Media <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Club</span>
            </h1>
            {club?.tagline && <p className="text-xl text-gray-500 dark:text-gray-400 italic mb-6">&ldquo;{club.tagline}&rdquo;</p>}
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">{club?.description}</p>

            <div className="flex justify-center gap-4 mt-8">
              {[
                { icon: Instagram, color: 'hover:text-pink-500', label: 'Instagram' },
                { icon: Twitter, color: 'hover:text-blue-400', label: 'Twitter' },
                { icon: Linkedin, color: 'hover:text-blue-600', label: 'LinkedIn' },
                { icon: Youtube, color: 'hover:text-red-500', label: 'YouTube' },
              ].map((social, i) => (
                <motion.a key={i} href="#" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}>
                  <social.icon size={22} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full hover:shadow-xl transition-shadow duration-500">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-6">
                  <Eye size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To be the most impactful and creative digital presence in the academic world, setting benchmarks for student-led content creation and social media management.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full hover:shadow-xl transition-shadow duration-500">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-6">
                  <Target size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  To amplify the voices of our department, celebrate achievements, foster community engagement, and train the next generation of digital creators through hands-on experience.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
                <Users size={14} /> The Team
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Meet Our Members</h2>
            </div>
          </ScrollReveal>

          {/* Leads */}
          {leads.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-4 flex items-center gap-2">
                <Star size={18} /> Leadership
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {leads.map((m: any, i: number) => <MemberCard key={m.id} member={m} index={i} color="#ec4899" />)}
              </div>
            </div>
          )}

          {/* Co-Leads */}
          {coLeads.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                <Sparkles size={18} /> Co-Leadership
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {coLeads.map((m: any, i: number) => <MemberCard key={m.id} member={m} index={i} color="#ec4899" />)}
              </div>
            </div>
          )}

          {/* Members */}
          {regularMembers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                <Users size={18} /> Members
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {regularMembers.map((m: any, i: number) => <MemberCard key={m.id} member={m} index={i} color="#ec4899" />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Achievements */}
      {club?.achievements && club.achievements.length > 0 && (
        <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium mb-4">
                  <Trophy size={14} /> Milestones
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Our Achievements</h2>
              </div>
            </ScrollReveal>
            <div className="space-y-4 max-w-3xl mx-auto">
              {club.achievements.map((ach: any, i: number) => (
                <ScrollReveal key={ach.id} delay={i * 0.1}>
                  <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                      <Trophy size={20} className="text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{ach.title}</h3>
                      {ach.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ach.description}</p>}
                      {ach.date && <p className="text-xs text-gray-400 mt-2">{new Date(ach.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {club?.gallery && club.gallery.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 text-sm font-medium mb-4">
                  <ImageIcon size={14} /> Memories
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Gallery</h2>
              </div>
            </ScrollReveal>
            <Lightbox images={club.gallery} />
          </div>
        </section>
      )}

      {/* Latest Social Posts */}
      {socialPosts && socialPosts.length > 0 && (
        <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-4">
                  <Share2 size={14} /> Our Feed
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Latest Posts</h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialPosts.map((post: any, i: number) => (
                <SocialPostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
