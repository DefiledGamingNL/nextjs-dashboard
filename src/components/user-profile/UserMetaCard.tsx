import React from "react";
import UserAvatar from "../UserAvatar";
import UsernameEditButton from "./UsernameEditButton";
import { isLoggedIn } from "@/utils/supabase/loggedIn";

export default async function UserMetaCard() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    const { user } = await loggedIn;
    return (
      <>
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
              <UserAvatar
                userId={user?.id}
                className="h-24 w-24"
                showDeleteButton={true}
                allowUpload={true}
              />
              <div className="order-3 xl:order-2">
                <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                  {user?.username || "Username not set"}
                </h4>
              </div>
              <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
                <UsernameEditButton user={user} />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
