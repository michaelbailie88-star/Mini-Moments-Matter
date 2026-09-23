import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<{ name: string } | null>(null);
  const [name, setName] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mmm.profile");
      if (raw) setProfile(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  function signIn(e: FormEvent) {
    e.preventDefault();
    const v = name.trim();
    if (!v) return;
    const data = { name: v };
    try {
      localStorage.setItem("mmm.profile", JSON.stringify(data));
    } catch {}
    setProfile(data);
    setName("");
  }
  function signOut() {
    try {
      localStorage.removeItem("mmm.profile");
    } catch {}
    setProfile(null);
  }
  return (
    <div className="mx-auto max-w-xl">
      <header className="mb-8 text-center">
        <h1 className="brand-display text-4xl text-ink">My Profile</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          A simple, on-device profile. Your name is stored only on this device — nothing is sent
          anywhere. Sign in is a friendly way of saying "hello again."
        </p>
      </header>
      {ready ? (
        profile ? (
          <div className="rounded-3xl bg-white/60 p-8 text-center shadow-sm">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pink-p2 via-blue-p2 to-purple-p2 text-3xl">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="brand-display mt-4 text-2xl text-ink">Welcome back, {profile.name}</h2>
            <p className="mt-2 text-sm text-ink-soft">
              You're signed in on this device. Your keepsakes and libraries live here as they're
              released.
            </p>
            <button type="button" onClick={signOut} className="btn btn-line mt-6">
              Sign Out
            </button>
          </div>
        ) : (
          <div className="rounded-3xl bg-white/60 p-8 shadow-sm">
            <h2 className="brand-display text-2xl text-ink">Sign In</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Tell us your first name so we can say hello when you return. Full accounts are coming in
              a future release.
            </p>
            <form onSubmit={signIn} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your first name"
                className="w-full rounded-full border border-ink/20 bg-white/80 px-5 py-3 text-ink outline-none placeholder:text-ink-soft/60 focus:border-pink-p3"
              />
              <button type="submit" className="btn btn-pastel shrink-0">
                Sign In
              </button>
            </form>
          </div>
        )
      ) : (
        <p className="text-center text-ink-soft">Loading…</p>
      )}
    </div>
  );
}
