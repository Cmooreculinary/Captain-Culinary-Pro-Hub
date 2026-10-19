import { Link, Navigate } from "react-router-dom";

import { Icon } from "../components/ui";
import { media } from "../media";
import { PRICE } from "../program";
import { useSession } from "../session";

export function ReceiptScreen() {
  const { session } = useSession();
  if (!session.paid) return <Navigate to="/pay" replace />;

  return (
    <div className="flex min-h-dvh flex-col px-5 pt-4 pb-8">
      <div className="mb-4 flex items-center justify-between">
        <Link to="/discover" aria-label="Close receipt"><Icon name="close" /></Link>
        <h1 className="text-sm font-bold tracking-widest uppercase">Receipt</h1>
        <span className="w-6" />
      </div>
      <div className="flex flex-1 flex-col items-center">
        <img src={media.receiptDish} alt="" className="mb-4 h-28 w-full rounded-3xl object-cover" />
        <Icon name="check_circle" filled className="text-5xl text-primary" />
        <h2 className="mt-3 text-3xl font-extrabold">Payment saved</h2>
        <p className="mt-2 text-center text-text-secondary">
          You are enrolled in the 16-week program on this device. No charge was sent to a bank.
        </p>
        <div className="mt-6 w-full rounded-3xl bg-surface-dark p-5">
          <p className="font-bold">16-Week Mastery</p>
          <p className="text-sm text-text-secondary">Culinary foundations series</p>
          <div className="my-4 h-px bg-white/10" />
          {[
            ["Total Amount", `${PRICE}.00`],
            ["Date", session.paidAt],
            ["Transaction ID", session.receiptId],
            ["Payment Method", session.methodLabel],
            ["Status", "Saved on device"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-1 text-sm">
              <span className="text-text-secondary">{label}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>
        <Link to="/confirmed" className="mt-6 w-full rounded-full bg-primary py-4 text-center font-bold text-black">
          Start Learning
        </Link>
        <button
          type="button"
          className="mt-3 flex w-full items-center justify-center gap-2 py-3 text-sm font-bold"
          onClick={() => void navigator.clipboard?.writeText(`${session.receiptId} ${session.methodLabel}`)}
        >
          <Icon name="mail" /> Copy receipt
        </button>
      </div>
    </div>
  );
}
