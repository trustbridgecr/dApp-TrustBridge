import { useState } from "react";

interface StatusFilterProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export default function StatusFilter({ statusFilter, setStatusFilter }: StatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const statuses = ["All Statuses", "Pending", "Under Review", "Approved"];

  return (
    <div className="relative w-38">

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white text-gray-900 dark:bg-darkbg dark:text-gray-200 border border-gray-300 dark:border-darkborder px-4 py-2 rounded-md text-left shadow-sm text-sm"
        aria-expanded={isOpen}
      >
        {statusFilter}
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-1 w-full bg-white dark:bg-darkbg border border-gray-300 dark:border-darkborder rounded-md shadow-lg">
          {statuses.map((status) => (
            <div
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setIsOpen(false);
              }}
              className="px-4 py-2 cursor-pointer text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            >
              {status}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
