import React from "react";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Pagination from "@/components/Pagination";
import FormModal from "@/components/FormModal";
import RowActions from "@/components/RowActions";
import JoinSectionButton from "@/components/JoinSectionButton";
import { FilterIcon, ArrowUpDownIcon } from "@/components/Icons";
import { getSections, getEnrolledSectionIds, getCourses, getTeachers } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { hasEditPermission } from "@/lib/permissions";

const columns = [
  { header: "Section Name", accessor: "section_name" },
  { header: "Course", accessor: "course_name" },
  { header: "Teacher / Faculty", accessor: "teacher_name", className: "hidden md:table-cell" },
  { header: "Academic Term", accessor: "term_name", className: "hidden lg:table-cell" },
  { header: "Enrolled", accessor: "student_count", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

export default async function SectionsListPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const data = await getSections(search);
  const currentPage = page ? parseInt(page) : 1;

  const currentUser = await getCurrentUser();
  const canEdit = hasEditPermission(currentUser?.roleName, "section");
  const isStudent = currentUser?.roleName?.toLowerCase() === "student";

  // Only fetch enrollment status if we actually need it — avoids an
  // unnecessary query for Admins/Teachers who don't see the Join button.
  const enrolledSectionIds = isStudent && currentUser?.profileId
    ? await getEnrolledSectionIds(currentUser.profileId as string)
    : [];

  // Only Admins actually see the Create/Update form, so only fetch the
  // dropdown data when it's actually going to be used.
  const [courses, teachers] = canEdit
    ? await Promise.all([getCourses(), getTeachers()])
    : [[], []];
  const formOptions = { courses, teachers };

  const renderRow = (item: any) => (
    <tr
      key={item.section_id}
      className="border-b border-gray-100 even:bg-slate-50 text-xs hover:bg-[#F1F0FF]/40 transition"
    >
      <td className="py-3 px-3 font-semibold text-gray-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          {item.section_name}
        </div>
      </td>
      <td className="py-3 px-3">
        <span className="font-mono text-xs font-bold text-sky-800 bg-[#C3EBFA]/50 px-2 py-0.5 rounded">
          {item.course_id}
        </span>{" "}
        <span className="text-gray-600 hidden sm:inline ml-1">{item.course_name}</span>
      </td>
      <td className="hidden md:table-cell py-3 px-3 text-gray-700 font-medium">
        {item.teacher_name}
      </td>
      <td className="hidden lg:table-cell py-3 px-3 text-gray-500">{item.term_name}</td>
      <td className="hidden md:table-cell py-3 px-3">
        <span className="bg-[#FAE27C]/60 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
          {item.student_count || 0} students
        </span>
      </td>
      <td className="py-3 px-3">
        {isStudent ? (
          <JoinSectionButton
            sectionId={item.section_id}
            initiallyEnrolled={enrolledSectionIds.includes(item.section_id)}
          />
        ) : (
          <RowActions
            table="section"
            canEdit={canEdit}
            updateData={item}
            deleteId={item.section_id}
            formOptions={formOptions}
          />
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-2xl flex-1 m-0 shadow-sm border border-gray-100">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-800">Class Sections</h1>
          <p className="text-xs text-gray-400">Total Sections: {data.length} scheduled</p>
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
            {canEdit && <FormModal table="section" type="create" courses={courses} teachers={teachers} />}
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