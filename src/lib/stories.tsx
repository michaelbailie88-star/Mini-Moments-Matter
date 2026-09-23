import type { ReactNode } from "react";

export type BandKey = "little-ones" | "toddlers" | "preschool" | "school-age";

export interface Band {
  key: BandKey;
  emoji: string;
  label: string;
  range: string;
  wood: string;
}

export interface StorySection {
  heading: string;
  body: string;
  kind: "reflect" | "play" | "remember" | "grow" | "other";
}

export interface Story {
  slug: string;
  title: string;
  emoji: string;
  series: string;
  ageLabel: string;
  band: BandKey;
  bandLabel: string;
  teaser: string;
  narrative: string;
  sections: StorySection[];
  cover: string;
}

export const BANDS: Band[] = [
  { key: "little-ones", emoji: "🐣", label: "Little Ones", range: "0–12 mo", wood: "wood-light" },
  { key: "toddlers", emoji: "🧸", label: "Toddlers", range: "1–3", wood: "wood" },
  { key: "preschool", emoji: "🎨", label: "Preschool", range: "3–5", wood: "wood-mid" },
  { key: "school-age", emoji: "🌱", label: "School Age", range: "5–7+", wood: "wood-dark" },
];

export const FREE_SLUGS = ["adventures-with-mr-frog", "the-spider-in-the-sink", "the-tiny-things"];

export const NARRATOR_CREDIT =
  "Voiced by Tatianna Bailie – a dedicated educator with lots of love for children and their mini moments.";

/** Map an H2 heading to its story-page section kind (mirrors the live site). */
function kindForHeading(heading: string): StorySection["kind"] {
  const e = heading.toLowerCase();
  if (e.includes("reflection")) return "reflect";
  if (
    e.includes("try it") ||
    e.includes("let's") ||
    e.includes("around you") ||
    e.includes("together")
  )
    return "play";
  if (e.includes("capture") || e.includes("remember") || e.includes("keepsake"))
    return "remember";
  if (e.includes("grow")) return "grow";
  return "other";
}

function bandFor(series: string, slug: string): BandKey {
  let first = "3-5";
  const m = series.match(/\(([^)]*)\)/);
  if (m) first = m[1].replace(/–/g, "-");
  const h = first.trim();
  if (h.startsWith("0-12") || slug === "the-first-little-drum" || slug === "the-very-first-laugh")
    return "little-ones";
  if (h.startsWith("1") || h.startsWith("2")) return "toddlers";
  if (h.startsWith("3")) return "preschool";
  return "school-age";
}

function ageLabel(series: string): string {
  return (
    "Ages " +
    (series.match(/\(([^)]*)\)/g) || [])
      .map((t) => t.replace(/[()]/g, ""))
      .join(" · ")
  );
}

export const GRADIENTS = [
  "linear-gradient(180deg,#fbd9e8,#f7c8de)",
  "linear-gradient(180deg,#cbeafa,#b3e0f7)",
  "linear-gradient(180deg,#fbeec2,#f7e4aa)",
  "linear-gradient(180deg,#dbf0e4,#c5e8d3)",
  "linear-gradient(180deg,#fbd5cd,#f6c3b8)",
  "linear-gradient(180deg,#e4d8f4,#d4c1ed)",
];

export const FILLERS = ["🧸", "🪴", "🧱", "🎨", "🧩", "🖍️", "🌷", "🪀", "📚", "🫧", "🪵", "🐻"];

