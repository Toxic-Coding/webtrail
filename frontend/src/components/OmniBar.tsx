"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useBrowser } from "@/lib/BrowserContext";

function looksLikeAddress(input: string) {
  return /^[a-z0-9-]+\.[a-z0-9.-]+$/i.test(input.trim());
}

export function OmniBar({ size = "compact" }: { size?: "large" | "compact" }) {
  const {
    currentAddress,
    canGoBack,
    canGoForward,
    navigate,
    goBack,
    goForward,
    searchResults,
    setSearchResults,
  } = useBrowser();
  const [input, setInput] = useState("");
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function focusHandler() {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    window.addEventListener("focus-omnibar", focusHandler);
    return () => window.removeEventListener("focus-omnibar", focusHandler);
  }, []);

  useEffect(() => {
    if (size === "compact") setInput(currentAddress ?? "");
  }, [currentAddress, size]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSearchResults(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSearchResults]);

  useEffect(() => {
    function handleWindowBlur() {
      setTimeout(() => {
        if (document.activeElement?.tagName === "IFRAME") {
          setSearchResults(null);
        }
      }, 0);
    }
    window.addEventListener("blur", handleWindowBlur);
    return () => window.removeEventListener("blur", handleWindowBlur);
  }, [setSearchResults]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;

    if (looksLikeAddress(value)) {
      setSearchResults(null);
      navigate(value.toLowerCase(), "typed");
    } else {
      setSearching(true);
      const sites = await api.searchSites(value).catch(() => []);
      setSearchResults(sites);
      setSearching(false);
    }
  }

  function goToResult(address: string) {
    // Deliberately NOT clearing results here — they stay attached to the
    // pointer position we're leaving, so Back can bring them right back.
    setInput(address);
    navigate(address, "link");
  }

  const large = size === "large";

  return (
    <div
      ref={containerRef}
      className={large ? "relative w-full max-w-xl mx-auto" : "relative flex-1 flex items-center gap-2"}
    >
      {!large && (
        <>
          <button type="button" onClick={goBack} disabled={!canGoBack} aria-label="Back"
            className="font-mono text-sm px-2 py-1.5 rounded-md border border-[var(--line)] bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--paper)]">
            ←
          </button>
          <button type="button" onClick={goForward} disabled={!canGoForward} aria-label="Forward"
            className="font-mono text-sm px-2 py-1.5 rounded-md border border-[var(--line)] bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--paper)]">
            →
          </button>
        </>
      )}

      <form onSubmit={handleSubmit} className={large ? "w-full" : "flex-1"}>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={large ? "Go to an address, or search the small web..." : "address or search..."}
          className={
            large
              ? "w-full font-mono text-base px-5 py-4 rounded-full border border-[var(--line)] bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--deep)] text-center"
              : "w-full font-mono text-sm px-3 py-1.5 rounded-md border border-[var(--line)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--deep)]"
          }
        />
      </form>

      {searchResults !== null && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-[var(--line)] rounded-xl shadow-lg z-10">
          {searching && <p className="p-3 text-sm text-[var(--ink)]/60">Searching...</p>}
          {!searching && searchResults.length === 0 && <p className="p-3 text-sm text-[var(--ink)]/60">No results.</p>}
          {searchResults.map((site) => (
            <button key={site._id} onClick={() => goToResult(site.address)}
              className="block w-full text-left px-4 py-2.5 border-t border-[var(--line)] first:border-t-0 hover:bg-[var(--paper)]">
              <div className="font-mono text-sm text-[var(--deep)]">{site.address}</div>
              <div className="text-sm">{site.title}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}