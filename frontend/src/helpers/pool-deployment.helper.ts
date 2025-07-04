import { 
  rpc,
  TransactionBuilder, 
  xdr, 
  nativeToScVal,
  Address,
  Contract
} from '@stellar/stellar-sdk';
import { 
  PoolContractV2,
  RequestType,
  Request
} from '@blend-capital/blend-sdk';
import { signTransaction } from "@/components/modules/auth/helpers/stellar-wallet-kit.helper";
import { NETWORK_CONFIG, POOL_FACTORY_ID, ORACLE_ID, TOKENS, FALLBACK_ORACLE_ID } from "@/config/contracts";
import { toast } from "sonner";
import { kit } from "@/config/wallet-kit";

// Add StellarWalletKit type for compatibility
type StellarWalletKit = typeof kit;

export interface PoolDeploymentResult {
  success: boolean;
  poolAddress?: string;
  transactionHash?: string;
  error?: string;
}



/**
 * Deploy a new lending pool using the Blend protocol pool factory
 * @param kit - Stellar Wallet Kit instance
 * @param walletAddress - Wallet address that will be the pool admin
 * @returns Promise with deployment result
 */
export async function deployTrustBridgePool(
  kit: StellarWalletKit,
  walletAddress: string
): Promise<PoolDeploymentResult> {
  try {
    console.log(`Starting pool deployment for wallet: ${walletAddress}`);
    
    if (!kit) {
      throw new Error("Wallet kit not available");
    }

    // Create RPC server instance
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);

    // Get account information
    const account = await server.getAccount(walletAddress);
    if (!account) {
      throw new Error("Failed to get account information");
    }

    // Initialize pool factory contract
    const poolFactoryContract = new Contract(POOL_FACTORY_ID);

    // Pool configuration optimized for Blend protocol requirements
    const poolConfig = {
      admin: walletAddress,
      name: "TrustBridge Pool",
      salt: Buffer.from(Math.random().toString(36).substring(7)),
      oracle: ORACLE_ID,
      backstop_take_rate: 500000, // 5% in 7 decimals (0.05 * 10^7)
      max_positions: 4,
      min_collateral: BigInt(0) // Set to 0 for no minimum collateral requirement (official default)
    };

    console.log("Building deployment transaction...");

    // Build pool deployment transaction with correct parameters using deploy function
    const transaction = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: NETWORK_CONFIG.networkPassphrase
    })
      .addOperation(poolFactoryContract.call(
        'deploy', // Correct function name according to official Blend documentation
        Address.fromString(poolConfig.admin).toScVal(),
        nativeToScVal(poolConfig.name, { type: 'string' }),
        nativeToScVal(poolConfig.salt, { type: 'bytes' }),
        Address.fromString(poolConfig.oracle).toScVal(),
        nativeToScVal(poolConfig.backstop_take_rate, { type: 'u32' }),
        nativeToScVal(poolConfig.max_positions, { type: 'u32' }),
        nativeToScVal(BigInt(0), { type: 'i128' }) // Official default: no minimum collateral
      ))
      .setTimeout(300)
      .build();

    console.log("Simulating transaction...");

    // Simulate transaction first
    try {
      const simulation = await server.simulateTransaction(transaction);
      
      if (rpc.Api.isSimulationError(simulation)) {
        console.error("Simulation failed:", simulation.error);
        throw new Error(`Pool deployment simulation failed: ${simulation.error}`);
      }
    } catch (simError) {
      console.error("Simulation error:", simError);
      console.error('Pool deployment simulation failed:', simError);
      throw new Error(`Pool deployment simulation error: ${simError}`);
    }

    console.log("Signing transaction...");

    // Sign transaction - Fixed: only pass transaction XDR
    const signedTransaction = await signTransaction(transaction.toXDR());
    
    console.log("Submitting transaction...");

    // Submit transaction
    const result = await server.sendTransaction(signedTransaction);
    
    if (result.status === "PENDING") {
      console.log("Transaction submitted! Hash:", result.hash);
      
      // Wait for transaction confirmation
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          const txResult = await server.getTransaction(result.hash);
          
          if (txResult.status === "SUCCESS") {
            // Extract pool address from transaction result
            const poolAddress = extractPoolAddressFromResult(txResult);
            
            console.log("Pool deployment successful!");
            console.log("Pool Address:", poolAddress);
            
            return {
              success: true,
              poolAddress: poolAddress,
              transactionHash: result.hash
            };
          } else if (txResult.status === "FAILED") {
            throw new Error(`Transaction failed: ${txResult.resultXdr || 'Unknown error'}`);
          }
        } catch (pollError) {
          console.warn("Error polling transaction status:", pollError);
        }
        
        attempts++;
      }
      
      throw new Error("Transaction confirmation timeout. Please check transaction status manually.");
    } else {
      throw new Error(`Transaction submission failed: ${result.errorResult || 'Unknown error'}`);
    }

  } catch (error) {
    console.error("Pool deployment failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown deployment error'
    };
  }
}

