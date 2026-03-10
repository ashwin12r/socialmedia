'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchClubs } from '@/lib/api';
import ClubCard from '@/components/ClubCard';
import PageHeader from '@/components/PageHeader';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/LoadingSpinner';
import { Users } from 'lucide-react';

export default function ClubsPage() {
  const { data: clubs, isLoading } = useQuery({ queryKey: ['clubs'], queryFn: fetchClubs });

  return (
    <div>
      <PageHeader
        title="Our Amazing Clubs"
        subtitle="Community"
        description="Each club is a universe of creativity, learning, and collaboration. Find where you belong and start building extraordinary things."
        gradient="from-indigo-500 via-purple-500 to-pink-500"
      />

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <LoadingSpinner text="Loading clubs..." />
          ) : clubs?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clubs.map((club: any, i: number) => (
                <ClubCard key={club.id} club={club} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState title="No clubs found" description="Check back soon!" icon={<Users size={40} />} />
          )}
        </div>
      </section>
    </div>
  );
}
