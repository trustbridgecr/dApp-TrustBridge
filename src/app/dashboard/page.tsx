import RequireWallet from "@/components/modules/auth/wallet/RequireWallet";
import { DashboardOverview } from "@/components/modules/dashboard/ui/pages/DashboardPage";

export default function Page() {
  return (
    <div className="h-screen overflow-auto">
      <RequireWallet>
        <DashboardOverview />
      </RequireWallet>
    </div>
  );
}
