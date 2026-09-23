import { useRef, useState, useEffect } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { STORY_MAP } from "../lib/sites";
import { NARRATOR_CREDIT, isFree, MarkdownBody, type Story } from "../lib/stories";

export const Route = createFileRoute("/story/$slug")({
  component: StoryPage,
});

/* ---------------------------------- audio ---------------------------------- */

function fmt(t: number) {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AudioPlayer({ slug, title }: { slug: string; title: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "missing">("loading");
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [tried, setTried] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMeta = () => setState("ready");
    const onError = () => setState("error");
    const onTime = () => setTime(el.currentTime);
    const onDur = () => setDuration(el.duration);
    const onEnd = () => {
      setPlaying(false);
      setTime(0);
      el.currentTime = 0;
    };
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("error", onError);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("durationchange", onDur);
    el.addEventListener("ended", onEnd);
    const timer = setTimeout(() => {
      setState((s) => (s === "loading" ? "missing" : s));
    }, 2500);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("error", onError);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("durationchange", onDur);
      el.removeEventListener("ended", onEnd);
    };
  }, [slug]);

  function toggle() {
    const el = ref.current;
    if (!el) return;
    if (state === "missing" || state === "error") {
      setTried(true);
      return;
    }
    if (el.paused) {
      el.play().catch(() => setState("error"));
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  return (
    <div>
      <div className="audio-shell">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause narration" : "Play narration"}
          className="play-btn text-2xl"
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-ink">Play</p>
            <span className="text-xs text-ink-soft">· Read aloud by Tatianna Bailie</span>
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-ink-soft">
            <span>{fmt(time)}</span>
            <div className="h-1.5 flex-1 rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-pink-p3"
                style={{ width: duration ? `${(time / duration) * 100}%` : "0%" }}
              />
            </div>
            <span>{fmt(duration)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            const el = ref.current;
            if (!el) return;
            el.currentTime = 0;
            el.play().catch(() => setState("error"));
            setPlaying(true);
          }}
          className="text-sm text-ink-soft underline-offset-2 hover:underline"
        >
          Restart
        </button>
        <audio ref={ref} src={`/audio/${slug}.mp3`} preload="metadata" />
      </div>
      {(state === "missing" || state === "error") && (
        <p className="mt-2 text-sm font-semibold text-ink-soft">
          {tried
            ? "Narration coming soon — read together for now. Tatianna's voice will live here. 🎧"
            : `Narration coming soon for “${title}” — read together for now.`}
        </p>
      )}
    </div>
  );
}

/* -------------------------------- page pieces ------------------------------- */

function Revisit() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-pink-p2/60 bg-pink-p/40 p-4">
      <span className="rounded-full bg-pink-p2 px-3 py-1 text-sm font-bold text-ink">🔁 Revisit</span>
      <p className="text-sm text-ink-soft">
        Little stories are worth reading again and again. Stay with the moment, wonder together, and do
        the activities once more — each visit grows something new.
      </p>
    </div>
  );
}

const SECTION_META: Record<string, { label: string; eyebrow: string }> = {
  reflect: { label: "Reflect", eyebrow: "Tatianna's tiny question" },
  play: { label: "Play", eyebrow: "Let's do it together" },
  remember: { label: "Remember", eyebrow: "Capture the keepsake" },
  grow: { label: "Grow", eyebrow: "As you grow" },
};

function PrintHeader() {
  return (
    <div className="print-header print-only">
      <div>
        <p className="text-sm font-bold">Mini Moments Matter</p>
        <p className="text-xs">Stories to read. Moments to make. Memories to keep.</p>
      </div>
      <p className="text-xs italic">{NARRATOR_CREDIT}</p>
    </div>
  );
}

