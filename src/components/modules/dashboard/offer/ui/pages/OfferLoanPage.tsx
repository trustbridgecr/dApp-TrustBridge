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
          <h1 className="text-4xl font-bold">Offer a New Loan</h1>
          <h2>
            Fill out the form below to publish a loan offer. Once approved, it
            will appear in the marketplace for borrowers.
          </h2>
          <OfferLoanForm />
        </div>
      )}
    </>
  );
};

export default CreateLoanOffer;
