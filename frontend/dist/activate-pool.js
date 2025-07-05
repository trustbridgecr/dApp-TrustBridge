#!/usr/bin/env ts-node
"use strict";
/**
 * TrustBridge Pool Activation Script
 *
 * This script helps activate the TrustBridge pool to resolve Error #1206
 * Usage: npx ts-node src/scripts/activate-pool.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const stellar_sdk_1 = require("@stellar/stellar-sdk");
// Configuration
const POOL_ID = "CB7BGBKLC4UNO2Q6V7O52622I44PVMDFDAMAJ6NT64GB3UQZX3FU7LA5";
const NETWORK_CONFIG = {
    networkPassphrase: "Test SDF Network ; September 2015",
    rpcUrl: "https://soroban-testnet.stellar.org:443"
};
// Pool admin secret key - REPLACE WITH YOUR ACTUAL ADMIN SECRET KEY
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "";
/**
 * Pool Status Enum
 */
var PoolStatus;
(function (PoolStatus) {
    PoolStatus[PoolStatus["ADMIN_ACTIVE"] = 0] = "ADMIN_ACTIVE";
    PoolStatus[PoolStatus["ACTIVE"] = 1] = "ACTIVE";
    PoolStatus[PoolStatus["ADMIN_ON_ICE"] = 2] = "ADMIN_ON_ICE";
    PoolStatus[PoolStatus["ON_ICE"] = 3] = "ON_ICE";
    PoolStatus[PoolStatus["ADMIN_FROZEN"] = 4] = "ADMIN_FROZEN";
    PoolStatus[PoolStatus["FROZEN"] = 5] = "FROZEN";
    PoolStatus[PoolStatus["SETUP"] = 6] = "SETUP"; // This status blocks all transactions
})(PoolStatus || (PoolStatus = {}));
/**
 * Activate the pool by setting status to Admin Active
 */
async function activatePool() {
    if (!ADMIN_SECRET_KEY) {
        console.error("❌ Error: ADMIN_SECRET_KEY environment variable not set");
        console.log("💡 Set it using: export ADMIN_SECRET_KEY=YOUR_SECRET_KEY");
        process.exit(1);
    }
    try {
        console.log("🚀 Starting TrustBridge Pool Activation...");
        console.log("📍 Pool ID:", POOL_ID);
        console.log("");
        // Initialize RPC server and admin keypair
        const server = new stellar_sdk_1.rpc.Server(NETWORK_CONFIG.rpcUrl);
        const adminKeypair = stellar_sdk_1.Keypair.fromSecret(ADMIN_SECRET_KEY);
        console.log("👤 Admin Account:", adminKeypair.publicKey());
        // Get admin account
        const account = await server.getAccount(adminKeypair.publicKey());
        console.log("💰 Admin Account:", adminKeypair.publicKey());
        // Create pool contract instance
        const poolContract = new stellar_sdk_1.Contract(POOL_ID);
        console.log("⚙️  Building pool activation transaction...");
        // Build transaction to set pool status to Admin Active
        const transaction = new stellar_sdk_1.TransactionBuilder(account, {
            fee: '1000000', // 1 XLM fee for safety
            networkPassphrase: NETWORK_CONFIG.networkPassphrase
        })
            .addOperation(poolContract.call('set_status', (0, stellar_sdk_1.nativeToScVal)(PoolStatus.ADMIN_ACTIVE, { type: 'u32' })))
            .setTimeout(30)
            .build();
        console.log("🧪 Simulating transaction...");
        // Simulate transaction first
        const simulation = await server.simulateTransaction(transaction);
        if (stellar_sdk_1.rpc.Api.isSimulationError(simulation)) {
            console.error("❌ Simulation failed:", simulation.error);
            console.log("");
            console.log("🔍 Common issues:");
            console.log("  - Pool admin permissions (make sure you're the pool admin)");
            console.log("  - Pool already active");
            console.log("  - Network connectivity issues");
            process.exit(1);
        }
        console.log("✅ Simulation successful!");
        // Assemble transaction with simulation results
        const assembledTx = stellar_sdk_1.rpc.assembleTransaction(transaction, simulation).build();
        console.log("✍️  Signing transaction...");
        // Sign transaction
        assembledTx.sign(adminKeypair);
        console.log("📤 Submitting transaction...");
        // Submit transaction
        const result = await server.sendTransaction(assembledTx);
        if (result.status === "PENDING") {
            console.log("⏳ Transaction submitted! Hash:", result.hash);
            console.log("🔄 Waiting for confirmation...");
            // Wait for confirmation
            let attempts = 0;
            const maxAttempts = 30;
            while (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                try {
                    const txResult = await server.getTransaction(result.hash);
                    if (txResult.status === "SUCCESS") {
                        console.log("");
                        console.log("🎉 Pool activation successful!");
                        console.log("✅ Pool status set to Admin Active");
                        console.log("🔗 Transaction hash:", result.hash);
                        console.log("");
                        console.log("📋 Next steps:");
                        console.log("  1. Your pool is now activated");
                        console.log("  2. Users can now supply and borrow");
                        console.log("  3. Test transactions should work (no more Error #1206)");
                        console.log("  4. Consider adding backstop funding for enhanced security");
                        return;
                    }
                    else if (txResult.status === "FAILED") {
                        console.error("❌ Transaction failed:", txResult.resultXdr);
                        process.exit(1);
                    }
                }
                catch {
                    console.log("⏳ Still waiting for confirmation...");
                }
                attempts++;
            }
            console.error("❌ Transaction confirmation timeout");
            console.log("🔗 Check status manually: https://stellar.expert/explorer/testnet/tx/" + result.hash);
            process.exit(1);
        }
        else {
            console.error("❌ Transaction submission failed:", result.errorResult);
            process.exit(1);
        }
    }
    catch (error) {
        console.error("❌ Pool activation failed:", error);
        console.log("");
        console.log("🔍 Troubleshooting:");
        console.log("  - Verify ADMIN_SECRET_KEY is correct");
        console.log("  - Ensure admin account has XLM for fees");
        console.log("  - Check network connectivity");
        console.log("  - Verify you're the pool admin");
        process.exit(1);
    }
}
/**
 * Main function
 */
async function main() {
    console.log("🏗️  TrustBridge Pool Activation Tool");
    console.log("=====================================");
    console.log("");
    await activatePool();
}
// Run the script
if (require.main === module) {
    main().catch(error => {
        console.error("❌ Script failed:", error);
        process.exit(1);
    });
}
