import React from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import FormModal from "@/components/FormModal";
import RowActions from "@/components/RowActions";
import { FilterIcon, ArrowUpDownIcon } from "@/components/Icons";
import { getPerformances, getPerformancesForStudent, getEnrollmentOptions } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { hasEditPermission } from "@/lib/permissions";

const columns = [
  { header: "Student", accessor: "student_name" },
  { header: "Course & Section", accessor: "section_name" },
  { header: "Midterm Grade", accessor: "midterm_grade" },
  { header: "Final Grade", accessor: "final_grade" },
  { header: "Remarks", accessor: "remarks" },
  { header: "Actions", accessor: "action" },
];

export default async function PerformanceListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;

  const currentUser = await getCurrentUser();
  const canEdit = hasEditPermission(currentUser?.roleName, "performance");
  const isStudent = currentUser?.roleName?.toLowerCase() === "student";

  // Students only ever see their own grade records — never the whole
  // school's. Admins and Teachers still see everyone's.
  const data = isStudent && currentUser?.profileId
    ? await getPerformancesForStudent(currentUser.profileId as string, search)
    : await getPerformances(search);

  // Only Admins/Teachers see the Create/Update form, so only fetch the
  // Student dropdown data when it's actually going to be used.
  const enrollments = canEdit ? await getEnrollmentOptions() : [];
  const formOptions = { enrollments };

  const renderRow = (item: any) => (
    <tr
      key={item.performance_id}
      className="border-b border-gray-100 even:bg-slate-50 text-xs hover:bg-[#F1F0FF]/40 transition"
    >
      <td className="py-3 px-3">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{item.student_name}</span>
          <span className="text-[10px] font-mono text-gray-400">{item.student_id}</span>
        </div>
      </td>
      <td className="py-3 px-3">
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">{item.section_name}</span>
          <span className="text-[10px] text-gray-400">{item.course_name}</span>
        </div>
      </td>
      <td className="py-3 px-3">
        <span className="font-bold text-amber-800 bg-[#FAE27C]/50 px-2 py-0.5 rounded text-[11px]">
          {item.midterm_grade !== null ? `${item.midterm_grade}%` : "Pending"}
        </span>
      </td>
      <td className="py-3 px-3">
        <span className="font-bold text-sky-900 bg-[#C3EBFA] px-2 py-0.5 rounded text-[11px]">
          {item.final_grade !== null ? `${item.final_grade}%` : "Pending"}
        </span>
      </td>
      <td className="py-3 px-3">
        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
          {item.remarks || "Enrolled"}
        </span>
      </td>
      <td className="py-3 px-3">
        <RowActions
          table="performance"
          canEdit={canEdit}
          updateData={item}
          deleteId={item.performance_id}
          formOptions={formOptions}
        />
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-2xl flex-1 m-0 shadow-sm border border-gray-100">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-800">
            {isStudent ? "My Academic Performance & Grades" : "Academic Performance & Grades"}
          </h1>
          <p className="text-xs text-gray-400">
            {isStudent
              ? `${data.length} grade ${data.length === 1 ? "entry" : "entries"} on record`
              : `Total Records: ${data.length} student grade entries`}
          </p>
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
            {canEdit && <FormModal table="performance" type="create" enrollments={enrollments} />}
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