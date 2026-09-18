'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePerson } from '@/lib/PersonContext';
import { PublishForm } from '@/components/PublishForm';

export default function PublishPage() {
  const { person } = usePerson();
  const router = useRouter();

  useEffect(() => {
    if (!person) router.replace('/browse');
  }, [person, router]);

  if (!person) return null;

  return (
    <main className="flex-1 px-4 py-8">
      <div className="max-w-xl mx-auto">
        <h1 className="font-serif text-2xl mb-4">Publish a new page</h1>
        <PublishForm embedded onPublished={() => router.push('/browse')} />
      </div>
    </main>
  );
}