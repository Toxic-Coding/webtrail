'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBrowser } from '@/lib/BrowserContext';

export function ShortcutsListener() {
  const router = useRouter();
  const { goBack, goForward, canGoBack, canGoForward } = useBrowser();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;

      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        if (canGoBack) goBack();
        return;
      }
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        if (canGoForward) goForward();
        return;
      }
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('focus-omnibar'));
        return;
      }
      if (mod && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        router.push('/history');
        return;
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        router.push('/publish');
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, goBack, goForward, canGoBack, canGoForward]);

  return null;
}