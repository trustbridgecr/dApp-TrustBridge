"use client";

import React from "react";
import ActiveLoansTable from "@/components/lender/active-loans/ActiveLoansTable";

const ActiveLoansPage = ({
  language,
  setLanguage,
}: {
  language: "en" | "es";
  setLanguage: (lang: "en" | "es") => void;
}) => {
  return <ActiveLoansTable language={language} setLanguage={setLanguage} />;
};

export default ActiveLoansPage;
