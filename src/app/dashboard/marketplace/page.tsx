import RequireWallet from "@/components/modules/auth/wallet/RequireWallet";
import ExploreMarketplace from "@/components/modules/dashboard/marketplace/ui/pages/ExploreMarketplace";

export default function Page() {
  return (
    <div className="h-screen overflow-auto p-6 mb-8">
      <RequireWallet>
      <ExploreMarketplace />
      </RequireWallet>
     
    </div>
  );
}
