import ComponentCard from "@/components/common/ComponentCard";
import UpdateProfileForm from "@/components/form/UpdateProfileForm";
import { isLoggedIn } from "@/utils/supabase/loggedIn";
import { redirect } from "next/navigation";
import React from "react";

interface SingleUserPageProps {
  params: {
    id: string;
  };
}

async function SingleUserPage({ params }: SingleUserPageProps) {
  const { id } = await params;
  const loggedIn = await isLoggedIn();
  if (loggedIn) {
    const { data, user, isCurrentUser } = await loggedIn;

    if (isCurrentUser === id) {
      return (
        <ComponentCard title="Profile">
          <div className="no-scrollbar relative w-full  overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                Edit Personal Information
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                Update your details to keep your profile up-to-date.
              </p>
            </div>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>
                <UpdateProfileForm user={data.user} profile={user} />
              </div>
            </div>
          </div>
        </ComponentCard>
      );
    } else {
      redirect("/account");
    }
  }
}

export default SingleUserPage;
