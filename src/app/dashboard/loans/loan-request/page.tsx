"use client";

import InitializeEscrowForm from "@/components/modules/escrow/ui/forms/InitializeEscrowForm";
import Loader from "@/components/utils/ui/Loader";
import { useGlobalUIBoundedStore } from "@/core/store/ui";

export default function Page() {
  const isLoading = useGlobalUIBoundedStore((state) => state.isLoading);

  return isLoading ? (
    <Loader isLoading={isLoading} />
  ) : (
    <InitializeEscrowForm />
  );
}