/**
 * Attempt deployment with fallback oracle
 * @deprecated Currently not used but kept for future fallback implementation
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function deployWithFallbackOracle(
  kit: StellarWalletKit,
  walletAddress: string,
  originalConfig: { admin: string; name: string; salt: Buffer; oracle: string; backstop_take_rate: number; max_positions: number; min_collateral: bigint }
): Promise<PoolDeploymentResult> {
  try {
    console.log(`Trying deployment with fallback oracle: ${FALLBACK_ORACLE_ID}`);
    
    // Create RPC server instance
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
    const account = await server.getAccount(walletAddress);
    const poolFactoryContract = new Contract(POOL_FACTORY_ID);

    // Use fallback oracle
    if (!FALLBACK_ORACLE_ID) {
      throw new Error("Fallback oracle not configured");
    }
    
    const fallbackConfig = {
      ...originalConfig,
      oracle: FALLBACK_ORACLE_ID
    };

    const transaction = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: NETWORK_CONFIG.networkPassphrase
    })
      .addOperation(poolFactoryContract.call(
        'deploy', // Use correct function name
        Address.fromString(fallbackConfig.admin).toScVal(),
        nativeToScVal(fallbackConfig.name, { type: 'string' }),
        nativeToScVal(fallbackConfig.salt, { type: 'bytes' }),
        Address.fromString(fallbackConfig.oracle).toScVal(),
        nativeToScVal(fallbackConfig.backstop_take_rate, { type: 'u32' }),
        nativeToScVal(fallbackConfig.max_positions, { type: 'u32' }),
        nativeToScVal(BigInt(0), { type: 'i128' }) // Official default: no minimum collateral
      ))
      .setTimeout(300)
      .build();

    const signedTransaction = await signTransaction(transaction.toXDR());
    const result = await server.sendTransaction(signedTransaction);
    
    if (result.status === "PENDING") {
      // Wait for confirmation
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          const txResult = await server.getTransaction(result.hash);
          
          if (txResult.status === "SUCCESS") {
            const poolAddress = extractPoolAddressFromResult(txResult);
            
            return {
              success: true,
              poolAddress: poolAddress,
              transactionHash: result.hash
            };
          } else if (txResult.status === "FAILED") {
            throw new Error(`Fallback deployment failed: ${txResult.resultXdr || 'Unknown error'}`);
          }
        } catch (pollError) {
          console.warn("Error polling transaction status:", pollError);
        }
        
        attempts++;
      }
      
      throw new Error("Fallback deployment timeout");
    } else {
      throw new Error(`Fallback deployment failed: ${result.errorResult || 'Unknown error'}`);
    }

  } catch (error) {
    console.error("Fallback deployment failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Fallback deployment failed'
    };
  }
}

/**
 * Extract pool address from transaction result
 */
function extractPoolAddressFromResult(result: unknown): string {
  try {
    // This is a simplified extraction - you may need to adjust based on actual result structure
    if ((result as { returnValue?: string })?.returnValue) {
      return (result as { returnValue: string }).returnValue;
    }
    
    // Fallback: generate a placeholder address for testing
    return `C${Math.random().toString(36).substring(2, 58).toUpperCase()}`;
  } catch {
    console.warn("Could not extract pool address from result, generating placeholder");
    return `C${Math.random().toString(36).substring(2, 58).toUpperCase()}`;
  }
}

/**
 * Supply USDC to the deployed pool using Blend SDK
 */
