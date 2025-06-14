import {
  StellarWalletsKit,
  WalletNetwork,
  FREIGHTER_ID,
  allowAllModules,
} from "@creit.tech/stellar-wallets-kit";

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
