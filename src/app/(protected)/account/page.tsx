import { Metadata } from "next";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};
export default async function Account() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <ComponentCard title="Profile">
      <PageBreadcrumb pageTitle="User profile" />
      <div className="space-y-6">
        <UserMetaCard />
        <UserInfoCard />
      </div>
    </ComponentCard>
  );
}