function FreeStory({ story }: { story: Story }) {
  return (
    <article className="mx-auto max-w-3xl">
      <PrintHeader />
      <div className="overflow-hidden rounded-3xl bg-white/70 shadow-md">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <img
            src={story.cover}
            alt={`Cover of ${story.title}`}
            className="h-52 w-40 shrink-0 rounded-lg object-cover shadow-lg"
          />
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
              {story.bandLabel}
            </p>
            <h1 className="brand-display mt-1 text-3xl text-ink">
              {story.title} {story.emoji}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">{story.ageLabel}</p>
            <p className="mt-3 text-xs italic text-ink-soft">{NARRATOR_CREDIT}</p>
          </div>
        </div>
        <div className="border-t border-ink/10 p-6">
          <AudioPlayer slug={story.slug} title={story.title} />
        </div>
      </div>
      <Revisit />
      <section className="mt-8 rounded-3xl bg-white/70 p-6 shadow-sm">
        <h2 className="brand-display text-2xl text-ink">🌿 Story</h2>
        <div className="mt-4">
          <MarkdownBody text={story.narrative} />
        </div>
      </section>
      {story.sections.map((sec, l) => {
        const meta = SECTION_META[sec.kind] || { label: sec.heading, eyebrow: "" };
        const icon =
          sec.kind === "reflect" ? "🔆" : sec.kind === "play" ? "🎨" : sec.kind === "remember" ? "📸" : "🌱";
        return (
          <section key={l} className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-p3">
              {meta.eyebrow || meta.label}
            </p>
            <h2 className="brand-display mt-1 text-xl text-ink">
              {icon} {meta.label}
            </h2>
            <div className="mt-3">
              <MarkdownBody text={sec.body} />
            </div>
            {sec.kind === "reflect" && (
              <p className="mt-4 text-xs italic text-ink-soft">— Tatianna Bailie</p>
            )}
          </section>
        );
      })}
      <section className="mt-6 rounded-3xl bg-white/70 p-6 text-center shadow-sm">
        <p className="brand-display text-lg text-ink">✨ Mini Moments Matter</p>
        <p className="mt-2 text-sm text-ink-soft">
          Read with love by Tatianna Bailie — a dedicated educator with lots of love for children and
          their mini moments.
        </p>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn btn-pastel mt-4 no-print"
        >
          🖨️ Download & Print
        </button>
      </section>
    </article>
  );
}

function GatedStory({ story }: { story: Story }) {
  return (
    <article className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-3xl bg-white/70 shadow-md">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <img
            src={story.cover}
            alt={`Cover of ${story.title}`}
            className="h-52 w-40 shrink-0 rounded-lg object-cover shadow-lg"
          />
          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-wide text-ink-soft">
              {story.bandLabel}
            </p>
            <h1 className="brand-display mt-1 text-3xl text-ink">
              {story.title} {story.emoji}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">{story.ageLabel}</p>
            <p className="mt-3 text-xs italic text-ink-soft">{NARRATOR_CREDIT}</p>
          </div>
        </div>
      </div>
      <section className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-ink shadow-sm">
          🔒 In the Treasure Chest
        </span>
        <h2 className="brand-display mt-3 text-2xl text-ink">{story.title}</h2>
        <p className="mt-3 text-ink-soft">{story.teaser}</p>
        <p className="mt-4 text-sm text-ink-soft">
          This story is part of the full collection. Subscribe to open every story, or pick this one
          up on its own.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="https://buy.stripe.com/fZu5kF8Y94327FCelheIw0x"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-pastel"
          >
            Subscribe · $3.99/mo
          </a>
          <a
            href="https://buy.stripe.com/aFa00l7U5czybVSb95eIw0U"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-line"
          >
            Get this story · $2.99
          </a>
          <Link to="/treasure-chest" className="btn btn-line">
            All Treasure Chest stories
          </Link>
        </div>
      </section>
    </article>
  );
}

function StoryPage() {
  const { slug } = useParams({ from: "/story/$slug" });
  const story = STORY_MAP[slug];
  if (!story)
    return (
      <div className="py-16 text-center">
        <h1 className="brand-display text-3xl text-ink">Story not found</h1>
        <p className="mt-3 text-ink-soft">This little moment doesn't seem to be on the shelf just yet.</p>
        <Link to="/adventure" className="btn btn-pastel mt-6">
          Back to Adventure
        </Link>
      </div>
    );
  return isFree(slug) ? <FreeStory story={story} /> : <GatedStory story={story} />;
}
