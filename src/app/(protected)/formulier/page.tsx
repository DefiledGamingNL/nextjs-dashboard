import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FormApplication from "@/components/form/forms/application";
import { Metadata } from "next";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import VacatureForm from "@/components/form/VacatureForm";
import { GET_USER_PROFILE } from "@/utils/supabase/getUserProfile";
import ComponentCard from "@/components/common/ComponentCard";

export const metadata: Metadata = {
  title: "Vacature genereren",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default async function FormLayout() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const user = await GET_USER_PROFILE();

  return (
    <ComponentCard title="Genereer een vacature">
      <PageBreadcrumb pageTitle="Genereer een vacature" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-5 sm:space-y-6">
          {/* <FormApplication /> */}
          <VacatureForm user={user?.user?.full_name} />
        </div>
      </div>
    </ComponentCard>
  );
}
