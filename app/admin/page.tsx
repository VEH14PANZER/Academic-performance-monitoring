import React from "react";
import UserCard from "@/components/UserCard";
import CountChart from "@/components/CountChart";
import PerformanceChart from "@/components/PerformanceChart";
import EventCalendar from "@/components/EventCalendar";
import Announcements from "@/components/Announcements";
import { getDashboardStats } from "@/lib/data";

export default async function AdminPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col xl:flex-row gap-4">
      {/* LEFT COLUMN */}
      <div className="w-full xl:w-2/3 flex flex-col gap-6">
        {/* USER CARDS ROW */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Students" count={stats.studentCount} date="2025/26" bg="purple" href="/list/students" />
          <UserCard type="Enrolled Students" count={stats.enrolledStudentCount} date="Active" bg="emerald" href="/list/sections" />
          <UserCard type="Teachers" count={stats.teacherCount} date="2025/26" bg="yellow" href="/list/teachers" />
          <UserCard type="Sections" count={stats.sectionCount} date="Term 1" bg="sky" href="/list/sections" />
          <UserCard type="Campuses" count={stats.campusCount} date="Active" bg="purple" href="/list/campuses" />
        </div>

        {/* MIDDLE CHARTS ROW */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[420px]">
            <CountChart boys={stats.maleCount} girls={stats.femaleCount} />
          </div>

          {/* PERFORMANCE / ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[420px]">
            <PerformanceChart />
          </div>
        </div>

        {/* BOTTOM QUICK ACTIONS BANNER */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800">Security & RBAC Enforcement Active</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Role permissions and session tokens are strictly validated against the PostgreSQL schema.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">
              System Online
            </span>
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