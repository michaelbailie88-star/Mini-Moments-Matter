import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Story } from "../lib/stories";
import { GRADIENTS, FILLERS } from "../lib/stories";

export function Book({
  story,
  i,
  onOpen,
}: {
  story: Story;
  i: number;
  onOpen: () => void;
}) {
  const bg = GRADIENTS[i % GRADIENTS.length];
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${story.title}`}
      className="book w-28 shrink-0 cursor-pointer sm:w-32"
      style={{ background: bg }}
    >
      <span className="book-spine" />
      <span
        className="book-cover"
        style={{ backgroundImage: `url(${story.cover})` }}
      />
    </button>
  );
}

export function Shelf({
  stories,
  wood = "wood",
  empty = 4,
  fill = true,
}: {
  stories: Story[];
  wood?: string;
  empty?: number;
  fill?: boolean;
}) {
  const navigate = useNavigate();
  const [opening, setOpening] = useState<Story | null>(null);
  const reduced = useRef(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (!opening) return;
    const timer = setTimeout(() => {
      navigate({ to: "/story/$slug", params: { slug: opening.slug } });
    }, reduced.current ? 350 : 1250);
    return () => clearTimeout(timer);
  }, [opening, navigate]);

  function openBook(s: Story) {
    if (reduced.current) {
      navigate({ to: "/story/$slug", params: { slug: s.slug } });
      return;
    }
    setOpening(s);
  }

  const fillerCount = fill ? Math.max(3, empty) : 0;
  return (
    <div className={`shelf ${wood}`}>
      <div className="relative z-10 flex flex-wrap items-end justify-center gap-3">
        {stories.map((a, l) => (
          <Book key={a.slug} story={a} i={l} onOpen={() => openBook(a)} />
        ))}
        {Array.from({ length: fillerCount }).map((_, l) => (
          <span
            key={`f${l}`}
            className="filler text-4xl opacity-80"
            aria-hidden="true"
            style={{
              transform: `rotate(${l % 5 - 2}deg) translateY(${(l % 3) * 4}px)`,
            }}
          >
            {FILLERS[l % FILLERS.length]}
          </span>
        ))}
      </div>
      <span className="shelf-board" />
      {fill && (
        <>
          <span className="sparkle left-6 top-3 text-xl" aria-hidden="true">
            ✦
          </span>
          <span
            className="sparkle right-10 top-5 text-lg"
            style={{ animationDelay: "0.5s" }}
            aria-hidden="true"
          >
            ✧
          </span>
          <span
            className="sparkle left-1/2 top-2 text-sm"
            style={{ animationDelay: "0.8s" }}
            aria-hidden="true"
          >
            ✦
          </span>
        </>
      )}
      {opening && (
        <div className="overlay-book opening no-print" role="dialog" aria-modal="true">
          <div className="book-open">
            <div className="book-page left">
              <img
                src={opening.cover}
                alt={opening.title}
                className="h-40 w-full max-w-[150px] rounded object-cover shadow-md"
              />
              <span className="sparkle right-4 top-2 text-2xl" aria-hidden="true">
                ✦
              </span>
              <span
                className="sparkle left-3 bottom-6 text-xl"
                style={{ animationDelay: "0.4s" }}
                aria-hidden="true"
              >
                ✧
              </span>
            </div>
            <div className="book-page right">
              <h3 className="brand-display text-xl text-ink">{opening.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{opening.bandLabel}</p>
              <p className="mt-3 max-w-[180px] text-sm italic text-ink-soft">
                Something lovely is opening…
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BandShelf({
  emoji,
  label,
  range,
  stories,
  wood,
  scrollId,
}: {
  emoji: string;
  label: string;
  range: string;
  stories: Story[];
  wood: string;
  scrollId: string;
}) {
  return (
    <section id={scrollId} className="scroll-mt-28">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <div>
          <h3 className="brand-display text-xl text-ink">{label}</h3>
          <p className="text-sm text-ink-soft">
            Ages {range} · where to start looking
          </p>
        </div>
      </div>
      <Shelf stories={stories} wood={wood} empty={3} fill={stories.length < 6} />
    </section>
  );
}
