import { useEffect, useState } from "react";
import { getEscrowsForWallet } from "../lib/escrow";
import { EscrowRecord } from "@/@types/escrow.entity";

export const useUserEscrows = (walletAddress: string) => {
  const [escrows, setEscrows] = useState<EscrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!walletAddress) {
        setEscrows([]);
        setLoading(false);
        setError(null);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const res = await getEscrowsForWallet(walletAddress);
        setEscrows(res);
      } catch (err) {
        console.error("Error loading escrows:", err);
        setError("Failed to load escrows");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [walletAddress]);

  return { escrows, loading, error };
};
