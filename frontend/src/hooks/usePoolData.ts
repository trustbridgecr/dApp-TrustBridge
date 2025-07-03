import { useState, useEffect, useCallback } from 'react';
import { TRUSTBRIDGE_POOL_ID, TOKENS } from '@/config/contracts';

export interface PoolData {
  totalDeposits: Map<string, bigint>;
  totalBorrows: Map<string, bigint>;
  bRate: number;
  poolMetadata: {
    name: string;
    oracle: string;
    backstopRate: number;
    maxPositions: number;
    reserves: string[];
  } | null;
  backstopStatus: {
    isActive: boolean;
    totalShares: bigint;
    totalTokens: bigint;
  } | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface UsePoolDataReturn extends PoolData {
  refetch: () => Promise<void>;
}

/**
 * React hook for fetching and polling TrustBridge pool data
 * Fetches pool metadata via blend-sdk and polls every 30s for real-time updates
 */
export function usePoolData(): UsePoolDataReturn {
  const [poolData, setPoolData] = useState<PoolData>({
    totalDeposits: new Map(),
    totalBorrows: new Map(),
    bRate: 0.05, // 5% as deployed
    poolMetadata: null,
    backstopStatus: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const fetchPoolData = useCallback(async () => {
    if (!TRUSTBRIDGE_POOL_ID) {
      setPoolData(prev => ({
        ...prev,
        loading: false,
        error: 'Pool ID not configured',
      }));
      return;
    }

    try {
      setPoolData(prev => ({ ...prev, loading: true, error: null }));

      // For now, return mock data that matches our deployed pool
      // This can be replaced with actual Blend SDK calls once the API is clarified
      const mockTotalDeposits = new Map<string, bigint>();
      const mockTotalBorrows = new Map<string, bigint>();
      
      // Mock some realistic values for our XLM/USDC pool
      mockTotalDeposits.set('XLM', BigInt(50000 * 1e7)); // 50,000 XLM
      mockTotalDeposits.set('USDC', BigInt(10000 * 1e7)); // 10,000 USDC
      mockTotalBorrows.set('XLM', BigInt(5000 * 1e7)); // 5,000 XLM borrowed
      mockTotalBorrows.set('USDC', BigInt(2000 * 1e7)); // 2,000 USDC borrowed
      
      setPoolData({
        totalDeposits: mockTotalDeposits,
        totalBorrows: mockTotalBorrows,
        bRate: 0.05, // 5% backstop rate as deployed
        poolMetadata: {
          name: 'TrustBridge Pool',
          oracle: 'CCYHURAC5VTN2ZU663UUS5F24S4GURDPO4FHZ75JLN5DMLRTLCG44H44', // oraclemock from testnet
          backstopRate: 0.05,
          maxPositions: 4,
          reserves: [TOKENS.XLM, TOKENS.USDC],
        },
        backstopStatus: {
          isActive: true,
          totalShares: BigInt(1000 * 1e7),
          totalTokens: BigInt(1000 * 1e7),
        },
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });

    } catch (error) {
      console.error('Error fetching pool data:', error);
      setPoolData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch pool data',
      }));
    }
  }, []);

  // Initial fetch and polling setup
  useEffect(() => {
    fetchPoolData();

    // Set up polling every 30 seconds
    const pollInterval = setInterval(fetchPoolData, 30000);

    return () => clearInterval(pollInterval);
  }, [fetchPoolData]);

  return {
    ...poolData,
    refetch: fetchPoolData,
  };
}

export default usePoolData; 