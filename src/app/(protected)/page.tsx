import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AccountForm from "@/app/(protected)/account/account-form";
import UserInfoCard from "@/components/user-profile/UserInfoCard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-12">
        <UserInfoCard />
        <EcommerceMetrics />
      </div>
    </div>
  );
}
