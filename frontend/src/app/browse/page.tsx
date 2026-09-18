'use client';

import { usePerson } from '@/lib/PersonContext';
import { useBrowser } from '@/lib/BrowserContext';
import { PersonPicker } from '@/components/PersonPicker';
import { OmniBar } from '@/components/OmniBar';
import { PageFrame } from '@/components/PageFrame';

export default function Browse() {
  const { person } = usePerson();
  const { currentAddress } = useBrowser();

  if (!person) return <PersonPicker />;

  if (!currentAddress) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 gap-6">
        <h1 className="font-serif text-5xl sm:text-6xl text-[var(--deep)]">WebTrail</h1>
        <p className="font-mono text-sm text-[var(--ink)]/60">a small web, browsed as {person}</p>
        <OmniBar size="large" />
      </main>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-[var(--line)] bg-white px-4 py-2">
        <OmniBar size="compact" />
      </div>
      <div className="flex-1 p-4">
        <div className="max-w-5xl mx-auto bg-white border border-[var(--line)] rounded-xl shadow-sm overflow-hidden">
          <PageFrame />
        </div>
      </div>
    </div>
  );
}