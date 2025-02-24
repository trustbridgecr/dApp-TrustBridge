"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface StatusFilterProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  statusFilter,
  setStatusFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const statuses = [
    { label: t("statusFilter.all"), value: "all" },
    { label: t("statusFilter.onTime"), value: "On Time" },
    { label: t("statusFilter.late"), value: "Late" },
  ];

  return (
    <div className="relative w-48">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white text-black dark:bg-[#1A1A1A] dark:text-white border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md text-left shadow-sm"
        aria-expanded={isOpen.toString()}
        aria-haspopup="listbox"
        aria-controls="status-filter-options"
        aria-label={t("statusFilter.placeholder")}
      >
        {
          statuses.find((status) => status.value === statusFilter)?.label ||
          t("statusFilter.placeholder")
        }
      </button>

      {isOpen && (
        <div
          className="absolute z-30 mt-1 w-full bg-white dark:bg-[#1A1A1A] border border-gray-300 dark:border-gray-600 rounded-md shadow-lg"
          role="listbox"
          id="status-filter-options"
        >
          {statuses.map((status) => (
            <div
              key={status.value}
              onClick={() => {
                setStatusFilter(status.value);
                setIsOpen(false);
              }}
              className="px-4 py-2 cursor-pointer text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
              role="option"
              aria-selected={(statusFilter === status.value).toString()}
            >
              {status.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusFilter;
