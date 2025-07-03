// TrustBridge Contract Addresses - Stellar Testnet
export const NETWORK_CONFIG = {
  networkPassphrase: "Test SDF Network ; September 2015",
  horizonUrl: 'https://horizon-testnet.stellar.org',
  sorobanRpcUrl: 'https://soroban-testnet.stellar.org:443',
};

// Official Blend Protocol Testnet Oracle (from blend-utils testnet.contracts.json)
export const ORACLE_ID = 'CCYHURAC5VTN2ZU663UUS5F24S4GURDPO4FHZ75JLN5DMLRTLCG44H44'; // Official Blend testnet oraclemock

// Disable fallback oracle for now to avoid address format issues
export const FALLBACK_ORACLE_ID = null;

// Token Addresses - Official Blend Protocol Testnet Tokens (verified from blend-utils)
export const TOKENS = {
  USDC: "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU", // Official Blend testnet USDC (verified)
  XLM: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC", // Official Blend testnet XLM (verified)
  BLND: "CB22KRA3YZVCNCQI64JQ5WE7UY2VAV7WFLK6A2JN3HEX56T2EDAFO7QF", // Official Blend testnet BLND (verified)
  TBRG: "CAAUAE53WKWR4X2BRCHXNUTDJGXTOBMHMK3KFTAPEUBA7MJEQBPWVWQU", // TrustBridge Token (custom)
} as const;

// Pool Configuration for TrustBridge-MicroLoans
export const POOL_CONFIG = {
  name: "TrustBridge-MicroLoans",
  oracle: ORACLE_ID,
  reserves: [TOKENS.USDC, TOKENS.XLM, TOKENS.TBRG],
  backstopRate: 15,
  maxPositions: 4,
  feeVault: "", // Will be set during deployment
} as const;

// Pool Factory - Official Blend Protocol Factory on Stellar Testnet (from blend-utils)
export const POOL_FACTORY_ID = 'CDIE73IJJKOWXWCPU5GWQ745FUKWCSH3YKZRF5IQW7GE3G7YAZ773MYK'; // Official poolFactoryV2

// Deployed Pool ID - Successfully deployed on Stellar Testnet
export const TRUSTBRIDGE_POOL_ID = "CB7BGBKLC4UNO2Q6V7O52622I44PVMDFDAMAJ6NT64GB3UQZX3FU7LA5";

// Backstop Contract - Official Blend Protocol Backstop on Stellar Testnet  
export const BACKSTOP_ID = "CC4TSDVQKBAYMK4BEDM65CSNB3ISI2A54OOBRO6IPSTFHJY3DEEKHRKV"; // Official backstopV2

// Pool deployment configuration
export const POOL_DEPLOYMENT_CONFIG = {
  admin: "", // Will be set to wallet address during deployment
  name: POOL_CONFIG.name,
  salt: null, // Will be generated randomly
  oracle: ORACLE_ID,
  backstopTakeRate: POOL_CONFIG.backstopRate * 100000, // Convert to 7 decimals (15% = 1500000)
  maxPositions: POOL_CONFIG.maxPositions,
} as const;

