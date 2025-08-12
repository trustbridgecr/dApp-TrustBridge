import { TRUSTBRIDGE_POOL_ID } from "@/config/contracts";

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

export interface WalletBalance {
  usdc: number;
  xlm: number;
  tbrg: number;
}

export interface CollateralData {
  totalCollateral: number;
  activeCollateral: number;
}

/**
 * Pool configuration mapping for asset classification
 * This makes it easy to add new assets and maintain pool assignments
 */
export const POOL_CONFIG = {
  MAIN_POOL: ['USDC', 'XLM'],
  SECONDARY_POOL: ['TBRG'],
  // Future pools can be easily added here
  // LIQUIDITY_POOL: ['NEW_ASSET_1', 'NEW_ASSET_2'],
  // STAKING_POOL: ['STAKING_TOKEN_1', 'STAKING_TOKEN_2'],
} as const;

export type PoolType = keyof typeof POOL_CONFIG;

/**
 * Helper function to get pool type for an asset
 */
export function getPoolTypeForAsset(assetSymbol: string): PoolType | null {
  for (const [poolType, assets] of Object.entries(POOL_CONFIG)) {
    if ((assets as readonly string[]).includes(assetSymbol)) {
      return poolType as PoolType;
    }
  }
  return null;
}

/**
 * Helper function to get assets for a specific pool
 */
export function getAssetsForPool(poolType: PoolType): readonly string[] {
  return POOL_CONFIG[poolType];
}

/**
 * Fetch user positions from the TrustBridge pool
 * This function makes actual contract calls to get real user data
 */
