import { Pool, PoolContract } from "@blend-capital/blend-sdk";
import { rpc, TransactionBuilder, xdr } from "@stellar/stellar-sdk";
import { NETWORK_CONFIG, TRUSTBRIDGE_POOL_ID } from "@/config/contracts";
import { signTransaction } from "@/components/modules/auth/helpers/stellar-wallet-kit.helper";

// Attempt to fix common pool issues that cause Error #1206
export async function attemptPoolFixes(walletAddress: string) {
  const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
  
  try {
    console.log("🔧 Attempting to fix TrustBridge Pool issues...");
    
    // 1. Load pool to check current status
    const network = {
      rpc: NETWORK_CONFIG.sorobanRpcUrl,
      passphrase: NETWORK_CONFIG.networkPassphrase,
      opts: { allowHttp: false }
    };
    
    const pool = await Pool.load(network, TRUSTBRIDGE_POOL_ID);
    console.log("Current pool status:", pool.config.status);
    
    const fixes: string[] = [];
    const issues: string[] = [];
    
    // 2. Check if pool needs activation
    if (pool.config.status !== 0) {
      issues.push(`Pool status is ${pool.config.status} (needs to be 0 for Active)`);
      
      // Try to activate pool if user is admin
      try {
        console.log("🔄 Attempting to activate pool...");
        
        const poolContract = new PoolContract(TRUSTBRIDGE_POOL_ID);
        const account = await server.getAccount(walletAddress);
        
        // Create set status operation
        const setStatusOpXdr = poolContract.setStatus(0); // 0 = Active
        const setStatusOp = xdr.Operation.fromXDR(setStatusOpXdr, 'base64');
        
        const transaction = new TransactionBuilder(account, {
          fee: '1000000',
          networkPassphrase: NETWORK_CONFIG.networkPassphrase,
        })
          .addOperation(setStatusOp)
          .setTimeout(30)
          .build();
        
        // Simulate to populate Soroban data
        const simulationResult = await server.simulateTransaction(transaction);
        
        if (rpc.Api.isSimulationError(simulationResult)) {
          throw new Error(`Simulation failed: ${simulationResult.error}`);
        }
        
        const assembledTx = rpc.assembleTransaction(transaction, simulationResult).build();
        
        // Try to sign and submit
        const signedTransaction = await signTransaction(assembledTx.toXDR());
        const result = await server.sendTransaction(signedTransaction);
        
        fixes.push("✅ Pool activation transaction submitted");
        console.log("Pool activation transaction:", result.hash);
        
      } catch (activationError) {
        console.error("❌ Failed to activate pool:", activationError);
        issues.push("Pool activation failed - you may not be the admin");
      }
    } else {
      console.log("✅ Pool is already active");
    }
    
    // 3. Check reserves configuration
    const disabledReserves: string[] = [];
    pool.reserves.forEach((reserve, address) => {
      if (reserve.config.c_factor === 0) {
        disabledReserves.push(address);
      }
    });
    
    if (disabledReserves.length > 0) {
      issues.push(`${disabledReserves.length} reserves are disabled`);
      console.log("Disabled reserves:", disabledReserves);
      // Note: Enabling reserves requires admin access and is complex
    }
    
    // 4. Try a simple test transaction to see if it works now
    console.log("🧪 Testing pool functionality...");
    try {
      // Create a small test supply operation (without actually submitting)
      const poolContract = new PoolContract(TRUSTBRIDGE_POOL_ID);
      const testOpXdr = poolContract.submit({
        from: walletAddress,
        spender: walletAddress,
        to: walletAddress,
        requests: [{
          request_type: 0, // Supply
          address: "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU", // USDC
          amount: BigInt(1000000) // Small test amount
        }]
      });
      
      const testOp = xdr.Operation.fromXDR(testOpXdr, 'base64');
      const account = await server.getAccount(walletAddress);
      const testTx = new TransactionBuilder(account, {
        fee: '1000000',
        networkPassphrase: NETWORK_CONFIG.networkPassphrase,
      })
        .addOperation(testOp)
        .setTimeout(30)
        .build();
      
      const testSimulation = await server.simulateTransaction(testTx);
      
      if (rpc.Api.isSimulationError(testSimulation)) {
        issues.push(`Test transaction still fails: ${testSimulation.error}`);
      } else {
        fixes.push("✅ Test transaction simulation successful");
      }
      
    } catch (testError) {
      console.error("❌ Test transaction failed:", testError);
      issues.push("Pool still not functional after attempted fixes");
    }
    
    // 5. Return results
    return {
      success: fixes.length > 0 && issues.length === 0,
      fixes,
      issues,
      poolStatus: pool.config.status,
      message: fixes.length > 0 
        ? "Some fixes were applied successfully" 
        : "No fixes could be applied automatically"
    };
    
  } catch (error) {
    console.error("❌ Fix attempt failed:", error);
    return {
      success: false,
      error: "Failed to attempt pool fixes",
      details: error instanceof Error ? error.message : "Unknown error",
      suggestions: [
        "The pool may need admin intervention",
        "Check if you have the necessary permissions",
        "Contact the pool administrator",
        "Wait for official pool activation"
      ]
    };
  }
}

// Simpler function to test if pool is working
export async function testPoolFunctionality(walletAddress: string) {
  try {
    console.log("🧪 Testing pool functionality...");
    
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
    const poolContract = new PoolContract(TRUSTBRIDGE_POOL_ID);
    
    // Create minimal test operation
    const testOpXdr = poolContract.submit({
      from: walletAddress,
      spender: walletAddress, 
      to: walletAddress,
      requests: [{
        request_type: 0,
        address: "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU",
        amount: BigInt(100)
      }]
    });
    
    const testOp = xdr.Operation.fromXDR(testOpXdr, 'base64');
    const account = await server.getAccount(walletAddress);
    const transaction = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: NETWORK_CONFIG.networkPassphrase,
    })
      .addOperation(testOp)
      .setTimeout(30)
      .build();
    
    const simulation = await server.simulateTransaction(transaction);
    
    if (rpc.Api.isSimulationError(simulation)) {
      return {
        working: false,
        error: simulation.error,
        message: "Pool is not functional - transactions will fail"
      };
    } else {
      return {
        working: true,
        message: "Pool appears to be functional"
      };
    }
    
  } catch (error) {
    return {
      working: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Could not test pool functionality"
    };
  }
}

export default attemptPoolFixes; 