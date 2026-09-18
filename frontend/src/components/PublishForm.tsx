'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { usePerson } from '@/lib/PersonContext';
import { useBrowser } from '@/lib/BrowserContext';

type Props = { embedded?: boolean; onClose?: () => void; onPublished?: (address: string) => void };

export function PublishForm({ embedded = false, onClose, onPublished }: Props) {
  const { person } = usePerson();
  const { navigate } = useBrowser();
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [html, setHtml] = useState('<h1>My Page</h1>\n<p>Write something here.</p>');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const site = await api.publishSite({ address: address.trim().toLowerCase(), title: title.trim(), html, author: person! });
      navigate(site.address, 'typed');
      onClose?.();
      onPublished?.(site.address);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  const formEl = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Address
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. myisland.zz" required
          className="font-mono px-3 py-2 rounded-md border border-[var(--line)] focus:outline-none focus:ring-2 focus:ring-[var(--deep)]" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required
          className="px-3 py-2 rounded-md border border-[var(--line)] focus:outline-none focus:ring-2 focus:ring-[var(--deep)]" />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Page HTML
        <textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={10} required
          className="font-mono text-sm px-3 py-2 rounded-md border border-[var(--line)] focus:outline-none focus:ring-2 focus:ring-[var(--deep)]" />
      </label>
      {error && <p className="text-sm text-[var(--rust)]">{error}</p>}
      <div className="flex gap-2 justify-end">
        {onClose && <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border border-[var(--line)] text-sm">Cancel</button>}
        <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md bg-[var(--deep)] text-white text-sm font-medium disabled:opacity-50">
          {submitting ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </form>
  );

  if (embedded) {
    return <div className="bg-white border border-[var(--line)] rounded-xl p-6 shadow-sm">{formEl}</div>;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="font-serif text-xl mb-4">Publish a new page</h2>
        {formEl}
      </div>
    </div>
  );
}