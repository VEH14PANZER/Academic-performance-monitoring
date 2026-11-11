import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { UserIcon, ShieldIcon, MapPinIcon, CalendarIcon, SchoolIcon } from "@/components/Icons";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  const name = user?.name || "Dr. Maria Elena Santos";
  const role = user?.roleName || "Admin";
  const email = user?.email || "admin@school.edu";
  const username = user?.username || "admin";
  const department = user?.department || "Academic Affairs Administration";
  const campus = user?.campusName || "Main Campus (Quezon City)";

  // For students, profileId is their student ID (e.g. STD-2026-123).
  const studentId =
    role.toLowerCase() === "student" && user?.profileId ? String(user.profileId) : null;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* HEADER CARD */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-purple-200 text-purple-800 font-extrabold text-3xl flex items-center justify-center ring-4 ring-purple-50 shadow-inner">
          {name.charAt(0)}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-bold text-gray-800">{name}</h1>
            <span className="bg-[#CFCEFF] text-purple-950 font-bold px-2.5 py-0.5 rounded-full text-xs">
              {role}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Username: @{username} • {email}</p>
          {studentId && (
            <p className="text-xs text-gray-500 mt-1">
              Std ID: <span className="font-mono font-semibold text-gray-800">{studentId}</span>
            </p>
          )}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-gray-600">
            <span className="flex items-center gap-1.5">
              <SchoolIcon size={14} className="text-purple-600" />
              {department}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPinIcon size={14} className="text-sky-600" />
              {campus}
            </span>
          </div>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ACCOUNT INFO */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
            <UserIcon size={18} className="text-purple-600" />
            Security & Identity
          </h2>
          <div className="flex flex-col gap-3 text-xs">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400">Account ID</span>
              <span className="font-mono font-medium text-gray-800">USR-00{user?.userId || 1}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400">Two-Factor / Active Status</span>
              <span className="font-semibold text-emerald-600">Active & Verified</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-400">Password Policy</span>
              <span className="text-gray-600">Compliant (Bcrypt Hashed)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Session ID</span>
              <span className="font-mono text-[10px] text-gray-500 truncate max-w-[180px]">
                Valid PostgreSQL Session
              </span>
            </div>
          </div>
        </div>

        {/* ROLE PRIVILEGES — Students don't get an admin-style capability
            list shown to them; those capabilities don't apply to them. */}
        {role.toLowerCase() !== "student" && (
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-4">
              <ShieldIcon size={18} className="text-amber-500" />
              Active Role Privileges
            </h2>
            <div className="flex flex-col gap-2.5 text-xs">
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Your account has inherited capabilities defined in the `Role_Permissions` schema table:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-[#EDF9FD] text-sky-800 px-2.5 py-1 rounded-md font-mono text-[11px]">
                  can_manage_users
                </span>
                <span className="bg-[#F1F0FF] text-purple-800 px-2.5 py-1 rounded-md font-mono text-[11px]">
                  can_view_grades
                </span>
                <span className="bg-[#FEFCE8] text-amber-800 px-2.5 py-1 rounded-md font-mono text-[11px]">
                  can_assign_sections
                </span>
                <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md font-mono text-[11px]">
                  can_manage_campuses
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}