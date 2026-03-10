'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import ScrollReveal from '@/components/ScrollReveal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, BookOpen, Sparkles, Guitar, Palette, Code, Globe, Award } from 'lucide-react';
import clsx from 'clsx';

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Workshop: Code, Hackathon: Sparkles, Seminar: BookOpen, Cultural: Guitar,
  Creative: Palette, 'Skill Development': Award, Outreach: Globe, Sports: Users,
};

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'technical' | 'non-technical'>('all');
  const { data: activities, isLoading } = useQuery({ queryKey: ['activities'], queryFn: () => fetchActivities() });

  const filtered = activities?.filter((a: any) => activeTab === 'all' || a.type === activeTab) || [];

  const techActivities = filtered.filter((a: any) => a.type === 'technical');
  const nonTechActivities = filtered.filter((a: any) => a.type === 'non-technical');

  return (
    <div>
      <PageHeader
        title="Co-Curricular & Extra-Curricular Activities"
        subtitle="Activities"
        description="From hackathons and workshops to cultural fests and community outreach — there's always something exciting happening."
        gradient="from-emerald-500 via-teal-500 to-cyan-500"
      />

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab buttons */}
          <div className="flex justify-center gap-2 mb-12">
            {[
              { key: 'all', label: 'All Activities' },
              { key: 'technical', label: '🔧 Technical' },
              { key: 'non-technical', label: '🎨 Non-Technical' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={clsx(
                  'px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300',
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <LoadingSpinner text="Loading activities..." />
          ) : filtered.length === 0 ? (
            <EmptyState title="No activities found" icon={<Calendar size={40} />} />
          ) : (
            <div className="space-y-16">
              {/* Technical */}
              {(activeTab === 'all' || activeTab === 'technical') && techActivities.length > 0 && (
                <div>
                  <ScrollReveal>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        <Code size={24} />
                      </div>
                      Technical Activities
                    </h2>
                  </ScrollReveal>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {techActivities.map((activity: any, i: number) => (
                        <ActivityCard key={activity.id} activity={activity} index={i} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Non-Technical */}
              {(activeTab === 'all' || activeTab === 'non-technical') && nonTechActivities.length > 0 && (
                <div>
                  <ScrollReveal>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                        <Sparkles size={24} />
                      </div>
                      Non-Technical Activities
                    </h2>
                  </ScrollReveal>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {nonTechActivities.map((activity: any, i: number) => (
                        <ActivityCard key={activity.id} activity={activity} index={i} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ActivityCard({ activity, index }: { activity: any; index: number }) {
  const CategoryIcon = categoryIcons[activity.category] || Calendar;
  const isTechnical = activity.type === 'technical';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div className="h-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
        {/* Header gradient */}
        <div className={`h-2 ${isTechnical ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-pink-500 to-rose-500'}`} />

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${isTechnical ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500' : 'bg-pink-50 dark:bg-pink-500/10 text-pink-500'}`}>
              <CategoryIcon size={22} />
            </div>
            {activity.category && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isTechnical ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400'}`}>
                {activity.category}
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {activity.title}
          </h3>
          {activity.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-3">{activity.description}</p>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            {activity.date && (
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {new Date(activity.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {activity.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {activity.location}
              </span>
            )}
            {activity.club_name && (
              <span className="flex items-center gap-1">
                <Users size={12} /> {activity.club_name}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
