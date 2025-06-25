"use client";
import { useEffect, useState } from "react";
import { PoolCard } from "../cards/PoolCard";
import { fetchPools } from "@/lib/blend/helpers";
import type { PoolData } from "@/@types/pool.entity";

export function PoolsPage() {
  const [pools, setPools] = useState<PoolData[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchPools().then(setPools).catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <input
        className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-200"
        placeholder="Search pools"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {pools
        .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        .map((pool) => (
          <PoolCard
            key={pool.id}
            id={pool.id}
            name={pool.name}
            state={pool.state}
            reserves={pool.reserves}
            depositApy={pool.depositApy}
            borrowApy={pool.borrowApy}
          />
        ))}
    </div>
  );
}
