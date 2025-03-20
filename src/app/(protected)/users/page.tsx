import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import UsersTable from "@/components/tables/UsersTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
function UsersPage() {
  return (
    <ComponentCard title="Users">
      <PageBreadcrumb pageTitle="All users" />
      <UsersTable />
    </ComponentCard>
  );
}

export default UsersPage;
