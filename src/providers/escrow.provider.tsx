"use client";

import { Escrow } from "@trustless-work/escrow/types";
import { createContext, useContext, useState, ReactNode } from "react";

/**
 *
 * Escrow Context
 *
 */
interface EscrowContextProps {
  escrow: Escrow | null;
  setEscrow: (escrow: Escrow) => void;
  resetEscrow: () => void;
}

const EscrowContext = createContext<EscrowContextProps | undefined>(undefined);

/**
 * Escrow Provider
 *
 * @Note:
 * - We're using useContext to provide the unique escrow in the whole project. But in your case, you
 *   can use Redux or Zustand to store the escrow.
 *
 */
export const EscrowProvider = ({ children }: { children: ReactNode }) => {
  const [escrow, setEscrowState] = useState<Escrow | null>(null);

  /**
   * Set Escrow
   *
   * @param newEscrow - New escrow
   */
  const setEscrow = (newEscrow: Escrow) => {
    setEscrowState(newEscrow);
  };

  /**
   * Reset Escrow
   */
  const resetEscrow = () => {
    setEscrowState(null);
  };

  return (
    <EscrowContext.Provider value={{ escrow, setEscrow, resetEscrow }}>
      {children}
    </EscrowContext.Provider>
  );
};

export const useEscrowContext = () => {
  const context = useContext(EscrowContext);
  if (!context) {
    throw new Error("useEscrowContext must be used within EscrowProvider");
  }
  return context;
};
