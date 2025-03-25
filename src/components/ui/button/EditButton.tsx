"use client";

import { useModal } from "@/hooks/useModal";
import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalTitle } from "../modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "./Button";
import { createClient } from "@/utils/supabase/client";
import TextArea from "@/components/form/input/TextArea";
import { redirect } from "next/navigation";

interface Vacancy {
  id: number;
  title: string;
  location: string;
  payment: string;
  description: string;
}

type UpdatedData = {
  title?: string;
  location?: string;
  payment?: string;
  description?: string;
};

export default function EditButton({ vacancy }: { vacancy: Vacancy }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(vacancy.title || "");
  const [location, setLocation] = useState(vacancy.location || "");
  const [payment, setPayment] = useState(vacancy.payment || "");
  const [description, setDescription] = useState(vacancy.description || "");

  const updateUser = async () => {
    const supabase = createClient();
    setLoading(true);

    const updatedData: UpdatedData = {};

    if (title && title !== vacancy.title) updatedData.title = title;
    if (location && location !== vacancy.location)
      updatedData.location = location;
    if (payment && payment !== vacancy.payment) updatedData.payment = payment;
    if (description && description !== vacancy.description)
      updatedData.description = description;

    if (Object.keys(updatedData).length === 0) {
      console.log("No changes detected");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("vacancies")
        .update(updatedData)
        .eq("id", vacancy.id);

      if (error) throw error;

      console.log("Updated:", data);
      closeModal(); // Sluit de modal na succesvol updaten
    } catch (err) {
      console.error("Error updating vacancy:", err);
    } finally {
      setLoading(false);
      redirect("/vacatures");
    }
  };

  return (
    <>
      <button
        onClick={() => openModal()}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
      >
        <svg
          className="fill-current"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
            fill=""
          />
        </svg>
        Edit Vacancy
      </button>

      {/* Modal for editing username */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[600px] m-4 p-10"
      >
        <ModalHeader className="pt-10">
          <ModalTitle>
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Vacancy {vacancy.title}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Update the vacancy.
            </p>
          </ModalTitle>
        </ModalHeader>
        <ModalContent>
          <form className="flex flex-col">
            <div className="mb-5">
              <Label>Title</Label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <Label>Location</Label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <Label>Payment</Label>
              <Input
                type="text"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <Label>Description</Label>
              <TextArea
                rows={14}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" onClick={updateUser} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
