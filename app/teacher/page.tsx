import React from "react";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";
import { getSections, getPerformances, getEnrolledStudentCountForTeacher } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { SchoolIcon, UsersIcon, AwardIcon } from "@/components/Icons";

export default async function TeacherPage() {
  const currentUser = await getCurrentUser();
  const sections = await getSections();
  const performances = await getPerformances();
  const enrolledStudentCount = currentUser?.profileId
    ? await getEnrolledStudentCountForTeacher(currentUser.profileId as string)
    : 0;

  return (
    <div className="flex flex-col xl:flex-row gap-4">
      {/* LEFT COLUMN */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        {/* TEACHER HERO BANNER */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase bg-white/20 px-2.5 py-1 rounded-full">
              Teacher Faculty Portal
            </span>
            <h1 className="text-xl font-bold mt-2">Welcome Back, Faculty Member!</h1>
            <p className="text-xs text-purple-100 mt-1 max-w-md">
              Here are your assigned class sections, student rosters, and upcoming grade encoding windows for the current academic term.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center bg-white/15 px-4 py-2 rounded-xl">
              <span className="text-lg font-bold flex items-center gap-1.5">
                <UsersIcon size={16} />
                {enrolledStudentCount}
              </span>
              <span className="text-[10px] text-purple-100">Enrolled Students</span>
            </div>
            <Link
              href="/list/sections"
              className="bg-white text-purple-700 px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-purple-50 transition"
            >
              My Sections
            </Link>
          </div>
        </div>

        {/* ASSIGNED SECTIONS LIST */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <SchoolIcon size={18} className="text-purple-600" />
              Assigned Class Sections
            </h2>
            <Link href="/list/sections" className="text-xs text-purple-600 font-semibold hover:underline">
              View All Sections
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.slice(0, 4).map((sec) => (
              <div
                key={sec.section_id}
                className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-purple-50/30 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold bg-[#C3EBFA] text-sky-900 px-2 py-0.5 rounded-md">
                      {sec.course_id}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {sec.student_count || 25} Students
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-gray-800 mt-2">{sec.section_name}</h3>
                  <p className="text-[11px] text-gray-500">{sec.course_name}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                  <span>Term: {sec.term_name?.split("-")[0]}</span>
                  <Link
                    href={`/list/performance`}
                    className="text-purple-600 font-semibold hover:underline"
                  >
                    Encode Grades &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT GRADES SUBMITTED */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <AwardIcon size={18} className="text-amber-500" />
              Recent Student Grade Submissions
            </h2>
            <Link href="/list/performance" className="text-xs text-purple-600 font-semibold hover:underline">
              Grade Sheet
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="pb-2">Student</th>
                  <th className="pb-2">Course</th>
                  <th className="pb-2">Midterm</th>
                  <th className="pb-2">Final</th>
                  <th className="pb-2">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {performances.slice(0, 4).map((p) => (
                  <tr key={p.performance_id} className="hover:bg-gray-50/50">
                    <td className="py-2.5 font-semibold text-gray-800">{p.student_name}</td>
                    <td className="py-2.5 text-gray-500">{p.course_name}</td>
                    <td className="py-2.5 font-medium text-amber-700">{p.midterm_grade}%</td>
                    <td className="py-2.5 font-bold text-sky-700">{p.final_grade}%</td>
                    <td className="py-2.5 text-gray-500">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px]">
                        {p.remarks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}