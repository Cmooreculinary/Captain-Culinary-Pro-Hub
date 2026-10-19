import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export function Icon({
  name,
  filled = false,
  className = "",
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span className={`material-symbols-outlined ${filled ? "icon-filled" : ""} ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export function TabBar({
  tabs,
}: {
  tabs: { to: string; icon: string; label: string }[];
}) {
  return (
    <nav className="sticky bottom-0 z-30 grid border-t border-white/10 bg-background-dark/95 px-2 pb-3 pt-2 backdrop-blur-md" style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-2xl px-1 py-1 text-[11px] font-semibold ${
              isActive ? "text-primary" : "text-text-secondary"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon name={tab.icon} filled={isActive} className="text-[22px]" />
              {tab.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export const discoverTabs = [
  { to: "/discover", icon: "explore", label: "Discovery" },
  { to: "/pantry", icon: "kitchen", label: "Pantry" },
  { to: "/cook", icon: "smart_toy", label: "AI Chef" },
  { to: "/path", icon: "person", label: "Profile" },
];

export const journeyTabs = [
  { to: "/discover", icon: "home", label: "Home" },
  { to: "/journey", icon: "bar_chart", label: "Progress" },
  { to: "/catalog", icon: "school", label: "Learn" },
  { to: "/path", icon: "person", label: "Profile" },
];

export function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end bg-black/55" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-label={title}
        className="max-h-[80%] overflow-y-auto rounded-t-3xl border border-white/10 bg-[#2a2118] p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button type="button" className="rounded-full bg-white/10 p-2" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Screen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`relative flex min-h-dvh flex-col ${className}`}>{children}</div>;
}
