import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "captain-culinary-pro-session";

export type Session = {
  name: string;
  enrolled: boolean;
  paid: boolean;
  methodLabel: string;
  receiptId: string;
  paidAt: string;
};

const emptySession: Session = {
  name: "",
  enrolled: false,
  paid: false,
  methodLabel: "",
  receiptId: "",
  paidAt: "",
};

type SessionContextValue = {
  session: Session;
  signIn: (name: string) => void;
  markPaid: (methodLabel: string) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function readSession(): Session {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptySession;
    const parsed = JSON.parse(raw) as Partial<Session>;
    return {
      ...emptySession,
      name: typeof parsed.name === "string" ? parsed.name : "",
      enrolled: Boolean(parsed.enrolled),
      paid: Boolean(parsed.paid),
      methodLabel: typeof parsed.methodLabel === "string" ? parsed.methodLabel : "",
      receiptId: typeof parsed.receiptId === "string" ? parsed.receiptId : "",
      paidAt: typeof parsed.paidAt === "string" ? parsed.paidAt : "",
    };
  } catch {
    return emptySession;
  }
}

function writeSession(session: Session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(readSession);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      signIn: (name) => {
        const next = { ...session, name: name.trim() || "Chef" };
        setSession(next);
        writeSession(next);
      },
      markPaid: (methodLabel) => {
        const stamp = new Date();
        const next: Session = {
          ...session,
          name: session.name || "Chef",
          enrolled: true,
          paid: true,
          methodLabel,
          receiptId: `CC-${stamp.getTime().toString().slice(-6)}-PRO`,
          paidAt: stamp.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }),
        };
        setSession(next);
        writeSession(next);
      },
      signOut: () => {
        setSession(emptySession);
        localStorage.removeItem(STORAGE_KEY);
      },
    }),
    [session],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error("SessionProvider is missing");
  return value;
}
