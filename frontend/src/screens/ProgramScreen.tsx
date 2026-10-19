import { Link, useNavigate } from "react-router-dom";

import { Icon } from "../components/ui";
import { media } from "../media";
import { curriculum, PRICE } from "../program";

const reasons = [
  ["psychology", "AI Chef Feedback", "Cap corrects one technique at a time, from what you tell him."],
  ["translate", "30+ Languages", "Instruction in your language, so the lesson stays clear."],
  ["restaurant", "Graduation Gift", "A Japanese steel chef's knife when you finish the 16 weeks."],
];

export function ProgramScreen() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-dvh flex-col pb-28">
      <div className="pointer-events-none fixed top-0 left-1/2 z-20 flex w-full max-w-md -translate-x-1/2 items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4">
        <button type="button" className="pointer-events-auto flex size-10 items-center justify-center rounded-full bg-white/10" aria-label="Back" onClick={() => navigate(-1)}>
          <Icon name="arrow_back" />
        </button>
        <div className="pointer-events-auto flex gap-3">
          <button type="button" className="flex size-10 items-center justify-center rounded-full bg-white/10" aria-label="Share program" onClick={() => void navigator.clipboard?.writeText(window.location.href)}>
            <Icon name="ios_share" />
          </button>
          <Link to="/catalog" className="flex size-10 items-center justify-center rounded-full bg-white/10" aria-label="Save to catalog">
            <Icon name="favorite_border" />
          </Link>
        </div>
      </div>

      <div className="relative min-h-[450px] h-[55vh]">
        <img src={media.plating} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-2">
          <div className="mb-4 flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold uppercase">
              <Icon name="school" className="text-[16px]" /> Pro foundations
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs">
              <Icon name="workspace_premium" className="text-[16px]" /> Certificate
            </span>
          </div>
          <h1 className="text-4xl leading-[1.1] font-bold">
            Master the Art <br /> of <span className="text-primary">Cooking</span>
          </h1>
          <p className="mt-2 max-w-md text-lg font-light text-gray-300">
            A 16-week journey from novice to pro, coached by Captain Culinary.
          </p>
        </div>
      </div>

      <div className="space-y-8 px-5 pt-6">
        <section>
          <h2 className="mb-4 text-xl font-bold">Why this program?</h2>
          <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5">
            {reasons.map(([icon, title, detail]) => (
              <article key={title} className="w-64 shrink-0 rounded-2xl border border-white/5 bg-surface-dark p-5">
                <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Icon name={icon} />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-gray-400">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">Curriculum</h2>
            <Link to="/catalog" className="text-sm font-medium text-primary">View Syllabus</Link>
          </div>
          <ol className="relative space-y-6 border-l border-primary/40 pl-6">
            {curriculum.map((item) => (
              <li key={item.title}>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-xs font-medium tracking-wider text-primary uppercase">{item.weeks}</p>
                <p className="text-sm text-gray-400">{item.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex items-center gap-4 rounded-2xl bg-surface-dark p-4">
          <img src={media.marcus} alt="" className="size-16 rounded-full object-cover" />
          <div>
            <h2 className="text-sm font-bold text-text-secondary">Your Head Chef</h2>
            <h3 className="text-lg font-bold">Chef Marcus</h3>
            <p className="text-sm text-gray-400">Program instructor. Cap coaches the live sessions.</p>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-md -translate-x-1/2 items-center justify-between border-t border-white/10 bg-background-dark/95 px-5 py-4 backdrop-blur">
        <div>
          <p className="text-xs text-text-secondary">Total Price</p>
          <p className="text-2xl font-extrabold">{PRICE} <span className="text-sm text-white/40 line-through">$499</span></p>
        </div>
        <Link to="/enroll" className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-black">
          Enroll Now <Icon name="arrow_forward" />
        </Link>
      </div>
    </div>
  );
}
