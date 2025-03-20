import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import { isLoggedIn } from "@/utils/supabase/loggedIn";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Dashboard() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    return (
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-12">
          <UserInfoCard />
          <EcommerceMetrics />
        </div>
      </div>
    );
  }
}
