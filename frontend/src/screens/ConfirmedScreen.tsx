import { Link, Navigate } from "react-router-dom";

import { Icon } from "../components/ui";
import { media } from "../media";
import { useSession } from "../session";

export function ConfirmedScreen() {
  const { session } = useSession();
  if (!session.paid) return <Navigate to="/enroll" replace />;

  return (
    <div className="flex min-h-dvh flex-col px-5 pt-4 pb-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/discover" className="flex size-10 items-center justify-center rounded-full bg-white/10" aria-label="Close">
          <Icon name="close" />
        </Link>
        <p className="text-xs font-bold tracking-widest text-primary uppercase">Confirmation</p>
        <span className="w-10" />
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img src={media.chefHat} alt="" className="size-32 rounded-full border-4 border-primary object-cover" />
          <Icon name="check_circle" filled className="absolute right-0 bottom-0 text-4xl text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold">You&apos;re In, Chef!</h1>
        <p className="mt-2 max-w-xs text-text-secondary">
          Your journey starts now. Welcome to the Captain Culinary 16-week program.
        </p>
      </div>

      <article className="mt-6 overflow-hidden rounded-xl border border-white/5 bg-[#2c241b]">
        <img src={media.mise} alt="" className="h-28 w-full object-cover" />
        <div className="p-5">
          <span className="rounded-md bg-primary/20 px-2 py-1 text-xs font-medium text-primary">Enrolled</span>
          <h2 className="mt-2 text-xl font-bold">Professional Culinary Foundations</h2>
          <div className="mt-3 flex gap-4 text-sm text-text-secondary">
            <span className="inline-flex items-center gap-1"><Icon name="calendar_month" className="text-primary" /> 16 Weeks</span>
            <span className="inline-flex items-center gap-1"><Icon name="school" className="text-primary" /> Beginner</span>
          </div>
        </div>
      </article>

      <h3 className="mt-6 text-lg font-bold">What Happens Next</h3>
      <ol className="mt-3 flex flex-col gap-4">
        {[
          ["countertops", "Prep your kitchen", "Get the station ready for the first practical."],
          ["smart_toy", "Meet Cap", "He coaches one action at a time."],
          ["restaurant", "First knife-skills lesson", "Claw grip, then the rocking motion."],
        ].map(([icon, title, detail]) => (
          <li key={title} className="flex gap-3">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-black">
              <Icon name={icon} className="text-[18px]" />
            </span>
            <div>
              <p className="font-bold">{title}</p>
              <p className="text-sm text-text-secondary">{detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link to="/lesson" className="mt-auto rounded-full bg-primary py-4 text-center font-bold text-black">
        Start Learning Now
      </Link>
      <Link to="/catalog" className="mt-3 py-2 text-center text-sm font-bold">
        Add to the course catalog
      </Link>
    </div>
  );
}
