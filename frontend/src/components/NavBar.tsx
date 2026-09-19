"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePerson } from "@/lib/PersonContext";
import { useBrowser } from "@/lib/BrowserContext";

export function NavBar() {
  const pathname = usePathname();
  const { reset } = useBrowser();
  const { person, logout } = usePerson();
  const linkClass = (path: string) =>
    `px-2 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap ${
      pathname === path
        ? "bg-[var(--deep)] text-white"
        : "hover:bg-[var(--paper)]"
    }`;
  if (!person) return null;

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-[var(--line)] px-2 sm:px-4 py-2 flex items-center gap-1 sm:gap-3 overflow-x-auto">
      <Link
        href="/"
        className="font-serif font-semibold text-base sm:text-lg text-[var(--deep)] mr-1 sm:mr-2 shrink-0"
      >
        WebTrail
      </Link>
      <nav className="flex items-center gap-0.5 sm:gap-1 shrink-0">
        <Link href="/" className={linkClass("/")}>
          Browse
        </Link>
        <Link href="/history" className={linkClass("/history")}>
          History
        </Link>
        <Link href="/publish" className={linkClass("/publish")}>
          Publish
        </Link>
      </nav>
      <div className="flex-1 min-w-2" />
      <span className="hidden sm:inline-block font-mono text-xs text-[var(--ink)]/60 shrink-0">
        {person}
      </span>
      <button
        onClick={() => {
          reset();
          logout();
        }}
        aria-label="Log out"
        className="px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[var(--paper)] cursor-pointer shrink-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 inline-block"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
          />
        </svg>
      </button>
    </header>
  );
}