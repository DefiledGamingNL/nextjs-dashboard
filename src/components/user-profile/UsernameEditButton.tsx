"use client";
import React, { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { createClient } from "@/utils/supabase/client";
import UserAvatar from "../UserAvatar";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { Profile } from "@/types";

function UsernameEditButton({ user: userProfile }: { user: Profile }) {
  const supabase = createClient();
  const { isOpen, openModal, closeModal } = useModal();

  // State for user data
  const [user, setUser] = useState<any | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const setProfile = useAuthStore((state) => state.setProfile);
  const profile = useAuthStore((state) => state.profile);

  // Fetch user data from Supabase
  useEffect(() => {
    async function fetchUserProfile() {
      setLoading(true);

      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData?.user) {
        console.error("User not found");
        return;
      }

      const userId = authData.user.id;

      // Fetch profile from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`username`)
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Profile Fetch Error:", profileError.message);
        return;
      }

      setUser(authData.user);
      setUsername(profileData.username);
      setLoading(false);
    }

    fetchUserProfile();
  }, []);

  // Update username in Supabase
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ username, updated_at: new Date().toISOString() })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating username:", error.message);
      return;
    }

    setProfile({ ...user, username, profile });

    toast.success("Username updated successfully");
    closeModal();
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={openModal}
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
        Edit Username
      </button>

      {/* Modal for editing username */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="relative w-full max-w-[500px] rounded-3xl bg-white p-6 dark:bg-gray-900">
          <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            Edit Username
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Update your username.
          </p>
          <form className="flex flex-col">
            <div className="mb-5">
              <Label>Username</Label>
              <Input
                type="text"
                value={username ?? ""}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default UsernameEditButton;
