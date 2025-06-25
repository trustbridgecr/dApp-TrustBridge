"use client";
import { PoolDetail } from "../detail/PoolDetail";

export function PoolDetailPage({ id }: { id: string }) {
  return (
    <div className="p-6">
      <PoolDetail id={id} />
    </div>
  );
}
