"use client";

import { HeaderHome } from "@/components/layouts/header/HeaderHome";
import { useGlobalAuthenticationStore } from "@/components/modules/auth/store/data";
import HomePage from "@/components/modules/auth/ui/pages/Home";
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
