import React from "react";
import { UsersIcon } from "./Icons";

interface EnrolledStudent {
  student_id: string;
  name: string;
  year_level: string;
  sections: string[];
}

export default function EnrolledStudentsList({ students }: { students: EnrolledStudent[] }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
            <UsersIcon size={18} className="text-blue-600" />
            Enrolled Students
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {students.length} {students.length === 1 ? "student has" : "students have"} joined at least one section
          </p>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto max-h-[340px]">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-white">
            <tr className="text-gray-400 text-[11px] border-b border-gray-100 font-semibold">
              <th className="py-2 px-2">Student ID</th>
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Year</th>
              <th className="py-2 px-2">Section(s)</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((s) => (
                <tr
                  key={s.student_id}
                  className="border-b border-gray-50 text-xs text-gray-700 align-top hover:bg-[#F1F0FF]/40 transition"
                >
                  <td className="py-2.5 px-2 font-mono text-[11px] text-gray-600">{s.student_id}</td>
                  <td className="py-2.5 px-2 font-semibold text-gray-800">{s.name}</td>
                  <td className="py-2.5 px-2">{s.year_level}</td>
                  <td className="py-2.5 px-2">
                    <div className="flex flex-wrap gap-1">
                      {s.sections.map((sec) => (
                        <span
                          key={sec}
                          className="text-[10px] bg-[#EDF9FD] text-sky-900 px-1.5 py-0.5 rounded-md font-medium"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-xs text-gray-400">
                  No enrolled students yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}