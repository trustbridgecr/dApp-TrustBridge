"use client";

import Home from "@/components/auth/Home";
import { useGlobalAuthenticationStore } from "@/components/auth/store/data";
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

  return <Home />;
}
