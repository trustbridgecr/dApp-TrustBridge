'use client';

import { useRoleContext } from "@/providers/role.provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BorrowerPoolPage from '@/components/modules/marketplace/ui/pages/BorrowerPoolPage';

export default function BorrowerMarketplace() {
  const { role } = useRoleContext();
  const router = useRouter();

  useEffect(() => {
    // If no role is set, redirect to marketplace entry
    if (!role) {
      router.push("/dashboard/marketplace");
    } else if (role !== "borrower") {
      // If role is set but not borrower, redirect to correct role page
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
  if (role !== "borrower") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-400">Redirecting to your marketplace...</p>
        </div>
      </div>
    );
  }

  return <BorrowerPoolPage />;
}