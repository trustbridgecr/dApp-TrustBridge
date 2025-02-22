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
      <SelectTrigger className="w-1/4 text-black dark:text-white bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-600">
        <SelectValue placeholder="Filter by Status" className="text-black dark:text-white" />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-600">
        <SelectItem value="all" className="text-black dark:text-white bg-white dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-gray-800">All</SelectItem>
        <SelectItem value="On Time" className="text-black dark:text-white bg-white dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-gray-800">On Time</SelectItem>
        <SelectItem value="Late" className="text-black dark:text-white bg-white dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-gray-800">Late</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
