'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchClubs, submitAchievement } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Upload, CheckCircle, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

export default function SubmitAchievementPage() {
  const [form, setForm] = useState({
    student_name: '',
    club_id: '',
    title: '',
    description: '',
    proof_url: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const { data: clubs } = useQuery({ queryKey: ['clubs'], queryFn: fetchClubs });

  const mutation = useMutation({
    mutationFn: () =>
      submitAchievement({
        name: form.student_name,
        title: form.title,
        description: form.description,
        proof_url: form.proof_url,
        club_id: form.club_id || undefined,
      }),
    onSuccess: () => {
      setSubmitted(true);
      setForm({ student_name: '', club_id: '', title: '', description: '', proof_url: '' });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const inputBase =
    'w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all';

  return (
    <div>
      <PageHeader
        title="Submit an Achievement"
        subtitle="Share Your Success"
        description="Got something amazing to share? Submit your achievement and let the department celebrate with you!"
        gradient="from-green-500 via-emerald-500 to-teal-500"
      />

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  Achievement Submitted!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Thank you for sharing! Your achievement will be reviewed and added to our showcase once approved.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 shadow-xl space-y-6"
              >
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 mb-2">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <Trophy size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Achievement Details</h3>
                    <p className="text-sm text-gray-400">All fields marked * are required</p>
                  </div>
                </div>

                {/* Student Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="student_name"
                    required
                    placeholder="Enter your full name"
                    value={form.student_name}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>

                {/* Club */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Club (optional)
                  </label>
                  <select
                    name="club_id"
                    value={form.club_id}
                    onChange={handleChange}
                    className={clsx(inputBase, 'appearance-none')}
                  >
                    <option value="">Select a club (optional)</option>
                    {clubs?.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Achievement Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="e.g. Won Smart India Hackathon 2024"
                    value={form.title}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={4}
                    placeholder="Tell us about your achievement — what you did, when, and any other details..."
                    value={form.description}
                    onChange={handleChange}
                    className={clsx(inputBase, 'resize-none')}
                  />
                </div>

                {/* Proof URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <LinkIcon size={14} /> Proof Link / Certificate URL (optional)
                    </span>
                  </label>
                  <input
                    type="url"
                    name="proof_url"
                    placeholder="https://..."
                    value={form.proof_url}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </div>

                {mutation.isError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle size={16} />
                    Something went wrong. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className={clsx(
                    'w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2',
                    mutation.isPending
                      ? 'bg-gray-400 cursor-wait'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5'
                  )}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Upload size={18} /> Submit Achievement
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
