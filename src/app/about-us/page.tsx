"use client";

import AboutPage from "@/components/modules/about-us/ui/pages/AboutUs";
import { GradientBackground } from "@/components/modules/dashboard/ui/pages/background/GradientBackground";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
  return (
    <GradientBackground>
      <ScrollArea className="h-screen">
        <div className="p-6">
          <AboutPage />
        </div>
      </ScrollArea>
    </GradientBackground>
  );
}
