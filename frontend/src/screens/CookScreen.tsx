import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { Icon, Sheet } from "../components/ui";
import { useCoach } from "../coach";
import { media } from "../media";
import { recipes, steakSteps } from "../program";

function formatClock(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function CookScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const recipe = recipes.find((item) => item.id === params.get("recipe"));
  const coach = useCoach();
  const [stepIndex, setStepIndex] = useState(3);
  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(174);
  const [sheet, setSheet] = useState<"more" | "ingredients" | "steps" | null>(null);

  useEffect(() => {
    coach.connect();
    // The socket is created once for this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const step = steakSteps[stepIndex] ?? steakSteps[0];
  const liveText = coach.streamingText || [...coach.entries].reverse().find((entry) => entry.role === "captain")?.text;
  const systemNote = [...coach.entries].reverse().find((entry) => entry.role === "system")?.text;

  const ingredients = useMemo(
    () =>
      recipe
        ? [`${recipe.title}`, recipe.time, recipe.level, "Tell Cap what you have on the board before you start."]
        : ["1 steak, patted dry", "Neutral oil, a thin coat", "Salt", "A stable pan", "Instant-read thermometer"],
    [recipe],
  );

  const goToStep = (nextIndex: number, message: string) => {
    const bounded = Math.min(steakSteps.length - 1, Math.max(0, nextIndex));
    setStepIndex(bounded);
    coach.sendText(message);
  };

  const listen = () => {
    const recognitionCtor = (window as Window & { webkitSpeechRecognition?: new () => {
      lang: string;
      onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
      onerror: (() => void) | null;
      start: () => void;
    } }).webkitSpeechRecognition;
    if (!recognitionCtor) {
      document.getElementById("coach-input")?.focus();
      return;
    }
    const recognition = new recognitionCtor();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) coach.sendText(transcript);
    };
    recognition.onerror = () => {
      document.getElementById("coach-input")?.focus();
    };
    recognition.start();
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <header className="flex items-center justify-between px-4 pt-4 pb-2">
        <button type="button" className="flex size-10 items-center justify-center rounded-full bg-white/5" aria-label="Close session" onClick={() => navigate(-1)}>
          <Icon name="close" />
        </button>
        <div className="flex flex-col items-center gap-1.5">
          <h2 className="text-xs font-bold tracking-[0.2em] text-text-secondary uppercase">
            Step {stepIndex + 1} of {steakSteps.length}
          </h2>
          <div className="flex items-center gap-1.5">
            {steakSteps.slice(0, 5).map((_, index) => (
              <span
                key={index}
                className={`rounded-full ${index === Math.min(stepIndex, 4) ? "size-2 bg-primary" : "size-1.5 bg-white/20"}`}
              />
            ))}
          </div>
        </div>
        <button type="button" className="flex size-10 items-center justify-center rounded-full bg-white/5" aria-label="Session tools" onClick={() => setSheet("more")}>
          <Icon name="more_vert" />
        </button>
      </header>

      <main className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 pt-2 pb-64">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#262018] ring-1 ring-white/5">
          {coach.cameraActive ? (
            <video ref={coach.videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
          ) : (
            <img src={recipe?.image ?? media.steak} alt="" className="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
          <button
            type="button"
            className="absolute inset-0 flex items-center justify-center"
            aria-label={running ? "Pause timer" : "Start timer"}
            onClick={() => setRunning((current) => !current)}
          >
            <span className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
              <Icon name={running ? "pause" : "play_arrow"} filled className="text-4xl" />
            </span>
          </button>
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-xl">
            <span className={`size-2 rounded-full ${coach.connection === "ready" ? "animate-pulse bg-primary" : "bg-white/40"}`} />
            <span className="font-mono text-xl font-bold tracking-widest">{formatClock(seconds)}</span>
          </div>
          <div className="absolute right-4 bottom-4 left-4 flex gap-3">
            <button type="button" className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/40 text-xs font-bold tracking-wide uppercase" onClick={() => setSheet("ingredients")}>
              <Icon name="inventory_2" className="text-sm" /> Ingredients
            </button>
            <button type="button" className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black/40 text-xs font-bold tracking-wide uppercase" onClick={() => setSheet("steps")}>
              <Icon name="format_list_bulleted" className="text-sm" /> Full Steps
            </button>
          </div>
        </div>

        <div>
          <h1 className="mb-1 text-lg font-bold text-primary">{recipe ? recipe.title : step.title}</h1>
          <h3 className="text-3xl leading-[1.1] font-bold tracking-tight">{step.action}</h3>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-[#2e2518] to-[#1f1912] p-4">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-primary/20 p-2.5 text-primary">
              <Icon name="smart_toy" filled className="text-2xl" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <p className="text-xs font-bold tracking-widest text-primary uppercase">Captain AI</p>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-text-secondary">
                  {coach.connection === "ready" ? "Line ready" : coach.connection}
                </span>
              </div>
              <p className="text-sm leading-snug text-gray-200">{liveText || step.insight}</p>
            </div>
          </div>
        </div>
        <p className="text-lg leading-relaxed text-[#cbb290]">{step.detail}</p>
        <p className="text-xs leading-relaxed text-white/45">
          One action at a time. A camera frame is only transported. It is not a doneness, allergen, or safety check.
          {systemNote ? ` ${systemNote}` : ""}
        </p>
        <div ref={coach.transcriptRef} className="sr-only" aria-live="polite">
          {liveText}
        </div>
      </main>

      <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent px-6 pt-10 pb-6">
        <form className="mb-4 flex items-center gap-2" onSubmit={coach.submit}>
          <input
            id="coach-input"
            value={coach.input}
            onChange={(event) => coach.setInput(event.target.value)}
            placeholder="Tell Cap what you see"
            maxLength={4000}
            aria-label="Coaching instruction"
            className="h-12 flex-1 rounded-full border border-white/10 bg-black/30 px-4 outline-none"
          />
          <button type="submit" className="rounded-full bg-primary px-4 py-3 text-sm font-bold text-black" disabled={coach.connection !== "ready" || !coach.input.trim()}>
            Send
          </button>
        </form>
        <div className="mb-4 flex justify-center">
          <button type="button" className="flex items-center gap-3 rounded-full border border-primary/30 bg-[#262018]/80 px-6 py-3" onClick={listen}>
            <Icon name="mic" filled className="text-primary" />
            <span className="flex items-end gap-1" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((bar) => (
                <span key={bar} className="wave-bar" style={{ animationDelay: `${bar * 0.12}s` }} />
              ))}
            </span>
            <span className="text-sm font-semibold">Say &quot;Next Step&quot;</span>
          </button>
        </div>
        <div className="grid grid-cols-3 items-center gap-3">
          <button type="button" className="flex flex-col items-center gap-1 text-xs font-bold text-text-secondary" onClick={() => goToStep(stepIndex - 1, "Repeat the last step")}>
            <Icon name="replay_10" /> Rewind
          </button>
          <button type="button" className="mx-auto flex size-16 items-center justify-center rounded-full bg-white text-black" aria-label="Stop response" onClick={coach.interrupt} disabled={coach.connection !== "ready"}>
            <Icon name="pause" filled className="text-3xl" />
          </button>
          <button type="button" className="flex items-center justify-center gap-1 rounded-full bg-primary py-3 text-sm font-bold text-black" onClick={() => goToStep(stepIndex + 1, "Next step")}>
            Next Step <Icon name="arrow_forward" />
          </button>
        </div>
        <Link to="/lesson" className="mt-3 block text-center text-xs font-semibold text-text-secondary">
          Open the knife-skills lesson
        </Link>
      </div>

      {sheet === "ingredients" && (
        <Sheet title="Ingredients" onClose={() => setSheet(null)}>
          <ul className="flex flex-col gap-2">
            {ingredients.map((item) => (
              <li key={item} className="rounded-xl bg-white/5 px-3 py-2">{item}</li>
            ))}
          </ul>
        </Sheet>
      )}
      {sheet === "steps" && (
        <Sheet title="Full steps" onClose={() => setSheet(null)}>
          <ol className="flex flex-col gap-3">
            {steakSteps.map((item, index) => (
              <li key={item.action}>
                <button type="button" className="w-full text-left" onClick={() => { setStepIndex(index); setSheet(null); }}>
                  <span className="text-xs font-bold text-primary">Step {index + 1}</span>
                  <p className="font-semibold">{item.action}</p>
                </button>
              </li>
            ))}
          </ol>
        </Sheet>
      )}
      {sheet === "more" && (
        <Sheet title="Session tools" onClose={() => setSheet(null)}>
          <p className="mb-3 text-sm text-text-secondary">{coach.runtimeNote}</p>
          <p className="mb-4 text-xs text-white/40">Session {coach.sessionId.slice(0, 8).toUpperCase()}</p>
          <div className="flex flex-col gap-2">
            <button type="button" className="rounded-2xl bg-white/5 px-4 py-3 text-left font-semibold" onClick={() => coach.sendText("Start the egg test")}>
              Start the egg test
            </button>
            <button type="button" className="rounded-2xl bg-white/5 px-4 py-3 text-left font-semibold" onClick={() => void coach.enableCamera()}>
              {coach.cameraActive ? "Camera is on" : "Enable station camera"}
            </button>
            <button type="button" className="rounded-2xl bg-white/5 px-4 py-3 text-left font-semibold" onClick={coach.sendCameraFrame} disabled={!coach.cameraActive}>
              Send one frame
            </button>
            <label className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 font-semibold">
              Browser voice playback
              <input type="checkbox" checked={coach.speakReplies} onChange={(event) => coach.setSpeakReplies(event.target.checked)} />
            </label>
          </div>
        </Sheet>
      )}
    </div>
  );
}
