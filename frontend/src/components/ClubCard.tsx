'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Users, Code, Cpu, Shield, Brain, Palette, Share2 } from 'lucide-react';
import clsx from 'clsx';

const iconMap: Record<string, any> = {
  Users, Code, Cpu, Shield, Brain, Palette, Share2,
};

interface ClubCardProps {
  club: {
    slug: string;
    name: string;
    tagline?: string;
    description?: string;
    color?: string;
    icon?: string;
    member_count?: number;
  };
  index?: number;
  compact?: boolean;
}

export default function ClubCard({ club, index = 0, compact = false }: ClubCardProps) {
  const Icon = iconMap[club.icon || 'Users'] || Users;
  const color = club.color || '#6366f1';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={club.slug === 'social-media-club' ? '/social-media-club' : `/clubs/${club.slug}`}>
        <div className={clsx(
          'group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden transition-all duration-500',
          'hover:shadow-2xl hover:-translate-y-2 hover:border-transparent',
          compact ? 'p-5' : 'p-6 md:p-8'
        )}>
          {/* Hover gradient background */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
            style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
          />

          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon size={24} color={color} />
              </div>
              <ArrowUpRight
                size={20}
                className="text-gray-400 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
              style={{ WebkitTextFillColor: undefined }}
            >
              <span className="group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent"
                style={{ backgroundImage: `linear-gradient(to right, ${color}, ${color}cc)` } as React.CSSProperties}>
                {club.name}
              </span>
            </h3>

            {club.tagline && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 italic">
                &ldquo;{club.tagline}&rdquo;
              </p>
            )}

            {!compact && club.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                {club.description}
              </p>
            )}

            {club.member_count !== undefined && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                <Users size={14} />
                <span>{club.member_count} members</span>
              </div>
            )}
          </div>

          {/* Bottom glow */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            style={{ backgroundColor: color }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
