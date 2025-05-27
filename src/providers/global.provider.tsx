"use client";

import { EscrowProvider } from "./escrow.provider";
import { WalletProvider } from "./wallet.provider";
import { TrustlessWorkProvider } from "./trustless-work.provider";
import { TabsProvider } from "./tabs.provider";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletProvider>
      <TrustlessWorkProvider>
        <TabsProvider>
          <EscrowProvider>{children}</EscrowProvider>
        </TabsProvider>
      </TrustlessWorkProvider>
    </WalletProvider>
  );
};
