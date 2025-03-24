"use client"; // This component needs to be client-side to use Zustand

import React from "react";
import UserAvatar from "../UserAvatar";
import UsernameEditButton from "./UsernameEditButton";
import { useAuthStore } from "@/store/authStore"; // Get user data from Zustand
import { Circle } from "lucide-react";

export default function UserMetaCard() {
  const user = useAuthStore((state) => state.user);
  const profile = useAuthStore((state) => state.profile); // Get real-time profile updates

  if (!user) return null; // If not logged in, return nothing

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <UserAvatar
            userId={user.id}
            className="h-24 w-24"
            showDeleteButton={true}
            allowUpload={true}
          />

          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left flex items-center gap-2">
              {profile?.username || "Username not set"}
              {profile?.online_status ? (
                <Circle
                  className="text-green-500"
                  fill="currentColor"
                  size={16}
                />
              ) : (
                <Circle
                  className="text-red-500"
                  fill="currentColor"
                  size={16}
                />
              )}
            </h4>
          </div>
          <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
            <UsernameEditButton />
          </div>
        </div>
      </div>
    </div>
  );
}
