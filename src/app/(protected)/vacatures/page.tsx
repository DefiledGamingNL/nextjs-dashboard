import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VacatureTable from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
export const metadata: Metadata = {
  title: "Vacature Overzicht",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default async function BasicTables() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Vacature overzicht" />
      <div className="space-y-6">
        <ComponentCard title="Een overzicht van alle vacatures">
          <VacatureTable />
        </ComponentCard>
      </div>
    </div>
  );
}
