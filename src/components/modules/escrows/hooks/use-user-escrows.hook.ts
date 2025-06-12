import { useEffect, useState } from "react";
import { getEscrowsForWallet } from "../lib/escrow";
import { EscrowRecord } from "@/@types/escrow.entity";

export const useUserEscrows = (walletAddress: string) => {
  const [escrows, setEscrows] = useState<EscrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!walletAddress) {
        setEscrows([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await getEscrowsForWallet(walletAddress);
      setEscrows(res);
      setLoading(false);
    };
    load();
  }, [walletAddress]);

  return { escrows, loading };
};
