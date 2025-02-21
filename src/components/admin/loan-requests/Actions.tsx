import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";


export function Actions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>View details</DropdownMenuItem>
        <DropdownMenuItem>Approve request</DropdownMenuItem>
        <DropdownMenuItem>Reject request</DropdownMenuItem>
        <DropdownMenuItem>Contact borrower</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
