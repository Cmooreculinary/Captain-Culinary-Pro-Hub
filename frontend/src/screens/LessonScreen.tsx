import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Icon } from "../components/ui";
import { media } from "../media";
import { quiz } from "../program";

export function LessonScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"Overview" | "Exercises" | "Discussion">("Overview");
  const [tasks, setTasks] = useState([true, false]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [question, setQuestion] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = quiz[question];
  const score = Math.round((correct / quiz.length) * 100);

  const choose = (index: number) => {
    if (picked !== null) return;
    setPicked(index);
    const nextCorrect = correct + (index === current.answer ? 1 : 0);
    setCorrect(nextCorrect);
    window.setTimeout(() => {
      if (question + 1 >= quiz.length) {
        setFinished(true);
      } else {
        setQuestion((value) => value + 1);
        setPicked(null);
      }
    }, 400);
  };

  return (
    <div className="flex min-h-dvh flex-col pb-24">
      <header className="flex items-center justify-between px-4 pt-4">
        <button type="button" aria-label="Back" onClick={() => navigate(-1)}><Icon name="arrow_back" /></button>
        <div className="text-center">
          <p className="text-xs font-bold tracking-widest text-primary uppercase">Week 3</p>
          <h1 className="font-bold">Knife Skills</h1>
        </div>
        <Icon name="bookmark_border" className="text-text-secondary" />
      </header>

      <div className="relative mx-4 mt-4 overflow-hidden rounded-3xl">
        <img src={media.julienne} alt="Hands practicing a julienne cut on a board" className="h-52 w-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-black/50">
            <Icon name="play_arrow" filled className="text-3xl" />
          </span>
        </div>
        <p className="absolute bottom-3 left-3 text-xs font-bold">4:12 / 12:45</p>
      </div>

      <div className="px-5 pt-5">
        <h2 className="text-3xl font-extrabold">Mastering the Julienne Cut</h2>
        <div className="mt-3 flex gap-4 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1"><Icon name="schedule" className="text-primary" /> 12 min</span>
          <span className="inline-flex items-center gap-1"><Icon name="signal_cellular_alt" className="text-primary" /> Intermediate</span>
          <span className="inline-flex items-center gap-1"><Icon name="restaurant" className="text-primary" /> French</span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          Precision cuts for the French kitchen. Safety first, then a consistent matchstick. Cap cannot see the board. Tell him what you see.
        </p>
      </div>

      <div className="mt-4 flex gap-2 px-5">
        {(["Overview", "Exercises", "Discussion"] as const).map((item) => (
          <button key={item} type="button" className={`rounded-full px-4 py-2 text-sm font-bold ${tab === item ? "bg-primary text-black" : "bg-white/5"}`} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <section className="px-5 pt-5">
          <h3 className="mb-3 flex items-center gap-2 font-bold"><Icon name="school" className="text-primary" /> Key Takeaways</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {["Curl the claw grip before the blade moves.", "Square the vegetable so it sits still.", "Aim for about 3 mm × 3 mm × 5 cm."].map((item) => (
              <li key={item} className="flex gap-2"><Icon name="check_circle" className="text-primary" /> {item}</li>
            ))}
          </ul>
        </section>
      )}
      {tab === "Exercises" && (
        <section className="px-5 pt-5">
          <h3 className="mb-3 font-bold">Practice · 2 tasks</h3>
          {["Set up the board and a damp towel.", "Cut three carrots. Check that they match."].map((item, index) => (
            <label key={item} className="mb-2 flex items-center gap-3 rounded-2xl bg-surface-dark p-3">
              <input type="checkbox" checked={tasks[index]} onChange={() => setTasks((current) => current.map((value, itemIndex) => itemIndex === index ? !value : value))} />
              <span>{item}</span>
            </label>
          ))}
        </section>
      )}
      {tab === "Discussion" && (
        <section className="px-5 pt-5 text-sm text-text-secondary">
          <p>Ask Cap on the live session. He answers from what you report, one action at a time.</p>
          <Link to="/cook" className="mt-3 inline-block font-bold text-primary">Open live cooking</Link>
        </section>
      )}

      <section className="mx-5 mt-6 rounded-3xl bg-surface-dark p-5">
        <h3 className="text-lg font-bold">Ready to prove your skills?</h3>
        <p className="mt-1 text-sm text-text-secondary">Finish the short check to mark this lesson reviewed.</p>
        <button type="button" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-bold text-black" onClick={() => { setQuizOpen(true); setFinished(false); setQuestion(0); setPicked(null); setCorrect(0); }}>
          <Icon name="play_circle" /> Start Theory Quiz
        </button>
        <p className="mt-2 text-center text-xs text-text-secondary">{quiz.length} questions · 80% to pass</p>
      </section>

      <div className="fixed bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 items-center justify-between bg-background-dark/95 px-5 py-4">
        <button type="button" className="inline-flex items-center gap-1 font-bold" onClick={() => navigate("/catalog")}>
          <Icon name="arrow_back" /> Previous
        </button>
        <Link to="/cook" className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-3 font-bold text-black">
          Next Lesson <Icon name="arrow_forward" />
        </Link>
      </div>

      {quizOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60" role="presentation">
          <div role="dialog" aria-label="Theory quiz" className="w-full max-w-md rounded-t-3xl bg-[#2a2118] p-5">
            {finished ? (
              <>
                <h2 className="text-2xl font-extrabold">{score >= 80 ? "Nice work, Chef." : "One more pass, Chef."}</h2>
                <p className="mt-2 text-text-secondary">Score {score}%. {score >= 80 ? "Lesson reviewed." : "80% unlocks the review mark."}</p>
                <button type="button" className="mt-4 w-full rounded-full bg-primary py-3 font-bold text-black" onClick={() => setQuizOpen(false)}>Close</button>
              </>
            ) : (
              <>
                <p className="text-xs font-bold text-primary">Question {question + 1} of {quiz.length}</p>
                <h2 className="mt-2 text-xl font-bold">{current.prompt}</h2>
                <div className="mt-4 flex flex-col gap-2">
                  {current.options.map((option, index) => (
                    <button key={option} type="button" className="rounded-2xl bg-white/5 px-4 py-3 text-left" onClick={() => choose(index)}>
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
