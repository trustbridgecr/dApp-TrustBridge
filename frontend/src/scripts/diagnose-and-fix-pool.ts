import { PoolContract, BackstopContract, Pool } from "@blend-capital/blend-sdk";
import { rpc, Keypair, TransactionBuilder } from "@stellar/stellar-sdk";
import { NETWORK_CONFIG, TRUSTBRIDGE_POOL_ID, TOKENS } from "@/config/contracts";

// Comprehensive pool diagnosis and potential fixes for Error #1206
export async function diagnoseAndFixPool() {
  const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
  
  try {
    console.log("🔍 Starting TrustBridge Pool Diagnosis...");
    console.log("Pool ID:", TRUSTBRIDGE_POOL_ID);
    
    // 1. Check if pool contract exists and is responding
    console.log("\n1. Checking pool contract existence...");
    try {
      const account = await server.getAccount(TRUSTBRIDGE_POOL_ID);
      console.log("✅ Pool contract exists and is responding");
    } catch (error) {
      console.error("❌ Pool contract not found or not responding:", error);
      return {
        success: false,
        error: "Pool contract does not exist",
        fixes: ["Deploy a new pool using the official Blend deployment scripts"]
      };
    }

    // 2. Load pool data using Blend SDK
    console.log("\n2. Loading pool data...");
    let pool: Pool;
    try {
      const network = {
        rpc: NETWORK_CONFIG.sorobanRpcUrl,
        passphrase: NETWORK_CONFIG.networkPassphrase,
        opts: { allowHttp: false }
      };
      
      pool = await Pool.load(network, TRUSTBRIDGE_POOL_ID);
      console.log("✅ Pool data loaded successfully");
      console.log("Pool config:", {
        status: pool.config.status,
        backstopRate: pool.config.backstopRate,
        maxPositions: pool.config.maxPositions
      });
    } catch (error) {
      console.error("❌ Failed to load pool data:", error);
      return {
        success: false,
        error: "Cannot load pool configuration",
        fixes: [
          "Pool may not be properly initialized",
          "Check if reserves are configured",
          "Verify oracle configuration"
        ]
      };
    }

    // 3. Check pool status
    console.log("\n3. Checking pool status...");
    const issues = [];
    const fixes = [];

    if (pool.config.status !== 0) {
      issues.push(`Pool status is ${pool.config.status} (not Active)`);
      fixes.push("Set pool status to 0 (Active) using admin functions");
    } else {
      console.log("✅ Pool status is Active (0)");
    }

    // 4. Check reserves configuration
    console.log("\n4. Checking reserves configuration...");
    const reserves = pool.reserves;
    console.log(`Found ${reserves.size} reserves:`);
    
    reserves.forEach((reserve, address) => {
      console.log(`  Reserve ${address}:`, {
        enabled: reserve.config.c_factor > 0,
        cFactor: reserve.config.c_factor,
        lFactor: reserve.config.l_factor,
        decimals: reserve.config.decimals
      });
      
      if (reserve.config.c_factor === 0) {
        issues.push(`Reserve ${address} has 0 collateral factor (disabled)`);
        fixes.push(`Enable reserve ${address} with proper collateral factor`);
      }
    });

    // 5. Check oracle configuration
    console.log("\n5. Checking oracle configuration...");
    try {
      const oracle = await pool.loadOracle();
      console.log("✅ Oracle loaded successfully");
      console.log("Oracle prices available for", oracle.prices.size, "assets");
    } catch (error) {
      console.error("❌ Oracle issues:", error);
      issues.push("Oracle not functioning properly");
      fixes.push("Check oracle configuration and price feeds");
    }

    // 6. Check backstop funding (requires backstop contract)
    console.log("\n6. Checking backstop information...");
    try {
      // From testnet.contracts.json
      const BACKSTOP_ID = "CC4TSDVQKBAYMK4BEDM65CSNB3ISI2A54OOBRO6IPSTFHJY3DEEKHRKV";
      
      const backstop = new BackstopContract(BACKSTOP_ID);
      console.log("ℹ️ Backstop contract loaded");
      // Note: We can't easily check backstop funding without more complex queries
      issues.push("Backstop funding status unknown - may need funding");
      fixes.push("Fund the pool's backstop with BLND:USDC LP tokens");
    } catch (error) {
      console.error("⚠️ Could not check backstop:", error);
    }

    // 7. Summary and recommendations
    console.log("\n📊 DIAGNOSIS SUMMARY");
    console.log("==================");
    
    if (issues.length === 0) {
      console.log("✅ Pool appears to be configured correctly");
      console.log("The Error #1206 may be due to:");
      console.log("- Insufficient backstop funding");
      console.log("- Temporary oracle issues");
      console.log("- Network connectivity problems");
      
      return {
        success: true,
        message: "Pool configuration appears correct",
        recommendations: [
          "Check backstop funding levels",
          "Verify oracle is providing current prices",
          "Try transactions with smaller amounts",
          "Wait for any temporary network issues to resolve"
        ]
      };
    } else {
      console.log("❌ Issues found:");
      issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
      
      console.log("\n🔧 Recommended fixes:");
      fixes.forEach((fix, i) => console.log(`  ${i + 1}. ${fix}`));
      
      return {
        success: false,
        issues,
        fixes,
        error: "Pool configuration issues detected"
      };
    }

  } catch (error) {
    console.error("❌ Diagnosis failed:", error);
    return {
      success: false,
      error: "Failed to diagnose pool",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Function to check if pool needs activation
export async function checkPoolActivation() {
  try {
    console.log("🔍 Checking if TrustBridge pool needs activation...");
    
    const network = {
      rpc: NETWORK_CONFIG.sorobanRpcUrl,
      passphrase: NETWORK_CONFIG.networkPassphrase,
      opts: { allowHttp: false }
    };
    
    const pool = await Pool.load(network, TRUSTBRIDGE_POOL_ID);
    
    const needsActivation = pool.config.status !== 0;
    const hasReserves = pool.reserves.size > 0;
    
    return {
      needsActivation,
      currentStatus: pool.config.status,
      hasReserves,
      reserveCount: pool.reserves.size,
      recommendation: needsActivation 
        ? "Pool needs to be set to Active status (0) by admin"
        : "Pool is Active - issue may be backstop funding or oracle"
    };
    
  } catch (error) {
    return {
      error: "Failed to check pool activation status",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

// Export the diagnosis function for use in frontend
export default diagnoseAndFixPool; 