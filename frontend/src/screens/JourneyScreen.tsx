import { Link } from "react-router-dom";

import { Icon, journeyTabs, TabBar } from "../components/ui";
import { media } from "../media";

const trophies = [
  ["restaurant", "Master Saucier"],
  ["content_cut", "Knife Skills"],
  ["timer", "Perfect Timing"],
  ["workspace_premium", "Flavor Profile"],
];

export function JourneyScreen() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-4 pt-5">
        <Link to="/" aria-label="Menu"><Icon name="menu" /></Link>
        <h1 className="text-lg font-bold">My Journey</h1>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-1 text-sm font-bold text-primary">
          <Icon name="local_fire_department" className="text-[16px]" /> 12
        </span>
      </header>

      <section className="px-4 pt-5">
        <p className="text-sm text-text-secondary">42% completed</p>
        <h2 className="text-3xl font-extrabold">Week 7 of 16</h2>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            ["7", "Weeks Done"],
            ["94%", "Avg Grade"],
            ["4.2k", "Total XP"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-surface-dark p-3">
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-text-secondary">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-bold">Current Module In Progress</h2>
        <article className="overflow-hidden rounded-3xl bg-surface-dark">
          <img src={media.braise} alt="" className="h-36 w-full object-cover" />
          <div className="p-4">
            <p className="text-xs font-bold text-primary uppercase">Week 7</p>
            <h3 className="text-xl font-bold">The Art of Braising</h3>
            <p className="mt-1 text-sm text-text-secondary">Low, gentle heat. Tough cuts become tender when you give them time.</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-text-secondary">Lesson 3 of 8</span>
              <Link to="/lesson" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-black">Resume</Link>
            </div>
          </div>
        </article>
      </section>

      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Trophy Case</h2>
          <Link to="/path" className="text-sm font-bold text-primary">View All</Link>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
          {trophies.map(([icon, label]) => (
            <div key={label} className="rounded-2xl bg-surface-dark p-2">
              <Icon name={icon} className="text-primary" />
              <p className="mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-bold">Program Timeline</h2>
        <ul className="flex flex-col gap-3">
          <li className="rounded-2xl bg-surface-dark p-4">
            <p className="font-bold">Week 6: Poultry</p>
            <p className="text-sm text-text-secondary">Completed · A (96%)</p>
          </li>
          <li className="rounded-2xl bg-surface-dark p-4">
            <p className="font-bold">Week 5: Vegetables</p>
            <p className="text-sm text-text-secondary">Completed · A− (92%)</p>
          </li>
          <li className="rounded-2xl bg-white/5 p-4 text-text-secondary">
            <p className="font-bold">Week 8: Seafood basics</p>
            <p className="text-sm">Unlocks after Week 7</p>
          </li>
        </ul>
      </section>

      <section className="mx-4 mt-6 mb-6 overflow-hidden rounded-3xl bg-surface-dark">
        <img src={media.knifeSet} alt="" className="h-32 w-full object-cover" />
        <div className="p-4">
          <p className="text-xs font-bold text-primary uppercase">Locked reward</p>
          <h3 className="text-lg font-bold">Chef&apos;s knife set and program certificate</h3>
          <p className="mt-1 text-sm text-text-secondary">Finish all 16 weeks with an average of 90% or higher.</p>
        </div>
      </section>
      <TabBar tabs={journeyTabs} />
    </div>
  );
}
