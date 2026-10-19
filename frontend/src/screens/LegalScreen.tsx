import { Link } from "react-router-dom";

import { Icon } from "../components/ui";

export function LegalScreen({ kind }: { kind: "terms" | "privacy" }) {
  const title = kind === "terms" ? "Terms" : "Privacy";
  return (
    <div className="min-h-dvh px-5 pt-5 pb-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold" aria-label="Back">
        <Icon name="arrow_back" /> Home
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold">{title}</h1>
      {kind === "terms" ? (
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
          <p>Captain Culinary Pro Hub coaches one action at a time. You confirm the station is safe before heat or a blade.</p>
          <p>The program price on screen is a saved enrollment on this device. It does not charge a card.</p>
          <p>You can clear the saved session from the profile screen.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
          <p>Your chef name, enrollment flag, and payment label stay in this browser. The full card number and security code are not stored.</p>
          <p>Camera frames go to the local coach socket for the session. They are not written to disk and they are not treated as a safety or doneness check.</p>
        </div>
      )}
    </div>
  );
}
