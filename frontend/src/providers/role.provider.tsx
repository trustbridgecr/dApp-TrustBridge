"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "lender" | "borrower";

interface RoleContextType {
  role: Role | null;
  setRole: (role: Role) => void;
  clearRole: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);

  useEffect(() => {
    // Load role from localStorage on mount
    const savedRole = localStorage.getItem("user-role") as Role | null;
    if (savedRole && (savedRole === "lender" || savedRole === "borrower")) {
      setRoleState(savedRole);
    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem("user-role", newRole);
  };

  const clearRole = () => {
    setRoleState(null);
    localStorage.removeItem("user-role");
  };

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
}