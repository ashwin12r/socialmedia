'use client';

import { motion } from 'framer-motion';
import { User, Linkedin, Github, Instagram, Mail } from 'lucide-react';
import clsx from 'clsx';

interface MemberCardProps {
  member: {
    name: string;
    role: string;
    title?: string;
    bio?: string;
    avatar_url?: string;
    year_of_study?: string;
    linkedin_url?: string;
    github_url?: string;
    instagram_url?: string;
    email?: string;
  };
  index?: number;
  color?: string;
}

export default function MemberCard({ member, index = 0, color = '#6366f1' }: MemberCardProps) {
  const roleColors: Record<string, string> = {
    Lead: 'from-amber-400 to-orange-500',
    'Co-Lead': 'from-indigo-400 to-purple-500',
    Member: 'from-emerald-400 to-teal-500',
  };

  const roleGradient = roleColors[member.role] || roleColors.Member;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group"
    >
      <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
        {/* Role badge glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${roleGradient} opacity-5 blur-2xl transition-opacity group-hover:opacity-10`} />

        <div className="relative z-10">
          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={32} className="text-gray-400" />
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${roleGradient} text-white text-[10px] font-bold uppercase tracking-wider shadow-lg`}>
                {member.role}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="text-center">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-0.5">
              {member.name}
            </h3>
            {member.title && (
              <p className="text-sm font-medium mb-2" style={{ color }}>
                {member.title}
              </p>
            )}
            {member.year_of_study && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                {member.year_of_study}
              </p>
            )}
            {member.bio && (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4">
                {member.bio}
              </p>
            )}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {member.linkedin_url && (
              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin size={14} />
              </a>
            )}
            {member.github_url && (
              <a href={member.github_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github size={14} />
              </a>
            )}
            {member.instagram_url && (
              <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram size={14} />
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-red-500 transition-colors">
                <Mail size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