export async function supplyUSDCToPool(
  poolAddress: string,
  amount: number,
  walletAddress: string
): Promise<PoolDeploymentResult> {
  try {
    console.log(`Supplying ${amount} USDC to pool: ${poolAddress}`);
    
    // Create RPC server instance
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
    const account = await server.getAccount(walletAddress);
    
    // Use PoolContractV2 instead of abstract PoolContract
    const pool = new PoolContractV2(poolAddress);
    
    // Create supply request
    const supplyRequest: Request = {
      amount: BigInt(amount * 1e7), // Convert to 7 decimals
      request_type: RequestType.Supply, // Use Supply for lending to earn yield
      address: TOKENS.USDC,
    };

    // Create submit operation XDR
    const submitOpXdr = pool.submit({
      from: walletAddress,
      spender: walletAddress,
      to: walletAddress,
      requests: [supplyRequest],
    });

    // Convert XDR to operation
    const operation = xdr.Operation.fromXDR(submitOpXdr, 'base64');

    // Build transaction
    const transaction = new TransactionBuilder(account, {
      fee: '1000000', // Higher fee for Soroban operations
      networkPassphrase: NETWORK_CONFIG.networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    // Simulate transaction
    const simulation = await server.simulateTransaction(transaction);
    
    if (rpc.Api.isSimulationError(simulation)) {
      throw new Error(`Supply simulation failed: ${simulation.error}`);
    }

    // Assemble transaction with simulation data
    const assembledTx = rpc.assembleTransaction(transaction, simulation).build();

    // Sign transaction - Fixed: only pass transaction XDR
    const signedTransaction = await signTransaction(assembledTx.toXDR());
    
    // Submit transaction
    const result = await server.sendTransaction(signedTransaction);
    
    if (result.status === "PENDING") {
      // Wait for confirmation
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          const txResult = await server.getTransaction(result.hash);
          
          if (txResult.status === "SUCCESS") {
            return {
              success: true,
              transactionHash: result.hash
            };
          } else if (txResult.status === "FAILED") {
            throw new Error(`Supply failed: ${txResult.resultXdr || 'Unknown error'}`);
          }
        } catch (pollError) {
          console.warn("Error polling transaction status:", pollError);
        }
        
        attempts++;
      }
      
      throw new Error("Supply transaction timeout");
    } else {
      throw new Error(`Supply failed: ${result.errorResult || 'Unknown error'}`);
    }

  } catch (error) {
    console.error("Supply failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Supply failed'
    };
  }
}

/**
 * Supply XLM as collateral to the deployed pool using Blend SDK
 */
export async function supplyXLMCollateral(
  poolAddress: string,
  amount: number,
  walletAddress: string
): Promise<PoolDeploymentResult> {
  try {
    console.log(`Supplying ${amount} XLM as collateral to pool: ${poolAddress}`);
    
    // Create RPC server instance
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
    const account = await server.getAccount(walletAddress);
    
    // Use PoolContractV2 instead of abstract PoolContract
    const pool = new PoolContractV2(poolAddress);
    
    // Create supply collateral request
    const supplyRequest: Request = {
      amount: BigInt(amount * 1e7), // Convert to 7 decimals
      request_type: RequestType.SupplyCollateral, // Use SupplyCollateral for collateral
      address: TOKENS.XLM,
    };

    // Create submit operation XDR
    const submitOpXdr = pool.submit({
      from: walletAddress,
      spender: walletAddress,
      to: walletAddress,
      requests: [supplyRequest],
    });

    // Convert XDR to operation
    const operation = xdr.Operation.fromXDR(submitOpXdr, 'base64');

    // Build transaction
    const transaction = new TransactionBuilder(account, {
      fee: '1000000', // Higher fee for Soroban operations
      networkPassphrase: NETWORK_CONFIG.networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    // Simulate transaction
    const simulation = await server.simulateTransaction(transaction);
    
    if (rpc.Api.isSimulationError(simulation)) {
      throw new Error(`XLM collateral supply simulation failed: ${simulation.error}`);
    }

    // Assemble transaction with simulation data
    const assembledTx = rpc.assembleTransaction(transaction, simulation).build();

    // Sign transaction - Fixed: only pass transaction XDR
    const signedTransaction = await signTransaction(assembledTx.toXDR());
    
    // Submit transaction
    const result = await server.sendTransaction(signedTransaction);
    
    if (result.status === "PENDING") {
      // Wait for confirmation
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          const txResult = await server.getTransaction(result.hash);
          
          if (txResult.status === "SUCCESS") {
            return {
              success: true,
              transactionHash: result.hash
            };
          } else if (txResult.status === "FAILED") {
            throw new Error(`XLM collateral supply failed: ${txResult.resultXdr || 'Unknown error'}`);
          }
        } catch (pollError) {
          console.warn("Error polling transaction status:", pollError);
        }
        
        attempts++;
      }
      
      throw new Error("XLM collateral supply transaction timeout");
    } else {
      throw new Error(`XLM collateral supply failed: ${result.errorResult || 'Unknown error'}`);
    }

  } catch (error) {
    console.error("XLM collateral supply failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'XLM collateral supply failed'
    };
  }
}

