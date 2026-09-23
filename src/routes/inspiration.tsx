import { createFileRoute, Link } from "@tanstack/react-router";
import { NARRATOR_CREDIT } from "../lib/stories";

export const Route = createFileRoute("/inspiration")({
  component: InspirationPage,
});

function InspirationPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-8 text-center">
        <h1 className="brand-display text-4xl text-ink">Why I Made Mini Moments Matter</h1>
        <p className="mt-3 text-sm italic text-ink-soft">{NARRATOR_CREDIT}</p>
      </header>
      <div className="rounded-3xl bg-white/60 p-8 shadow-sm">
        <p className="brand-display text-2xl leading-relaxed text-ink">
          "Childhood doesn't happen in milestones. It happens in moments."
        </p>
        <div className="mt-6 space-y-5 text-ink-soft">
          <p>
            As an educator, I've spent my days with children — and I've watched them lose themselves
            completely in the tiniest, quietest things. A spider in the sink. A paint splash. The very
            first laugh. These are the moments that make childhood extraordinary, if we're lucky enough
            to stop and notice them.
          </p>
          <p>
            Mini Moments Matter began with a simple wish: to help families and educators slow down,
            connect, and celebrate those little moments — not the big milestones, but everything in
            between. Every story here is written to read, play, and keep, so a fleeting moment can
            stay with you forever.
          </p>
          <p>
            That's why every activity story lives in three promises:{" "}
            <strong className="text-ink">stories to read</strong>,{" "}
            <strong className="text-ink">moments to make</strong>, and{" "}
            <strong className="text-ink">memories to keep</strong>. I made this for the children, the
            families, and the educators who believe, like I do, that the little things are actually
            the big things.
          </p>
        </div>
      </div>
      <div className="mt-8 text-right">
        <p className="brand-display text-lg text-ink">With love,</p>
        <p className="text-ink">Tatianna Bailie</p>
      </div>
      <div className="mt-8 rounded-3xl bg-white/60 p-8 text-center shadow-sm">
        <h2 className="brand-display text-2xl text-ink">Read a little moment with me</h2>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link to="/adventure" className="btn btn-pastel">
            Open Mini Moments Adventure
          </Link>
          <Link to="/world" className="btn btn-line">
            Browse the World
          </Link>
        </div>
      </div>
    </div>
  );
}
