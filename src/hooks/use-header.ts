import { useGlobalAuthenticationStore } from "@/components/auth/store/data";
import { useRouter } from "next/navigation";

const useHeaderWithoutAuth = () => {
  const { address } = useGlobalAuthenticationStore();
  const router = useRouter();

  const handleRequestApiKey = () => {
    router.push("/request-api-key");
  };

  const handleReportIssue = () => {
    router.push("/report-issue");
  };

  return { handleRequestApiKey, handleReportIssue, address };
};

export default useHeaderWithoutAuth;