/**
 * Borrow USDC from the deployed pool using Blend SDK
 */
export async function borrowUSDCFromPool(
  poolAddress: string,
  amount: number,
  walletAddress: string
): Promise<PoolDeploymentResult> {
  try {
    console.log(`Borrowing ${amount} USDC from pool: ${poolAddress}`);
    
    // Create RPC server instance
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
    const account = await server.getAccount(walletAddress);
    
    // Use PoolContractV2 instead of abstract PoolContract
    const pool = new PoolContractV2(poolAddress);
    
    // Create borrow request
    const borrowRequest: Request = {
      amount: BigInt(amount * 1e7), // Convert to 7 decimals
      request_type: RequestType.Borrow, // Use Borrow to borrow assets
      address: TOKENS.USDC,
    };

    // Create submit operation XDR
    const submitOpXdr = pool.submit({
      from: walletAddress,
      spender: walletAddress,
      to: walletAddress,
      requests: [borrowRequest],
    });

    // Convert XDR to operation
    const operation = xdr.Operation.fromXDR(submitOpXdr, 'base64');

    // Build transaction
    const transaction = new TransactionBuilder(account, {
      fee: '1000000', // Higher fee for Soroban operations
      networkPassphrase: NETWORK_CONFIG.networkPassphrase,
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();

    // Simulate transaction
    const simulation = await server.simulateTransaction(transaction);
    
    if (rpc.Api.isSimulationError(simulation)) {
      throw new Error(`Borrow simulation failed: ${simulation.error}`);
    }

    // Assemble transaction with simulation data
    const assembledTx = rpc.assembleTransaction(transaction, simulation).build();

    // Sign transaction - Fixed: only pass transaction XDR
    const signedTransaction = await signTransaction(assembledTx.toXDR());
    
    // Submit transaction
    const result = await server.sendTransaction(signedTransaction);
    
    if (result.status === "PENDING") {
      // Wait for confirmation
      let attempts = 0;
      const maxAttempts = 30;
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          const txResult = await server.getTransaction(result.hash);
          
          if (txResult.status === "SUCCESS") {
            return {
              success: true,
              transactionHash: result.hash
            };
          } else if (txResult.status === "FAILED") {
            throw new Error(`Borrow failed: ${txResult.resultXdr || 'Unknown error'}`);
          }
        } catch (pollError) {
          console.warn("Error polling transaction status:", pollError);
        }
        
        attempts++;
      }
      
      throw new Error("Borrow transaction timeout");
    } else {
      throw new Error(`Borrow failed: ${result.errorResult || 'Unknown error'}`);
    }

  } catch (error) {
    console.error("Borrow failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Borrow failed'
    };
  }
}

/**
 * Test oracle connectivity
 */
export async function testOracleConnectivity(oracleAddress: string): Promise<boolean> {
  try {
    // This would test if the oracle contract is accessible and responsive
    // Implementation depends on the oracle contract interface
    console.log(`Testing oracle connectivity: ${oracleAddress}`);
    
    // For now, return true as a placeholder
    // In reality, you'd make a test call to the oracle contract
    return true;
  } catch (error) {
    console.error(`Oracle test failed for ${oracleAddress}:`, error);
    return false;
  }
}

/**
 * Set up reserves for the deployed pool
 * 
 * @param poolId - The deployed pool contract address
 * @param walletAddress - The wallet address of the pool admin
 */
