'use client';

import { ReactNode } from 'react';
import ScrollReveal from './ScrollReveal';
import clsx from 'clsx';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  gradient?: string;
  children?: ReactNode;
  align?: 'left' | 'center';
}

export default function PageHeader({
  title,
  subtitle,
  description,
  gradient = 'from-indigo-500 via-purple-500 to-pink-500',
  children,
  align = 'center',
}: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-10 dark:opacity-5 animate-pulse`} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-10 dark:opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--tw-gradient-from)_100%)] from-white/0 dark:from-gray-950/0" />
      </div>

      <div className={clsx('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', align === 'center' && 'text-center')}>
        <ScrollReveal>
          {subtitle && (
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${gradient} text-white mb-6 shadow-lg`}>
              {subtitle}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {title.split(' ').map((word, i, arr) => (
              <span key={i}>
                {i >= arr.length - 2 ? (
                  <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{word} </span>
                ) : (
                  <span>{word} </span>
                )}
              </span>
            ))}
          </h1>
        </ScrollReveal>
        {description && (
          <ScrollReveal delay={0.15}>
            <p className={clsx(
              'text-lg text-gray-600 dark:text-gray-400 leading-relaxed',
              align === 'center' ? 'max-w-3xl mx-auto' : 'max-w-3xl'
            )}>
              {description}
            </p>
          </ScrollReveal>
        )}
        {children && (
          <ScrollReveal delay={0.3}>
            <div className="mt-8">{children}</div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
