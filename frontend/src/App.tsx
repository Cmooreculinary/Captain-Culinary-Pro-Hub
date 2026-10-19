import { Route, Routes } from "react-router-dom";

import { SessionProvider } from "./session";
import { CatalogScreen } from "./screens/CatalogScreen";
import { ConfirmedScreen } from "./screens/ConfirmedScreen";
import { CookScreen } from "./screens/CookScreen";
import { DiscoverScreen } from "./screens/DiscoverScreen";
import { EnrollScreen } from "./screens/EnrollScreen";
import { JourneyScreen } from "./screens/JourneyScreen";
import { LegalScreen } from "./screens/LegalScreen";
import { LessonScreen } from "./screens/LessonScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { PantryScreen } from "./screens/PantryScreen";
import { PathScreen } from "./screens/PathScreen";
import { PaymentScreen } from "./screens/PaymentScreen";
import { ProgramScreen } from "./screens/ProgramScreen";
import { ReceiptScreen } from "./screens/ReceiptScreen";
import { WelcomeScreen } from "./screens/WelcomeScreen";

export default function App() {
  return (
    <SessionProvider>
      <div className="min-h-dvh bg-[#120e09] font-display text-white antialiased">
        <div className="relative mx-auto min-h-dvh w-full max-w-md bg-background-dark shadow-[0_0_80px_rgba(0,0,0,0.45)]">
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/discover" element={<DiscoverScreen />} />
            <Route path="/pantry" element={<PantryScreen />} />
            <Route path="/path" element={<PathScreen />} />
            <Route path="/cook" element={<CookScreen />} />
            <Route path="/program" element={<ProgramScreen />} />
            <Route path="/enroll" element={<EnrollScreen />} />
            <Route path="/pay" element={<PaymentScreen />} />
            <Route path="/receipt" element={<ReceiptScreen />} />
            <Route path="/confirmed" element={<ConfirmedScreen />} />
            <Route path="/catalog" element={<CatalogScreen />} />
            <Route path="/lesson" element={<LessonScreen />} />
            <Route path="/journey" element={<JourneyScreen />} />
            <Route path="/terms" element={<LegalScreen kind="terms" />} />
            <Route path="/privacy" element={<LegalScreen kind="privacy" />} />
          </Routes>
        </div>
      </div>
    </SessionProvider>
  );
}
