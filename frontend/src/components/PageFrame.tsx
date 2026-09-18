'use client';

import { useEffect, useRef, useState } from 'react';
import { api, Site } from '@/lib/api';
import { useBrowser } from '@/lib/BrowserContext';

export function PageFrame() {
  const { currentAddress, navigate } = useBrowser();
  const [site, setSite] = useState<Site | null | undefined>(undefined);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!currentAddress) return;
    setSite(undefined);
    api.getSite(currentAddress).then(setSite).catch(() => setSite(null));
  }, [currentAddress]);

  function handleIframeLoad() {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.addEventListener('click', (e) => {
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href) navigate(href.toLowerCase().trim(), 'link');
    });
  }

  if (!currentAddress) {
    return <p className="p-10 text-center text-[var(--ink)]/50">Type an address above, or search, to get started.</p>;
  }
  if (site === undefined) {
    return <p className="p-10 text-center text-[var(--ink)]/50">Loading...</p>;
  }
  if (site === null) {
    return (
      <div className="p-10 text-center">
        <h2 className="font-serif text-2xl text-[var(--rust)] mb-2">Nowhere</h2>
        <p className="text-[var(--ink)]/60">There&apos;s no page at <code className="font-mono">{currentAddress}</code>.</p>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-same-origin"
      srcDoc={site.html}
      onLoad={handleIframeLoad}
      className="w-full h-[70vh] border-0"
      title={site.title}
    />
  );
}