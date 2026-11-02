import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Icon } from "../components/ui";
import { media } from "../media";
import { PRICE } from "../program";

// Card entry happens only on the hosted checkout page (e.g. a Stripe Payment
// Link). This app never renders card fields or sees card numbers.
const checkoutUrl = import.meta.env.VITE_CHECKOUT_URL?.trim() || "";

export function PaymentScreen() {
  const navigate = useNavigate();
  const [note, setNote] = useState("");

  const goToCheckout = () => {
    if (!checkoutUrl.startsWith("https://")) {
      setNote("Checkout opens at launch. Nothing has been charged.");
      return;
    }
    window.location.assign(checkoutUrl);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center gap-3 px-4 pt-4">
        <button type="button" aria-label="Back" onClick={() => navigate(-1)}>
          <Icon name="arrow_back_ios_new" />
        </button>
        <h1 className="text-lg font-bold">Checkout</h1>
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

        <p className="mt-6 flex items-start gap-2 text-sm text-text-secondary">
          <Icon name="lock" className="text-base" />
          You pay on a secure checkout page run by our payment provider. Card, Apple Pay, and Google Pay are handled
          there. This app never sees your card number.
        </p>
        {note && <p className="mt-3 text-sm text-primary">{note}</p>}
        <button
          type="button"
          onClick={goToCheckout}
          className="mt-5 flex w-full items-center justify-between rounded-full bg-primary px-6 py-4 font-bold text-black"
        >
          <span>Continue to Secure Checkout</span>
          <span>{PRICE}.00</span>
        </button>
        <p className="py-6 text-center text-xs text-text-secondary">
          <Link className="underline" to="/terms">Terms of Service</Link> · <Link className="underline" to="/privacy">Refund Policy</Link>
        </p>
      </div>
    </div>
  );
}
