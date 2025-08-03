"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "borrower" | "lender";


interface RoleContextType {
  role: Role | null;
  setRole: (role: Role) => void;
  clearRole: () => void;

  isLoading: boolean; 


const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);

  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    
    try {
      const savedRole = localStorage.getItem("user-role") as Role | null;
      if (savedRole && (savedRole === "borrower" || savedRole === "lender")) {
        setRoleState(savedRole);
      }
    } catch (error) {
      console.error("Error loading role from localStorage:", error);
    } finally {
      // Always set loading to false after attempting to load
      setIsLoading(false);

    }
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);

    try {
      localStorage.setItem("user-role", newRole);
    } catch (error) {
      console.error("Error saving role to localStorage:", error);
    }

  };

  const clearRole = () => {
    setRoleState(null);

    try {
      localStorage.removeItem("user-role");
    } catch (error) {
      console.error("Error removing role from localStorage:", error);
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, clearRole, isLoading }}>

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

