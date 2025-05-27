import { Badge } from "@/components/ui/badge";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Escrow } from "@trustless-work/escrow/types";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCodeIcon as FileContract,
  Handshake,
} from "lucide-react";
import Link from "next/link";

interface HeaderSectionProps {
  escrow: Escrow | null;
}

export const HeaderSection = ({ escrow }: HeaderSectionProps) => {
  return (
    <>
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <FileContract className="h-5 w-5 text-primary" />
          <CardTitle>{escrow?.title}</CardTitle>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href={`https://viewer.trustlesswork.com/${escrow?.contractId}`}
            target="_blank"
          >
            <Badge variant="outline" className="gap-2">
              <ExternalLink /> Escrow Viewer
            </Badge>
          </Link>

          <Link
            href={`https://stellar.expert/explorer/testnet/contract/${escrow?.contractId}`}
            target="_blank"
          >
            <Badge variant="outline" className="gap-2">
              <ExternalLink /> Stellar Expert
            </Badge>
          </Link>

          <Badge
            variant="outline"
            className={
              escrow?.flags?.releaseFlag || escrow?.flags?.resolvedFlag
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : escrow?.flags?.disputeFlag
                ? "bg-destructive text-white hover:bg-destructive/90"
                : ""
            }
          >
            {escrow?.flags?.releaseFlag ? (
              <>
                <CheckCircle2 className="mr-1 h-3 w-3" /> Released
              </>
            ) : escrow?.flags?.resolvedFlag ? (
              <>
                <Handshake className="mr-1 h-3 w-3" /> Resolved
              </>
            ) : escrow?.flags?.disputeFlag ? (
              <>
                <AlertCircle className="mr-1 h-3 w-3" /> Dispute
              </>
            ) : (
              <>
                <Clock className="mr-1 h-3 w-3" /> Working
              </>
            )}
          </Badge>
        </div>
      </div>
      <CardDescription className="text-sm mt-1">
        {escrow?.description}
      </CardDescription>
    </>
  );
};
