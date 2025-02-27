import { LoanSummary } from "@/components/admin/loan-status/LoanSummary"
import { PaymentHistory } from "@/components/admin/loan-status/PaymentHistory"
import { FuturePayments } from "@/components/admin/loan-status/FuturePayments"

const loanData = {
  totalAmount: 1000.0,
  amountPaid: 400.0,
  interestRate: 5,
  nextPaymentDate: "July 14, 2023",
  paymentHistory: [
    { id: "1", date: "May 14, 2023", amount: 200.0 },
    { id: "2", date: "June 14, 2023", amount: 200.0 },
  ],
  futurePayments: [
    { id: "3", date: "July 14, 2023", amount: 200.0 },
    { id: "4", date: "August 14, 2023", amount: 200.0 },
    { id: "5", date: "September 14, 2023", amount: 200.0 },
  ],
}

export default function LoansPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <LoanSummary
        totalAmount={loanData.totalAmount}
        amountPaid={loanData.amountPaid}
        interestRate={loanData.interestRate}
        nextPaymentDate={loanData.nextPaymentDate}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PaymentHistory payments={loanData.paymentHistory} />
        <FuturePayments payments={loanData.futurePayments} />
      </div>
    </div>
  )
}

