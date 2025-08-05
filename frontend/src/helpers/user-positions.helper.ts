import { TRUSTBRIDGE_POOL_ID, TOKENS } from "@/config/contracts";

export interface UserPosition {
  asset: string;
  symbol: string;
  supplied: number;
  borrowed: number;
  collateral: boolean;
  apy: number;
  usdValue: number;
}

export interface UserDashboardData {
  totalSupplied: number;
  totalBorrowed: number;
  availableBalance: number;
  activeLoans: number;
  positions: UserPosition[];
}

/**
 * Fetch user positions from the TrustBridge pool
 * This function will make actual contract calls to get real user data
 */
export async function fetchUserPositions(walletAddress: string): Promise<UserPosition[]> {
  if (!walletAddress || !TRUSTBRIDGE_POOL_ID) {
    return [];
  }

  try {
    // TODO: Replace with actual contract calls using Blend SDK
    // For now, returning mock data that simulates real user positions
    
    // In the real implementation, you would:
    // 1. Call pool.get_user_position(walletAddress) for each asset
    // 2. Parse the returned data to get supplied/borrowed amounts
    // 3. Calculate APY based on current pool rates
    // 4. Get USD values from oracle prices
    
    const mockPositions: UserPosition[] = [
      {
        asset: TOKENS.USDC,
        symbol: "USDC",
        supplied: 250000,
        borrowed: 0,
        collateral: false,
        apy: 3.2,
        usdValue: 250000,
      },
      {
        asset: TOKENS.XLM,
        symbol: "XLM",
        supplied: 150000,
        borrowed: 75000,
        collateral: true,
        apy: 2.8,
        usdValue: 150000,
      },
      {
        asset: TOKENS.TBRG,
        symbol: "TBRG",
        supplied: 56289,
        borrowed: 50750,
        collateral: false,
        apy: 5.1,
        usdValue: 56289,
      },
    ];

    return mockPositions;
  } catch (error) {
    console.error("Error fetching user positions:", error);
    throw new Error("Failed to fetch user positions");
  }
}

/**
 * Calculate dashboard metrics from user positions
 */
export function calculateDashboardMetrics(positions: UserPosition[]): Omit<UserDashboardData, 'positions'> {
  const totalSupplied = positions.reduce((sum, pos) => sum + pos.supplied, 0);
  const totalBorrowed = positions.reduce((sum, pos) => sum + pos.borrowed, 0);
  const activeLoans = positions.filter(pos => pos.borrowed > 0).length;
  
  // Available balance calculation
  // This is a simplified calculation - in reality it would be more complex
  // considering collateral factors, liquidation thresholds, etc.
  const availableBalance = Math.max(0, totalSupplied - totalBorrowed * 0.8);

  return {
    totalSupplied,
    totalBorrowed,
    availableBalance,
    activeLoans,
  };
}

/**
 * Get real-time user dashboard data
 */
export async function fetchUserDashboardData(walletAddress: string): Promise<UserDashboardData> {
  const positions = await fetchUserPositions(walletAddress);
  const metrics = calculateDashboardMetrics(positions);
  
  return {
    ...metrics,
    positions,
  };
}

/**
 * Format currency values consistently
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Get percentage change for display
 */
export function calculatePercentageChange(current: number, previous: number): {
  value: string;
  type: 'positive' | 'negative' | 'neutral';
} {
  if (previous === 0) {
    return { value: '0%', type: 'neutral' };
  }
  
  const change = ((current - previous) / previous) * 100;
  const formattedChange = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  
  return {
    value: formattedChange,
    type: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral',
  };
} 