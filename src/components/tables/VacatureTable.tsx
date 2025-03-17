import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import GET_VACANCIES from "@/utils/supabase/getVacancies";
import EditButton from "../ui/button/EditButton";
import DeleteButton from "./DeleteButton";

interface Vacancy {
  id: number;
  user_full_name: string;
  title: string;
  location: string;
  payment: string;
  description: string;
  created_at: Date;
}

export default async function VacatureTable() {
  const { vacancies } = await GET_VACANCIES();
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Vacancy Title
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Location
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Created At
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {vacancies.map((vacancy: Vacancy) => {
                return (
                  <>
                    <TableRow key={vacancy.id}>
                      <TableCell className="px-5 py-3">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              {vacancy.user_full_name}
                            </h3>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <div className="flex items-center space-x-3">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                              {vacancy.title}
                            </h3>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {vacancy.location}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-3">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {new Date(vacancy.created_at).toLocaleDateString(
                            "nl-NL",
                            { year: "numeric", month: "long", day: "numeric" }
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-3 flex items-center gap-3">
                        <EditButton vacancy={vacancy} />
                        <DeleteButton vacancy={vacancy} />
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
