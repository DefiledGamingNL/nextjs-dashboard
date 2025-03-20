import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import { Data } from "@/types";
import { isLoggedIn } from "@/utils/supabase/loggedIn";
import { Label } from "@radix-ui/react-label";
import React from "react";

async function SingleUserPage() {
  const loggedIn = await isLoggedIn();
  if (loggedIn) {
    const { data, user } = await loggedIn;
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
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Full name</Label>
                    <Input type="text" defaultValue={user?.full_name} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input type="email" defaultValue={data?.user?.email} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Position</Label>
                    <Input type="text" defaultValue={user?.position} />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone number</Label>
                    <Input type="text" defaultValue={user?.phone} />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </ComponentCard>
    );
  }
}

export default SingleUserPage;
