"use client";

import HomePage from "@/components/modules/auth/ui/pages/Home";
import { GradientBackground } from "@/components/modules/dashboard/ui/pages/background/GradientBackground";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push("/dashboard");
    }
  }, [address, router]);

  return (
    <GradientBackground>
      <div className="p-6 ">
        <HomePage />
      </div>
    </GradientBackground>
  );
}
