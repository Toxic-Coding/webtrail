'use client';

import { useEffect, useState } from 'react';
import { api, Person } from '@/lib/api';
import { usePerson } from '@/lib/PersonContext';

export function PersonPicker() {
  const [people, setPeople] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setPerson } = usePerson();

  useEffect(() => {
    api.getPeople().then(setPeople).catch((e) => setError(e.message));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 gap-6 text-center">
      <h1 className="font-serif text-4xl text-[var(--deep)]">WebTrail</h1>
      {error && <p className="text-[var(--rust)]">Something went wrong: {error}</p>}
      {!error && people.length === 0 && <p className="text-[var(--ink)]/50">Loading people...</p>}
      {people.length > 0 && (
        <>
          <p className="text-[var(--ink)]/60">Who&apos;s browsing?</p>
          <div className="flex flex-wrap gap-3 justify-center max-w-md">
            {people.map((p) => (
              <button key={p._id} onClick={() => setPerson(p.name)}
                className="px-5 py-2.5 rounded-full border border-[var(--line)] bg-white hover:bg-[var(--paper)] hover:border-[var(--deep)] transition-colors font-medium">
                {p.name}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}