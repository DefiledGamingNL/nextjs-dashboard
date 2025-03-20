import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import UserAvatar from "../UserAvatar";

interface Profiles {
  id: string;
  full_name: string;
  position: string;
  role: string;
}

export default function UsersTable({ profiles }: { profiles: Profiles[] }) {
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
                  Avatar
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Full name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Position
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Role
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {profiles?.map((profile: Profiles) => {
                return (
                  <TableRow key={profile.id}>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            <UserAvatar
                              allowUpload={false}
                              className="w-16 h-16 object-cover"
                              userId={profile?.id}
                            />
                          </h3>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {profile?.full_name}
                          </h3>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {profile?.position}
                      </span>
                    </TableCell>

                    <TableCell className="px-5 py-3">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {profile?.role}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
