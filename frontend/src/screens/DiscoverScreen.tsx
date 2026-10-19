import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { discoverTabs, Icon, TabBar } from "../components/ui";
import { media } from "../media";
import { recipes } from "../program";
import { useSession } from "../session";

const filters = ["Trending", "Quick", "Vegan", "Dinner", "Asian", "Dessert", "Low-Carb"];

export function DiscoverScreen() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Trending");
  const name = session.name || "Alex";

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesText = !text || recipe.title.toLowerCase().includes(text);
      const matchesFilter =
        filter === "Trending" ||
        (filter === "Quick" && parseInt(recipe.time, 10) <= 20) ||
        (filter === "Vegan" && recipe.id === "salad") ||
        (filter === "Dinner" && ["ramen", "pasta", "burger", "curry", "risotto"].includes(recipe.id)) ||
        (filter === "Asian" && ["ramen", "curry"].includes(recipe.id)) ||
        (filter === "Dessert" && false) ||
        (filter === "Low-Carb" && recipe.id === "salad");
      return matchesText && matchesFilter;
    });
  }, [filter, query]);

  const picked = visible.filter((recipe) => recipe.picked);
  const community = visible.filter((recipe) => !recipe.picked);

  return (
    <div className="flex min-h-dvh flex-col pb-2">
      <header className="flex items-center justify-between px-5 pt-6">
        <div>
          <p className="text-sm text-text-secondary">What are we cooking today?</p>
          <h1 className="text-2xl font-extrabold">Ready to cook, {name}?</h1>
        </div>
        <button type="button" aria-label="Open profile" onClick={() => navigate("/path")}>
          <img src={media.alex} alt="" className="size-12 rounded-full border-2 border-primary object-cover" />
        </button>
      </header>

      <label className="mx-5 mt-5 flex items-center gap-2 rounded-full bg-white/5 px-4">
        <Icon name="search" className="text-text-secondary" />
        <input
          className="w-full bg-transparent py-3 outline-none"
          placeholder="Search recipes, ingredients..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search recipes"
        />
        <Icon name="mic" className="text-primary" />
      </label>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto px-5">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
              filter === item ? "bg-primary text-black" : "bg-white/5 text-text-secondary"
            }`}
            onClick={() => setFilter(item)}
          >
            {item === "Trending" && <Icon name="local_fire_department" className="mr-1 align-[-4px] text-[16px]" />}
            {item}
          </button>
        ))}
      </div>

      <section className="mt-6 px-5">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <Icon name="smart_toy" className="text-primary" /> Picked by Captain Culinary
        </h2>
        <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5">
          {picked.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              className="w-56 shrink-0 text-left"
              onClick={() => navigate(`/cook?recipe=${recipe.id}`)}
            >
              <div className="relative h-40 overflow-hidden rounded-3xl">
                <img src={recipe.image} alt="" className="h-full w-full object-cover" />
                <span className="absolute top-3 left-3 rounded-full bg-primary px-2 py-1 text-[11px] font-bold text-black">
                  {recipe.match}
                </span>
              </div>
              <p className="mt-2 font-bold">{recipe.title}</p>
              <p className="text-xs text-text-secondary">
                {recipe.time} · {recipe.level}
              </p>
            </button>
          ))}
          {picked.length === 0 && <p className="text-sm text-text-secondary">Nothing in this filter yet.</p>}
        </div>
      </section>

      <section className="mt-6 flex-1 px-5">
        <h2 className="mb-3 text-lg font-bold">Community Favorites</h2>
        <div className="grid grid-cols-2 gap-3">
          {community.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              className="text-left"
              onClick={() => navigate(`/cook?recipe=${recipe.id}`)}
            >
              <img src={recipe.image} alt="" className="h-28 w-full rounded-2xl object-cover" />
              <p className="mt-2 text-sm font-bold">{recipe.title}</p>
              <p className="text-xs text-text-secondary">
                {recipe.time} · {recipe.level}
              </p>
            </button>
          ))}
        </div>
        <Link to="/program" className="mt-6 mb-4 block rounded-2xl bg-primary py-3 text-center font-bold text-black">
          View the 16-week program
        </Link>
      </section>
      <TabBar tabs={discoverTabs} />
    </div>
  );
}
