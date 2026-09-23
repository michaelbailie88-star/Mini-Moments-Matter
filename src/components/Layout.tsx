import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { NARRATOR_CREDIT } from "../lib/stories";

const BROWSE_LINKS = [
  { label: "Mini Moments Adventure", to: "/adventure" },
  { label: "Mini Moments Treasure Chest", to: "/treasure-chest" },
  { label: "World of Mini Moments", to: "/world" },
];
const ACCOUNT_LINKS = [
  { label: "My Keepsakes", to: "/keepsakes" },
  { label: "Inspiration", to: "/inspiration" },
  { label: "My Profile", to: "/profile" },
];
const FOOTER_LINKS = [
  { label: "Adventure", to: "/adventure" },
  { label: "Treasure Chest", to: "/treasure-chest" },
  { label: "World of Mini Moments", to: "/world" },
  { label: "My Keepsakes", to: "/keepsakes" },
  { label: "Inspiration", to: "/inspiration" },
  { label: "Profile", to: "/profile" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState<{ name: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("mmm.profile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  function signOut() {
    try {
      localStorage.removeItem("mmm.profile");
    } catch {}
    setProfile(null);
    setMenuOpen(false);
  }

  return (
    <div className="bg-pastel-blend flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/85 backdrop-blur">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2.5 justify-self-start">
            <img
              src="/assets/logo.png"
              alt="Mini Moments Matter"
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="brand-display hidden whitespace-nowrap text-lg text-ink sm:block">
              Mini Moments Matter
            </span>
          </Link>
          <nav className="mx-auto hidden w-full max-w-3xl min-w-0 items-stretch justify-center gap-1.5 md:flex">
            {BROWSE_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className={`nav-pill ${pathname === l.to ? "active" : ""}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div ref={menuRef} className="relative shrink-0 justify-self-end">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-white/70 text-ink shadow-sm transition hover:bg-white"
            >
              <span className="flex flex-col items-center justify-center gap-[5px]">
                <span
                  className={`h-[2.5px] w-5 rounded-full bg-ink transition-transform ${
                    menuOpen ? "translate-y-[7.5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-[2.5px] w-5 rounded-full bg-ink transition-opacity ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`h-[2.5px] w-5 rounded-full bg-ink transition-transform ${
                    menuOpen ? "-translate-y-[7.5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-64 rounded-2xl border border-ink/10 bg-cream/95 p-2 shadow-xl backdrop-blur">
                <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                  Browse
                </p>
                {BROWSE_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`block rounded-xl px-3 py-2 text-sm font-semibold text-ink transition hover:bg-white ${
                      pathname === l.to ? "bg-white text-ink" : ""
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-ink/10" />
                <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wide text-ink-soft">
                  Account
                </p>
                {ACCOUNT_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`block rounded-xl px-3 py-2 text-sm font-semibold text-ink transition hover:bg-white ${
                      pathname === l.to ? "bg-white text-ink" : ""
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-ink/10" />
                {profile ? (
                  <>
                    <p className="px-3 text-sm text-ink-soft">
                      Signed in as <span className="font-semibold text-ink">{profile.name}</span>
                    </p>
                    <button
                      type="button"
                      onClick={signOut}
                      className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-ink transition hover:bg-white"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/profile"
                    className="block rounded-xl px-3 py-2 text-sm font-semibold text-ink transition hover:bg-white"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">{children}</main>
      <footer className="mt-12 border-t border-ink/10 bg-cream/70">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-ink-soft">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {FOOTER_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-ink">
                {l.label}
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-xs italic">{NARRATOR_CREDIT}</p>
          <p className="mt-3 text-xs">
            Stories to read. Moments to make. Memories to keep. © {new Date().getFullYear()} Mini
            Moments Matter.
          </p>
        </div>
      </footer>
    </div>
  );
}
