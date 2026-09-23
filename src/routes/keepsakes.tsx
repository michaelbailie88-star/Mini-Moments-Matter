import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/keepsakes")({
  component: KeepsakesPage,
});

const VIEWS = ["View", "Export", "Share", "Send to Printify"];

export function TreasureBox({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden="true" role="img">
      <defs>
        <linearGradient id="tbLid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbeec2" />
          <stop offset="1" stopColor="#efcf7c" />
        </linearGradient>
        <linearGradient id="tbBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8a475" />
          <stop offset="1" stopColor="#c68b5c" />
        </linearGradient>
      </defs>
      <path d="M30 60 L50 38 L150 38 L170 60 Z" fill="url(#tbLid)" stroke="#9c643f" strokeWidth="3" />
      <circle cx="100" cy="34" r="7" fill="#ef9dc4" />
      <circle cx="88" cy="30" r="5" fill="#7ec8ee" />
      <circle cx="112" cy="30" r="5" fill="#8fd2aa" />
      <path d="M36 60 L164 60 L158 132 L42 132 Z" fill="url(#tbBody)" stroke="#9c643f" strokeWidth="3" />
      <circle cx="100" cy="88" r="7" fill="#7d4a63" />
      <path d="M100 88 L100 104" stroke="#7d4a63" strokeWidth="4" />
      <path d="M22 24 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="#f7d277" />
      <path d="M180 20 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" fill="#f7d277" />
    </svg>
  );
}

function KeepsakesPage() {
  const [tab, setTab] = useState("View");
  return (
    <div>
      <header className="mb-8 text-center">
        <h1 className="brand-display text-4xl text-ink">🫙 My Keepsakes</h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink-soft">
          Your magical bookshelf — where every completed little moment lives and stays. This is where
          your family's memories collect, ready to view, export, share, or turn into a keepsake book.
        </p>
      </header>
      <section className="rounded-3xl bg-white/60 p-8 text-center shadow-sm">
        <TreasureBox className="treasure-box mx-auto h-44 w-auto" />
        <h2 className="brand-display mt-4 text-2xl text-ink">You haven't kept any moments yet</h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-soft">
          Finished a story activity? Capture the moment here and it will appear on your shelf, waiting
          in the treasure box. When you make your first keepsake, this shelf comes to life.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm text-ink-soft">
          Keepsake capture and physical books are on the way with the next release.
        </p>
      </section>
      <section className="mt-10">
        <h2 className="brand-display mb-4 text-2xl text-ink">Your keepsake shelf</h2>
        <div className="shelf wood" aria-label="Keepsake shelf">
          <div className="relative z-10 flex flex-wrap items-end justify-center gap-3 p-4">
            {Array.from({ length: 8 }).map((_, a) => (
              <div
                key={a}
                aria-hidden="true"
                className="flex h-28 w-20 items-center justify-center rounded-md bg-white/40 text-3xl text-ink/30"
                style={{ transform: `rotate(${(a % 5) - 2}deg)` }}
              >
                🫙
              </div>
            ))}
          </div>
          <span className="shelf-board" />
        </div>
        <p className="mt-3 text-center text-sm text-ink-soft">
          Completed activity keepsakes will appear here, each one a little moment preserved.
        </p>
      </section>
      <section className="mt-10">
        <h2 className="brand-display mb-4 text-2xl text-ink">
          Your keepsakes, however you like them
        </h2>
        <div className="flex flex-wrap gap-2">
          {VIEWS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`nav-link ${tab === t ? "active" : ""}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-3xl bg-white/60 p-8 text-center shadow-sm">
          {tab === "View" && (
            <>
              <h3 className="brand-display text-xl text-ink">👀 View your keepsakes</h3>
              <p className="mx-auto mt-2 max-w-lg text-ink-soft">
                When you've kept moments, this is where you'll browse them as a collection of little
                story keepsakes.
              </p>
            </>
          )}
          {tab === "Export" && (
            <>
              <h3 className="brand-display text-xl text-ink">⬇️ Export</h3>
              <p className="mx-auto mt-2 max-w-lg text-ink-soft">
                Download your keepsake collection as a file to keep on your own devices.
              </p>
            </>
          )}
          {tab === "Share" && (
            <>
              <h3 className="brand-display text-xl text-ink">📤 Share</h3>
              <p className="mx-auto mt-2 max-w-lg text-ink-soft">
                Send a keepsake to a loved one — grandparents love these most of all.
              </p>
            </>
          )}
          {tab === "Send to Printify" && (
            <>
              <h3 className="brand-display text-xl text-ink">🧡 Send to Printify</h3>
              <p className="mx-auto mt-2 max-w-lg text-ink-soft">
                Turn a collection into a physical keepsake book, delivered warm and printed on demand.
                Printing opens as keepsake books become available.
              </p>
            </>
          )}
          <p className="mx-auto mt-4 max-w-lg text-xs text-ink-soft">
            These tools come to life with the keepsake release. They're shown together here so you
            know what's headed your way.
          </p>
        </div>
      </section>
    </div>
  );
}
