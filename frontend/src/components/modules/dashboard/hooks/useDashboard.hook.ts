"use client";

import { useState, useEffect } from "react";
import { useWalletContext } from "@/providers/wallet.provider";
import { useUserContext } from "@/providers/user.provider";
import { usePoolData } from "@/hooks/usePoolData";
import { 
  fetchUserDashboardData, 
  UserPosition, 
  UserDashboardData 
} from "@/helpers/user-positions.helper";

import { UserProfile } from "@/@types/user.entity";

interface DashboardData {
  profile: UserProfile | null;
  chatCount: number;
  address: string | null;
  walletName: string | null;
  loading: boolean;
  // Dashboard-specific data
  totalSupplied: number;
  totalBorrowed: number;
  availableBalance: number;
  activeLoans: number;
  userPositions: UserPosition[];
  // Loading states for individual cards
  cardsLoading: {
    totalSupplied: boolean;
    totalBorrowed: boolean;
    availableBalance: boolean;
    activeLoans: boolean;
  };
  error: string | null;
}

export function useDashboard(): DashboardData {
  const { walletAddress: address, walletName } = useWalletContext();
  const { profile, loading: profileLoading } = useUserContext();
  const poolData = usePoolData();

  const [chatCount, setChatCount] = useState(0);
  const [chatsLoading, setChatsLoading] = useState(true);
  
  // Dashboard data state
  const [totalSupplied, setTotalSupplied] = useState(0);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [activeLoans, setActiveLoans] = useState(0);
  const [userPositions, setUserPositions] = useState<UserPosition[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Individual card loading states
  const [cardsLoading, setCardsLoading] = useState({
    totalSupplied: true,
    totalBorrowed: true,
    availableBalance: true,
    activeLoans: true,
  });

  // Fetch user dashboard data
  const fetchDashboardData = async () => {
    if (!address) {
      setCardsLoading({
        totalSupplied: false,
        totalBorrowed: false,
        availableBalance: false,
        activeLoans: false,
      });
      return;
    }

    try {
      setError(null);
      
      // Fetch real user dashboard data
      const dashboardData: UserDashboardData = await fetchUserDashboardData(address);
      
      setUserPositions(dashboardData.positions);

      // Simulate loading delays for better UX
      setTimeout(() => {
        setTotalSupplied(dashboardData.totalSupplied);
        setCardsLoading(prev => ({ ...prev, totalSupplied: false }));
      }, 300);

      setTimeout(() => {
        setTotalBorrowed(dashboardData.totalBorrowed);
        setCardsLoading(prev => ({ ...prev, totalBorrowed: false }));
      }, 500);

      setTimeout(() => {
        setAvailableBalance(dashboardData.availableBalance);
        setCardsLoading(prev => ({ ...prev, availableBalance: false }));
      }, 700);

      setTimeout(() => {
        setActiveLoans(dashboardData.activeLoans);
        setCardsLoading(prev => ({ ...prev, activeLoans: false }));
      }, 900);

    } catch (err) {
      console.error("Error fetching user dashboard data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
      setCardsLoading({
        totalSupplied: false,
        totalBorrowed: false,
        availableBalance: false,
        activeLoans: false,
      });
    }
  };

  useEffect(() => {
    const loadChats = async () => {
      if (!address) {
        setChatCount(0);
        setChatsLoading(false);
        return;
      }
    };

    loadChats();
  }, [address]);

  // Fetch dashboard data when wallet address changes
  useEffect(() => {
    fetchDashboardData();
  }, [address, poolData.lastUpdated]);

  return {
    profile,
    chatCount,
    address,
    walletName,
    loading: profileLoading || chatsLoading,
    // Dashboard-specific data
    totalSupplied,
    totalBorrowed,
    availableBalance,
    activeLoans,
    userPositions,
    cardsLoading,
    error,
  };
}
