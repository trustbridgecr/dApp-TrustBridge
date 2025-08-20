"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RoleSelectionModal from "@/components/modules/marketplace/ui/components/RoleSelectionModal";
import { useRoleContext } from "@/providers/role.provider";


export default function MarketplaceEntry() {
  const { role, setRole } = useRoleContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [hasShownModal, setHasShownModal] = useState(false);
  const router = useRouter();

  // Show modal only once when component mounts
  useEffect(() => {
    if (!hasShownModal) {
      setModalOpen(true);
      setHasShownModal(true);
    }
  }, [hasShownModal]);

  // Get the last selected role from localStorage as fallback

  const getLastSelectedRole = (): "borrower" | "lender" => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("user-role") as
        | "borrower"
        | "lender"

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

  const handleCloseModal = () => {
    setModalOpen(false);

    // If user closes modal without selecting, redirect to borrower by default
    if (!role) {
      setRole("borrower");
      router.push("/dashboard/marketplace/borrower");

    } else {
      router.push(`/dashboard/marketplace/${role}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="loader mb-4"></div>
        <p className="text-gray-400">Loading marketplace...</p>
      </div>
      <RoleSelectionModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onRoleSelect={handleRoleSelect}
        currentRole={getLastSelectedRole()}
      />
    </div>
  );
}
