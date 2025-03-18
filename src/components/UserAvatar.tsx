"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useModal } from "@/hooks/useModal";
import { CameraIcon } from "lucide-react";
import { TrashBinIcon } from "@/icons";
import { useAvatarStore } from "@/store/useAvatarStore";
import {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from "./ui/modal";
import Button from "./ui/button/Button";

interface AvatarProps {
  userId: string | undefined;
  className?: string;
  showDeleteButton?: boolean;
  allowUpload?: boolean;
}

const UserAvatar: React.FC<AvatarProps> = ({
  userId,
  className,
  showDeleteButton = false,
  allowUpload = false,
}) => {
  const { avatars, setAvatar } = useAvatarStore();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { isOpen, openModal, closeModal } = useModal();
  const avatarUrl = avatars[userId || ""] || "/user/owner.jpg"; // Fallback avatar

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

      if (error || !data?.avatar_url) return;

      const { data: file, error: downloadError } = await supabase.storage
        .from("avatars")
        .download(data.avatar_url);

      if (downloadError || !file) return;

      const url = URL.createObjectURL(file);
      setAvatar(userId, url);

      return () => URL.revokeObjectURL(url); // Revoke URL to free memory
    };

    fetchAvatar();
  }, [userId, supabase, setAvatar]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setUploading(true);
    const filePath = `${userId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload mislukt.");
      setUploading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: filePath })
      .eq("id", userId);

    if (updateError) {
      toast.error("Database update mislukt.");
      setUploading(false);
      return;
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("avatars")
      .download(filePath);

    if (downloadError || !fileData) {
      toast.error("Kan avatar niet laden.");
      setUploading(false);
      return;
    }

    const url = URL.createObjectURL(fileData);
    setAvatar(userId, url);
    toast.success("Avatar bijgewerkt!");
    setUploading(false);
  };

  const handleDelete = async () => {
    if (!userId || !avatarUrl) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    if (error || !data?.avatar_url) {
      toast.error("Avatar verwijderen mislukt.");
      return;
    }

    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([data.avatar_url]);

    if (deleteError) {
      toast.error("Avatar verwijderen mislukt.");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", userId);

    if (updateError) {
      toast.error("Avatar verwijderen mislukt.");
    } else {
      setAvatar(userId, "/user/owner.jpg"); // Reset naar default avatar
      toast.success("Avatar verwijderd.");
    }

    closeModal();
  };

  return (
    <div className="gap-3 relative group">
      {showDeleteButton && avatarUrl && (
        <button
          className="absolute top-2 right-2 p-2 group-hover:z-50 bg-white rounded-full shadow-lg hover:bg-red-100 transition-colors"
          onClick={openModal}
        >
          <TrashBinIcon size={20} className="text-red-500" />
        </button>
      )}

      <div
        className={`relative rounded-full border border-gray-300 shadow hover:opacity-80 transition-opacity ${className}`}
      >
        <Image
          src={avatarUrl}
          alt="User Avatar"
          fill
          className="rounded-full object-cover flex items-center justify-center"
        />
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm rounded-full">
            Uploading...
          </div>
        )}
      </div>

      {allowUpload && !uploading && (
        <button
          className="absolute bottom-2 left-2 p-2 rounded-full hover:bg-blue-100 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <CameraIcon size={20} className="text-blue-500" />
        </button>
      )}

      {isOpen && (
        <Modal
          className="max-w-[400px] p-4"
          isOpen={isOpen}
          onClose={closeModal}
        >
          <ModalHeader className="border-b border-gray-200 dark:border-gray-800">
            <ModalTitle className="py-4">
              <h3 className="text-lg font-semibold text-red-500">
                Delete Avatar
              </h3>
            </ModalTitle>
          </ModalHeader>
          <ModalContent className="py-4">
            <p>
              Are you <strong>sure</strong> that you want to delete your avatar?
            </p>
          </ModalContent>
          <ModalFooter className="mt-4 flex gap-3 justify-end">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white rounded-md"
              onClick={handleDelete}
            >
              Confirm
            </Button>
            <Button
              className="bg-gray-500 hover:bg-gray-600 text-gray-700 rounded"
              onClick={closeModal}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};

export default UserAvatar;
