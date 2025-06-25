"use client";
import Link from "next/link";
import type React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bitcoin,
  CircleDollarSign,
  Euro,
  FlaskConical,
  ChevronDown,
  Briefcase,
  Landmark,
} from "lucide-react";

export type PoolCardProps = {
  id: string;
  name: string;
  state: string; // "active", "on ice", "deprecated"
  reserves: string; // e.g., "$10.88M" - Mapped to "Supplied"
  depositApy?: number;
  borrowApy?: number;
  supplied?: string;
  borrowed?: string;
  backstop?: string;
  assetIcons?: React.ElementType[];
};

export function PoolCard({
  id,
  name,
  reserves, // Used as "Supplied"
  borrowApy, // Used as "Borrowed"
  supplied, // Prefer this if available
  borrowed, // Prefer this if available
  backstop, // Prefer this if available
  assetIcons = [CircleDollarSign, Euro, Bitcoin],
}: PoolCardProps) {
  const displaySupplied = supplied || reserves;
  const displayBorrowed = borrowed || (borrowApy ? `${borrowApy}% APY` : "N/A");
  const displayBackstop = backstop || "$0.00k";

  return (
    <Card className="bg-neutral-800 border-neutral-700 text-neutral-100 w-full max-w-1xl shadow-xl rounded-lg overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-green-400" />
          <CardTitle className="text-lg font-medium text-neutral-100">
            {name}
          </CardTitle>
          <Badge
            variant="outline"
            className="bg-purple-500/20 border-purple-400 text-purple-300 text-xs px-1.5 py-0.5 ml-1 rounded-sm"
          >
            V2
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-neutral-400 hover:text-neutral-100 px-2 py-1"
        >
          Details <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-2 pb-4 px-4">
        <div className="grid grid-cols-3 gap-x-3 gap-y-2 mb-4 text-xs">
          <div>
            <p className="text-neutral-400 uppercase tracking-wider text-[0.65rem] mb-0.5">
              Supplied
            </p>
            <p className="text-base font-semibold text-neutral-50">
              {displaySupplied}
            </p>
          </div>
          <div>
            <p className="text-neutral-400 uppercase tracking-wider text-[0.65rem] mb-0.5">
              Borrowed
            </p>
            <p className="text-base font-semibold text-neutral-50">
              {displayBorrowed}
            </p>
          </div>
          <div>
            <p className="text-neutral-400 uppercase tracking-wider text-[0.65rem] mb-0.5">
              Backstop
            </p>
            <p className="text-base font-semibold text-neutral-50">
              {displayBackstop}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          {assetIcons.map((IconComponent, index) => (
            <div key={index} className="bg-neutral-700 p-1.5 rounded-full">
              <IconComponent className="h-4 w-4 text-green-400" />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="bg-teal-900/50 p-3 border-t border-teal-800/60">
        <div className="flex items-center justify-between w-full">
          {/* State badge can be here if needed, or removed if not in the target style */}
          {/* <Badge className={`${badgeClass} text-xs px-2 py-1`}>{state}</Badge> */}
          <div className="flex items-center space-x-1.5">
            <Briefcase className="h-4 w-4 text-green-400" />
            <Landmark className="h-4 w-4 text-green-400" />
          </div>
          <Link href={`/dashboard/pools/${id}`} passHref>
            <Button
              variant="link"
              size="sm"
              className="text-green-400 hover:text-green-300 text-xs font-medium px-0"
            >
              Dashboard <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
