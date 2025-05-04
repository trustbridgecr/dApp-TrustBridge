import { useState, useEffect } from "react";
import { useGlobalAuthenticationStore } from "@/core/store/data";
import {
  Escrow,
  providerMilestone,
} from "../services/service-provider-milestone.service";
import { toast } from "sonner";

export const useProviderEscrows = () => {
  const address = useGlobalAuthenticationStore((state) => state.address);
  const [escrows, setEscrows] = useState<Escrow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchEscrows = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const data = await providerMilestone.getProviderEscrows(address);
      setEscrows(data);
    } catch {
      toast.error("Failed to load escrows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscrows();
  }, [address]);

  return { escrows, loading, refetch: fetchEscrows };
};
