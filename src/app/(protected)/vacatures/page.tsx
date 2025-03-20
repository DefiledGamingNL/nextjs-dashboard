import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import VacatureTable from "@/components/tables/VacatureTable";
import { Metadata } from "next";
import React from "react";
import { isLoggedIn } from "@/utils/supabase/loggedIn";
import GET_VACANCIES from "@/utils/supabase/getVacancies";
export const metadata: Metadata = {
  title: "Vacature Overzicht",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default async function BasicTables() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    const { vacancies } = await GET_VACANCIES();
    const { user } = await loggedIn;
    return (
      <div>
        <PageBreadcrumb pageTitle="Vacature overzicht" />
        <div className="space-y-6">
          <ComponentCard title="Een overzicht van alle vacatures">
            <VacatureTable vacancies={vacancies} user={user} />
          </ComponentCard>
        </div>
      </div>
    );
  }
}
