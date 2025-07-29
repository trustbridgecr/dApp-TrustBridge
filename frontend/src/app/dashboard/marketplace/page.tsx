"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoleSelectionModal from "@/components/modules/marketplace/ui/components/RoleSelectionModal";
import { useRoleContext } from "@/providers/role.provider";

export default function MarketplaceEntry() {
  const { role, setRole } = useRoleContext();
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!role) {
      setModalOpen(true);
    } else {
      // If role is already set, redirect to the appropriate page
      router.push(`/dashboard/marketplace/${role}`);
    }
  }, [role, router]);

  // Get the last selected role from localStorage as fallback
  const getLastSelectedRole = (): "lender" | "borrower" => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("user-role") as
        | "lender"
        | "borrower"
        | null;
      return savedRole && (savedRole === "lender" || savedRole === "borrower")
        ? savedRole
        : "lender";
    }
    return "lender";
  };

  const handleRoleSelect = (selectedRole: "lender" | "borrower") => {
    setRole(selectedRole);
    setModalOpen(false);
    router.push(`/dashboard/marketplace/${selectedRole}`);
  };

  if (!role) {
    return (
      <RoleSelectionModal
        isOpen={modalOpen}
        onRoleSelect={handleRoleSelect}
        currentRole={getLastSelectedRole()}
      />
    );
  }

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="loader mb-4"></div>
        <p className="text-gray-400">Redirecting to your marketplace...</p>
      </div>
    </div>
  );
}
