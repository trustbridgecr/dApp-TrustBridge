"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EscrowRecord } from "@/@types/escrow.entity";

interface Props {
  escrows: EscrowRecord[];
  loading: boolean;
}

export function EscrowList({ escrows, loading }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (escrows.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No escrows found for this wallet.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-2">
        {escrows.map((escrow) => (
          <Card key={escrow.escrowId} className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {escrow.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>Contract ID: {escrow.escrowId}</div>
              <div>Amount: {escrow.amount}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
