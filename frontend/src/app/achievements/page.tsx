'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAchievements, fetchClubs } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import ScrollReveal from '@/components/ScrollReveal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award, Calendar, Users, Building2 } from 'lucide-react';
import clsx from 'clsx';

export default function AchievementsPage() {
  const [filter, setFilter] = useState<'all' | 'Club' | 'Department'>('all');
  const { data: achievements, isLoading } = useQuery({ queryKey: ['achievements'], queryFn: () => fetchAchievements() });

  const filtered = achievements?.filter((a: any) => filter === 'all' || a.category === filter) || [];

  return (
    <div>
      <PageHeader
        title="Our Proudest Achievements"
        subtitle="Hall of Fame"
        description="Every milestone tells a story of dedication, teamwork, and excellence. Here's what our department has accomplished."
        gradient="from-amber-500 via-orange-500 to-red-500"
      />

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter tabs */}
          <div className="flex justify-center gap-2 mb-12">
            {[
              { key: 'all', label: 'All', icon: Trophy },
              { key: 'Club', label: 'Club Achievements', icon: Users },
              { key: 'Department', label: 'Department Achievements', icon: Building2 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={clsx(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                  filter === tab.key
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                )}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <LoadingSpinner text="Loading achievements..." />
          ) : filtered.length === 0 ? (
            <EmptyState title="No achievements found" icon={<Trophy size={40} />} />
          ) : (
            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 hidden md:block" />

              <AnimatePresence mode="popLayout">
                {filtered.map((ach: any, i: number) => (
                  <motion.div
                    key={ach.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="relative pl-0 md:pl-20 pb-8"
                  >
                    {/* Timeline dot */}
                    <div className="hidden md:flex absolute left-5 top-6 w-7 h-7 rounded-full bg-white dark:bg-gray-950 border-4 border-amber-500 items-center justify-center z-10">
                      {ach.is_featured ? (
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                    </div>

                    <div className={clsx(
                      'group p-6 rounded-2xl border bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-500',
                      ach.is_featured
                        ? 'border-amber-200 dark:border-amber-500/20 shadow-amber-500/5'
                        : 'border-gray-200 dark:border-gray-800'
                    )}>
                      <div className="flex items-start gap-4">
                        <div className={clsx(
                          'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
                          ach.category === 'Department'
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500'
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-500'
                        )}>
                          {ach.is_featured ? <Award size={22} /> : <Trophy size={22} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={clsx(
                              'px-2 py-0.5 rounded-full text-xs font-semibold',
                              ach.category === 'Department'
                                ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            )}>
                              {ach.category}
                            </span>
                            {ach.is_featured === 1 && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1">
                                <Star size={10} /> Featured
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {ach.title}
                          </h3>
                          {ach.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{ach.description}</p>
                          )}
                          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                            {ach.date && (
                              <span className="flex items-center gap-1">
                                <Calendar size={12} /> {new Date(ach.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </span>
                            )}
                            {ach.club_name && (
                              <span className="flex items-center gap-1">
                                <Users size={12} /> {ach.club_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
