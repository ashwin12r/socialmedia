'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGallery, fetchGalleryFilters } from '@/lib/api';
import PageHeader from '@/components/PageHeader';
import Lightbox from '@/components/Lightbox';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/LoadingSpinner';
import { Image as ImageIcon, Filter, X } from 'lucide-react';
import clsx from 'clsx';

export default function GalleryPage() {
  const [filters, setFilters] = useState<{ club_id?: string; category?: string; year?: number }>({});
  const [showFilters, setShowFilters] = useState(false);

  const { data: gallery, isLoading } = useQuery({
    queryKey: ['gallery', filters],
    queryFn: () => fetchGallery(filters as any),
  });
  const { data: filterOptions } = useQuery({
    queryKey: ['gallery-filters'],
    queryFn: fetchGalleryFilters,
  });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div>
      <PageHeader
        title="Our Photo Gallery"
        subtitle="Memories"
        description="Relive the moments that define our department — events, competitions, workshops, and celebrations captured in frames."
        gradient="from-pink-500 via-rose-500 to-orange-500"
      />

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                showFilters || activeFilterCount > 0
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-transparent'
              )}
            >
              <Filter size={16} /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={() => setFilters({})}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <X size={14} /> Clear all
              </button>
            )}
          </div>

          {showFilters && filterOptions && (
            <div className="mb-10 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-6">
              {/* Category filter */}
              {filterOptions.categories?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.categories.map((cat: string) => (
                      <button
                        key={cat}
                        onClick={() => setFilters(f => ({ ...f, category: f.category === cat ? undefined : cat }))}
                        className={clsx(
                          'px-3 py-1.5 rounded-lg text-sm transition-all',
                          filters.category === cat
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Club filter */}
              {filterOptions.clubs?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Club</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.clubs.map((club: any) => (
                      <button
                        key={club.id}
                        onClick={() => setFilters(f => ({ ...f, club_id: f.club_id === club.id ? undefined : club.id }))}
                        className={clsx(
                          'px-3 py-1.5 rounded-lg text-sm transition-all',
                          filters.club_id === club.id
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        )}
                      >
                        {club.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Year filter */}
              {filterOptions.years?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Year</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.years.map((year: number) => (
                      <button
                        key={year}
                        onClick={() => setFilters(f => ({ ...f, year: f.year === year ? undefined : year }))}
                        className={clsx(
                          'px-3 py-1.5 rounded-lg text-sm transition-all',
                          filters.year === year
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {isLoading ? (
            <LoadingSpinner text="Loading gallery..." />
          ) : gallery?.length ? (
            <Lightbox images={gallery} />
          ) : (
            <EmptyState title="No photos found" description="Try adjusting your filters" icon={<ImageIcon size={40} />} />
          )}
        </div>
      </section>
    </div>
  );
}