// Reserve configurations for pool setup
export const RESERVE_CONFIGS = [
  // USDC Reserve Config
  {
    index: 0,
    decimals: 7, // USDC has 7 decimals on Stellar
    c_factor: 8500000, // 85% collateral factor (scaled to 7 decimals)
    l_factor: 9500000, // 95% liability factor (scaled to 7 decimals)
    util: 8000000, // 80% target utilization (scaled to 7 decimals)
    max_util: 9500000, // 95% max utilization (scaled to 7 decimals)
    r_base: 100000, // 1% base rate (scaled to 7 decimals)
    r_one: 500000, // 5% rate increase below target (scaled to 7 decimals)
    r_two: 5000000, // 50% rate increase above target (scaled to 7 decimals)
    r_three: 15000000, // 150% rate increase above 95% util (scaled to 7 decimals)
    reactivity: 10, // Reactivity constant (scaled to 7 decimals)
    collateral_cap: BigInt(1000000 * 1e7), // 1M USDC collateral cap
    enabled: true,
  },
  // XLM Reserve Config
  {
    index: 1,
    decimals: 7, // XLM has 7 decimals
    c_factor: 7500000, // 75% collateral factor
    l_factor: 9000000, // 90% liability factor
    util: 7500000, // 75% target utilization
    max_util: 9000000, // 90% max utilization
    r_base: 200000, // 2% base rate
    r_one: 800000, // 8% rate increase below target
    r_two: 6000000, // 60% rate increase above target
    r_three: 20000000, // 200% rate increase above 90% util
    reactivity: 20,
    collateral_cap: BigInt(500000 * 1e7), // 500K XLM collateral cap
    enabled: true,
  },
  // TBRG Reserve Config
  {
    index: 2,
    decimals: 7, // TBRG has 7 decimals
    c_factor: 6000000, // 60% collateral factor (more volatile)
    l_factor: 8500000, // 85% liability factor
    util: 7000000, // 70% target utilization
    max_util: 8500000, // 85% max utilization
    r_base: 300000, // 3% base rate
    r_one: 1000000, // 10% rate increase below target
    r_two: 8000000, // 80% rate increase above target
    r_three: 25000000, // 250% rate increase above 85% util
    reactivity: 30,
    collateral_cap: BigInt(200000 * 1e7), // 200K TBRG collateral cap
    enabled: true,
  },
] as const;

// Emission configurations for reserves
export const RESERVE_EMISSIONS = [
  // USDC supply emissions (encourage lending)
  {
    res_index: 0, // USDC index
    res_type: 1, // 1 = supply/collateral emissions
    share: 4000000, // 40% of total pool emissions (scaled to 7 decimals)
  },
  // XLM borrow emissions (encourage borrowing)
  {
    res_index: 1, // XLM index
    res_type: 0, // 0 = liability/borrow emissions
    share: 3500000, // 35% of total pool emissions
  },
  // TBRG supply emissions (encourage TBRG deposits)
  {
    res_index: 2, // TBRG index
    res_type: 1, // 1 = supply/collateral emissions
    share: 2500000, // 25% of total pool emissions
  },
  // Total shares must equal 10000000 (100%)
] as const;

// Pool Configuration Defaults
export const DEFAULT_POOL_CONFIG = {
  backstop_take_rate: 1500000, // 15% in 7 decimals (15 * 100000)
  max_positions: 4,
  // Removed min_collateral as it's not supported by current Blend SDK
};

// Testing Configuration
export const TESTING_CONFIG = {
  skipOracleValidation: true, // Set to true to bypass oracle checks during testing
  useSimulatedValues: true,   // Use mock values for testing
  mockOracleResponse: {
    price: 100000000, // $1.00 in 7 decimals
    timestamp: Date.now()
  }
};

// Assets Configuration - Using Official Blend Testnet Addresses
export const SUPPORTED_ASSETS = {
  USDC: 'CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU', // Official Blend testnet USDC
  XLM: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC', // Official Blend testnet XLM
  BLND: 'CB22KRA3YZVCNCQI64JQ5WE7UY2VAV7WFLK6A2JN3HEX56T2EDAFO7QF', // Official Blend testnet BLND
};

// Export all contract IDs for easy access
export const CONTRACT_IDS = {
  POOL_FACTORY: POOL_FACTORY_ID,
  ORACLE: ORACLE_ID,
  FALLBACK_ORACLE: FALLBACK_ORACLE_ID,
  BACKSTOP: BACKSTOP_ID,
  TRUSTBRIDGE_POOL: TRUSTBRIDGE_POOL_ID,
};

export default {
  NETWORK_CONFIG,
  CONTRACT_IDS,
  DEFAULT_POOL_CONFIG,
  TESTING_CONFIG,
  SUPPORTED_ASSETS
}; 