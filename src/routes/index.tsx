import { createFileRoute, Link } from "@tanstack/react-router";
import { FREE_STORIES, STORY_MAP } from "../lib/sites";
import { NARRATOR_CREDIT } from "../lib/stories";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const PROMISES = [
  {
    emoji: "✨",
    title: "Stories to read",
    body: "Warm picture-book tales with recurring friends Lily, Theo, and Nana — every one read aloud in a real human voice.",
  },
  {
    emoji: "🎨",
    title: "Moments to make",
    body: "Simple, doable activities and printables that turn each story into something you make and do together.",
  },
  {
    emoji: "📷",
    title: "Memories to keep",
    body: "Capture the moment. Build your keepsakes shelf and turn favourite collections into keepsake books.",
  },
];

const WAYS = [
  {
    emoji: "🐸",
    title: "Mini Moments Adventure",
    body: "The free flagship stories — read and do them today.",
    to: "/adventure" as const,
  },
  {
    emoji: "🧰",
    title: "Treasure Chest",
    body: "The paid library — twenty-four more stories on a subscription.",
    to: "/treasure-chest" as const,
  },
  {
    emoji: "🌍",
    title: "World of Mini Moments",
    body: "Individually purchase favourite stories, one at a time.",
    to: "/world" as const,
  },
];

function HomePage() {
  const featured = STORY_MAP["the-tiny-things"];
  const trio = FREE_STORIES;
  return (
    <div>
      <section className="grid items-center gap-8 py-6 md:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-bold text-ink shadow-sm">
            ✨ Mini Moments Matter
          </div>
          <h1 className="brand-display mt-4 text-4xl leading-tight text-ink sm:text-5xl">
            Stories to read.
            <br />
            Moments to make.
            <br />
            <span className="text-ink-soft">Memories to keep.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">
            Childhood doesn't happen in milestones. It happens in moments. We gather the little
            experiences of childhood into activity stories to read, do, and treasure.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/adventure" className="btn btn-pastel">
              Start with the free trio
            </Link>
            <Link to="/world" className="btn btn-line">
              Browse the World
            </Link>
          </div>
          <p className="mt-4 text-xs italic text-ink-soft">{NARRATOR_CREDIT}</p>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 rounded-[2.5rem] bg-white/50 blur-sm" />
          <img
            src="/assets/hero.png"
            alt="A warm, whimsical childhood illustration"
            className="relative w-full rounded-[2.5rem] object-cover shadow-xl"
          />
          <img
            src="/assets/logo.png"
            alt="Mini Moments Matter — a glass jar full of sparkles"
            className="absolute -bottom-5 -left-5 h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
          />
        </div>
      </section>

      <section className="mt-16 rounded-3xl bg-white/60 p-8 text-center shadow-sm">
        <p className="brand-display text-2xl text-ink sm:text-3xl">
          “Childhood doesn't happen in milestones. It happens in moments.”
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-ink-soft">
          The first laugh, the spilled paint, the sink spider turned hero — these quiet little things
          are what childhood is really made of. Mini Moments Matter helps you slow down and stay with
          them.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="brand-display mb-6 text-center text-3xl text-ink">
          Every activity story has it
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PROMISES.map((t) => (
            <div key={t.title} className="rounded-3xl bg-white/60 p-6 shadow-sm">
              <span className="text-4xl">{t.emoji}</span>
              <h3 className="brand-display mt-3 text-xl text-ink">{t.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {featured && (
        <section className="mt-16 overflow-hidden rounded-3xl bg-white/60 shadow-sm">
          <div className="grid items-center gap-6 p-8 md:grid-cols-[auto_1fr]">
            <img
              src={featured.cover}
              alt={`Cover of ${featured.title}`}
              className="h-56 w-44 shrink-0 rounded-lg object-cover shadow-lg"
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
                {featured.bandLabel} · Featured free story
              </p>
              <h2 className="brand-display mt-1 text-3xl text-ink">
                {featured.title} {featured.emoji}
              </h2>
              <p className="mt-1 text-sm text-ink-soft">{featured.ageLabel}</p>
              <p className="mt-4 max-w-xl text-ink-soft">{featured.teaser}</p>
              <Link
                to="/story/$slug"
                params={{ slug: featured.slug }}
                className="btn btn-pastel mt-6"
              >
                Read, play & keep
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="mt-16">
        <div className="mb-6 text-center">
          <h2 className="brand-display text-3xl text-ink">Start with the free trio</h2>
          <p className="mt-2 text-ink-soft">
            Three complete activity stories — read and do them free, right now.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {trio.map((t) => (
            <Link
              key={t.slug}
              to="/story/$slug"
              params={{ slug: t.slug }}
              className="group rounded-3xl bg-white/60 p-5 shadow-sm transition hover:-translate-y-1"
            >
              <img
                src={t.cover}
                alt={`Cover of ${t.title}`}
                className="h-44 w-full rounded-2xl object-cover shadow"
              />
              <h3 className="brand-display mt-4 text-xl text-ink">
                {t.emoji} {t.title}
              </h3>
              <p className="mt-1 text-sm text-ink-soft">{t.ageLabel}</p>
              <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{t.teaser}</p>
              <span className="btn btn-pastel mt-4 inline-block">Read, play & keep</span>
            </Link>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/adventure" className="btn btn-line">
            Open Mini Moments Adventure
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="brand-display mb-6 text-center text-3xl text-ink">Ways to explore</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {WAYS.map((w) => (
            <Link
              key={w.to}
              to={w.to}
              className="group rounded-3xl bg-white/60 p-6 shadow-sm transition hover:-translate-y-1"
            >
              <span className="text-3xl">{w.emoji}</span>
              <h3 className="brand-display mt-3 text-xl text-ink">{w.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{w.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
