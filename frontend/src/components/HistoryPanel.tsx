'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, Visit } from '@/lib/api';
import { usePerson } from '@/lib/PersonContext';
import { useBrowser } from '@/lib/BrowserContext';

export function HistoryPanel({ full = false }: { full?: boolean }) {
  const { person } = usePerson();
  const { navigate, history: navHistory } = useBrowser();
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    if (!person) return;
    api.getHistory(person).then(setVisits).catch(() => {});
  }, [person, navHistory]);

  function jumpTo(address: string) {
    navigate(address, 'history');
    router.push('/browse');
  }

  return (
    <div className={full ? 'bg-white border border-[var(--line)] rounded-xl divide-y divide-[var(--line)]' : 'w-64 border-l border-[var(--line)] h-[80vh] overflow-y-auto'}>
      {visits.length === 0 && <p className="p-4 text-sm text-[var(--ink)]/60">No visits yet — go browse somewhere.</p>}
      {visits.map((v) => (
        <button key={v._id} onClick={() => jumpTo(v.address)} className="block w-full text-left px-4 py-3 hover:bg-[var(--paper)]">
          <div className="font-mono text-sm text-[var(--deep)]">{v.address}</div>
          <div className="text-xs text-[var(--ink)]/50 mt-0.5">{new Date(v.visitedAt).toLocaleString()} · via {v.arrivedVia}</div>
        </button>
      ))}
    </div>
  );
}