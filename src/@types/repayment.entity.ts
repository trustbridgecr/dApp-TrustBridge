export type Status = "all" | "upcoming" | "paid" | "overdue";

export interface Repayment {
  id: string;
  borrower: string;
  loanId: string;
  amount: number;
  dueDate: string;
  status: Exclude<Status, "all">;
}
