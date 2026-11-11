import React from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import FormModal from "@/components/FormModal";
import RowActions from "@/components/RowActions";
import { FilterIcon, ArrowUpDownIcon } from "@/components/Icons";
import { getCourses } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { hasEditPermission } from "@/lib/permissions";

const columns = [
  { header: "Course Code", accessor: "course_id" },
  { header: "Course Title", accessor: "course_name" },
  { header: "Units / Credits", accessor: "units" },
  { header: "Actions", accessor: "action" },
];

export default async function CoursesListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const data = await getCourses(search);
  const currentPage = page ? parseInt(page) : 1;

  const currentUser = await getCurrentUser();
  const canEdit = hasEditPermission(currentUser?.roleName, "course");

  const renderRow = (item: any) => (
    <tr
      key={item.course_id}
      className="border-b border-gray-100 even:bg-slate-50 text-xs hover:bg-[#F1F0FF]/40 transition"
    >
      <td className="py-3 px-3 font-mono font-bold text-purple-700">
        <span className="bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
          {item.course_id}
        </span>
      </td>
      <td className="py-3 px-3 font-semibold text-gray-800">{item.course_name}</td>
      <td className="py-3 px-3">
        <span className="bg-[#FAE27C]/60 text-amber-950 font-bold px-2 py-0.5 rounded text-[11px]">
          {item.units} Units
        </span>
      </td>
      <td className="py-3 px-3">
        <RowActions table="course" canEdit={canEdit} updateData={item} deleteId={item.course_id} />
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-2xl flex-1 m-0 shadow-sm border border-gray-100">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-800">Academic Courses</h1>
          <p className="text-xs text-gray-400">Total Curriculum: {data.length} registered courses</p>
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
            {canEdit && <FormModal table="course" type="create" />}
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