export function parseStory(slug: string, md: string): Story {
  const lines = md.split("\n");
  let title = slug;
  let emoji = "";
  let series = "";
  let i = 0;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("# ")) {
      title = line.replace(/^#\s+/, "").trim();
      const m = title.match(/([\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}])\s*$/u);
      if (m) {
        emoji = m[1];
        title = title.slice(0, m.index).replace(/\s+$/u, "");
      }
      continue;
    }
    if (line.startsWith("*Series:")) {
      series = line.replace(/^\*Series:\s*/, "").replace(/\*$/, "").trim();
      continue;
    }
    if (line === "---") break;
  }

  const parts = lines.slice(i + 1).join("\n").split(/\n---\n/);
  const narrative = (parts[0] || "").trim();
  const sections: StorySection[] = [];
  for (let o = 1; o < parts.length; o++) {
    const block = (parts[o] || "").trim();
    if (!block) continue;
    const nl = block.indexOf("\n");
    let heading = "";
    let body = block;
    if (block.startsWith("##")) {
      if (nl === -1) {
        heading = block.replace(/^#+\s*/, "").trim();
        body = "";
      } else {
        heading = block.slice(0, nl).replace(/^#+\s*/, "").trim();
        body = block.slice(nl + 1).trim();
      }
    }
    const kind = kindForHeading(heading || "More");
    sections.push({ heading: heading || "More", body, kind });
  }

  const teaser = narrative
    .replace(/\*\*/g, "")
    .replace(/\n+/g, " ")
    .trim();
  const teaserMatch = teaser.match(/[^.!?]+[.!?]+/g) || [teaser];
  const band = bandFor(series, slug);
  const bandRow = BANDS.find((b) => b.key === band);
  return {
    slug,
    title,
    emoji,
    series,
    ageLabel: ageLabel(series) || bandRow?.range || "",
    band,
    bandLabel: `${bandRow?.emoji ?? ""} ${bandRow?.label ?? ""}`,
    teaser: teaserMatch.slice(0, 2).join(" ").trim(),
    narrative,
    sections,
    cover: `/covers/cover-${slug}.png`,
  };
}

export function createStoryMap(mods: Record<string, string>): Record<string, Story> {
  const map: Record<string, Story> = {};
  for (const [key, md] of Object.entries(mods)) {
    const slug = key.replace(/\.md(\?raw)?$/, "");
    map[slug] = parseStory(slug, md);
  }
  return map;
}

export const isFree = (slug: string) => FREE_SLUGS.includes(slug);

export function InlineMd({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((s, i) => {
        if (s.startsWith("**") && s.endsWith("**") && s.length > 4)
          return <strong key={i}>{s.slice(2, -2)}</strong>;
        if (s.startsWith("*") && s.endsWith("*") && s.length > 2)
          return <em key={i}>{s.slice(1, -1)}</em>;
        return <span key={i}>{s}</span>;
      })}
    </>
  );
}

type Block = { kind: "p" | "list" | "h2" | "h3" | "hr"; text?: string; items?: string[] };

export function MarkdownBody({ text }: { text: string }): ReactNode {
  const lines = text.split("\n");
  const out: ReactNode[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushPara = (key: number) => {
    if (para.length) {
      out.push(
        <p key={`p-${key}`}>
          <InlineMd text={para.join(" ")} />
        </p>
      );
      para = [];
    }
  };
  const flushList = (key: number) => {
    if (list.length) {
      out.push(
        <ul key={`ul-${key}`} className="ml-5 list-disc space-y-1">
          {list.map((it, i) => (
            <li key={i}>
              <InlineMd text={it} />
            </li>
          ))}
        </ul>
      );
      list = [];
    }
  };
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    if (line.startsWith("##")) {
      flushPara(i * 10 + 1);
      flushList(i * 10 + 2);
      out.push(
        <h2 key={`h-${i}`}>
          <InlineMd text={line.replace(/^#+\s*/, "")} />
        </h2>
      );
    } else if (line.startsWith("#")) {
      flushPara(i * 10 + 1);
      flushList(i * 10 + 2);
      out.push(
        <h3 key={`h-${i}`}>
          <InlineMd text={line.replace(/^#+\s*/, "")} />
        </h3>
      );
    } else if (line === "---") {
      flushPara(i * 10 + 1);
      flushList(i * 10 + 2);
    } else if (line.startsWith("- ")) {
      flushPara(i * 10 + 1);
      list.push(line.slice(2));
    } else {
      flushList(i * 10 + 100);
      para.push(line);
    }
  });
  flushPara(9999);
  flushList(10000);
  return (
    <div className="prose-story">
      {out.map((n, i) => (
        <span key={i}>{n}</span>
      ))}
    </div>
  );
}
