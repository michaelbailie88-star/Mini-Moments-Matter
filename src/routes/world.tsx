import { createFileRoute, Link } from "@tanstack/react-router";
import { ALL_STORIES, bandsWithStories } from "../lib/sites";
import { NARRATOR_CREDIT } from "../lib/stories";
import { Shelf } from "../components/Bookcase";
import { WaitlistForm } from "../components/WaitlistForm";

export const Route = createFileRoute("/world")({
  component: WorldPage,
});

const BUY_URL = "https://buy.stripe.com/aFa00l7U5czybVSb95eIw0U";
const PRICE = "$2.99";

function WorldPage() {
  return (
    <div>
      <header className="mb-8 text-center">
        <h1 className="brand-display text-4xl text-ink">🌍 World of Mini Moments</h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink-soft">
          The big, growing catalogue. Pick individual favourite stories to keep — no subscription
          needed. Each story is {PRICE} CAD and yours forever, ready to read, play, and treasure.
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-ink-soft">{NARRATOR_CREDIT}</p>
      </header>
      <section className="mb-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
        <span className="text-4xl">✨</span>
        <h2 className="brand-display mt-2 text-2xl text-ink">250+ activity stories are on the way</h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-soft">
          This is just the beginning. We're building a much larger World of Mini Moments, released in
          gentle batches as each one is written, recorded, and illustrated. Sign up below and we'll
          let you know when the next batch lands.
        </p>
        <div className="mt-6 flex justify-center">
          <WaitlistForm source="world" />
        </div>
      </section>
      {bandsWithStories.map(({ band, stories }) => (
        <section key={band.key} className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-3xl">{band.emoji}</span>
            <div>
              <h3 className="brand-display text-xl text-ink">{band.label}</h3>
              <p className="text-sm text-ink-soft">Ages {band.range}</p>
            </div>
          </div>
          <Shelf
            stories={stories}
            wood={band.wood}
            empty={3}
            fill={stories.length < 6}
          />
          <div className="mt-4 flex flex-wrap gap-3">
            {stories.map((a) => (
              <div
                key={a.slug}
                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-white/60 p-4 shadow-sm sm:w-auto sm:min-w-[260px] sm:flex-1"
              >
                <div className="min-w-0">
                  <p className="truncate font-bold text-ink">
                    {a.emoji} {a.title}
                  </p>
                  <p className="text-xs text-ink-soft">{a.ageLabel}</p>
                </div>
                <a
                  href={BUY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-pastel whitespace-nowrap"
                >
                  Get · {PRICE}
                </a>
              </div>
            ))}
          </div>
        </section>
      ))}
      <section className="rounded-3xl bg-white/60 p-8 text-center shadow-sm">
        <h2 className="brand-display text-2xl text-ink">Prefer the full library?</h2>
        <p className="mx-auto mt-2 max-w-xl text-ink-soft">
          The Treasure Chest subscription opens the whole current collection for less than one story
          a month. Explore both ways to keep your favourites.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/treasure-chest" className="btn btn-pastel">
            Explore the Treasure Chest
          </Link>
          <Link to="/adventure" className="btn btn-line">
            Try the free stories first
          </Link>
        </div>
      </section>
    </div>
  );
}
