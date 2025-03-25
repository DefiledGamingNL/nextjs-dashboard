import React from "react";

interface CreateButtonProps {
  onClick: () => void;
  type?: "button" | "submit";
  children: React.ReactNode;
}

function CreateButton({ onClick, type, children }: CreateButtonProps) {
  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-full border border-green-300 bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-700 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}

export default CreateButton;
