import React from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import FormModal from "@/components/FormModal";
import RowActions from "@/components/RowActions";
import { FilterIcon, ArrowUpDownIcon } from "@/components/Icons";
import { getTeachers } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { hasEditPermission } from "@/lib/permissions";

const columns = [
  { header: "Faculty Info", accessor: "info" },
  { header: "Teacher ID", accessor: "teacher_id", className: "hidden md:table-cell" },
  { header: "Sex", accessor: "sex", className: "hidden md:table-cell" },
  { header: "Contact", accessor: "contact_number", className: "hidden lg:table-cell" },
  { header: "Campus Affiliation", accessor: "campus_name", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

export default async function TeacherListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const data = await getTeachers(search);
  const currentPage = page ? parseInt(page) : 1;

  const currentUser = await getCurrentUser();
  const canEdit = hasEditPermission(currentUser?.roleName, "teacher");

  const renderRow = (item: any) => (
    <tr
      key={item.teacher_id}
      className="border-b border-gray-100 even:bg-slate-50 text-xs hover:bg-[#F1F0FF]/40 transition"
    >
      <td className="flex items-center gap-3 p-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
          {item.first_name[0]}
        </div>
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-800">{`Prof. ${item.first_name} ${item.last_name}`}</h3>
          <p className="text-[10px] text-gray-400">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell py-3 px-3 font-mono font-medium text-gray-600">
        {item.teacher_id}
      </td>
      <td className="hidden md:table-cell py-3 px-3 text-gray-600">{item.sex}</td>
      <td className="hidden lg:table-cell py-3 px-3 text-gray-600">{item.contact_number}</td>
      <td className="hidden lg:table-cell py-3 px-3 text-gray-600">
        <span className="bg-[#F1F0FF] text-purple-800 px-2 py-0.5 rounded-md font-medium text-[11px]">
          {item.campus_name}
        </span>
      </td>
      <td className="py-3 px-3">
        <RowActions table="teacher" canEdit={canEdit} updateData={item} deleteId={item.teacher_id} />
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-2xl flex-1 m-0 shadow-sm border border-gray-100">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-800">All Teachers & Faculty</h1>
          <p className="text-xs text-gray-400">Total Faculty: {data.length} registered</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] text-amber-950 hover:bg-amber-300 transition">
              <FilterIcon size={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FAE27C] text-amber-950 hover:bg-amber-300 transition">
              <ArrowUpDownIcon size={14} />
            </button>
            {canEdit && <FormModal table="teacher" type="create" />}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination count={data.length} page={currentPage} />
    </div>
  );
}