import { useState } from "react";
import { Link } from "react-router-dom";

import { Icon, Sheet } from "../components/ui";
import { media } from "../media";

const links = [
  { to: "/cook", label: "Live cooking" },
  { to: "/discover", label: "Recipe discovery" },
  { to: "/path", label: "Learning path" },
  { to: "/program", label: "16-week program" },
  { to: "/catalog", label: "Course catalog" },
  { to: "/journey", label: "My journey" },
];

export function WelcomeScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex min-h-dvh flex-col">
      <header className="absolute top-0 z-10 flex w-full items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <Icon name="soup_kitchen" className="text-primary text-[28px]" />
          <span className="text-sm font-bold tracking-wider uppercase">Captain Culinary</span>
        </div>
        <button type="button" className="text-white/80" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <Icon name="menu" />
        </button>
      </header>

      <main className="flex flex-1 flex-col items-center px-6 pt-24 pb-8">
        <div className="relative mb-6 aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-white/5 bg-slate-900 shadow-2xl">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url('${media.welcomeChef}')` }}
            role="img"
            aria-label="Captain Culinary coaching a live kitchen"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex animate-pulse items-center gap-2 rounded-full bg-red-500/90 px-3 py-1.5 shadow-lg">
            <span className="size-2 rounded-full bg-white" />
            <span className="text-[10px] font-bold tracking-wider text-white uppercase">Live Feedback</span>
          </div>
          <div className="absolute right-4 bottom-6 left-4 flex flex-col gap-3">
            <div className="max-w-[80%] self-end rounded-2xl rounded-tr-sm border border-white/10 bg-slate-900/60 p-3 backdrop-blur-md">
              <p className="text-xs text-white/90">How do I know the slices are thin enough?</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-background-dark bg-primary">
                <Icon name="smart_toy" className="text-[20px]" />
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-sm border border-primary/20 bg-slate-800/95 p-3.5">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-wide text-primary uppercase">Captain Culinary</span>
                  <Icon name="graphic_eq" className="text-[14px] text-primary" />
                </div>
                <p className="text-xs leading-snug font-medium text-slate-200">
                  Tell me what you see, Chef. Matchstick-thin is the mark. One check, then we adjust.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3 text-center">
          <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight">
            <span className="block">Live Chef in</span>
            <span className="block text-primary">Your Kitchen.</span>
          </h1>
          <p className="mx-auto mt-2 max-w-[95%] text-sm leading-relaxed font-medium text-white/60">
            Master cooking with classes and hands-on modules. Cap coaches one action at a time, from what you tell him.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/5 px-3 py-1 text-[11px] font-bold">
              <Icon name="school" className="text-[16px] text-primary" /> Modules
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/5 px-3 py-1 text-[11px] font-bold">
              <Icon name="record_voice_over" className="text-[16px] text-primary" /> Conversational
            </span>
          </div>
        </div>

        <div className="mt-auto flex w-full max-w-sm flex-col gap-4 pt-6">
          <Link
            to="/cook"
            className="flex w-full items-center justify-center rounded-full border-2 border-primary py-4 text-base font-bold tracking-wide text-primary"
          >
            Start Cooking Live
          </Link>
          <Link to="/login" className="py-2 text-center text-sm font-bold">
            Log In
          </Link>
        </div>
      </main>

      <footer className="pb-6 text-center">
        <p className="text-[10px] text-white/30">
          By continuing, you agree to our <Link className="underline" to="/terms">Terms</Link> &{" "}
          <Link className="underline" to="/privacy">Privacy Policy</Link>.
        </p>
      </footer>

      {menuOpen && (
        <Sheet title="Captain Culinary" onClose={() => setMenuOpen(false)}>
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="rounded-2xl bg-white/5 px-4 py-3 font-semibold" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        </Sheet>
      )}
    </div>
  );
}
