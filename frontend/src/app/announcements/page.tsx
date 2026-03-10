'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAnnouncements } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import ScrollReveal from '@/components/ScrollReveal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Megaphone, Pin, Calendar, Users, AlertTriangle, CalendarDays, Info } from 'lucide-react';
import clsx from 'clsx';

const tagConfig: Record<string, { color: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  Important: { color: 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20', icon: AlertTriangle },
  Event: { color: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20', icon: CalendarDays },
  General: { color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700', icon: Info },
};

export default function AnnouncementsPage() {
  const [activeTag, setActiveTag] = useState<string | undefined>();
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements', { tag: activeTag }],
    queryFn: () => fetchAnnouncements({ tag: activeTag }),
  });

  return (
    <div>
      <PageHeader
        title="Announcements & Updates"
        subtitle="Stay Informed"
        description="All the latest news, event updates, and important announcements from the E-Tech Department."
        gradient="from-amber-500 via-yellow-500 to-orange-500"
      />

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter tabs */}
          <div className="flex justify-center gap-2 mb-10">
            {[
              { key: undefined, label: 'All' },
              { key: 'Important', label: '🔴 Important' },
              { key: 'Event', label: '🔵 Events' },
              { key: 'General', label: '⚪ General' },
            ].map((tab) => (
              <button
                key={tab.key || 'all'}
                onClick={() => setActiveTag(tab.key)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
                  activeTag === tab.key
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <LoadingSpinner text="Loading announcements..." />
          ) : !announcements?.length ? (
            <EmptyState title="No announcements" description="Check back later for updates" icon={<Megaphone size={40} />} />
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {announcements.map((ann: any, i: number) => {
                  const config = tagConfig[ann.tag] || tagConfig.General;
                  const TagIcon = config.icon;
                  return (
                    <motion.div
                      key={ann.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                    >
                      <div className={clsx(
                        'group p-6 rounded-2xl bg-white dark:bg-gray-900 border hover:shadow-xl transition-all duration-500',
                        ann.is_pinned
                          ? 'border-amber-200 dark:border-amber-500/20 shadow-amber-500/5'
                          : 'border-gray-200 dark:border-gray-800'
                      )}>
                        <div className="flex items-start gap-4">
                          <div className={clsx('shrink-0 p-2.5 rounded-xl border', config.color)}>
                            <TagIcon size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border', config.color)}>
                                {ann.tag}
                              </span>
                              {ann.is_pinned === 1 && (
                                <span className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                                  <Pin size={12} /> Pinned
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                              {ann.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                              {ann.content}
                            </p>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(ann.published_at).toLocaleDateString('en-US', {
                                  weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
                                })}
                              </span>
                              {ann.club_name && (
                                <span className="flex items-center gap-1">
                                  <Users size={12} /> {ann.club_name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
