import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Filter } from "lucide-react";

interface StatusFilterProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export default function StatusFilter({
  statusFilter,
  setStatusFilter,
}: StatusFilterProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const statuses = [
    { key: "all", label: t("status.allStatuses") },
    { key: "pending", label: t("status.pending") },
    { key: "under_review", label: t("status.under_review") },
    { key: "approved", label: t("status.approved") },
  ];

  return (
    <div className="relative w-38">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white flex gap-3 justify-center items-center text-gray-900 dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-darkborder px-4 py-2 rounded-md text-left shadow-sm text-sm"
        aria-expanded={isOpen}
      >
        <Filter className="w-4 h-4" />
        {statuses.find((s) => s.key === statusFilter)?.label ||
          t("status.allStatuses")}
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-1 w-full bg-white dark:bg-darkbg border border-gray-300 dark:border-darkborder rounded-md shadow-lg">
          {statuses.map(({ key, label }) => (
            <div
              key={key}
              onClick={() => {
                setStatusFilter(key);
                setIsOpen(false);
              }}
              className="px-4 py-2 cursor-pointer text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
