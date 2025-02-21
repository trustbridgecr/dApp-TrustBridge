"use client";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: string) => void;
}

export default function RoleSelectionModal({
  isOpen,
  onClose,
  onSelectRole,
}: RoleSelectionModalProps) {
  if (!isOpen) return null; // No renderizar si el modal está cerrado

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
          Please select your role
        </h2>
        <div className="flex flex-col gap-4 mt-4">
          <button
            onClick={() => onSelectRole("Lender")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Lender
          </button>
          <button
            onClick={() => onSelectRole("Borrower")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Borrower
          </button>
        </div>
      </div>
    </div>
  );
}
