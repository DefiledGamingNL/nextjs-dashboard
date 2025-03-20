import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import VacatureForm from "@/components/form/VacatureForm";
import ComponentCard from "@/components/common/ComponentCard";
import { isLoggedIn } from "@/utils/supabase/loggedIn";

export const metadata: Metadata = {
  title: "Vacature genereren",
  description:
    "This is Next.js Form Layout page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default async function FormLayout() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    const user = await loggedIn.user;
    return (
      <ComponentCard title="Genereer een vacature">
        <PageBreadcrumb pageTitle="Genereer een vacature" />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-5 sm:space-y-6">
            {/* <FormApplication /> */}
            <VacatureForm user={user?.full_name} />
          </div>
        </div>
      </ComponentCard>
    );
  }
}
