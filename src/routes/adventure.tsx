import { createFileRoute, Link } from "@tanstack/react-router";
import { FREE_STORIES, bandsWithStories } from "../lib/sites";
import { BandShelf } from "../components/Bookcase";

export const Route = createFileRoute("/adventure")({
  component: AdventurePage,
});

function AdventurePage() {
  const freeBands = bandsWithStories
    .map((b) => ({ ...b, stories: b.stories.filter((s) => FREE_STORIES.some((f) => f.slug === s.slug)) }))
    .filter((b) => b.stories.length > 0);
  return (
    <div>
      <header className="mb-8 text-center">
        <h1 className="brand-display text-4xl text-ink">🐸 Mini Moments Adventure</h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink-soft">
          The free tier. Three complete activity stories you can read, play, and keep right now — no
          subscription needed. Pick a book off the shelf to open it.
        </p>
      </header>
      {freeBands.map(({ band, stories }) => (
        <div key={band.key} className="mb-10">
          <BandShelf
            emoji={band.emoji}
            label={band.label}
            range={band.range}
            stories={stories}
            wood={band.wood}
            scrollId={`adventure-${band.key}`}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {stories.map((t) => (
              <Link
                key={t.slug}
                to="/story/$slug"
                params={{ slug: t.slug }}
                className="rounded-2xl bg-white/60 p-4 shadow-sm transition hover:-translate-y-0.5"
              >
                <p className="font-bold text-ink">
                  {t.emoji} {t.title}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{t.ageLabel}</p>
                <p className="mt-2 line-clamp-2 text-xs text-ink-soft">{t.teaser}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
      <section className="mt-10 rounded-3xl bg-white/60 p-8 text-center shadow-sm">
        <h2 className="brand-display text-2xl text-ink">Finished the free stories?</h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-soft">
          When you're ready for more, the Treasure Chest holds the full collection on a gentle
          subscription — and every story is read aloud by Tatianna Bailie.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/treasure-chest" className="btn btn-pastel">
            Explore the Treasure Chest
          </Link>
          <Link to="/world" className="btn btn-line">
            Visit the World
          </Link>
        </div>
      </section>
    </div>
  );
}
