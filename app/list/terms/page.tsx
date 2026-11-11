import React from "react";
import Table from "@/components/Table";
import { CalendarIcon } from "@/components/Icons";
import { getAcademicTerms } from "@/lib/data";

const columns = [
  { header: "Term ID", accessor: "term_id" },
  { header: "Academic Year", accessor: "academic_year" },
  { header: "Term Name", accessor: "term_name" },
  { header: "Status", accessor: "status" },
];

export default async function TermsListPage() {
  const terms = await getAcademicTerms();

  const renderRow = (item: any) => (
    <tr
      key={item.term_id}
      className="border-b border-gray-100 even:bg-slate-50 text-xs hover:bg-[#F1F0FF]/40 transition"
    >
      <td className="py-3 px-3 font-mono font-bold text-gray-500">#{item.term_id}</td>
      <td className="py-3 px-3 font-bold text-gray-800">{item.academic_year}</td>
      <td className="py-3 px-3 font-medium text-gray-700">{item.term_name}</td>
      <td className="py-3 px-3">
        {item.term_id === 1 ? (
          <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">
            Active Current Term
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded text-[10px]">
            Upcoming / Concluded
          </span>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-2xl flex-1 m-0 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <CalendarIcon size={20} className="text-purple-600" />
            Academic Terms & Semesters
          </h1>
          <p className="text-xs text-gray-400">Term Schedule & Semester Delimiters</p>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={terms} />
    </div>
  );
}
