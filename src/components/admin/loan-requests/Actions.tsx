import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

export function Actions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
      >
        <MoreHorizontal className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md border shadow-md bg-white dark:bg-darkbg border-gray-300 dark:border-darkborder"
          role="menu"
        >
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            View details
          </button>
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            Approve request
          </button>
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            Reject request
          </button>
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}
          >
            Contact borrower
          </button>
        </div>
      )}
    </div>
  );
}
