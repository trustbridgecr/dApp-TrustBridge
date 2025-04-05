import { useFormatUtils } from "@/utils/hook/format.hook";
import { useCopyUtils } from "@/utils/hook/copy.hook";

interface LoanRequest {
  id: string;
  borrower: string;
  amount: number;
  status: string;
  createdAt: number;
}

export function useLoanRequestDetail(
  isDialogOpen: boolean,
  setIsDialogOpen: (value: boolean) => void,
  selectedRequest: LoanRequest | undefined,
  setSelectedRequest: (value?: LoanRequest) => void,
) {
  const { formatDollar, formatAddress, formatDateFromFirebase } =
    useFormatUtils();
  const { copyText, copiedKeyId } = useCopyUtils();

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedRequest(undefined);
  };

  return {
    formatDollar,
    formatAddress,
    formatDateFromFirebase,
    copyText,
    copiedKeyId,
    handleClose,
  };
}
