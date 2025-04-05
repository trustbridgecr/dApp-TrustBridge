"use client";

import Loader from "@/components/utils/ui/Loader";
import { useGlobalUIBoundedStore } from "@/core/store/ui";
import { OfferLoanForm } from "../forms/OfferLoanForm";

const CreateLoanOffer = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="p-8 flex flex-col gap-3">
          <OfferLoanForm />
        </div>
      )}
    </>
  );
};

export default CreateLoanOffer;
