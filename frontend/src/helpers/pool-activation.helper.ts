import { Contract, rpc, TransactionBuilder, nativeToScVal } from "@stellar/stellar-sdk";
import { NETWORK_CONFIG, TRUSTBRIDGE_POOL_ID } from "@/config/contracts";
import { signTransaction } from "@/components/modules/auth/helpers/stellar-wallet-kit.helper";
import { toast } from "sonner";

export interface PoolStatusResult {
  success: boolean;
  currentStatus?: number;
  backstopInfo?: {
    totalShares: string;
    totalTokens: string;
    threshold: string;
    meetsThreshold: boolean;
  };
  error?: string;
}

/**
 * Pool Status Enum (from Blend documentation)
 */
export enum PoolStatus {
  ADMIN_ACTIVE = 0,
  ACTIVE = 1,
  ADMIN_ON_ICE = 2,
  ON_ICE = 3,
  ADMIN_FROZEN = 4,
  FROZEN = 5,
  SETUP = 6  // Initial status - blocks all transactions
}

/**
 * Get human-readable status name
 */
export function getStatusName(status: number): string {
  const statusNames = {
    0: "Admin Active",
    1: "Active", 
    2: "Admin On Ice",
    3: "On Ice",
    4: "Admin Frozen",
    5: "Frozen",
    6: "Setup (Inactive)"
  };
  return statusNames[status as keyof typeof statusNames] || "Unknown";
}

/**
 * Activate pool by setting proper status
 */
export async function activatePool(
  poolId: string = TRUSTBRIDGE_POOL_ID,
  walletAddress: string
): Promise<PoolStatusResult> {
  try {
    console.log('🚀 Activating pool:', poolId);
    toast.info("Activating pool...");
    
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
    const account = await server.getAccount(walletAddress);
    const poolContract = new Contract(poolId);
    
    // Set pool status to Admin Active (0)
    console.log('Setting pool status to Admin Active...');
    const setStatusTx = new TransactionBuilder(account, {
      fee: '1000000',
      networkPassphrase: NETWORK_CONFIG.networkPassphrase
    })
    .addOperation(poolContract.call('set_status', nativeToScVal(PoolStatus.ADMIN_ACTIVE, { type: 'u32' })))
    .setTimeout(30)
    .build();

    // Simulate first
    const simulation = await server.simulateTransaction(setStatusTx);
    if (rpc.Api.isSimulationError(simulation)) {
      throw new Error(`Pool activation simulation failed: ${simulation.error}`);
    }

    // Assemble and sign
    const assembledTx = rpc.assembleTransaction(setStatusTx, simulation).build();
    const signedTx = await signTransaction(assembledTx.toXDR());
    
    // Submit transaction
    const result = await server.sendTransaction(signedTx);
    
    if (result.status === "PENDING") {
      // Wait for confirmation
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          const txResult = await server.getTransaction(result.hash);
          
          if (txResult.status === "SUCCESS") {
            console.log('✅ Pool status updated successfully!');
            toast.success("Pool activated successfully!");
            
            return {
              success: true,
              currentStatus: PoolStatus.ADMIN_ACTIVE
            };
          } else if (txResult.status === "FAILED") {
            throw new Error(`Pool activation failed: ${txResult.resultXdr}`);
          }
        } catch (pollError) {
          console.warn("Error polling transaction status:", pollError);
        }
        
        attempts++;
      }
      
      throw new Error("Pool activation timeout");
    } else {
      throw new Error(`Pool activation failed: ${result.errorResult}`);
    }
    
  } catch (error) {
    console.error('Pool activation failed:', error);
    toast.error(`Pool activation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Diagnose pool issues and provide recommendations
 */
export async function diagnosePoolIssues(poolId: string = TRUSTBRIDGE_POOL_ID): Promise<string[]> {
  const issues: string[] = [];
  
  try {
    console.log('🔍 Diagnosing pool issues for:', poolId);
    
    // Basic connectivity test
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
    const poolContract = new Contract(poolId);
    
    // Try to call a basic read function
    try {
      const dummyAccount = await server.getAccount("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF");
      
      const testTx = new TransactionBuilder(dummyAccount, {
        fee: '100',
        networkPassphrase: NETWORK_CONFIG.networkPassphrase
      })
      .addOperation(poolContract.call('name'))
      .setTimeout(30)
      .build();
      
      const simulation = await server.simulateTransaction(testTx);
      
      if (rpc.Api.isSimulationError(simulation)) {
        issues.push(`❌ Pool contract not accessible: ${simulation.error}`);
        issues.push("💡 Pool may not be properly initialized");
      } else {
        issues.push("✅ Pool contract is accessible");
        issues.push("🚨 Most likely issue: Pool is in SETUP status");
        issues.push("💡 Solution: Call activatePool() to activate the pool");
      }
      
    } catch (readError) {
      issues.push(`⚠️ Pool read error: ${readError instanceof Error ? readError.message : 'Unknown'}`);
      issues.push("💡 Pool may need activation or proper configuration");
    }
    
    // General recommendations for error #1206
    issues.push("");
    issues.push("📋 Error #1206 Solutions:");
    issues.push("1. Activate pool using activatePool() function");
    issues.push("2. Ensure pool has adequate backstop funding");
    issues.push("3. Verify oracle is working for all assets");
    issues.push("4. Check pool admin permissions");
    
  } catch (error) {
    issues.push(`❌ Diagnosis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return issues;
} 