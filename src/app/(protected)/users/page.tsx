import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import UsersTable from "@/components/tables/UsersTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { isLoggedIn } from "@/utils/supabase/loggedIn";

async function UsersPage() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    const profiles = await loggedIn.profiles;
    return (
      <ComponentCard title="Users">
        <PageBreadcrumb pageTitle="All users" />
        <UsersTable profiles={profiles} />
      </ComponentCard>
    );
  }
}

export default UsersPage;
