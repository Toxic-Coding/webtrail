"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { api, ArrivedVia } from "@/lib/api";
import { usePerson } from "@/lib/PersonContext";

type BrowserContextType = {
  history: string[]; // every address visited, in order
  pointer: number; // where we currently are in that list
  currentAddress: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
  navigate: (address: string, via: ArrivedVia) => void;
  goBack: () => void;
  goForward: () => void;
  reset: () => void;
};

const BrowserContext = createContext<BrowserContextType | null>(null);

export function BrowserProvider({ children }: { children: ReactNode }) {
  const { person } = usePerson();
  const [history, setHistory] = useState<string[]>([]);
  const [pointer, setPointer] = useState(-1);

  function recordVisit(address: string, via: ArrivedVia) {
    if (!person) return;
    api.recordVisit({ person, address, arrivedVia: via }).catch(() => {
      // If recording fails, browsing still works — we just log it quietly.
      console.error("Failed to record visit");
    });
  }

  function navigate(address: string, via: ArrivedVia) {
    // Cut off anything "ahead" of us, then add the new address.
    // This is what makes Forward disappear after visiting somewhere new.
    const newHistory = [...history.slice(0, pointer + 1), address];
    setHistory(newHistory);
    setPointer(newHistory.length - 1);
    recordVisit(address, via);
  }

  function goBack() {
    if (pointer <= 0) return;
    const newPointer = pointer - 1;
    setPointer(newPointer);
    recordVisit(history[newPointer], "back");
  }

  function goForward() {
    if (pointer >= history.length - 1) return;
    const newPointer = pointer + 1;
    setPointer(newPointer);
    recordVisit(history[newPointer], "forward");
  }

  function reset() {
    setHistory([]);
    setPointer(-1);
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
        reset
      }}
    >
      {children}
    </BrowserContext.Provider>
  );
}

export function useBrowser() {
  const ctx = useContext(BrowserContext);
  if (!ctx) throw new Error("useBrowser must be used within BrowserProvider");
  return ctx;
}
