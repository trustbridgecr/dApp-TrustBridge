"use client";

import LoanOfferRequests from "@/components/modules/admin/ui/pages/CreateLoanRequests";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalAuthenticationStore } from "@/core/store/data";

const ADMIN_WALLET = "GBZ7KCIUGD2ME7J7YSQW6WVM2RRNYA3AQWVEKVM2VK5LMQL3CKYARBWX";

export default function Page() {
  const { address } = useGlobalAuthenticationStore();
  const router = useRouter();

  useEffect(() => {
    if (address && address !== ADMIN_WALLET) {
      router.replace("/");
    }
  }, [address, router]);

  if (!address) return null;
  if (address !== ADMIN_WALLET) return null;
  return (
    <div className="h-screen overflow-auto p-6 mb-8">
      <LoanOfferRequests />
    </div>
  );
}
