import LoanDetails from "@/components/borrewer/loan-status/loan-details";

export default function LoanStatusPage() {
  // Define the loan data directly in the page
  const loanData = {
    totalAmount: 10000,
    amountPaid: 4000,
    interestRate: 5.5,
    nextPayment: "April 14, 2024",
    paymentHistory: [
      { date: "January 14, 2024", amount: 1000 },
      { date: "February 14, 2024", amount: 1000 },
      { date: "March 14, 2024", amount: 2000 },
    ],
    upcomingPayments: [
      { dueDate: "April 14, 2024", amount: 1000 },
      { dueDate: "May 14, 2024", amount: 1000 },
      { dueDate: "June 14, 2024", amount: 1000 },
      { dueDate: "July 14, 2024", amount: 1000 },
      { dueDate: "August 14, 2024", amount: 1000 },
      { dueDate: "September 14, 2024", amount: 1000 },
    ],
  };

  return (
    <div className=" dark:bg-gradient-to-br dark:from-[#131620] dark:to-[#19181A]">
      <LoanDetails {...loanData} />
    </div>
  );
}
