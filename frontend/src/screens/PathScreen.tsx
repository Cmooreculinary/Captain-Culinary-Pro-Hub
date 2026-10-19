import { Link } from "react-router-dom";

import { discoverTabs, Icon, TabBar } from "../components/ui";
import { media } from "../media";
import { useSession } from "../session";

const lessons = [
  { title: "Knife Safety Basics", detail: "Handling and a stable board.", progress: "100%", state: "done" },
  { title: "Boiling & Blanching", detail: "Color and texture in vegetables.", progress: "98%", state: "done" },
  { title: "Béchamel Sauce", detail: "The white roux base.", progress: "CURRENT", state: "current" },
  { title: "Velouté Sauce", detail: "Finish the previous lesson to unlock.", progress: "", state: "locked" },
];

export function PathScreen() {
  const { session, signOut } = useSession();
  const name = session.name || "Chef Alex";

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-white/10 bg-background-dark p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={media.pathAvatar} alt="" className="size-12 rounded-full border-2 border-primary object-cover" />
              <span className="absolute -right-1 -bottom-1 rounded-full border border-background-dark bg-primary px-1.5 text-[10px] font-bold text-black">
                Lvl 5
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold">{name}</h1>
              <p className="text-xs text-text-secondary">Sous Chef in Training</p>
            </div>
          </div>
          <button type="button" className="text-xs font-bold text-text-secondary" onClick={signOut}>
            Sign out
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">XP to Level 6</span>
            <span className="font-bold text-primary">350 / 500 XP</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-dark">
            <div className="h-full w-[70%] rounded-full bg-primary" />
          </div>
        </div>
      </header>

      <section className="grid grid-cols-3 gap-3 px-4 py-6">
        {[
          ["local_fire_department", "7", "Day Streak"],
          ["restaurant_menu", "15", "Recipes"],
          ["military_tech", "Silver", "League"],
        ].map(([icon, value, label]) => (
          <div key={label} className="rounded-xl border border-surface-border bg-surface-dark p-3 text-center">
            <Icon name={icon} className="text-primary" />
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs text-text-secondary">{label}</p>
          </div>
        ))}
      </section>

      <section className="px-4 pb-6">
        <div className="rounded-xl border border-surface-border bg-surface-dark p-5">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h2 className="font-bold">Skill Proficiency</h2>
              <p className="text-xs text-text-secondary">From lessons you finished</p>
            </div>
            <span className="rounded bg-green-500/20 px-2 py-1 text-xs font-bold text-green-400">+10% this week</span>
          </div>
          <svg viewBox="0 0 200 180" className="h-48 w-full" role="img" aria-label="Skill chart for knife skills, sautéing, baking, seasoning, and plating">
            <polygon fill="none" opacity="0.5" points="100,10 190,65 155,160 45,160 10,65" stroke="#685131" strokeWidth="1" />
            <polygon fill="rgba(242, 147, 13, 0.2)" points="100,20 170,70 140,140 60,150 25,80" stroke="#f2930d" strokeWidth="2" />
            <text fill="#cbb290" fontSize="10" textAnchor="middle" x="100" y="8">Knife Skills</text>
            <text fill="#cbb290" fontSize="10" textAnchor="middle" x="188" y="62">Sautéing</text>
            <text fill="#cbb290" fontSize="10" textAnchor="middle" x="160" y="176">Baking</text>
            <text fill="#cbb290" fontSize="10" textAnchor="middle" x="40" y="176">Seasoning</text>
            <text fill="#cbb290" fontSize="10" textAnchor="middle" x="18" y="62">Plating</text>
          </svg>
        </div>
      </section>

      <section className="px-4 pb-8">
        <h2 className="mb-3 text-lg font-bold">Up Next</h2>
        <div className="overflow-hidden rounded-2xl bg-surface-dark">
          <img src={media.bechamel} alt="" className="h-36 w-full object-cover" />
          <div className="p-4">
            <p className="text-xs font-bold tracking-wide text-primary uppercase">Path: Mother Sauces</p>
            <p className="mt-2 text-sm text-text-secondary">Cap: Hollandaise is behind you. This white sauce is next, Chef.</p>
            <h3 className="mt-2 text-2xl font-bold">Béchamel Sauce</h3>
            <p className="mt-1 text-sm text-text-secondary">20 min · Intermediate</p>
            <Link to="/cook?recipe=pasta" className="mt-4 flex items-center justify-center gap-2 rounded-full bg-primary py-3 font-bold text-black">
              <Icon name="play_circle" /> Start Cooking
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Learning Path</h2>
          <span className="text-sm text-primary">Module 2 of 5</span>
        </div>
        <ol className="flex flex-col gap-4">
          {lessons.map((lesson) => (
            <li key={lesson.title} className="flex gap-3">
              <Icon
                name={lesson.state === "locked" ? "lock" : lesson.state === "current" ? "restaurant" : "check"}
                className={lesson.state === "locked" ? "text-white/30" : "text-primary"}
              />
              <div>
                <p className="font-bold">{lesson.title}</p>
                <p className="text-sm text-text-secondary">{lesson.detail}</p>
                {lesson.progress && <p className="text-xs font-bold text-primary">{lesson.progress}</p>}
              </div>
            </li>
          ))}
        </ol>
        <Link to="/lesson" className="mt-4 block text-center text-sm font-bold text-primary">
          Open the current lesson
        </Link>
      </section>

      <section className="px-4 pb-8">
        <h2 className="mb-3 text-lg font-bold">Badges Earned</h2>
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            ["outdoor_grill", "Grill Master"],
            ["timer", "Speed Chopper"],
            ["local_pizza", "Dough Pro"],
            ["cake", "Patisserie"],
          ].map(([icon, label]) => (
            <div key={label} className="rounded-2xl bg-surface-dark p-3">
              <Icon name={icon} className="text-primary" />
              <p className="mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-6">
        <h2 className="mb-3 text-lg font-bold">Culinary Journal</h2>
        {[
          [media.carbonara, "Spaghetti Carbonara", "Yesterday", "4.5"],
          [media.salmon, "Pan-Seared Salmon", "3 days ago", "4.8"],
        ].map(([image, title, when, score]) => (
          <div key={title} className="mb-3 flex items-center gap-3">
            <img src={image} alt="" className="size-16 rounded-2xl object-cover" />
            <div className="flex-1">
              <p className="font-bold">{title}</p>
              <p className="text-xs text-text-secondary">{when} · {score} · Coach note</p>
            </div>
            <Icon name="chevron_right" className="text-text-secondary" />
          </div>
        ))}
      </section>
      <TabBar tabs={discoverTabs} />
    </div>
  );
}
