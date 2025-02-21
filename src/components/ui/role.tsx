"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // ✅ Usando ShadCN para botones

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: string) => void;
}

export default function RoleSelectionModal({ isOpen, onClose, onSelectRole }: RoleSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-gray-800 dark:text-gray-100">
            Please select your role
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
          <Button
            onClick={() => onSelectRole("Lender")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Lender
          </Button>
          <Button
            onClick={() => onSelectRole("Borrower")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Borrower
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
