import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatusFilter from "./StatusFilter";
import { SearchBar } from "./SearchBar";
import { Actions } from "./Actions";

interface LoanRequest {
  id: string;
  borrower: string;
  amount: number;
  purpose: string;
  creditScore: number;
  status: string;
}

const loanRequests: LoanRequest[] = [
  { id: "LR001", borrower: "Alice Johnson", amount: 5000, purpose: "Business Expansion", creditScore: 720, status: "Pending" },
  { id: "LR002", borrower: "Bob Smith", amount: 3500, purpose: "Debt Consolidation", creditScore: 680, status: "Under Review" },
  { id: "LR003", borrower: "Carol Williams", amount: 7000, purpose: "Home Improvement", creditScore: 750, status: "Pending" },
  { id: "LR004", borrower: "David Brown", amount: 2000, purpose: "Education", creditScore: 700, status: "Approved" },
  { id: "LR005", borrower: "Eva Davis", amount: 10000, purpose: "Start-up Funding", creditScore: 780, status: "Under Review" },
];

export function LoanRequestsTable() {
  const [filteredRequests, setFilteredRequests] = useState<LoanRequest[]>(loanRequests);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses");

  const filterRequests = (query: string, status: string) => {
    let filtered = loanRequests.filter(
      (req) =>
        req.borrower.toLowerCase().includes(query.toLowerCase()) ||
        req.id.toLowerCase().includes(query.toLowerCase())
    );

    if (status !== "All Statuses") {
      filtered = filtered.filter((req) => req.status === status);
    }
    setFilteredRequests(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    filterRequests(query, statusFilter);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    filterRequests(searchQuery, status);
  };

  return (
    <div className="space-y-4 p-[4rem]">
      <h1 className="text-3xl font-bold">Loan Requests</h1>
      <div className="flex gap-2 items-center">
        <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} />
        <StatusFilter statusFilter={statusFilter} setStatusFilter={handleStatusFilter} />
      </div>
      <section className="border rounded-xl p-[2rem]">
        <h1 className="text-2xl font-bold">All Loan Requests</h1>
        <p className="mt-1 mb-4 text-[#9C9EA8]">A list of all loan requests from borrowers. Review and take action.</p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer">Request ID</TableHead>
              <TableHead className="cursor-pointer">Borrower</TableHead>
              <TableHead className="cursor-pointer">Amount ($)</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead className="cursor-pointer">Credit Score</TableHead>
              <TableHead className="cursor-pointer">Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.borrower}</TableCell>
                <TableCell>{request.amount.toLocaleString()}</TableCell>
                <TableCell>{request.purpose}</TableCell>
                <TableCell>{request.creditScore}</TableCell>
                <TableCell>{request.status}</TableCell>
                <TableCell>
                  <Actions />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
