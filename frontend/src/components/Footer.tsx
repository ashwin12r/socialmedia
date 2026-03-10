'use client';

import Link from 'next/link';
import { Heart, Github, Twitter, Instagram, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Clubs', href: '/clubs' },
  { label: 'Activities', href: '/activities' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Announcements', href: '/announcements' },
];

const clubLinks = [
  { label: 'Social Media Club', href: '/social-media-club' },
  { label: 'CodeCraft Club', href: '/clubs/codecraft-club' },
  { label: 'RoboTech Club', href: '/clubs/robotech-club' },
  { label: 'CyberShield Club', href: '/clubs/cybershield-club' },
  { label: 'AI/ML Society', href: '/clubs/ai-ml-society' },
  { label: 'DesignX Studio', href: '/clubs/designx-studio' },
];

export default function Footer() {
  return (
    <footer className="relative bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      {/* Gradient decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  E-Tech Social Hub
                </span>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              The digital home of the Electronics & Technology Department. Connecting students, showcasing achievements, and building a vibrant tech community.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#', color: 'hover:text-pink-500' },
                { icon: Twitter, href: '#', color: 'hover:text-blue-400' },
                { icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
                { icon: Github, href: '#', color: 'hover:text-gray-900 dark:hover:text-white' },
                { icon: Mail, href: '#', color: 'hover:text-red-500' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className={`p-2.5 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-500 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Clubs */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Our Clubs
            </h3>
            <ul className="space-y-3">
              {clubLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Get In Touch
            </h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>Electronics & Technology Department</p>
              <p>Building C, 3rd Floor</p>
              <p>University Campus</p>
              <p className="pt-2">
                <a href="mailto:etech@university.edu" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  etech@university.edu
                </a>
              </p>
            </div>
            <Link
              href="/submit-achievement"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:-translate-y-0.5"
            >
              Share Your Achievement
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> by E-Tech Social Media Club
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © <span data-footer-year className="cursor-pointer hover:text-indigo-400 transition-colors">{new Date().getFullYear()}</span> E-Tech Department. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
