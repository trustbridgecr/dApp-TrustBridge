"use client";

import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  return (
    <Input 
      placeholder="Search by Borrower or Loan ID"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-1/3"
    />
  );
};

export default SearchBar;
