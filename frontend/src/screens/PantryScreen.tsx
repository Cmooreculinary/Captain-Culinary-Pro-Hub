import { discoverTabs, Icon, TabBar } from "../components/ui";

const items = [
  { name: "Steak", note: "1, for the live sear", icon: "restaurant" },
  { name: "Neutral oil", note: "A thin coat in the pan", icon: "water_drop" },
  { name: "Kosher salt", note: "Season just before the sear", icon: "grain" },
  { name: "Thermometer", note: "Your doneness check", icon: "device_thermostat" },
  { name: "Dry towel", note: "Under the board", icon: "dry" },
];

export function PantryScreen() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-5 pt-6">
        <p className="text-sm text-text-secondary">Station list</p>
        <h1 className="text-2xl font-extrabold">Pantry</h1>
      </header>
      <ul className="flex flex-1 flex-col gap-3 px-5 py-6">
        {items.map((item) => (
          <li key={item.name} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-surface-dark p-4">
            <Icon name={item.icon} className="text-primary" />
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="text-sm text-text-secondary">{item.note}</p>
            </div>
          </li>
        ))}
      </ul>
      <TabBar tabs={discoverTabs} />
    </div>
  );
}
