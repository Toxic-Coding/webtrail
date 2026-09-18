'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePerson } from '@/lib/PersonContext';
import { HistoryPanel } from '@/components/HistoryPanel';

export default function HistoryPage() {
  const { person } = usePerson();
  const router = useRouter();

  useEffect(() => {
    if (!person) router.replace('/browse');
  }, [person, router]);

  if (!person) return null;

  return (
    <main className="flex-1 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-2xl mb-4">{person}&apos;s History</h1>
        <HistoryPanel full />
      </div>
    </main>
  );
}