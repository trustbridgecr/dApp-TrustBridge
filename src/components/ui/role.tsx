"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Wallet, Users } from "lucide-react";
import { useTranslation } from "next-i18next";
import { UserRole } from "@/@types/auth";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
}

export default function RoleSelectionModal({ isOpen, onClose, onSelectRole }: RoleSelectionModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-darkbg text-black dark:text-white p-12 max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {t("roleSelection.title", "Select Your Role")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-row items-center justify-between gap-8 mt-8">
          <div
            onClick={() => onSelectRole("Lender")}
            className="flex flex-col items-center justify-center w-1/2 p-8 bg-white dark:bg-darkbg rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-lg"
          >
            <Wallet className="text-blue-400 text-5xl mb-4" />
            <h3 className="text-blue-400 font-semibold text-xl">
              {t("roleSelection.lenderTitle", "Lender")}
            </h3>
            <p className="text-sm text-gray-400 text-center mt-2">
              {t("roleSelection.lenderDescription", "Invest your funds and earn returns by supporting borrowers on our platform.")}
            </p>
          </div>
          
          <Separator orientation="vertical" className="h-32 w-px bg-gray-700" />
          
          <div
            onClick={() => onSelectRole("Borrower")}
            className="flex flex-col items-center justify-center w-1/2 p-8 bg-white dark:bg-darkbg rounded-2xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-lg"
          >
            <Users className="text-green-400 text-5xl mb-4" />
            <h3 className="text-green-400 font-semibold text-xl">
              {t("roleSelection.borrowerTitle", "Borrower")}
            </h3>
            <p className="text-sm text-gray-400 text-center mt-2">
              {t("roleSelection.borrowerDescription", "Access funds quickly through our community of lenders with competitive rates.")}
            </p>
          </div>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-8">
          {t("roleSelection.footer", "Secure P2P lending powered by smart contracts.")}
        </p>
      </DialogContent>
    </Dialog>
  );
}
