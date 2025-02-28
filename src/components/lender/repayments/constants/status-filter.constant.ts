import { Status } from "@/@types/repayment.entity";

export const statusFilter = {
  upcoming: "upcoming",
  paid: "paid",
  all: "all",
};

export const statuses: { label: string; value: Status }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
];
