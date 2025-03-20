import { Metadata } from "next";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { isLoggedIn } from "@/utils/supabase/loggedIn";
import InfoCard from "@/components/user-profile/InfoCard";
import { Data } from "@/types";
import UserMetaCard from "@/components/user-profile/UserMetaCard";

export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};
export default async function Account() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    const { data, user } = await loggedIn;

    const email: Data = { email: data.user.email ?? null };
    return (
      <ComponentCard title="Profile">
        <PageBreadcrumb pageTitle="User profile" />
        <div className="space-y-6">
          <UserMetaCard />
          <InfoCard user={user} data={email} />
        </div>
      </ComponentCard>
    );
  }
}
