import React from "react";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import FormModal from "@/components/FormModal";
import { ShieldIcon, UserIcon } from "@/components/Icons";
import { getUsers } from "@/lib/data";

const columns = [
  { header: "User", accessor: "username" },
  { header: "Email Address", accessor: "email" },
  { header: "System Role", accessor: "role_name" },
  { header: "Account Status", accessor: "is_active" },
  { header: "Last Login", accessor: "last_login_at", className: "hidden md:table-cell" },
  { header: "Created At", accessor: "created_at", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

export default async function UsersListPage() {
  const data = await getUsers();

  const renderRow = (item: any) => (
    <tr
      key={item.user_id}
      className="border-b border-gray-100 even:bg-slate-50 text-xs hover:bg-[#F1F0FF]/40 transition"
    >
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
            <UserIcon size={14} />
          </div>
          <span className="font-bold text-gray-800">{item.username}</span>
        </div>
      </td>
      <td className="py-3 px-3 text-gray-600">{item.email}</td>
      <td className="py-3 px-3">
        <span
          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
            item.role_name === "Admin"
              ? "bg-[#CFCEFF] text-purple-950"
              : item.role_name === "Teacher"
              ? "bg-[#FAE27C] text-amber-950"
              : "bg-[#C3EBFA] text-sky-950"
          }`}
        >
          {item.role_name || `Role #${item.role_id}`}
        </span>
      </td>
      <td className="py-3 px-3">
        {item.is_active ? (
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            Active
          </span>
        ) : (
          <span className="text-[10px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            Suspended
          </span>
        )}
      </td>
      <td className="hidden md:table-cell py-3 px-3 font-mono text-gray-500 text-[11px]">
        {item.last_login_at || "Never"}
      </td>
      <td className="hidden lg:table-cell py-3 px-3 font-mono text-gray-500 text-[11px]">
        {item.created_at}
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <FormModal table="user" type="update" data={item} />
          <FormModal table="user" type="delete" id={item.user_id} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-2xl flex-1 m-0 shadow-sm border border-gray-100">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <ShieldIcon size={20} className="text-purple-600" />
            Security & User Authentication (RBAC)
          </h1>
          <p className="text-xs text-gray-400">Total System Users: {data.length} accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <FormModal table="user" type="create" />
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination count={data.length} page={1} />
    </div>
  );
}
