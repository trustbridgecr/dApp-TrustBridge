# Smart Contract Integration Guide

## Overview

This document provides instructions for integrating real smart contract data to replace the current placeholder implementation in the dashboard cards.

## Current Implementation

The dashboard currently shows:
- **Total Supplied**: $0 (no positions)
- **Total Borrowed**: $0 (no positions)  
- **Available Balance**: $0 (no positions)
- **Active Loans**: 0 (no positions)

## Required Smart Contract Integration

### 1. Blend SDK Setup

First, install and configure the Blend SDK:

```bash
npm install @blend-protocol/sdk
```

### 2. Contract Configuration

Update the contract configuration in `src/config/contracts.ts`:

```typescript
import { BlendSDK } from '@blend-protocol/sdk';

// Initialize Blend SDK
export const blendSDK = new BlendSDK({
  network: 'testnet', // or 'mainnet'
  rpcUrl: 'https://soroban-testnet.stellar.org:443',
});

// Pool contract instance
export const poolContract = blendSDK.getPoolContract(TRUSTBRIDGE_POOL_ID);
export const oracleContract = blendSDK.getOracleContract(ORACLE_ID);
```

### 3. Implement Real Data Fetching

Replace the placeholder implementation in `src/helpers/user-positions.helper.ts`:

```typescript
export async function fetchUserPositions(walletAddress: string): Promise<UserPosition[]> {
  if (!walletAddress || !TRUSTBRIDGE_POOL_ID) {
    return [];
  }

  try {
    const positions: UserPosition[] = [];
    
    for (const asset of [TOKENS.USDC, TOKENS.XLM, TOKENS.TBRG]) {
      try {
        // Get user position for this asset
        const userPosition = await poolContract.get_user_position(walletAddress, asset);
        
        // Get current APY for this asset
        const reserveData = await poolContract.get_reserve_data(asset);
        const currentAPY = calculateAPY(reserveData.current_liquidity_rate);
        
        // Get USD price from oracle
        const priceData = await oracleContract.get_price(asset);
        const usdPrice = Number(priceData.price) / Math.pow(10, 7);
        
        // Parse amounts from contract (assuming 7 decimals)
        const suppliedAmount = Number(userPosition.supplied) / Math.pow(10, 7);
        const borrowedAmount = Number(userPosition.borrowed) / Math.pow(10, 7);
        const totalAmount = Number(userPosition.total_amount) / Math.pow(10, 7);
        
        const position: UserPosition = {
          asset,
          symbol: getAssetSymbol(asset),
          supplied: suppliedAmount,
          borrowed: borrowedAmount,
          collateral: userPosition.is_collateral,
          apy: currentAPY,
          usdValue: totalAmount * usdPrice,
        };
        
        positions.push(position);
      } catch (error) {
        console.error(`Error fetching position for ${asset}:`, error);
      }
    }
    
    return positions;
  } catch (error) {
    console.error("Error fetching user positions:", error);
    throw new Error("Failed to fetch user positions");
  }
}

// Helper functions
function getAssetSymbol(asset: string): string {
  const assetMap = {
    [TOKENS.USDC]: 'USDC',
    [TOKENS.XLM]: 'XLM',
    [TOKENS.TBRG]: 'TBRG',
  };
  return assetMap[asset] || 'Unknown';
}

function calculateAPY(rate: bigint): number {
  // Convert rate from contract format to percentage
  const rateNumber = Number(rate) / Math.pow(10, 7);
  return rateNumber * 100;
}
```

### 4. Add Percentage Change Tracking

To show percentage changes, implement historical data tracking:

```typescript
// Store previous values for comparison
let previousValues = {
  totalSupplied: 0,
  totalBorrowed: 0,
  availableBalance: 0,
  activeLoans: 0,
};

export function calculatePercentageChanges(currentData: UserDashboardData) {
  const changes = {
    totalSupplied: calculatePercentageChange(currentData.totalSupplied, previousValues.totalSupplied),
    totalBorrowed: calculatePercentageChange(currentData.totalBorrowed, previousValues.totalBorrowed),
    availableBalance: calculatePercentageChange(currentData.availableBalance, previousValues.availableBalance),
    activeLoans: calculatePercentageChange(currentData.activeLoans, previousValues.activeLoans),
  };
  
  // Update previous values
  previousValues = { ...currentData };
  
  return changes;
}
```

### 5. Update Dashboard Hook

Update the dashboard hook to use real data:

```typescript
// In useDashboard.hook.ts
const fetchDashboardData = async () => {
  if (!address) return;

  try {
    setError(null);
    
    // Fetch real data from smart contracts
    const dashboardData = await fetchUserDashboardData(address);
    
    // Calculate percentage changes
    const changes = calculatePercentageChanges(dashboardData);
    
    setUserPositions(dashboardData.positions);
    setTotalSupplied(dashboardData.totalSupplied);
    setTotalBorrowed(dashboardData.totalBorrowed);
    setAvailableBalance(dashboardData.availableBalance);
    setActiveLoans(dashboardData.activeLoans);
    
    // Set percentage changes for display
    setPercentageChanges(changes);
    
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
  }
};
```

## Testing the Integration

### 1. Test with Real Wallet

1. Connect a wallet with actual positions
2. Verify that real data is displayed
3. Check that tooltips show actual breakdowns
4. Confirm that calculations are correct

### 2. Test Error Handling

1. Test with invalid wallet address
2. Test with network errors
3. Test with contract errors
4. Verify fallback behavior

### 3. Test Performance

1. Measure data fetching time
2. Test with multiple concurrent requests
3. Verify caching behavior
4. Check memory usage

## Expected Results

After integration, the dashboard should show:

- **Real user positions** from smart contracts
- **Actual supplied/borrowed amounts** for each asset
- **Current APY rates** from pool contracts
- **Real-time USD values** from oracle prices
- **Accurate percentage changes** based on historical data
- **Proper error handling** for network/contract issues

## Troubleshooting

### Common Issues

1. **Network Errors**: Check RPC URL and network configuration
2. **Contract Errors**: Verify contract addresses and ABI
3. **Data Parsing Errors**: Check decimal precision and data format
4. **Performance Issues**: Implement caching and optimize requests

### Debug Steps

1. Check browser console for errors
2. Verify contract calls in network tab
3. Test individual contract functions
4. Validate data format and parsing

## Next Steps

1. Implement the Blend SDK integration
2. Test with real wallet addresses
3. Add error handling and fallbacks
4. Optimize performance and caching
5. Add real-time updates via WebSocket 