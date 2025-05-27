"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StartDisputeForm } from "../forms/StartDisputeForm";
import { GetEscrowForm } from "../forms/GetEscrowForm";
import { FundEscrowForm } from "../forms/FundEscrowForm";
import { ChangeMilestoneStatusForm } from "../forms/ChangeMilestoneStatusForm";
import { ChangeMilestoneFlagForm } from "../forms/ChangeMilestoneFlagForm";
import { ReleaseFundsForm } from "../forms/ReleaseFundsForm";
import { ResolveDisputeForm } from "../forms/ResolveDisputeForm";
import { UpdateEscrowForm } from "../forms/UpdateEscrowForm";
import { EscrowCreatedSection } from "../sections/EscrowCreatedSection";
import { useEscrowContext } from "@/providers/escrow.provider";
import { useTabsContext } from "@/providers/tabs.provider";
import { Button } from "@/components/ui/button";

export function EscrowEndpoints() {
  const [activeTabEscrow, setActiveTabEscrow] = useState("get-escrow");
  const { resetEscrow } = useEscrowContext();
  const { setActiveTab } = useTabsContext();
  const { escrow } = useEscrowContext();

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3 flex justify-between gap-4">
        <div className="flex gap-2 flex-col">
          <CardTitle className="text-xl">Escrow Endpoints</CardTitle>
          <CardDescription>
            Manage escrow contracts, milestones, and funds
          </CardDescription>
        </div>

        {escrow && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              resetEscrow();
              setActiveTab("deploy");
            }}
            className="mb-4"
          >
            Reset Escrow
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <Tabs
          value={activeTabEscrow}
          onValueChange={setActiveTabEscrow}
          className="w-full"
        >
          <TabsList className="w-full flex flex-wrap mb-32 md:mb-4 gap-1">
            <TabsTrigger value="get-escrow" className="flex-1">
              Get Escrow
            </TabsTrigger>
            <TabsTrigger value="fund-escrow" className="flex-1">
              Fund Escrow
            </TabsTrigger>
            <TabsTrigger value="change-milestone-status" className="flex-1">
              Change Status
            </TabsTrigger>
            <TabsTrigger value="change-milestone-flag" className="flex-1">
              Approve Milestone
            </TabsTrigger>
            <TabsTrigger value="change-dispute-flag" className="flex-1">
              Start Dispute
            </TabsTrigger>
            <TabsTrigger value="resolve-dispute" className="flex-1">
              Resolve Dispute
            </TabsTrigger>
            <TabsTrigger value="release-funds" className="flex-1">
              Release Funds
            </TabsTrigger>
            <TabsTrigger value="update-escrow" className="flex-1">
              Update Escrow
            </TabsTrigger>
          </TabsList>
          <div className="flex flex-col md:flex-row gap-10 w-full">
            <div className="w-full md:w-3/4">
              <div className="mt-2 pt-4 border-t">
                <TabsContent value="get-escrow" className="mt-0">
                  <GetEscrowForm />
                </TabsContent>
                <TabsContent value="fund-escrow" className="mt-0">
                  <FundEscrowForm />
                </TabsContent>
                <TabsContent value="change-milestone-status" className="mt-0">
                  <ChangeMilestoneStatusForm />
                </TabsContent>
                <TabsContent value="change-milestone-flag" className="mt-0">
                  <ChangeMilestoneFlagForm />
                </TabsContent>
                <TabsContent value="change-dispute-flag" className="mt-0">
                  <StartDisputeForm />
                </TabsContent>
                <TabsContent value="resolve-dispute" className="mt-0">
                  <ResolveDisputeForm />
                </TabsContent>
                <TabsContent value="release-funds" className="mt-0">
                  <ReleaseFundsForm />
                </TabsContent>
                <TabsContent value="update-escrow" className="mt-0">
                  <UpdateEscrowForm />
                </TabsContent>
              </div>
            </div>

            <EscrowCreatedSection />
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
