export type PoolData = {
  name?: string;
  assets?: string[];
  interest?: {
    base?: number;
  };
  depositApy?: number;
  borrowApy?: number;
  ltv?: number;
  liquidationThreshold?: number;
  risk?: Record<string, unknown>;
  backstop?: {
    tvl?: number;
    withdrawalPct?: number;
    rewardZone?: boolean;
  };
};

export type UserData = {
  bTokens?: number;
  dTokens?: number;
  collateral?: number;
  debt?: number;
  healthFactor?: number;
};
