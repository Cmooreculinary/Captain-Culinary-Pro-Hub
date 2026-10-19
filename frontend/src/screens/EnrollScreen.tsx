import { Link, useNavigate } from "react-router-dom";

import { Icon } from "../components/ui";
import { media } from "../media";
import { PRICE } from "../program";

const perks = [
  ["restaurant", "Full access to all 16 modules"],
  ["model_training", "Live coaching on knife skills, one action at a time"],
  ["verified", "Final exam and a Captain Culinary certificate"],
  ["translate", "Language support for ES, FR, IT, and DE"],
];

export function EnrollScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col pb-28">
      <header className="flex items-center gap-3 px-4 pt-4">
        <button type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <Icon name="arrow_back" />
        </button>
        <div>
          <h1 className="text-lg font-bold">Enrollment Summary</h1>
          <p className="text-sm text-text-secondary">16-Week Intensive · Certification Program</p>
        </div>
      </header>
      <img src={media.enrollHero} alt="" className="mx-4 mt-4 h-40 w-[calc(100%-2rem)] rounded-3xl object-cover" />
      <div className="px-5 pt-5">
        <h2 className="text-3xl font-extrabold">Master Chef Culinary Arts</h2>
        <div className="mt-4 rounded-3xl border border-surface-border bg-[#342918] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-primary uppercase">Best value</p>
              <h3 className="text-lg font-bold">All-Inclusive Access</h3>
            </div>
            <p className="text-3xl font-extrabold">{PRICE}</p>
          </div>
          <p className="mt-1 text-sm text-text-secondary">One-time payment. Nothing is charged until you confirm on the next screen, and even then this demo keeps the card on this device.</p>
          <ul className="mt-4 flex flex-col gap-3">
            {perks.map(([icon, label]) => (
              <li key={label} className="flex items-center gap-3 text-sm">
                <Icon name={icon} className="text-primary" /> {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex gap-4 rounded-3xl bg-surface-dark p-4">
          <img src={media.apron} alt="" className="size-20 rounded-2xl object-cover" />
          <div>
            <p className="text-xs font-bold text-primary uppercase">Bonus inclusion</p>
            <h3 className="font-bold">Graduation Gift Set</h3>
            <p className="text-sm text-text-secondary">Apron and knife roll after you finish. Shipping included.</p>
          </div>
        </div>

        <div className="mt-4 flex gap-4 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1"><Icon name="lock" className="text-sm" /> Stays on this device</span>
          <span className="inline-flex items-center gap-1"><Icon name="verified_user" className="text-sm" /> 14-day cancel window</span>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-text-secondary">
          By proceeding, you agree to our <Link className="underline" to="/terms">Terms of Service</Link> and{" "}
          <Link className="underline" to="/privacy">Privacy Policy</Link>. You can cancel within 14 days if no module is marked complete.
        </p>
      </div>
      <div className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-gradient-to-t from-background-dark px-5 py-4">
        <Link to="/pay" className="flex items-center justify-center gap-2 rounded-full bg-primary py-4 font-bold text-black">
          Proceed to Payment <Icon name="arrow_forward" />
        </Link>
      </div>
    </div>
  );
}
