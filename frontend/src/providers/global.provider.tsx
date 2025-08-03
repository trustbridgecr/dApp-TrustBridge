"use client";

import { WalletProvider } from "./wallet.provider";
import { TabsProvider } from "./tabs.provider";
import { UserProvider } from "./user.provider";
import { RoleProvider } from "./role.provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletProvider>
      <TabsProvider>

         <UserProvider>
         <RoleProvider>{children}</RoleProvider>
        </UserProvider>
      </TabsProvider>
    </WalletProvider>
  );
};