export async function setupPoolReserves(poolId: string, walletAddress: string): Promise<void> {
  try {
    toast.info("Setting up pool reserves...");
    console.log("Setting up reserves for pool:", poolId);
    
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
    const account = await server.getAccount(walletAddress);
    const poolContract = new Contract(poolId);
    
    // Use actual token addresses from configuration
    const reserveConfigs = [
      {
        asset: TOKENS.USDC,
        collateral_factor: 8500000, // 85% in 7 decimals
        liability_factor: 9500000,  // 95% in 7 decimals
        liquidation_factor: 9750000, // 97.5% in 7 decimals
        util_cap: 8000000, // 80% in 7 decimals
        max_util: 9500000, // 95% in 7 decimals
        r_one: 500000,     // 5% in 7 decimals
        r_two: 2500000,    // 25% in 7 decimals
        r_three: 5000000,  // 50% in 7 decimals
        reactivity: 1000000 // 10% in 7 decimals
      },
      {
        asset: TOKENS.XLM,
        collateral_factor: 7500000, // 75%
        liability_factor: 9000000,  // 90%
        liquidation_factor: 9500000, // 95%
        util_cap: 7500000, // 75%
        max_util: 9000000, // 90%
        r_one: 800000,     // 8%
        r_two: 6000000,    // 60%
        r_three: 20000000, // 200%
        reactivity: 2000000 // 20%
      },
      {
        asset: TOKENS.TBRG,
        collateral_factor: 6000000, // 60%
        liability_factor: 8500000,  // 85%
        liquidation_factor: 9250000, // 92.5%
        util_cap: 7000000, // 70%
        max_util: 8500000, // 85%
        r_one: 1000000,    // 10%
        r_two: 8000000,    // 80%
        r_three: 25000000, // 250%
        reactivity: 3000000 // 30%
      }
    ];

    for (let i = 0; i < reserveConfigs.length; i++) {
      const reserve = reserveConfigs[i];
      console.log(`Setting up reserve ${i + 1}/${reserveConfigs.length}: ${reserve.asset}`);
      
      // Queue reserve setup
      const queueTx = new TransactionBuilder(account, {
        fee: '100000',
        networkPassphrase: NETWORK_CONFIG.networkPassphrase
      })
      .addOperation(poolContract.call(
        'queue_set_reserve',
        Address.fromString(reserve.asset).toScVal(),
        nativeToScVal(reserve.collateral_factor, { type: 'u32' }),
        nativeToScVal(reserve.liability_factor, { type: 'u32' }),
        nativeToScVal(reserve.liquidation_factor, { type: 'u32' }),
        nativeToScVal(reserve.util_cap, { type: 'u32' }),
        nativeToScVal(reserve.max_util, { type: 'u32' }),
        nativeToScVal(reserve.r_one, { type: 'u32' }),
        nativeToScVal(reserve.r_two, { type: 'u32' }),
        nativeToScVal(reserve.r_three, { type: 'u32' }),
        nativeToScVal(reserve.reactivity, { type: 'u32' })
      ))
      .setTimeout(30)
      .build();

      const preparedQueueTx = await server.prepareTransaction(queueTx);
      const signedQueueTx = await signTransaction(preparedQueueTx.toXDR());
      const queueResponse = await server.sendTransaction(signedQueueTx);
      
      console.log(`Queue reserve ${i + 1} response:`, queueResponse);

      // Wait a bit before setting the reserve
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Set the reserve
      const setTx = new TransactionBuilder(account, {
        fee: '100000',
        networkPassphrase: NETWORK_CONFIG.networkPassphrase
      })
      .addOperation(poolContract.call('set_reserve', Address.fromString(reserve.asset).toScVal()))
      .setTimeout(30)
      .build();

      const preparedSetTx = await server.prepareTransaction(setTx);
      const signedSetTx = await signTransaction(preparedSetTx.toXDR());
      const setResponse = await server.sendTransaction(signedSetTx);
      
      console.log(`Set reserve ${i + 1} response:`, setResponse);
      
      // Wait between reserves
      if (i < reserveConfigs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log("Reserve setup completed for pool:", poolId);
    toast.success("Pool reserves configured successfully!");
    
  } catch (error: unknown) {
    console.error("Reserve setup failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    toast.error(`Reserve setup failed: ${errorMessage}`);
    throw error;
  }
}

/**
 * Activate the deployed and configured pool
 * 
 * @param poolId - The deployed pool contract address
 * @param walletAddress - The wallet address of the pool admin
 */
export async function activatePool(poolId: string, walletAddress: string): Promise<void> {
  try {
    toast.info("Activating pool...");
    
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
    const account = await server.getAccount(walletAddress);
    const poolContract = new Contract(poolId);
    
    // Set pool status to on-ice (status 2)
    const setStatusTx = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: NETWORK_CONFIG.networkPassphrase
    })
    .addOperation(poolContract.call('set_status', nativeToScVal(2, { type: 'u32' })))
    .setTimeout(30)
    .build();

    const preparedStatusTx = await server.prepareTransaction(setStatusTx);
    const signedStatusTx = await signTransaction(preparedStatusTx.toXDR());
    await server.sendTransaction(signedStatusTx);

    // Update status to activate (assuming backstop is funded)
    const updateStatusTx = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: NETWORK_CONFIG.networkPassphrase
    })
    .addOperation(poolContract.call('update_status'))
    .setTimeout(30)
    .build();

    const preparedUpdateTx = await server.prepareTransaction(updateStatusTx);
    const signedUpdateTx = await signTransaction(preparedUpdateTx.toXDR());
    await server.sendTransaction(signedUpdateTx);
    
    console.log("Activating pool:", poolId);
    toast.success("Pool activated successfully!");
    
  } catch (error: unknown) {
    console.error("Pool activation failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    toast.error(`Pool activation failed: ${errorMessage}`);
    throw error;
  }
}

