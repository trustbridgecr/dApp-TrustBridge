"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Copy } from "lucide-react";
import {
  Escrow,
  EscrowRequestResponse,
  GetEscrowBalancesResponse,
  InitializeEscrowResponse,
  UpdateEscrowResponse,
} from "@trustless-work/escrow/types";
import { useUtils } from "@/hooks/utils.hook";

interface ResponseDisplayProps {
  response:
    | InitializeEscrowResponse
    | UpdateEscrowResponse
    | EscrowRequestResponse
    | GetEscrowBalancesResponse[]
    | Escrow
    | null;
}

export function ResponseDisplay({ response }: ResponseDisplayProps) {
  const [activeTab, setActiveTab] = useState("formatted");
  const { copyToClipboard, copied } = useUtils();

  if (!response) return null;

  const responseString = JSON.stringify(response, null, 2);

  return (
    <Card className="mt-6 border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Response</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(responseString)}
          className="h-8 px-2 text-xs"
        >
          {copied ? (
            <>
              <CheckCircle className="h-4 w-4 mr-1" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1" /> Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="formatted"
              className="flex-1 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:shadow-none py-3"
            >
              Formatted
            </TabsTrigger>
            <TabsTrigger
              value="raw"
              className="flex-1 rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-primary data-[state=active]:shadow-none py-3"
            >
              Raw
            </TabsTrigger>
          </TabsList>
          <div className="p-4">
            <TabsContent value="formatted" className="mt-0">
              <pre className="bg-muted p-4 rounded-md overflow-auto max-h-96 text-xs">
                {responseString}
              </pre>
            </TabsContent>
            <TabsContent value="raw" className="mt-0">
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-96 text-xs break-all">
                {JSON.stringify(response)}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
