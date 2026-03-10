'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDepartment } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import ScrollReveal from '@/components/ScrollReveal';
import LoadingSpinner from '@/components/LoadingSpinner';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Eye, Target, CheckCircle, GraduationCap, FlaskConical, Users, BookOpen, Award } from 'lucide-react';

export default function AboutPage() {
  const { data: dept, isLoading } = useQuery({ queryKey: ['department'], queryFn: fetchDepartment });

  if (isLoading) return <div className="pt-32"><LoadingSpinner text="Loading department info..." /></div>;

  const highlights: string[] = dept?.highlights || [];
  const stats = dept?.stats || {};

  return (
    <div>
      <PageHeader
        title="About the E-Tech Department"
        subtitle="Our Department"
        description={dept?.description || 'The Electronics & Technology Department is a hub of innovation, creativity, and technical excellence.'}
        gradient="from-blue-500 via-indigo-500 to-purple-500"
      />

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <AnimatedCounter end={stats.students || 850} suffix="+" label="Students" icon={<GraduationCap size={24} />} color="from-blue-500 to-indigo-500" />
            <AnimatedCounter end={stats.faculty || 45} suffix="+" label="Faculty" icon={<Users size={24} />} color="from-purple-500 to-pink-500" />
            <AnimatedCounter end={stats.labs || 12} label="Labs" icon={<FlaskConical size={24} />} color="from-emerald-500 to-teal-500" />
            <AnimatedCounter end={stats.publications || 200} suffix="+" label="Publications" icon={<BookOpen size={24} />} color="from-amber-500 to-orange-500" />
            <AnimatedCounter end={stats.placements_percent || 95} suffix="%" label="Placements" icon={<Award size={24} />} color="from-pink-500 to-rose-500" />
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full hover:shadow-xl transition-shadow duration-500">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6">
                  <Eye size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {dept?.vision || 'To be a globally recognized center of excellence in electronics and technology education, fostering innovation and producing industry-ready professionals.'}
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 h-full hover:shadow-xl transition-shadow duration-500">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
                  <Target size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {dept?.mission || 'To provide a dynamic and inclusive learning environment that empowers students with cutting-edge knowledge and leadership skills.'}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Department <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Highlights</span>
                </h2>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {highlights.map((highlight: string, i: number) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="flex items-start gap-4 p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mt-0.5">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{highlight}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
