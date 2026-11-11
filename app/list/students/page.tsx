import React from "react";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";
import EnrolledStudentsList from "@/components/EnrolledStudentsList";
import { getPerformances, getSectionsForStudent, getEnrolledStudentsList } from "@/lib/data";
import { getCurrentUser } from "@/lib/auth";
import { BookOpenIcon, AwardIcon } from "@/components/Icons";
import Link from "next/link";

export default async function StudentPage() {
  const currentUser = await getCurrentUser();
  const role = currentUser?.roleName?.toLowerCase();
  // The Students menu link is only shown to Admins and Teachers, so they
  // are the ones who get the roster of enrolled students.
  const canViewRoster = role === "admin" || role === "teacher";
  const enrolledStudents = canViewRoster ? await getEnrolledStudentsList() : [];

  const performances = await getPerformances();
  const studentGrades = performances.slice(0, 3);
  const sections = currentUser?.profileId
    ? await getSectionsForStudent(currentUser.profileId as string)
    : [];

  return (
    <div className="flex flex-col xl:flex-row gap-4">
      {/* LEFT COLUMN */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        {/* ACADEMIC PERFORMANCE SUMMARY */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <AwardIcon size={18} className="text-amber-500" />
              My Academic Grades & Performance
            </h2>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
              Good Standing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {studentGrades.map((grade) => (
              <div
                key={grade.performance_id}
                className="p-4 rounded-xl border border-gray-100 bg-[#EDF9FD] flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-sky-800 bg-white px-2 py-0.5 rounded shadow-2xs">
                    {grade.section_name}
                  </span>
                  <h3 className="font-bold text-xs text-gray-800 mt-2">{grade.course_name}</h3>
                </div>
                <div className="mt-4 pt-3 border-t border-sky-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-500 block">Midterm</span>
                    <span className="font-bold text-sm text-amber-600">{grade.midterm_grade}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">Final</span>
                    <span className="font-bold text-sm text-sky-700">{grade.final_grade}%</span>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-emerald-700 font-semibold text-center bg-white/80 py-1 rounded">
                  {grade.remarks}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ENROLLED STUDENTS (admin/teacher) / ENROLLED CLASS SECTIONS (others) */}
        {canViewRoster ? (
          <EnrolledStudentsList students={enrolledStudents} />
        ) : (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <BookOpenIcon size={18} className="text-purple-600" />
              Current Enrolled Sections
            </h2>
            <Link href="/list/sections" className="text-xs text-purple-600 font-semibold hover:underline">
              Browse & Join Sections &rarr;
            </Link>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xs text-gray-400 mb-3">You haven't joined any class sections yet.</p>
              <Link
                href="/list/sections"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Browse Sections
              </Link>
            </div>
          ) : (
          <div className="divide-y divide-gray-50">
            {sections.slice(0, 3).map((sec) => (
              <div key={sec.section_id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-800">{sec.section_name}</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded">
                      {sec.course_id}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{sec.course_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-gray-700 block">{sec.teacher_name}</span>
                  <span className="text-[10px] text-gray-400">Instructor</span>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  );
}