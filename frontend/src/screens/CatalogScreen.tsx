import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Icon, journeyTabs, TabBar } from "../components/ui";
import { media } from "../media";
import { modules } from "../program";

export function CatalogScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "done" | "pending">("all");
  const visible = modules.filter((item) => {
    if (filter === "done") return item.state === "done";
    if (filter === "pending") return item.state !== "done";
    return true;
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-4 pt-4">
        <button type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <Icon name="arrow_back" />
        </button>
        <div className="mt-3 flex items-center gap-3">
          <img src={media.catalogAvatar} alt="" className="size-12 rounded-full object-cover" />
          <div>
            <h1 className="text-2xl font-extrabold">Master Chef Curriculum</h1>
            <p className="text-sm text-text-secondary">Program progress · 25%</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/4 rounded-full bg-primary" />
        </div>
        <p className="mt-2 text-xs text-text-secondary">Week 4 of 16 · 3 modules completed</p>
      </header>

      <div className="mt-4 flex gap-2 px-4">
        {[
          ["all", "All Modules"],
          ["done", "Completed"],
          ["pending", "Pending"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`rounded-full px-3 py-2 text-sm font-bold ${filter === id ? "bg-primary text-black" : "bg-white/5 text-text-secondary"}`}
            onClick={() => setFilter(id as typeof filter)}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="flex flex-1 flex-col gap-3 px-4 py-5">
        {visible.map((item) => (
          <li key={item.week}>
            <Link
              to={item.state === "locked" ? "/catalog" : "/lesson"}
              className="flex items-center gap-3 rounded-2xl border border-white/5 bg-surface-dark p-4"
            >
              <Icon
                name={item.state === "done" ? "check_circle" : item.state === "active" ? "play_arrow" : "lock"}
                className={item.state === "locked" ? "text-white/30" : "text-primary"}
              />
              <div className="flex-1">
                <p className="font-bold">{item.week}</p>
                <p className="text-xs font-bold text-primary uppercase">{item.state === "active" ? "Active" : item.state}</p>
                <p className="text-sm text-text-secondary">{item.detail}</p>
              </div>
              <Icon name="chevron_right" className="text-text-secondary" />
            </Link>
          </li>
        ))}
        <li className="rounded-2xl border border-dashed border-white/10 px-4 py-3 text-sm text-text-secondary">10 more weeks unlock as you finish the active module.</li>
      </ul>
      <Link to="/lesson" className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-full bg-primary py-4 font-bold text-black">
        <Icon name="play_circle" /> Continue Week 4
      </Link>
      <TabBar tabs={journeyTabs} />
    </div>
  );
}
