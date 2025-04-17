"use client";

import Loader from "@/components/utils/ui/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tab";
import { useEscrowBoundedStore } from "@/components/modules/escrow/store/ui";
import MyEscrowsTable from "@/components/modules/escrow/ui/tables/MyEscrowsTable";
import MyEscrowsCards from "@/components/modules/escrow/ui/cards/MyEscrowsCards";
import MyEscrowsFilter from "@/components/modules/escrow/ui/filters/MyEscrowsFilter";
import { useGlobalUIBoundedStore } from "@/core/store/ui";

const MyEscrows = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);
  const setActiveTab = useEscrowBoundedStore((state) => state.setActiveTab);
  const activeMode = useEscrowBoundedStore((state) => state.activeMode);
  const theme = useGlobalUIBoundedStore((state) => state.theme);

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <>
          <div className="flex gap-3 w-full h-full p-6 justify-between">
            <Tabs defaultValue="issuer" className="w-full">
              <div className="flex w-full justify-between items-center flex-col 2xl:flex-row gap-16 md:gap-3">
                <TabsList
                  className="grid w-full grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-4"
                  id="step-1"
                >
                  <TabsTrigger
                    onClick={() => setActiveTab("issuer")}
                    value="issuer"
                  >
                    Initiated Escrows
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("approver")}
                    value="approver"
                  >
                    Approver
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("serviceProvider")}
                    value="service-provider"
                  >
                    Service Provider
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("disputeResolver")}
                    value="dispute-resolver"
                  >
                    Dispute Resolver
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("releaseSigner")}
                    value="release-signer"
                  >
                    Release Signer
                  </TabsTrigger>
                  <TabsTrigger
                    onClick={() => setActiveTab("platformAddress")}
                    value="platform-address"
                  >
                    Platform Address
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="issuer" className="flex flex-col gap-3">
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsFilter />
                  </CardContent>
                </Card>
                {activeMode === "table" ? (
                  <Card className={cn("overflow-hidden")}>
                    <MyEscrowsTable type="issuer" />
                  </Card>
                ) : (
                  <MyEscrowsCards type="issuer" />
                )}
              </TabsContent>

              <TabsContent value="approver" className="flex flex-col gap-3">
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsFilter />
                  </CardContent>
                </Card>
                {activeMode === "table" ? (
                  <Card className={cn("overflow-hidden")}>
                    <MyEscrowsTable type="approver" />
                  </Card>
                ) : (
                  <MyEscrowsCards type="approver" />
                )}
              </TabsContent>

              <TabsContent
                value="service-provider"
                className="flex flex-col gap-3"
              >
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsFilter />
                  </CardContent>
                </Card>
                {activeMode === "table" ? (
                  <Card className={cn("overflow-hidden")}>
                    <MyEscrowsTable type="serviceProvider" />
                  </Card>
                ) : (
                  <MyEscrowsCards type="serviceProvider" />
                )}
              </TabsContent>

              <TabsContent
                value="dispute-resolver"
                className="flex flex-col gap-3"
              >
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsFilter />
                  </CardContent>
                </Card>
                {activeMode === "table" ? (
                  <Card className={cn("overflow-hidden")}>
                    <MyEscrowsTable type="disputeResolver" />
                  </Card>
                ) : (
                  <MyEscrowsCards type="disputeResolver" />
                )}
              </TabsContent>

              <TabsContent
                value="release-signer"
                className="flex flex-col gap-3"
              >
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsFilter />
                  </CardContent>
                </Card>
                {activeMode === "table" ? (
                  <Card className={cn("overflow-hidden")}>
                    <MyEscrowsTable type="releaseSigner" />
                  </Card>
                ) : (
                  <MyEscrowsCards type="releaseSigner" />
                )}
              </TabsContent>

              <TabsContent
                value="platform-address"
                className="flex flex-col gap-3"
              >
                <Card className={cn("overflow-hidden")}>
                  <CardContent className="p-6">
                    <MyEscrowsFilter />
                  </CardContent>
                </Card>
                {activeMode === "table" ? (
                  <Card className={cn("overflow-hidden")}>
                    <MyEscrowsTable type="platformAddress" />
                  </Card>
                ) : (
                  <MyEscrowsCards type="platformAddress" />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </>
  );
};

export default MyEscrows;
