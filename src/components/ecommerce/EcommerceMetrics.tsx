"use client";
import React, { useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { createClient } from "@/utils/supabase/client";

export const EcommerceMetrics = () => {
  const [vacancies, setVacancies] = React.useState([
    {
      title: "",
      description: "",
      location: "",
      payment: "",
    },
  ]);
  const [users, setUsers] = React.useState([
    {
      id: "",
      username: "",
      email: "",
      role: "",
    },
  ]);

  useEffect(() => {
    async function getVacancies() {
      const supabase = await createClient();
      const { data, error } = await supabase.from("vacancies").select("*");
      if (error) {
        console.error(error);
      }
      console.log(data);

      setVacancies(data || []);
    }
    getVacancies();
  }, []);

  useEffect(() => {
    async function getUsers() {
      const supabase = await createClient();
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error(error);
      }
      console.log(data);

      setUsers(data || []);
    }
    getUsers();
  }, []);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Users
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {users?.length}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Vacancies
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {vacancies?.length}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
