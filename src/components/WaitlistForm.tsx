import { useState } from "react";
import { subscribe } from "../server/actions";

type State = "idle" | "busy" | "success" | "error";

function useWaitlist() {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  async function submit(email: string, source: string) {
    setState("busy");
    setMessage("");
    try {
      const res = await subscribe({ data: { email, source } });
      if (res.ok) {
        setState("success");
      } else {
        setState("error");
        setMessage(res.message || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }
  return { state, message, submit, reset: () => setState("idle") };
}

export function WaitlistForm({
  source,
  cta = "Join the waitlist",
  note,
}: {
  source: string;
  cta?: string;
  note?: string;
}) {
  const { state, message, submit } = useWaitlist();
  const [email, setEmail] = useState("");
  return (
    <div>
      <form
        className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          submit(email, source);
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-ink/20 bg-white/80 px-5 py-3 text-ink outline-none placeholder:text-ink-soft/60 focus:border-pink-p3"
          disabled={state === "busy"}
        />
        <button
          type="submit"
          disabled={state === "busy" || state === "success"}
          className="btn btn-pastel shrink-0 disabled:opacity-60"
        >
          {state === "busy" ? "Saving…" : state === "success" ? "You're on the list ✓" : cta}
        </button>
      </form>
      {state === "success" && (
        <p className="mt-3 text-sm font-semibold text-green-p3">
          {message || "You're on the list. Thank you!"}
        </p>
      )}
      {state === "error" && (
        <p className="mt-3 text-sm font-semibold text-red-p3">{message}</p>
      )}
      <p className="mt-3 text-xs text-ink-soft">
        {note || "We'll only use your email to share news from Mini Moments Matter. No spam, ever."}
      </p>
    </div>
  );
}
