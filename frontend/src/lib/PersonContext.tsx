'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type PersonContextType = {
  person: string | null;
  setPerson: (name: string) => void;
};

const PersonContext = createContext<PersonContextType | null>(null);

const STORAGE_KEY = 'webtrail-person';

export function PersonProvider({ children }: { children: ReactNode }) {
  const [person, setPersonState] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setPersonState(saved);
  }, []);

  function setPerson(name: string) {
    sessionStorage.setItem(STORAGE_KEY, name);
    setPersonState(name);
  }

  return (
    <PersonContext.Provider value={{ person, setPerson }}>
      {children}
    </PersonContext.Provider>
  );
}

export function usePerson() {
  const ctx = useContext(PersonContext);
  if (!ctx) throw new Error('usePerson must be used within PersonProvider');
  return ctx;
}