"use client";

import Loader from "@/components/utils/ui/Loader";
import InitializeEscrowForm from "../forms/InitializeEscrowForm";
import { useGlobalUIBoundedStore } from "@/core/store/ui";

const InitializeLoan = () => {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);

  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <div className="p-8 flex flex-col gap-3 ">
          <InitializeEscrowForm />
        </div>
      )}
    </>
  );
};

export default InitializeLoan;
