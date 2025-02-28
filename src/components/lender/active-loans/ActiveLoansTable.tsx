import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import StatusFilter from './StatusFilter';
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import { useTranslation } from "react-i18next";

const translations = {
  en,
  es
};

const loansData = [
    {
      id: 'LN87654',
      borrower: 'Alice Thompson',
      loanType: 'Home',
      amount: 18000,
      remainingBalance: 9000,
      interestRate: '3.5%',
      startDate: '2024-01-15',
      lastPayment: '2025-02-12',
      nextPayment: '2025-03-12',
      paymentsMade: 14,
      status: 'On Time'
    },
    {
      id: 'LN67891',
      borrower: 'David Miller',
      loanType: 'Personal',
      amount: 8000,
      remainingBalance: 2500,
      interestRate: '6%',
      startDate: '2023-03-12',
      lastPayment: '2025-02-25',
      nextPayment: '2025-03-25',
      paymentsMade: 22,
      status: 'Late'
    },
    {
      id: 'LN09876',
      borrower: 'Emily Davis',
      loanType: 'Education',
      amount: 15000,
      remainingBalance: 3000,
      interestRate: '2.8%',
      startDate: '2021-06-25',
      lastPayment: '2025-02-20',
      nextPayment: '2025-03-20',
      paymentsMade: 42,
      status: 'On Time'
    },
    {
      id: 'LN12345',
      borrower: 'John Doe',
      loanType: 'Personal',
      amount: 5000,
      remainingBalance: 1500,
      interestRate: '5%',
      startDate: '2023-01-15',
      lastPayment: '2025-02-10',
      nextPayment: '2025-03-10',
      paymentsMade: 24,
      status: 'On Time'
    },
    {
      id: 'LN67890',
      borrower: 'Jane Smith',
      loanType: 'Home',
      amount: 10000,
      remainingBalance: 8000,
      interestRate: '3%',
      startDate: '2024-02-20',
      lastPayment: '2025-02-05',
      nextPayment: '2025-03-05',
      paymentsMade: 12,
      status: 'Late'
    },
    {
      id: 'LN54321',
      borrower: 'Michael Johnson',
      loanType: 'Car',
      amount: 20000,
      remainingBalance: 12000,
      interestRate: '4.5%',
      startDate: '2022-05-10',
      lastPayment: '2025-02-15',
      nextPayment: '2025-03-15',
      paymentsMade: 36,
      status: 'On Time'
    },
    {
      id: 'LN34567',
      borrower: 'Nancy Cooper',
      loanType: 'Home',
      amount: 25000,
      remainingBalance: 20000,
      interestRate: '4.0%',
      startDate: '2024-03-22',
      lastPayment: '2025-02-18',
      nextPayment: '2025-03-18',
      paymentsMade: 11,
      status: 'Late'
    },
    {
      id: 'LN23456',
      borrower: 'Paul Brown',
      loanType: 'Car',
      amount: 12000,
      remainingBalance: 6000,
      interestRate: '4.2%',
      startDate: '2023-07-01',
      lastPayment: '2025-02-22',
      nextPayment: '2025-03-22',
      paymentsMade: 20,
      status: 'On Time'
    },
    {
      id: 'LN78901',
      borrower: 'Karen White',
      loanType: 'Education',
      amount: 10000,
      remainingBalance: 4000,
      interestRate: '3.2%',
      startDate: '2022-09-10',
      lastPayment: '2025-02-08',
      nextPayment: '2025-03-08',
      paymentsMade: 30,
      status: 'On Time'
    },
    {
      id: 'LN89012',
      borrower: 'Sara Wilson',
      loanType: 'Personal',
      amount: 9000,
      remainingBalance: 2000,
      interestRate: '5.5%',
      startDate: '2023-11-03',
      lastPayment: '2025-02-28',
      nextPayment: '2025-03-28',
      paymentsMade: 16,
      status: 'On Time'
    }
  ];
  

  const ActiveLoansTable: React.FC = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
  
    const { t } = useTranslation();
  
    const filteredLoans = loansData.filter(
      (loan) =>
        (loan.borrower.toLowerCase().includes(search.toLowerCase()) ||
          loan.id.toLowerCase().includes(search.toLowerCase())) &&
        (statusFilter === "all" || loan.status === statusFilter)
    );
  
    return (
    <div className="p-4 bg-white dark:bg-darkbg">
      <h1 className="text-xl font-bold text-black dark:text-white mb-2">{t("activeLoans.title")}</h1>
      <div className="flex justify-between items-center mb-2 space-x-2">
        <SearchBar search={search} setSearch={setSearch} />
        <StatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      </div>
      <div className="overflow-x-auto rounded-md shadow-md">
        <table className="min-w-full bg-white dark:bg-darkbg text-sm text-black dark:text-white">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-darkbg">
            <th className="py-3 px-6">{t("activeLoans.loanId")}</th>
                <th className="py-3 px-6">{t("activeLoans.borrower")}</th>
                <th className="py-3 px-6">{t("activeLoans.loanType")}</th>
                <th className="py-3 px-6">{t("activeLoans.amount")}</th>
                <th className="py-3 px-6">
                  {t("activeLoans.remainingBalance")}
                </th>
                <th className="py-3 px-6">{t("activeLoans.interestRate")}</th>
                <th className="py-3 px-6">{t("activeLoans.startDate")}</th>
                <th className="py-3 px-6">{t("activeLoans.lastPaymentDate")}</th>
                <th className="py-3 px-6">{t("activeLoans.nextPaymentDate")}</th>
                <th className="py-3 px-6">{t("activeLoans.status")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map((loan) => (
              <tr key={loan.id} className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <td className="py-4 px-6">{loan.id}</td>
                  <td className="py-4 px-6">{loan.borrower}</td>
                  <td className="py-4 px-6">{t(`loanTypes.${loan.loanType.toLowerCase()}`)}</td>
                  <td className="py-4 px-6">{loan.amount}</td>
                  <td className="py-4 px-6">{loan.remainingBalance}</td>
                  <td className="py-4 px-6">{loan.interestRate}</td>
                  <td className="py-4 px-6">{loan.startDate}</td>
                  <td className="py-4 px-6">{loan.lastPayment}</td>
                  <td className="py-4 px-6">{loan.nextPayment}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-1 rounded-full text-white text-xs ${loan.status === "On Time" ? "bg-green-600" : "bg-red-600"}`}>
                    {loan.status === "On Time" ? t("activeLoans.onTime") : t("activeLoans.late")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  };
  
  export default ActiveLoansTable;