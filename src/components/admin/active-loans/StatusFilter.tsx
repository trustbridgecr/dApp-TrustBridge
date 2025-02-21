"use client";

import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

interface StatusFilterProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ statusFilter, setStatusFilter }) => {
  return (
    <Select onValueChange={(value) => setStatusFilter(value)} value={statusFilter}>
      <SelectTrigger className="w-1/4">
        <SelectValue placeholder="Filter by Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="On Time">On Time</SelectItem>
        <SelectItem value="Late">Late</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
