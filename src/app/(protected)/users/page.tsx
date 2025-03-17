import React from "react";
import { isAuthenticated } from "@/utils/supabase/isAuthenticated";
import NotFound from "@/app/not-found";
import ComponentCard from "@/components/common/ComponentCard";
import UsersTable from "@/components/tables/UsersTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

async function UsersPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return NotFound;
  }

  return (
    <ComponentCard title="Users">
      <PageBreadcrumb pageTitle="All users" />
      <UsersTable />
    </ComponentCard>
  );
}

export default UsersPage;
