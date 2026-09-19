'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, Visit } from '@/lib/api';
import { usePerson } from '@/lib/PersonContext';
import { useBrowser } from '@/lib/BrowserContext';

const RANGES: { key: '15m' | '1h' | '24h' | 'all'; label: string }[] = [
  { key: '15m', label: 'Last 15 min' },
  { key: '1h', label: 'Last hour' },
  { key: '24h', label: 'Last 24h' },
  { key: 'all', label: 'Everything' },
];

export function HistoryPanel({ full = false }: { full?: boolean }) {
  const { person } = usePerson();
  const { navigate, history: navHistory } = useBrowser();
  const router = useRouter();
  const [visits, setVisits] = useState<Visit[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function loadHistory() {
    if (!person) return;
    api.getHistory(person).then(setVisits).catch(() => {});
  }

  useEffect(loadHistory, [person, navHistory]);

  function jumpTo(address: string) {
    navigate(address, 'history');
    router.push('/');
  }

  function toggleSelected(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected((prev) => (prev.size === visits.length ? new Set() : new Set(visits.map((v) => v._id))));
  }

  async function deleteOne(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!person) return;
    await api.deleteVisit(person, id);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    loadHistory();
  }

  async function deleteSelected() {
    if (!person || selected.size === 0) return;
    await api.deleteVisits(person, Array.from(selected));
    setSelected(new Set());
    loadHistory();
  }

  async function deleteByRange(range: '15m' | '1h' | '24h' | 'all') {
    if (!person) return;
    if (range === 'all' && !confirm('Delete this person\'s entire history?')) return;
    await api.deleteVisitsByRange(person, range);
    setSelected(new Set());
    loadHistory();
  }

  if (!full) {
    // Compact sidebar version — read-only, no delete controls, kept simple.
    return (
      <div className="w-64 border-l border-[var(--line)] h-[80vh] overflow-y-auto">
        {visits.length === 0 && <p className="p-4 text-sm text-[var(--ink)]/60">No visits yet.</p>}
        {visits.map((v) => (
          <button key={v._id} onClick={() => jumpTo(v.address)} className="block w-full text-left px-4 py-3 hover:bg-[var(--paper)]">
            <div className="font-mono text-sm text-[var(--deep)]">{v.address}</div>
            <div className="text-xs text-[var(--ink)]/50 mt-0.5">{new Date(v.visitedAt).toLocaleString()} · via {v.arrivedVia}</div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {RANGES.map((r) => (
          <button key={r.key} onClick={() => deleteByRange(r.key)}
            className="px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--line)] bg-white hover:border-[var(--rust)] hover:text-[var(--rust)]">
            Clear {r.label}
          </button>
        ))}
      </div>

      {visits.length > 0 && (
        <div className="flex items-center justify-between mb-2 px-1">
          <label className="flex items-center gap-2 text-sm text-[var(--ink)]/70">
            <input type="checkbox" checked={selected.size === visits.length} onChange={toggleSelectAll} />
            Select all
          </label>
          {selected.size > 0 && (
            <button onClick={deleteSelected} className="text-sm font-medium text-[var(--rust)] hover:underline">
              Delete {selected.size} selected
            </button>
          )}
        </div>
      )}

      <div className="bg-white border border-[var(--line)] rounded-xl divide-y divide-[var(--line)]">
        {visits.length === 0 && <p className="p-4 text-sm text-[var(--ink)]/60">No visits yet — go browse somewhere.</p>}
        {visits.map((v) => (
          <div key={v._id} onClick={() => jumpTo(v.address)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--paper)] cursor-pointer">
            <input
              type="checkbox"
              checked={selected.has(v._id)}
              onClick={(e) => e.stopPropagation()}
              onChange={() => toggleSelected(v._id)}
            />
            <div className="flex-1">
              <div className="font-mono text-sm text-[var(--deep)]">{v.address}</div>
              <div className="text-xs text-[var(--ink)]/50 mt-0.5">{new Date(v.visitedAt).toLocaleString()} · via {v.arrivedVia}</div>
            </div>
            <button onClick={(e) => deleteOne(v._id, e)} className="text-xs text-[var(--ink)]/40 hover:text-[var(--rust)] px-2">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}