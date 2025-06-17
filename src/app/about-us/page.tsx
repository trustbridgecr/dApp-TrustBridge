"use client";

import AboutPage from "@/components/modules/about-us/ui/pages/AboutUs";
import { GradientBackground } from "@/components/modules/dashboard/ui/pages/background/GradientBackground";

export default function Page() {
  return (
    <GradientBackground>
      <div className="p-6">
        <AboutPage />
      </div>
    </GradientBackground>
  );
}
