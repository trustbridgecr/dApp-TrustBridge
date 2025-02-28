import { Repayment } from "@/@types/repayment.entity";

export const data: Repayment[] = [
  {
    id: "RP001",
    borrower: "Alice Johnson",
    loanId: "AL001",
    amount: 800,
    dueDate: "2025-03-15",
    status: "upcoming",
  },
  {
    id: "RP002",
    borrower: "Bob Smith",
    loanId: "AL002",
    amount: 700,
    dueDate: "2025-03-10",
    status: "overdue",
  },
  {
    id: "RP003",
    borrower: "Carol Williams",
    loanId: "AL003",
    amount: 1200,
    dueDate: "2025-03-20",
    status: "upcoming",
  },
  {
    id: "RP004",
    borrower: "David Brown",
    loanId: "AL004",
    amount: 500,
    dueDate: "2025-03-05",
    status: "paid",
  },
  {
    id: "RP005",
    borrower: "Eva Davis",
    loanId: "AL005",
    amount: 1500,
    dueDate: "2025-03-25",
    status: "upcoming",
  },
];
