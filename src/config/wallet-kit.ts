import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  allowAllModules,
} from "@creit.tech/stellar-wallets-kit";
import { setAllowedWallets } from "@creit.tech/stellar-wallets-kit/state/store";

/**
 *
 * Stellar Wallets Kit
 * @Reference URL: https://stellarwalletskit.dev
 *
 */
export const kit: StellarWalletsKit = new StellarWalletsKit({
  network: WalletNetwork.TESTNET,
  selectedWalletId: FREIGHTER_ID,
  modules: allowAllModules(),
});

// Force Lobstr and Rabet modules to be marked as available
kit.getSupportedWallets().then((wallets) => {
  const updated = wallets.map((w) =>
    w.id === "lobstr" || w.id === "rabet" ? { ...w, isAvailable: true } : w
  );
  setAllowedWallets(updated);
});
