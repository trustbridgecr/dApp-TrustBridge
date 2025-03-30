"use client";
import "@/lib/i18n";
import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next";
import {Button} from '@/components/ui/button'
import CurrentLoanStatus from '@/components/borrewer/dashboard/CurrentLoanStatus'
import PaymentHistory from '@/components/borrewer/dashboard/PaymentHistory'
import UpcomingPayment from '@/components/borrewer/dashboard/UpcomingPayment'


export function DashboardContent() {

  const currentLoanData = {
    totalAmount: 1000,
    amountPaid: 400,
    nextPayment: "July 14, 2023",
    interestRate: 5,
  };

  const paymentHistoryData = [
    { id: 1, date: "May 14, 2023", amount: 500,},
    { id: 2, date: "June 14, 2023", amount: 450, },
  ];

  const upcomingPaymentsData = [
    { id: 1, dueDate: "July 14, 2023", amount: 200,},
    { id: 2, dueDate: "August 14, 2023", amount: 200,},
    { id: 3, dueDate: "September 14, 2023", amount: 200,}
  ];

  const { t } = useTranslation()
  const [theme] = useState<"light" | "dark">("dark")
  
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor

    if (theme === "dark") {
      document.body.style.backgroundColor = "#19181A"
      document.documentElement.classList.add("dark")
    } else {
      document.body.style.backgroundColor = "white"
      document.documentElement.classList.remove("dark")
    }

    return () => {
      document.body.style.backgroundColor = originalBg
      document.documentElement.classList.remove("dark")
    }
  }, [theme])


  return (
    <main className="flex-1 bg-white dark:bg-darkbg text-black dark:text-white px-[4rem] mb-6">
        <div className="flex justify-between items-center mb-6  mt-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-br from-green-400 to-blue-400 text-transparent bg-clip-text">{t("borrowerDashboard.title")}</h1>
            <div className={`h-1 w-52 ${theme === "dark" ? "bg-[#38bdf8]" : "bg-[#0ea5e9]"} mt-2 rounded-full`}/>
            <div className={`h-1 w-32 ${theme === "dark" ? "bg-[#38bdf8]" : "bg-[#0ea5e9]"} mt-2 rounded-full`}/>
          </div>
          <div>
            <Button
              variant="outline"
              className={`py-4 px-6 rounded-3xl ${theme === "dark" ? "bg-[#0E1827] text-[#1DAFC9] border-[#0F2535] shadow-[0_4px_12px_rgba(1,242,160,0.15)]" : "bg-white text-[#0ea5e9] border-gray-200 shadow-md"}`}
            >
              <div className="h-4 w-4 rounded-full bg-gradient-to-r from-[#1DAFC9] via-[#38bdf8] to-[#10b981]"></div>
              {t("borrowerDashboard.loanOverview.activeLoans")}
            </Button>
          </div>

        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-[2rem]">
        <CurrentLoanStatus {...currentLoanData} theme={theme}/>
        <PaymentHistory payments={paymentHistoryData}  theme={theme}/>
      </div>

      {/* Upcoming Payments Spanning Full Width */}
      <UpcomingPayment upcomingPayments={upcomingPaymentsData} theme={theme}/>
    </main>
  );
}
