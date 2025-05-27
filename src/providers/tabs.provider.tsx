"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Tabs = "deploy" | "escrow" | "helper";

interface TabsContextType {
  activeTab: Tabs;
  setActiveTab: (tab: Tabs) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("useTabsContext must be used within TabsProvider");
  }
  return context;
}

export function TabsProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tabs>("deploy");

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}
