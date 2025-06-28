"use client";

import { WalletProvider } from "./wallet.provider";
import { TabsProvider } from "./tabs.provider";
import { UserProvider } from "./user.provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletProvider>
      <TabsProvider>
        <UserProvider>{children}</UserProvider>
      </TabsProvider>
    </WalletProvider>
  );
};
