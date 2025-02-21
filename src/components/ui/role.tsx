"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FaWallet, FaUsers } from "react-icons/fa";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: string) => void;
}

export default function RoleSelectionModal({ isOpen, onClose, onSelectRole }: RoleSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black text-white p-12 max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Select Your Role</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-row items-center justify-between gap-8 mt-8">
          {/* Lender Card */}
          <div
            onClick={() => onSelectRole("Lender")}
            className="flex flex-col items-center justify-center w-1/2 p-8 bg-black rounded-2xl cursor-pointer hover:bg-gray-800 transition shadow-lg"
          >
            <FaWallet className="text-blue-400 text-5xl mb-4" />
            <h3 className="text-blue-400 font-semibold text-xl">Lender</h3>
            <p className="text-sm text-gray-400 text-center mt-2">
              Invest your funds and earn returns by supporting borrowers on our platform.
            </p>
          </div>
          
          <Separator orientation="vertical" className="h-32 w-px bg-gray-700" />
          
          {/* Borrower Card */}
          <div
            onClick={() => onSelectRole("Borrower")}
            className="flex flex-col items-center justify-center w-1/2 p-8 bg-black rounded-2xl cursor-pointer hover:bg-gray-800 transition shadow-lg"
          >
            <FaUsers className="text-green-400 text-5xl mb-4" />
            <h3 className="text-green-400 font-semibold text-xl">Borrower</h3>
            <p className="text-sm text-gray-400 text-center mt-2">
              Access funds quickly through our community of lenders with competitive rates.
            </p>
          </div>
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-8">
          Secure P2P lending powered by smart contracts.
        </p>
      </DialogContent>
    </Dialog>
  );
}