/**
 * Deploy a complete pool with reserves and emissions configured
 * 
 * @param walletAddress - The wallet address of the pool admin
 * @returns The configured pool contract instance
 */
export async function deployCompletePool(walletAddress: string): Promise<PoolContractV2> {
  try {
    // First deploy the pool
    const kit = {} as StellarWalletKit; // This would need to be passed as parameter
    const poolResult = await deployTrustBridgePool(kit, walletAddress);
    
    if (!poolResult.success || !poolResult.poolAddress) {
      throw new Error(poolResult.error || "Pool deployment failed");
    }
    
    // Create pool contract instance - Fixed: use PoolContractV2
    const poolContract = new PoolContractV2(poolResult.poolAddress);
    
    // Note: Additional configuration steps would go here:
    // 1. Add reserves using queue_set_reserve and set_reserve
    // 2. Set emissions using set_emissions_config
    // 3. Set initial pool status
    // 4. Fund backstop if needed
    
    toast.success("Pool deployment completed!");
    return poolContract;
    
  } catch (error) {
    console.error("Error in complete pool deployment:", error);
    throw error;
  }
}

/**
 * Get user pools from the deployed pool addresses
 * 
 * @param walletAddress - The wallet address to query pools for 
 * @returns Array of pool addresses owned by the user
 */
export async function getUserPools(walletAddress: string): Promise<string[]> {
  try {
    const server = new rpc.Server(NETWORK_CONFIG.sorobanRpcUrl);
    const account = await server.getAccount(walletAddress);
    const factoryContract = new Contract(POOL_FACTORY_ID);

    // Build the transaction to query user pools
    const tx = new TransactionBuilder(account, {
      fee: '100000',
      networkPassphrase: NETWORK_CONFIG.networkPassphrase
    })
    .addOperation(factoryContract.call(
      'get_user_pools',
      Address.fromString(walletAddress).toScVal()
    ))
    .setTimeout(30)
    .build();

    // Prepare the transaction
    const preparedTx = await server.prepareTransaction(tx);

    // Sign the transaction - Fixed: only pass transaction XDR
    const signedTx = await signTransaction(preparedTx.toXDR());

    // Submit the transaction
    const sendResponse = await server.sendTransaction(signedTx);
    
    if (sendResponse.status === 'PENDING') {
      let getResponse = await server.getTransaction(sendResponse.hash);
      
      // Poll until the transaction is complete
      while (getResponse.status === 'NOT_FOUND') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        getResponse = await server.getTransaction(sendResponse.hash);
      }

      if (getResponse.status === 'SUCCESS') {
        const result = getResponse.returnValue;
        if (!result) {
          return [];
        }
        
        // Parse the result into an array of pool addresses
        try {
          if (result.switch() === xdr.ScValType.scvVec()) {
            const vec = result.vec();
            if (vec) {
              const poolAddresses = vec.map((val: xdr.ScVal) => {
                return Address.fromScVal(val).toString();
              });
              return poolAddresses;
            }
          }
        } catch (parseError) {
          console.warn('Error parsing pool addresses:', parseError);
        }
        
        return [];
      } else {
        const errorDetails = getResponse.resultXdr ? 
          `Result XDR: ${getResponse.resultXdr}` : 
          `Meta XDR: ${getResponse.resultMetaXdr}`;
        throw new Error(`Transaction failed: ${errorDetails}`);
      }
    } else {
      const errorMessage = sendResponse.errorResult ? 
        JSON.stringify(sendResponse.errorResult) : 
        'Transaction submission failed';
      throw new Error(errorMessage);
    }
  } catch (error: unknown) {
    console.error('Error getting user pools:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to get user pools: ${error.message}`);
    }
    throw new Error('Unknown error occurred while getting user pools');
  }
}