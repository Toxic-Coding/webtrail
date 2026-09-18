"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePerson } from "@/lib/PersonContext";

export function NavBar() {
  const pathname = usePathname();
  const { person, logout } = usePerson();

  const linkClass = (path: string) =>
    `px-3 py-1.5 rounded-md text-sm font-medium ${
      pathname === path
        ? "bg-[var(--deep)] text-white"
        : "hover:bg-[var(--paper)]"
    }`;

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-[var(--line)] px-4 py-2 flex items-center gap-3">
      <Link
        href="/"
        className="font-serif font-semibold text-lg text-[var(--deep)] mr-2 shrink-0"
      >
        WebTrail
      </Link>
      <nav className="flex items-center gap-1 shrink-0">
        <Link href="/browse" className={linkClass("/browse")}>
          Browse
        </Link>
        <Link href="/history" className={linkClass("/history")}>
          History
        </Link>
        <Link href="/publish" className={linkClass("/publish")}>
          Publish
        </Link>
      </nav>
      <div className="flex-1" />
      {person && (
        <span className="font-mono text-xs text-[var(--ink)]/60 shrink-0">
          {person}
        </span>
      )}
      {person && (
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[var(--paper)] cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 inline-block mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </button>
      )}
    </header>
  );
}
