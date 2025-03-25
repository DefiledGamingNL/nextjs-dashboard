"use client";

import { TrashBinIcon } from "@/icons";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteUserButtonProps {
  userId: string;
  onSuccess?: () => void;
}

export default function DeleteUserButton({
  userId,
  onSuccess,
}: DeleteUserButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete this user with ID: ${userId}?`)
    )
      return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete user");
      }

      toast.success("User deleted successfully");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
      redirect("/users");
    }
  };

  return (
    <button
      className="flex w-full items-center justify-center gap-2 rounded-full border border-red-300 bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-700 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
      onClick={handleDelete}
      disabled={loading}
    >
      <TrashBinIcon /> {loading ? "Deleting..." : "Delete"}
    </button>
  );
}
