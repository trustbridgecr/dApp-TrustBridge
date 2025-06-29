// TrustBridge Contract Addresses - Stellar Testnet
export const NETWORK_CONFIG = {
  network: "TESTNET",
  rpc: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
  horizonUrl: "https://horizon-testnet.stellar.org",
} as const;

// Deployed Oracle Contract
export const ORACLE_ID = "CBCIZHUC42CKOZHKKEYMSXVVY24ZK2EKEUU6NFGQS5YFG7GAMEU5L32M";

// Token Addresses
export const TOKENS = {
  USDC: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA", // Stellar testnet USDC
  XLM: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAOBKYCWXVB", // Native XLM wrapped for Soroban
  TBRG: "CAAUAE53WKWR4X2BRCHXNUTDJGXTOBMHMK3KFTAPEUBA7MJEQBPWVWQU", // TrustBridge Token
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

// Pool Factory - Blend Protocol Factory on Stellar Testnet
export const POOL_FACTORY_ID = "CCDEMRRGV4XHXR6PVHA6OXQ5NV3NWUGWFWRR5H3CEPSNKVPQRYVCTPPU"; // Blend Factory on testnet

// Deployed Pool ID - Will be set after pool deployment
export const TRUSTBRIDGE_POOL_ID = ""; // To be updated after pool deployment

// Pool deployment configuration
export const POOL_DEPLOYMENT_CONFIG = {
  admin: "", // Will be set to wallet address during deployment
  name: POOL_CONFIG.name,
  salt: null, // Will be generated randomly
  oracle: ORACLE_ID,
  backstopTakeRate: POOL_CONFIG.backstopRate * 100000, // Convert to 7 decimals (15% = 1500000)
  maxPositions: POOL_CONFIG.maxPositions,
  minCollateral: BigInt(1 * 1e7), // $1 minimum collateral in oracle decimals
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