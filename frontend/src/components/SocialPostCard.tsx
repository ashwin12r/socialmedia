'use client';

import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Youtube, ExternalLink, Heart, MessageCircle, Share2 } from 'lucide-react';
import clsx from 'clsx';

const platformConfig: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string; bg: string }> = {
  Instagram: { icon: Instagram, color: 'text-pink-500', bg: 'from-pink-500 to-purple-600' },
  Twitter: { icon: Twitter, color: 'text-blue-400', bg: 'from-blue-400 to-blue-600' },
  LinkedIn: { icon: Linkedin, color: 'text-blue-600', bg: 'from-blue-500 to-blue-700' },
  YouTube: { icon: Youtube, color: 'text-red-500', bg: 'from-red-500 to-red-700' },
};

interface SocialPostCardProps {
  post: {
    id: string;
    platform: string;
    caption?: string;
    image_url?: string;
    post_url?: string;
    club_name?: string;
    posted_at?: string;
  };
  index?: number;
}

export default function SocialPostCard({ post, index = 0 }: SocialPostCardProps) {
  const config = platformConfig[post.platform] || platformConfig.Instagram;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
        {/* Post Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.bg} flex items-center justify-center`}>
            <Icon size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-gray-900 dark:text-white">
              {post.club_name || 'E-Tech Department'}
            </p>
            <p className="text-xs text-gray-500">
              {post.posted_at ? new Date(post.posted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
            </p>
          </div>
          <div className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', config.color, 'bg-gray-100 dark:bg-gray-800')}>
            {post.platform}
          </div>
        </div>

        {/* Image */}
        {post.image_url && (
          <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={post.image_url}
              alt={post.caption || 'Social post'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}

        {/* Caption & Actions */}
        <div className="p-4">
          {/* Interaction buttons */}
          <div className="flex items-center gap-4 mb-3">
            <button className="text-gray-500 hover:text-red-500 transition-colors">
              <Heart size={20} />
            </button>
            <button className="text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle size={20} />
            </button>
            <button className="text-gray-500 hover:text-green-500 transition-colors">
              <Share2 size={20} />
            </button>
            {post.post_url && (
              <a
                href={post.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-gray-500 hover:text-indigo-500 transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
          
          {post.caption && (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
              {post.caption}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
