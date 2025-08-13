"use client";

import LenderPoolPage from "@/components/modules/marketplace/ui/pages/LenderPoolPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useRoleContext } from "@/providers/role.provider";


export default function LenderMarketplace() {
  const { role } = useRoleContext();
  const router = useRouter();

  useEffect(() => {
    // If no role is set, redirect to marketplace entry
    if (!role) {
      router.push("/dashboard/marketplace");
    } else if (role !== "lender") {
      // If role is set but not lender, redirect to correct role page
      router.push(`/dashboard/marketplace/${role}`);
    }
  }, [role, router]);

  // Show loading while checking role
  if (!role) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-400">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  // Show loading while redirecting
  if (role !== "lender") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-400">Redirecting to your marketplace...</p>
        </div>
      </div>
    );
  }


  return <LenderPoolPage />;

}

