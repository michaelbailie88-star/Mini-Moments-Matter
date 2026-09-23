import { createFileRoute } from "@tanstack/react-router";
import { CHEST_STORIES, bandsWithStories } from "../lib/sites";
import { NARRATOR_CREDIT } from "../lib/stories";

export const Route = createFileRoute("/treasure-chest")({
  component: TreasureChestPage,
});

const MONTHLY = "https://buy.stripe.com/fZu5kF8Y94327FCelheIw0x";
const ANNUAL = "https://buy.stripe.com/00w5kF8Y92YYbVSa51eIw0y";

function TreasureChestPage() {
  const bands = bandsWithStories
    .map((b) => ({ ...b, stories: b.stories.filter((s) => CHEST_STORIES.some((c) => c.slug === s.slug)) }))
    .filter((b) => b.stories.length > 0);
  return (
    <div>
      <header className="mb-8 text-center">
        <h1 className="brand-display text-4xl text-ink">🧰 Mini Moments Treasure Chest</h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink-soft">
          The paid library of Mini Moments Matter — twenty-four more activity stories, each one
          themed, read aloud by Tatianna Bailie, and ready to do. Unlock the whole chest on a gentle
          subscription.
        </p>
      </header>
      <section className="mb-10 overflow-hidden rounded-3xl bg-white/70 shadow-md">
        <div className="grid gap-6 p-8 md:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-white/70 px-4 py-1.5 text-sm font-bold text-ink shadow-sm">
              🔑 Unlock the full chest
            </span>
            <h2 className="brand-display mt-4 text-3xl text-ink">
              Subscribe to open all {CHEST_STORIES.length} stories
            </h2>
            <p className="mt-3 text-ink-soft">
              Subscribe to the Treasure Chest and every story sits on your shelf — read aloud, with
              printables and keepsake moments included. Cancel anytime.
            </p>
            <p className="mt-4 text-xs italic text-ink-soft">{NARRATOR_CREDIT}</p>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <a
              href={MONTHLY}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-pastel w-full justify-between"
            >
              <span>Subscribe — Monthly</span>
              <span className="font-bold">$3.99/mo</span>
            </a>
            <a
              href={ANNUAL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ink w-full justify-between"
            >
              <span>Subscribe — Annual</span>
              <span className="font-bold">$32.99/yr</span>
            </a>
            <p className="text-center text-xs text-ink-soft">
              Pricing in CAD. Checkout is handled securely by Stripe.
            </p>
          </div>
        </div>
      </section>
      {bands.map(({ band, stories }) => (
        <section key={band.key} className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-3xl">{band.emoji}</span>
            <div>
              <h3 className="brand-display text-xl text-ink">{band.label}</h3>
              <p className="text-sm text-ink-soft">
                Ages {band.range} · locked until you subscribe
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((t) => (
              <div key={t.slug} className="flex gap-4 rounded-2xl bg-white/60 p-4 shadow-sm">
                <img
                  src={t.cover}
                  alt={`Cover of ${t.title}`}
                  className="h-32 w-24 shrink-0 rounded-md object-cover shadow"
                />
                <div className="min-w-0">
                  <p className="font-bold leading-tight text-ink">
                    {t.emoji} {t.title}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">{t.ageLabel}</p>
                  <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                    <span className="mr-1 inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold text-ink shadow-sm">
                      🔒 Preview
                    </span>
                    {t.teaser}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
