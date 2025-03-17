"use client";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import React from "react";
import { TrashBinIcon } from "@/icons";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "../ui/modal";
import { Button } from "../ui/button";
import { useModal } from "@/hooks/useModal";

interface Vacancy {
  id: number;
  title: string;
  location: string;
  payment: string;
  description: string;
}

export default function DeleteButton({ vacancy }: { vacancy: Vacancy }) {
  const { isOpen, openModal, closeModal } = useModal();
  const deleteVacancy = async () => {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from("vacancies")
        .delete()
        .eq("id", vacancy.id);
      if (error) throw error;
      console.log("Deleted:", data);
    } catch (err) {
      console.error("Error deleting vacancy:", err);
    } finally {
      redirect("/vacatures");
    }
  };

  const handleDelete = async () => {
    openModal();
  };

  return (
    <>
      <button
        className="flex w-full items-center justify-center gap-2 rounded-full border border-red-300 bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-red-700 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        onClick={handleDelete}
      >
        <TrashBinIcon /> Delete
      </button>

      <Modal className="max-w-[400px] p-4" isOpen={isOpen} onClose={closeModal}>
        <ModalHeader className="border-b border-gray-200 dark:border-gray-800">
          <ModalTitle className="py-4">
            <h3 className="text-lg font-semibold text-red-500">
              Delete Vacancy
            </h3>
          </ModalTitle>
        </ModalHeader>
        <ModalContent className="py-4">
          <p>Are you sure you want to delete this vacancy?</p>
        </ModalContent>
        <ModalFooter className="mt-4 flex gap-3 justify-end">
          <Button
            onClick={deleteVacancy}
            className="bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            Delete
          </Button>
          <Button
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-600 text-white rounded-md"
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
