"use client";

import { useState, useEffect, useCallback } from "react";
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
  const fetchDashboardData = useCallback(async () => {
    // Reset all loading states to true immediately when starting to fetch data
    setCardsLoading({
      totalSupplied: true,
      totalBorrowed: true,
      availableBalance: true,
      activeLoans: true,
    });

    if (!address) {
      setCardsLoading({
        totalSupplied: false,
        totalBorrowed: false,
        availableBalance: false,
        activeLoans: false,
      });
      return () => {}; // Return an empty cleanup function
    }

    try {
      setError(null);
      
      // Fetch real user dashboard data from smart contracts
      const dashboardData: UserDashboardData = await fetchUserDashboardData(address);
      
      setUserPositions(dashboardData.positions);

      // Store timeout IDs for cleanup
      const timeoutIds: NodeJS.Timeout[] = [];

      // Simulate loading delays for better UX
      timeoutIds.push(setTimeout(() => {
        setTotalSupplied(dashboardData.totalSupplied);
        setCardsLoading(prev => ({ ...prev, totalSupplied: false }));
      }, 300));

      timeoutIds.push(setTimeout(() => {
        setTotalBorrowed(dashboardData.totalBorrowed);
        setCardsLoading(prev => ({ ...prev, totalBorrowed: false }));
      }, 500));

      timeoutIds.push(setTimeout(() => {
        setAvailableBalance(dashboardData.availableBalance);
        setCardsLoading(prev => ({ ...prev, availableBalance: false }));
      }, 700));

      timeoutIds.push(setTimeout(() => {
        setActiveLoans(dashboardData.activeLoans);
        setCardsLoading(prev => ({ ...prev, activeLoans: false }));
      }, 900));

      // Return cleanup function
      return () => {
        timeoutIds.forEach(id => clearTimeout(id));
      };

    } catch (err) {
      console.error("Error fetching user dashboard data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
      setCardsLoading({
        totalSupplied: false,
        totalBorrowed: false,
        availableBalance: false,
        activeLoans: false,
      });
      return () => {}; // Return an empty cleanup function
    }
  }, [address]);

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

  // Reset loading states when wallet address changes
  const resetLoadingStates = useCallback(() => {
    if (address) {
      // Reset all loading states to true when address changes
      setCardsLoading({
        totalSupplied: true,
        totalBorrowed: true,
        availableBalance: true,
        activeLoans: true,
      });
      // Clear any previous error
      setError(null);
    } else {
      // Reset loading states to false when no address
      setCardsLoading({
        totalSupplied: false,
        totalBorrowed: false,
        availableBalance: false,
        activeLoans: false,
      });
    }
  }, [address]);

  useEffect(() => {
    resetLoadingStates();
  }, [resetLoadingStates]);

  // Fetch dashboard data when wallet address changes
  useEffect(() => {
    let isMounted = true;
    let cleanup: (() => void) | undefined;
    let abortController: AbortController | undefined;

    const loadData = async () => {
      // Create abort controller for this request
      abortController = new AbortController();
      
      try {
        cleanup = await fetchDashboardData();
        
        // Check if component is still mounted before updating state
        if (!isMounted) {
          if (cleanup) cleanup();
          return;
        }
      } catch (error) {
        // Only log error if component is still mounted
        if (isMounted) {
          console.error("Error in loadData:", error);
        }
      }
    };

    loadData();

    // Cleanup function for useEffect
    return () => {
      isMounted = false;
      
      // Abort ongoing request if it exists
      if (abortController) {
        abortController.abort();
      }
      
      // Clean up timeouts if cleanup function exists
      if (cleanup) {
        cleanup();
      }
    };
  }, [fetchDashboardData]);

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
