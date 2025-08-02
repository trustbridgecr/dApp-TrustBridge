"use client";

import { useState, useEffect } from "react";
import { X, TrendingUp, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RoleSelectionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentRole?: "lender" | "borrower";
  onRoleSelect?: (role: "lender" | "borrower") => void;
}

export default function RoleSelectionModal({
  isOpen = true,
  onClose,
  currentRole = "lender",
  onRoleSelect,
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<"lender" | "borrower">(
    currentRole,
  );

  // Update selected role when currentRole prop changes
  useEffect(() => {
    setSelectedRole(currentRole);
  }, [currentRole]);

  const handleRoleSelect = (role: "lender" | "borrower") => {
    setSelectedRole(role);
  };

  const handleConfirm = () => {
    // Immediately call onRoleSelect and let the parent handle the navigation
    onRoleSelect?.(selectedRole);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full relative">
        {/* Close Button - Only show if onClose is provided */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">
            Choose Your Path
          </h2>
          <p className="text-gray-400 text-sm">
            How would you like to participate in our marketplace?
          </p>
          <div className="mt-4">
            <span className="text-gray-400 text-sm">Selected role: </span>
            <span
              className={
                selectedRole === "lender" ? "text-green-400" : "text-orange-400"
              }
            >
              {selectedRole}
            </span>
          </div>
        </div>

        {/* Role Options */}
        <div className="space-y-4 mb-6">
          <Card
            className={`p-6 cursor-pointer transition-all duration-200 ${
              selectedRole === "lender"
                ? "bg-slate-700 border-2 border-green-500"
                : "bg-slate-700 border border-slate-600 hover:border-slate-500"
            }`}
            onClick={() => handleRoleSelect("lender")}
          >
            <div className="flex items-start gap-4">
              <div className="bg-slate-600 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">
                    I&apos;m a Lender
                  </h3>
                  {selectedRole === "lender" && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-green-400 text-sm font-medium mb-2">
                  Supply & Earn
                </p>
                <p className="text-gray-400 text-sm">
                  Provide liquidity to earn competitive yields on your crypto
                  assets
                </p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all duration-200 ${
              selectedRole === "borrower"
                ? "bg-slate-700 border-2 border-orange-500"
                : "bg-slate-700 border border-slate-600 hover:border-slate-500"
            }`}
            onClick={() => handleRoleSelect("borrower")}
          >
            <div className="flex items-start gap-4">
              <div className="bg-slate-600 p-2 rounded-lg">
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold">
                    I&apos;m a Borrower
                  </h3>
                  {selectedRole === "borrower" && (
                    <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-orange-400 text-sm font-medium mb-2">
                  Borrow & Build
                </p>
                <p className="text-gray-400 text-sm">
                  Access instant liquidity by using your crypto as collateral
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Confirm Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleConfirm}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2 rounded-lg font-medium"
          >
            Continue as {selectedRole}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Your preference will be saved for future visits
        </p>
      </div>
    </div>
  );
}