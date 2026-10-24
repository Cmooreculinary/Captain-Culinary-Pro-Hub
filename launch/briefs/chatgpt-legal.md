# Brief for ChatGPT — Legal pages (drafts for lawyer review)

You are drafting the legal pages for **Captain Culinary Pro Hub**, a mobile web
app. These are DRAFTS. A licensed attorney will review them before launch.
Mark every spot that needs a lawyer's decision with `[LAWYER: ...]`.

## The product (facts — do not invent features)

- Owner: BCA (Captain Culinary). Operator: Chris Moore. Mission-driven: revenue
  supports feeding and housing orphaned children.
- Product: "Cap", an AI cooking coach. User points their phone camera at
  their kitchen; Cap talks them through cooking **one step at a time** and
  waits for them to confirm each step.
- AI provider: Anthropic Claude (cloud). Offline fallback: a local model (Ollama).
- Paid offer: **16-Week Mastery Program, $199 one-time**. Payment via Stripe
  Checkout (we never see card numbers).
- Sign-in: hosted auth provider (email + password or magic link).
- Camera frames: sent to the coach for the live session only. **Never written
  to disk. Not stored.** Only metadata (size, type) is held in memory for the
  session.
- Cap **never** says food is safe, allergen-free, or fully cooked from the
  camera. Users must use a thermometer and their own judgment.
- Audience: adults 18+. (Kids product is separate.)
- Data we keep: account email, chef name, purchase record (from Stripe),
  course progress. No ad tracking.

## Deliverables (Markdown, plain English, 8th-grade reading level)

1. **Terms of Service** — include: AI coaching is educational, not
   professional food-safety advice; kitchen safety is the user's
   responsibility (knives, heat, burns, allergies); 18+; account rules;
   payment + refund pointer; limitation of liability `[LAWYER]`; governing
   law `[LAWYER]`; changes to terms.
2. **Privacy Policy** — what we collect, why, who processes it (Anthropic,
   Stripe, auth provider, Cloudflare hosting), camera handling exactly as
   above, retention, deletion request process, contact email
   `[LAWYER: contact address]`. Cover US (CCPA basics) and Nigeria (NDPA 2023)
   since the operator is linked to both `[LAWYER: confirm jurisdictions]`.
3. **Refund Policy** — propose a clear rule (e.g. full refund within 14 days
   if under 2 lessons completed) and flag it `[LAWYER/OWNER: confirm]`.
4. **AI & Safety Disclaimer** — a short in-app version (max 60 words) shown
   before the first live session, plus a longer version.

## Rules

- Do not claim certifications, partnerships, or features not listed above.
- Do not use the words "guarantee", "safe to eat", or "allergen-free" as
  promises.
- End with a list of every `[LAWYER]` question in one place.
