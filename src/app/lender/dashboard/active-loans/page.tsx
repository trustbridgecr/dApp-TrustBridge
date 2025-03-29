'use client';

import { useState } from "react";
import ActiveLoansTable from "@/components/lender/active-loans/ActiveLoansTable";

export default function ActiveLoansPage() {
  const [language, setLanguage] = useState<"en" | "es">("en");

  return (
    <div className="p-4">
      <ActiveLoansTable language={language} setLanguage={setLanguage} />
    </div>
  );
}
