import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";
import { SchoolIcon } from "@/components/Icons";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="h-screen flex overflow-hidden bg-[#F7F8FA]">
      {/* LEFT SIDEBAR */}
      <div className="w-[14%] md:w-[8%] lg:w-[18%] xl:w-[15%] p-4 bg-white border-r border-gray-100 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* LOGO */}
          <Link
            href="/admin"
            className="flex items-center justify-center lg:justify-start gap-2.5 px-2 py-1"
          >
            <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <SchoolIcon size={20} />
            </div>
            <span className="hidden lg:block font-extrabold text-base tracking-tight text-gray-800">
              Academic<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          {/* MENU ITEMS */}
          <Menu role={user?.roleName} />
        </div>

        {/* BOTTOM BRAND FOOTER */}
        <div className="hidden lg:block p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
          <p className="text-[11px] font-semibold text-blue-900">PostgreSQL + Next.js</p>
          <p className="text-[10px] text-blue-600">Role-Based Dashboard</p>
        </div>
      </div>

      {/* RIGHT MAIN AREA */}
      <div className="w-[86%] md:w-[92%] lg:w-[82%] xl:w-[85%] bg-[#F7F8FA] overflow-y-auto flex flex-col">
        <Navbar />
        <div className="p-4 md:p-6 flex-1">{children}</div>
      </div>
    </div>
  );
}