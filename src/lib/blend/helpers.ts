import { FACTORY_ADDRESS, DEFAULT_WALLET } from "./config";

async function getFactory() {
  const sdk: any = await import("@blend-capital/blend-sdk");
  const { BlendClient, PoolFactory } = "default" in sdk ? sdk.default : sdk;

  const client = new BlendClient({ network: "futurenet" });
  return new PoolFactory(client, FACTORY_ADDRESS);
}

export async function fetchPools() {
  const factory = await getFactory();
  return factory.getPools();
}

export async function fetchPool(poolId: string) {
  const factory = await getFactory();
  return factory.getPool(poolId);
}

export async function fetchUserInfo(poolId: string) {
  const factory = await getFactory();
  const pool = await factory.getPool(poolId);
  return pool.getUserInfo(DEFAULT_WALLET);
}

export async function fetchStats() {
  const factory = await getFactory();
  return factory.getStats();
}