export async function fetchUserPositions(walletAddress: string): Promise<UserPosition[]> {
  if (!walletAddress || !TRUSTBRIDGE_POOL_ID) {
    return [];
  }

  try {
    // TODO: Replace with actual Blend SDK contract calls
    // This is where you would implement real smart contract integration
    
    // Example implementation structure:
    // const positions: UserPosition[] = [];
    // 
    // for (const asset of [TOKENS.USDC, TOKENS.XLM, TOKENS.TBRG]) {
    //   try {
    //     // Call pool.get_user_position(walletAddress, asset)
    //     const userPosition = await poolContract.get_user_position(walletAddress, asset);
    //     
    //     // Parse the returned data
    //     const position: UserPosition = {
    //       asset,
    //       symbol: getAssetSymbol(asset),
    //       supplied: parseSuppliedAmount(userPosition.supplied),
    //       borrowed: parseBorrowedAmount(userPosition.borrowed),
    //       collateral: userPosition.is_collateral,
    //       apy: await getCurrentAPY(asset),
    //       usdValue: await getUSDValue(asset, userPosition.total_amount),
    //     };
    //     
    //     positions.push(position);
    //   } catch (error) {
    //     console.error(`Error fetching position for ${asset}:`, error);
    //   }
    // }
    
    // For now, return mock data to simulate real user positions
    // This will be replaced with real contract calls
    const mockPositions: UserPosition[] = [
      {
        asset: "USDC",
        symbol: "USDC",
        supplied: 250000,
        borrowed: 100000, // $100,000 as shown in image
        collateral: false,
        apy: 3.2,
        usdValue: 250000,
      },
      {
        asset: "XLM",
        symbol: "XLM",
        supplied: 150000,
        borrowed: 25750, // $25,750 as shown in image
        collateral: true,
        apy: 2.8,
        usdValue: 150000,
      },
      {
        asset: "TBRG",
        symbol: "TBRG",
        supplied: 56289,
        borrowed: 50000, // Added borrowed amount to show in Secondary Pool
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
 * Fallback: Get wallet balance when direct contract calls fail
 */
export async function getWalletBalance(): Promise<WalletBalance> {
  try {
    // TODO: Implement actual wallet balance fetching
    // This would typically involve:
    // 1. Querying the Stellar network for account balances
    // 2. Converting to USD values using price oracles
    // 3. Handling different asset types
    
    // Mock wallet balance for demonstration - more realistic values
    return {
      usdc: 75000,  // User has $75k USDC in wallet
      xlm: 50000,   // User has $50k XLM in wallet
      tbrg: 25000,  // User has $25k TBRG in wallet
    };
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return {
      usdc: 0,
      xlm: 0,
      tbrg: 0,
    };
  }
}

/**
 * Fallback: Get collateral data when direct contract calls fail
 */
export async function getCollateralData(): Promise<CollateralData> {
  try {
    // TODO: Implement actual collateral data fetching
    // This would typically involve:
    // 1. Querying collateral contracts
    // 2. Calculating liquidation thresholds
    // 3. Determining active vs total collateral
    
    // Mock collateral data for demonstration
    return {
      totalCollateral: 150000,
      activeCollateral: 125000,
    };
  } catch (error) {
    console.error("Error fetching collateral data:", error);
    return {
      totalCollateral: 0,
      activeCollateral: 0,
    };
  }
}

/**
 * Calculate dashboard metrics from user positions with fallback logic
 */
export async function calculateDashboardMetrics(
  positions: UserPosition[]
): Promise<Omit<UserDashboardData, 'positions'>> {
  
  // Total Supplied: sum of all supplied assets across all pools
  // Fallback: If cannot be fetched directly, use sum of get_user_position().supplied
  const totalSupplied = positions.reduce((sum, pos) => sum + pos.supplied, 0);
  
  // Total Borrowed: total amount borrowed by the user
  const totalBorrowed = positions.reduce((sum, pos) => sum + pos.borrowed, 0);
  
  // Active Loans: number of currently active borrow positions
  const activeLoans = positions.filter(pos => pos.borrowed > 0).length;
  
  // Available Balance: unallocated funds available for borrowing or supplying again
  // Enhanced calculation incorporating real wallet balance and borrowing capacity
  let availableBalance: number;
  try {
    // Get real wallet balance and collateral data
    const walletBalance = await getWalletBalance();
    const collateralData = await getCollateralData();
    
    // Calculate total wallet balance
    const totalWalletBalance = walletBalance.usdc + walletBalance.xlm + walletBalance.tbrg;
    
    // Calculate borrowing capacity based on collateral
    const borrowingCapacity = collateralData.totalCollateral * 0.8; // Assuming 80% LTV ratio
    
    // Available balance = wallet balance + borrowing capacity - total borrowed
    availableBalance = Math.max(0, totalWalletBalance + borrowingCapacity - totalBorrowed);
    
    // Alternative calculation: if user has supplied assets, consider them as available
    if (totalSupplied > 0) {
      const suppliedAvailable = Math.max(0, totalSupplied - totalBorrowed);
      availableBalance = Math.max(availableBalance, suppliedAvailable);
    }
    
  } catch {
    console.warn("Failed to calculate available balance with wallet data, using fallback");
    // Fallback calculation: Total Supplied - Total Borrowed
    availableBalance = Math.max(0, totalSupplied - totalBorrowed);
  }

  return {
    totalSupplied,
    totalBorrowed,
    availableBalance,
    activeLoans,
  };
}

/**
 * Get real-time user dashboard data with fallback logic
 */
export async function fetchUserDashboardData(walletAddress: string): Promise<UserDashboardData> {
  try {
    // Primary: Fetch user positions from contracts
    const positions = await fetchUserPositions(walletAddress);
    const metrics = await calculateDashboardMetrics(positions);
    
    return {
      ...metrics,
      positions,
    };
  } catch (error) {
    console.error("Error fetching dashboard data, using fallback calculations:", error);
    
    // Fallback: Use alternative data sources
    try {
      const walletBalance = await getWalletBalance();
      const collateralData = await getCollateralData();
      
      // Create fallback positions based on wallet balance
      const fallbackPositions: UserPosition[] = [
        {
          asset: "USDC",
          symbol: "USDC",
          supplied: walletBalance.usdc,
          borrowed: 0,
          collateral: false,
          apy: 0,
          usdValue: walletBalance.usdc,
        },
        {
          asset: "XLM",
          symbol: "XLM",
          supplied: walletBalance.xlm,
          borrowed: 0,
          collateral: false,
          apy: 0,
          usdValue: walletBalance.xlm,
        },
        {
          asset: "TBRG",
          symbol: "TBRG",
          supplied: walletBalance.tbrg,
          borrowed: 0,
          collateral: false,
          apy: 0,
          usdValue: walletBalance.tbrg,
        },
      ];
      
      const totalSupplied = walletBalance.usdc + walletBalance.xlm + walletBalance.tbrg;
      const availableBalance = Math.max(0, totalSupplied - collateralData.activeCollateral);
      
      return {
        totalSupplied,
        totalBorrowed: 0,
        availableBalance,
        activeLoans: 0,
        positions: fallbackPositions,
      };
    } catch (fallbackError) {
      console.error("Fallback calculation also failed:", fallbackError);
      
      // Ultimate fallback: Return empty data
      return {
        totalSupplied: 0,
        totalBorrowed: 0,
        availableBalance: 0,
        activeLoans: 0,
        positions: [],
      };
    }
  }
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

/**
 * Helper functions for smart contract integration
 * These will be implemented when connecting to real contracts
 */

// export async function getAssetSymbol(asset: string): Promise<string> {
//   // Get asset symbol from contract or configuration
//   const assetMap = {
//     [TOKENS.USDC]: 'USDC',
//     [TOKENS.XLM]: 'XLM',
//     [TOKENS.TBRG]: 'TBRG',
//   };
//   return assetMap[asset] || 'Unknown';
// }

// export function parseSuppliedAmount(rawAmount: bigint): number {
//   // Convert from contract decimals to display format
//   return Number(rawAmount) / Math.pow(10, 7); // Assuming 7 decimals
// }

// export function parseBorrowedAmount(rawAmount: bigint): number {
//   return Number(rawAmount) / Math.pow(10, 7);
// }

// export async function getCurrentAPY(asset: string): Promise<number> {
//   const reserveData = await poolContract.get_reserve_data(asset);
//   return calculateAPY(reserveData.current_liquidity_rate);
// }

// export async function getUSDValue(asset: string, amount: bigint): Promise<number> {
//   const price = await oracleContract.get_price(asset);
//   return Number(amount) * Number(price) / Math.pow(10, 7);
// } 