'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePerson } from '@/lib/PersonContext';

export function NavBar() {
  const pathname = usePathname();
  const { person } = usePerson();

  const linkClass = (path: string) =>
    `px-3 py-1.5 rounded-md text-sm font-medium ${
      pathname === path ? 'bg-[var(--deep)] text-white' : 'hover:bg-[var(--paper)]'
    }`;

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-[var(--line)] px-4 py-2 flex items-center gap-3">
      <Link href="/" className="font-serif font-semibold text-lg text-[var(--deep)] mr-2 shrink-0">
        WebTrail
      </Link>
      <nav className="flex items-center gap-1 shrink-0">
        <Link href="/browse" className={linkClass('/browse')}>Browse</Link>
        <Link href="/history" className={linkClass('/history')}>History</Link>
        <Link href="/publish" className={linkClass('/publish')}>Publish</Link>
      </nav>
      <div className="flex-1" />
      {person && <span className="font-mono text-xs text-[var(--ink)]/60 shrink-0">{person}</span>}
    </header>
  );
}