import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Icon } from "../components/ui";
import { media } from "../media";
import { useSession } from "../session";

export function LoginScreen() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [note, setNote] = useState("");

  const finish = (chefName: string) => {
    signIn(chefName);
    navigate("/discover");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || password.length < 4) {
      setNote("Add an email and a password of at least 4 characters. This stays on this device.");
      return;
    }
    const fromEmail = email.split("@")[0]?.replace(/[._-]+/g, " ") || "Chef";
    finish(mode === "signup" && name.trim() ? name.trim() : fromEmail);
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url('${media.loginTable}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background-dark via-background-dark/85 to-background-dark" />
      <div className="relative flex flex-1 flex-col px-6 pt-16 pb-8">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary" aria-label="Back to welcome">
          <Icon name="arrow_back" /> Welcome
        </Link>
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Icon name="skillet" className="text-4xl" />
          </div>
          <h1 className="text-3xl font-extrabold">Captain Culinary</h1>
          <p className="mt-2 text-text-secondary">Master the kitchen with Cap.</p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-full bg-white/5 p-1">
          {(["login", "signup"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={`rounded-full py-2 text-sm font-bold ${mode === item ? "bg-primary text-black" : "text-text-secondary"}`}
              onClick={() => setMode(item)}
            >
              {item === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form className="flex flex-col gap-4" onSubmit={submit}>
          {mode === "signup" && (
            <label className="text-sm font-semibold">
              Name
              <input
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#2d2418] px-4 py-3 outline-none focus:border-primary"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </label>
          )}
          <label className="text-sm font-semibold">
            Email Address
            <span className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#2d2418] px-4">
              <Icon name="mail" className="text-text-secondary" />
              <input
                className="w-full bg-transparent py-3 outline-none"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </span>
          </label>
          <label className="text-sm font-semibold">
            Password
            <span className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#2d2418] px-4">
              <Icon name="lock" className="text-text-secondary" />
              <input
                className="w-full bg-transparent py-3 outline-none"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
              />
              <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((current) => !current)}>
                <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-text-secondary" />
              </button>
            </span>
          </label>
          <button
            type="button"
            className="self-end text-sm font-semibold text-primary"
            onClick={() => setNote("There is no account server. Your name stays in this browser.")}
          >
            Forgot Password?
          </button>
          {note && <p className="text-sm text-text-secondary">{note}</p>}
          <button type="submit" className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary py-4 text-base font-bold text-black">
            Let&apos;s Cook <Icon name="arrow_forward" />
          </button>
        </form>

        <p className="my-6 text-center text-xs tracking-widest text-text-secondary uppercase">Or continue with</p>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="rounded-2xl border border-white/10 py-3 font-bold" onClick={() => finish("Chef Alex")}>
            Google
          </button>
          <button type="button" className="rounded-2xl border border-white/10 py-3 font-bold" onClick={() => finish("Chef Alex")}>
            Apple
          </button>
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 text-xs text-text-secondary">
          <Icon name="face" className="text-primary" /> These buttons only save a name on this device.
        </p>
      </div>
    </div>
  );
}
