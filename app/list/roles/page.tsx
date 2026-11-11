import React from "react";
import Table from "@/components/Table";
import { ShieldIcon, KeyIcon } from "@/components/Icons";
import { getRoles } from "@/lib/data";

const columns = [
  { header: "Role ID", accessor: "role_id" },
  { header: "Role Name", accessor: "role_name" },
  { header: "Description", accessor: "description" },
  { header: "Standard Capabilities", accessor: "capabilities" },
];

export default async function RolesListPage() {
  const roles = await getRoles();

  const renderRow = (item: any) => (
    <tr
      key={item.role_id}
      className="border-b border-gray-100 even:bg-slate-50 text-xs hover:bg-[#F1F0FF]/40 transition"
    >
      <td className="py-3 px-3 font-mono font-bold text-gray-500">#{item.role_id}</td>
      <td className="py-3 px-3">
        <span
          className={`px-3 py-1 rounded-full font-bold text-xs inline-flex items-center gap-1.5 ${
            item.role_name === "Admin"
              ? "bg-[#CFCEFF] text-purple-950"
              : item.role_name === "Teacher"
              ? "bg-[#FAE27C] text-amber-950"
              : "bg-[#C3EBFA] text-sky-950"
          }`}
        >
          <ShieldIcon size={14} />
          {item.role_name}
        </span>
      </td>
      <td className="py-3 px-3 text-gray-700 font-medium">{item.description}</td>
      <td className="py-3 px-3">
        <div className="flex flex-wrap gap-1">
          {item.role_name === "Admin" && (
            <>
              <span className="bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded font-mono">manage_users</span>
              <span className="bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded font-mono">manage_campuses</span>
              <span className="bg-purple-50 text-purple-700 text-[10px] px-2 py-0.5 rounded font-mono">assign_roles</span>
            </>
          )}
          {item.role_name === "Teacher" && (
            <>
              <span className="bg-amber-50 text-amber-800 text-[10px] px-2 py-0.5 rounded font-mono">encode_grades</span>
              <span className="bg-amber-50 text-amber-800 text-[10px] px-2 py-0.5 rounded font-mono">view_roster</span>
            </>
          )}
          {item.role_name === "Student" && (
            <>
              <span className="bg-sky-50 text-sky-800 text-[10px] px-2 py-0.5 rounded font-mono">view_grades</span>
              <span className="bg-sky-50 text-sky-800 text-[10px] px-2 py-0.5 rounded font-mono">view_sections</span>
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-2xl flex-1 m-0 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <KeyIcon size={20} className="text-amber-500" />
            Roles & Granular Permissions
          </h1>
          <p className="text-xs text-gray-400">Database Role-Based Access Control Definitions</p>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={roles} />
    </div>
  );
}
