'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { api, ArrivedVia, Site } from '@/lib/api';
import { usePerson } from '@/lib/PersonContext';

type BrowserContextType = {
  history: string[];
  pointer: number;
  currentAddress: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
  navigate: (address: string, via: ArrivedVia) => void;
  goBack: () => void;
  goForward: () => void;
  reset: () => void;
  searchResults: Site[] | null;
  setSearchResults: (results: Site[] | null) => void;
};

const BrowserContext = createContext<BrowserContextType | null>(null);

export function BrowserProvider({ children }: { children: ReactNode }) {
  const { person } = usePerson();
  const [history, setHistory] = useState<string[]>([]);
  const [pointer, setPointer] = useState(-1);
  // Keyed by pointer position, not address — this is what lets search
  // results reappear when you come back to the exact spot you searched from.
  const [resultsMap, setResultsMap] = useState<Map<number, Site[] | null>>(new Map());

  function recordVisit(address: string, via: ArrivedVia) {
    if (!person) return;
    api.recordVisit({ person, address, arrivedVia: via }).catch(() => {
      console.error('Failed to record visit');
    });
  }

  function navigate(address: string, via: ArrivedVia) {
    const oldPointer = pointer;
    const newHistory = [...history.slice(0, oldPointer + 1), address];
    setHistory(newHistory);
    setPointer(newHistory.length - 1);

    // Going somewhere new means any results tied to positions "ahead" of us
    // are lost too — same rule as losing forward history, applied to search state.
    setResultsMap((prev) => {
      const next = new Map(prev);
      for (const key of next.keys()) {
        if (key > oldPointer) next.delete(key);
      }
      return next;
    });

    recordVisit(address, via);
  }

  function goBack() {
    if (pointer <= 0) return;
    const newPointer = pointer - 1;
    setPointer(newPointer);
    recordVisit(history[newPointer], 'back');
  }

  function goForward() {
    if (pointer >= history.length - 1) return;
    const newPointer = pointer + 1;
    setPointer(newPointer);
    recordVisit(history[newPointer], 'forward');
  }

  function reset() {
    setHistory([]);
    setPointer(-1);
    setResultsMap(new Map());
  }

  function setSearchResults(results: Site[] | null) {
    setResultsMap((prev) => {
      const next = new Map(prev);
      next.set(pointer, results);
      return next;
    });
  }

  return (
    <BrowserContext.Provider
      value={{
        history,
        pointer,
        currentAddress: pointer >= 0 ? history[pointer] : null,
        canGoBack: pointer > 0,
        canGoForward: pointer < history.length - 1,
        navigate,
        goBack,
        goForward,
        reset,
        searchResults: resultsMap.get(pointer) ?? null,
        setSearchResults,
      }}
    >
      {children}
    </BrowserContext.Provider>
  );
}

export function useBrowser() {
  const ctx = useContext(BrowserContext);
  if (!ctx) throw new Error('useBrowser must be used within BrowserProvider');
  return ctx;
}