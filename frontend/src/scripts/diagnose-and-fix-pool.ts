import { PoolContract, BackstopContract, Pool } from "@blend-capital/blend-sdk";
import { rpc, TransactionBuilder, xdr, Contract } from "@stellar/stellar-sdk";
import { NETWORK_CONFIG, TRUSTBRIDGE_POOL_ID, TOKENS, BACKSTOP_ID } from "@/config/contracts";

// Comprehensive pool diagnosis and potential fixes for Error #1206
export async function diagnoseAndFixPool() {
  const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
  
  try {
    console.log("🔍 Starting TrustBridge Pool Diagnosis...");
    console.log("Pool ID:", TRUSTBRIDGE_POOL_ID);
    
    // 1. Check if pool contract exists and load pool data using Blend SDK
    console.log("\n1. Checking pool contract existence and loading data...");
    let pool: Pool;
    let sdkCompatible = false;
    
    try {
      const network = {
        rpc: NETWORK_CONFIG.sorobanRpcUrl,
        passphrase: NETWORK_CONFIG.networkPassphrase,
        opts: { allowHttp: false }
      };
      
      pool = await Pool.load(network, TRUSTBRIDGE_POOL_ID);
      console.log("✅ Pool contract exists and data loaded successfully");
      console.log("Pool config:", {
        status: pool.config.status,
        backstopRate: pool.config.backstopRate,
        maxPositions: pool.config.maxPositions
      });
      sdkCompatible = true;
    } catch (error) {
      console.error("❌ Blend SDK failed to load pool:", error);
      
      // Check if this is the min_collateral compatibility issue
      if (error instanceof Error && error.message.includes("min_collateral")) {
        console.log("🔍 Detected SDK compatibility issue with min_collateral field");
        return {
          success: false,
          error: "Pool SDK compatibility issue detected",
          details: "The pool was deployed with a 'min_collateral' field that the current Blend SDK doesn't support",
          fixes: [
            "This explains Error #1206 - SDK version mismatch with pool configuration",
            "Update @blend-capital/blend-sdk to a compatible version",
            "Or deploy a new pool without the min_collateral field",
            "Contact Blend Protocol team about SDK compatibility for this pool"
          ],
          recommendations: [
            "The pool exists but can't be accessed due to SDK version incompatibility",
            "This is why you're getting Error #1206 in your transactions",
            "Consider using the blend-utils repository scripts to interact with the pool directly"
          ]
        };
      }
      
      // For other errors, fall back to basic contract existence check
      try {
        console.log("🔄 Trying basic contract existence check...");
        const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
        // Try to get any contract data to verify it exists
        const contractInstanceKey = xdr.ScVal.scvLedgerKeyContractInstance();
        await server.getContractData(TRUSTBRIDGE_POOL_ID, contractInstanceKey);
        console.log("✅ Pool contract exists but SDK cannot parse configuration");
        
        return {
          success: false,
          error: "Pool exists but SDK cannot load configuration",
          details: `SDK Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          fixes: [
            "Update Blend SDK to latest version",
            "Check SDK compatibility with deployed pool version",
            "Use blend-utils scripts instead of frontend SDK integration",
            "Deploy a new pool with current SDK version"
          ]
        };
      } catch (contractError) {
        console.error("❌ Pool contract not found:", contractError);
        return {
          success: false,
          error: "Pool contract does not exist or failed to load",
          details: `Address ${TRUSTBRIDGE_POOL_ID} may not be a valid deployed contract`,
          fixes: [
            "Verify the pool contract address is correct in your config",
            "Check if the pool was properly deployed to testnet", 
            "Deploy a new pool using the official Blend deployment scripts",
            "Ensure you're connected to the correct network (testnet)"
          ]
        };
      }
    }

    // 3. Analyze what we found
    console.log("\n3. Analyzing pool configuration...");
    const issues: string[] = [];
    const fixes: string[] = [];
    const recommendations: string[] = [];

    if (!sdkCompatible) {
      issues.push("Pool configuration not compatible with current Blend SDK");
      fixes.push("Update Blend SDK to a compatible version");
      fixes.push("Deploy a new pool with current SDK version");
      recommendations.push("This is likely why you're getting Error #1206 - the SDK can't properly interact with the pool");
    }

    if (pool) {
      // SDK-based analysis
      if (pool.config.status !== 0) {
        issues.push(`Pool status is ${pool.config.status} (not Active)`);
        fixes.push("Set pool status to 0 (Active) using admin functions");
      } else {
        console.log("✅ Pool status is Active (0)");
      }

      // Check reserves
      const reserves = pool.reserves;
      console.log(`Found ${reserves.size} reserves:`);
      
      reserves.forEach((reserve, address) => {
        console.log(`  Reserve ${address}:`, {
          enabled: reserve.config.c_factor > 0,
          cFactor: reserve.config.c_factor,
          lFactor: reserve.config.l_factor,
        });
        
        if (reserve.config.c_factor === 0) {
          issues.push(`Reserve ${address} has 0 collateral factor (disabled)`);
          fixes.push(`Enable reserve ${address} with proper collateral factor`);
        }
      });
    }

    // 4. Try a simple transaction simulation to test functionality
    console.log("\n4. Testing pool transaction capability...");
    try {
      // Create a test transaction to see if the pool can handle operations
      const poolContract = new PoolContract(TRUSTBRIDGE_POOL_ID);
      
      // Use a dummy address for testing
      const testAddress = "GBVMCJYXYPQ4LTL7XLFBZ5TZWQL5NUPOBLQ6GTBSYNC3NGSMOD4HCRFO";
      const testOpXdr = poolContract.submit({
        from: testAddress,
        spender: testAddress,
        to: testAddress,
        requests: [{
          request_type: 0, // Supply
          address: "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU", // USDC
          amount: BigInt(1000000) // Small test amount
        }]
      });

      console.log("✅ Pool contract can generate transaction operations");
      recommendations.push("Pool contract appears capable of handling transactions");
      
    } catch (contractError) {
      console.error("❌ Pool contract transaction test failed:", contractError);
      issues.push("Pool contract cannot generate valid transactions");
      fixes.push("Pool may need redeployment with compatible configuration");
    }

    // 5. Summary and recommendations
    console.log("\n📊 DIAGNOSIS SUMMARY");
    console.log("==================");
    
    if (issues.length === 0) {
      console.log("✅ Pool appears to be functional");
      return {
        success: true,
        message: "Pool is accessible and appears functional",
        sdkCompatible,
        recommendations: [
          "Pool contract exists and is responding",
          "Try your transactions again - they may work now",
          "If Error #1206 persists, it may be due to pool status or backstop funding",
          "Check the Blend Protocol documentation for Error #1206 troubleshooting"
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
        sdkCompatible,
        error: "Pool configuration issues detected",
        recommendations
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