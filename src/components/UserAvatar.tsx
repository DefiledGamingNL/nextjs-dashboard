"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // Importeren van Sonner toast
import { useModal } from "@/hooks/useModal"; // Jouw modal hook
import { CameraIcon } from "lucide-react"; // Zorg ervoor dat je Lucide-icons hebt geïnstalleerd
import { TrashBinIcon } from "@/icons";
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
  size?: [width: number | string, height: number | string];
  showDeleteButton?: boolean; // Regelt of de verwijderknop wordt weergegeven
  allowUpload?: boolean; // Regelt of de uploadknop wordt weergegeven
}

const UserAvatar: React.FC<AvatarProps> = ({
  userId,
  className,
  showDeleteButton = false,
  allowUpload = false, // Standaard op false, betekent geen upload mogelijkheid
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { isOpen, openModal, closeModal } = useModal(); // Modal hook

  useEffect(() => {
    const downloadAvatar = async () => {
      if (!userId) return;

      const { data, error } = await supabase
        .from("profiles") // Pas de tabelnaam aan indien nodig
        .select("avatar_url")
        .eq("id", userId)
        .single();

      if (error || !data?.avatar_url) return;

      const { data: fileData, error: fileError } = await supabase.storage
        .from("avatars") // Pas bucketnaam aan
        .download(data.avatar_url);

      if (fileError) return;

      const url = URL.createObjectURL(fileData);
      setAvatarUrl(url);
    };

    downloadAvatar();

    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    };
  }, [userId, supabase]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const filePath = `${userId}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars") // Pas bucketnaam aan
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      setUploading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles") // Pas tabelnaam aan
      .update({ avatar_url: filePath })
      .eq("id", userId);

    if (updateError) {
      console.error("Database update error:", updateError.message);
    } else {
      const { data: fileData, error: fileError } = await supabase.storage
        .from("avatars")
        .download(filePath);

      if (!fileError && fileData) {
        const url = URL.createObjectURL(fileData);
        setAvatarUrl(url);
      }
    }

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
      console.error("Verwijderen mislukt:", deleteError.message);
      toast.error("Avatar verwijderen mislukt.");
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", userId);

    if (updateError) {
      console.error("Database update error:", updateError.message);
      toast.error("Avatar verwijderen mislukt.");
    } else {
      setAvatarUrl(null);
      toast.success("Avatar verwijderd.");
    }

    closeModal(); // Sluit de modal na succesvolle verwijdering
  };

  return (
    <div className="gap-3 relative group">
      {/* Verwijderknop in de rechterbovenhoek */}
      {showDeleteButton && avatarUrl && (
        <button
          className="absolute top-2 right-2 p-2 group-hover:z-50 bg-white rounded-full shadow-lg hover:bg-red-100 transition-colors"
          onClick={openModal}
        >
          <TrashBinIcon size={20} className="text-red-500" />
        </button>
      )}

      {/* Avatar */}
      <div
        className={cn(
          "relative rounded-full border border-gray-300 shadow hover:opacity-80 transition-opacity",
          className
        )}
      >
        <Image
          src={avatarUrl || "/user/owner.jpg"}
          alt="User Avatar"
          fill
          className={cn(
            "rounded-full object-cover flex items-center justify-center",
            className
          )}
        />
        {uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-sm rounded-full">
            Uploading...
          </div>
        )}
      </div>

      {/* Uploadknop als allowUpload true is */}
      {allowUpload && !uploading && (
        <button
          className="absolute bottom-2 left-2 p-2 rounded-full  hover:bg-blue-100 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <CameraIcon size={20} className="text-blue-500" />
        </button>
      )}

      {/* Modal voor bevestiging van verwijderen */}
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
              onClick={handleDelete} // Verwijder avatar
            >
              Confirm
            </Button>
            <Button
              className="bg-gray-500 hover:bg-gray-600 text-gray-700 rounded"
              onClick={closeModal} // Modal sluiten zonder actie
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}

      {/* Verborgen file input */}
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
