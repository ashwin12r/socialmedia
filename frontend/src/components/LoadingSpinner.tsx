'use client';

import { motion } from 'framer-motion';

export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-800"
          style={{ borderTopColor: '#6366f1' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 animate-pulse">{text}</p>
    </div>
  );
}

export function EmptyState({ title = 'No data found', description = '', icon }: { title?: string; description?: string; icon?: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      {icon && (
        <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-6 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 dark:text-gray-500 max-w-md">{description}</p>
      )}
    </motion.div>
  );
}
