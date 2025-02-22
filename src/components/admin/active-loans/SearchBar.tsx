"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch }) => {
  const { t } = useTranslation();

  return (
    <Input
      placeholder={t("searchBar.placeholder")}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-1/3 text-black dark:text-white bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
    />
  );
};

export default SearchBar;
