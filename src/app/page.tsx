"use client";

import { HeaderHome } from "@/components/layouts/header/HeaderHome";
import HomePage from "@/components/modules/auth/ui/pages/Home";
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
    <div>
      <HeaderHome />
      <HomePage />
    </div>
  );
}
