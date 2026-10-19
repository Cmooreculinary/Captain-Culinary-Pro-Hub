import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Icon } from "../components/ui";
import { media } from "../media";
import { PRICE } from "../program";
import { useSession } from "../session";

const methods = [
  { id: "card", icon: "credit_card", label: "Card" },
  { id: "apple", icon: "phone_iphone", label: "Apple Pay" },
  { id: "google", icon: "android", label: "Google Pay" },
] as const;

export function PaymentScreen() {
  const navigate = useNavigate();
  const { markPaid } = useSession();
  const [method, setMethod] = useState<(typeof methods)[number]["id"]>("card");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const digits = number.replace(/\D/g, "");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (method === "card") {
      if (digits.length < 13 || digits.length > 19) {
        setError("Enter a card number of 13 to 19 digits. It is not sent anywhere.");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        setError("Use an expiry like 12/28.");
        return;
      }
      if (cvv.length < 3) {
        setError("Enter the security code. It is discarded after this screen.");
        return;
      }
      if (!name.trim()) {
        setError("Add the name on the card.");
        return;
      }
    }
    const label = method === "card" ? `Card •••• ${digits.slice(-4)}` : method === "apple" ? "Apple Pay" : "Google Pay";
    setCvv("");
    setNumber("");
    markPaid(label);
    navigate("/receipt");
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center gap-3 px-4 pt-4">
        <button type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <Icon name="arrow_back_ios_new" />
        </button>
        <h1 className="text-lg font-bold">Payment Method</h1>
      </header>
      <div className="px-5 pt-4">
        <div className="overflow-hidden rounded-3xl bg-surface-dark">
          <img src={media.paymentDish} alt="" className="h-28 w-full object-cover" />
          <div className="flex items-end justify-between p-4">
            <div>
              <p className="font-bold">16-Week Mastery Program</p>
              <p className="text-sm text-text-secondary">Culinary foundations curriculum</p>
            </div>
            <p className="text-2xl font-extrabold">{PRICE}.00</p>
          </div>
        </div>

        <h2 className="mt-6 mb-3 font-bold">Select Method</h2>
        <div className="grid grid-cols-3 gap-2">
          {methods.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`rounded-2xl border px-2 py-3 text-sm font-bold ${method === item.id ? "border-primary bg-primary/10 text-primary" : "border-white/10"}`}
              onClick={() => setMethod(item.id)}
            >
              <Icon name={item.icon} className="mb-1" />
              <span className="block">{item.label}</span>
            </button>
          ))}
        </div>

        <form className="mt-5 flex flex-col gap-3" onSubmit={submit}>
          {method === "card" && (
            <>
              <label className="text-sm font-semibold">
                Card Number
                <span className="mt-1 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#342918] px-4">
                  <Icon name="credit_card" className="text-text-secondary" />
                  <input
                    inputMode="numeric"
                    autoComplete="cc-number"
                    className="w-full bg-transparent py-3 outline-none"
                    value={number}
                    onChange={(event) => setNumber(event.target.value)}
                  />
                </span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm font-semibold">
                  Expiry Date
                  <input
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-[#342918] px-4 py-3 outline-none"
                    value={expiry}
                    onChange={(event) => setExpiry(event.target.value)}
                  />
                </label>
                <label className="text-sm font-semibold">
                  CVV
                  <input
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-[#342918] px-4 py-3 outline-none"
                    value={cvv}
                    onChange={(event) => setCvv(event.target.value.replace(/\D/g, "").slice(0, 4))}
                  />
                </label>
              </div>
              <label className="text-sm font-semibold">
                Name on Card
                <input
                  autoComplete="cc-name"
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-[#342918] px-4 py-3 outline-none"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            </>
          )}
          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <Icon name="lock" className="text-sm" /> Card numbers stay in this form. Only the last four digits are saved on this device. Nothing is charged.
          </p>
          {error && <p className="text-sm text-primary">{error}</p>}
          <button type="submit" className="mt-2 flex items-center justify-between rounded-full bg-primary px-6 py-4 font-bold text-black">
            <span>Confirm Payment</span>
            <span>{PRICE}.00</span>
          </button>
        </form>
        <p className="py-6 text-center text-xs text-text-secondary">
          <Link className="underline" to="/terms">Terms of Service</Link> · <Link className="underline" to="/privacy">Refund Policy</Link>
        </p>
      </div>
    </div>
  );
}
