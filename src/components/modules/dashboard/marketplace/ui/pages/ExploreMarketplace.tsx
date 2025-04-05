"use client";

import Loader from "@/components/utils/ui/Loader";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import MarketplaceOffersList from "./MarketplaceOffersList";

const ExploreMarketplace = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="p-8 flex flex-col gap-3">
          <h1 className="text-4xl font-bold">Marketplace</h1>
          <h2 className="text-muted-foreground">
            Explore loan offers available in the marketplace and choose the one
            that suits your needs.
          </h2>
          <MarketplaceOffersList />
        </div>
      )}
    </>
  );
};

export default ExploreMarketplace;
