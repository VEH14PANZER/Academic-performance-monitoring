"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  GraduationCapIcon,
  BookOpenIcon,
  CalendarIcon,
  AwardIcon,
  MapPinIcon,
  ShieldIcon,
  UserIcon,
  LogOutIcon,
  SchoolIcon,
} from "./Icons";

const menuItems = [
  {
    title: "MENU",
    items: [
      { icon: HomeIcon, label: "Admin Dashboard", href: "/admin", roles: ["admin"] },
      { icon: HomeIcon, label: "Teacher View", href: "/teacher", roles: ["admin", "teacher"] },
      { icon: HomeIcon, label: "Student View", href: "/student", roles: ["admin", "student"] },
      { icon: UsersIcon, label: "Teachers", href: "/list/teachers", roles: ["admin", "teacher"] },
      { icon: GraduationCapIcon, label: "Students", href: "/list/students", roles: ["admin", "teacher"] },
      { icon: SchoolIcon, label: "Class Sections", href: "/list/sections", roles: ["admin", "teacher", "student"] },
      { icon: BookOpenIcon, label: "Courses", href: "/list/courses", roles: ["admin", "teacher", "student"] },
      { icon: CalendarIcon, label: "Academic Terms", href: "/list/terms", roles: ["admin", "teacher"] },
      { icon: AwardIcon, label: "Performance", href: "/list/performance", roles: ["admin", "teacher", "student"] },
      { icon: MapPinIcon, label: "Campuses & Loc", href: "/list/campuses", roles: ["admin"] },
    ],
  },
  {
    title: "SECURITY & RBAC",
    items: [
      { icon: UserIcon, label: "User Accounts", href: "/list/users", roles: ["admin"] },
      { icon: ShieldIcon, label: "Roles & Permissions", href: "/list/roles", roles: ["admin"] },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { icon: UserIcon, label: "My Profile", href: "/profile", roles: ["admin", "teacher", "student"] },
      { icon: LogOutIcon, label: "Switch / Login", href: "/login", roles: ["admin", "teacher", "student"] },
    ],
  },
];

export default function Menu({ role }: { role?: string }) {
  const pathname = usePathname();
  // Default to the most restrictive role if none was passed in, rather
  // than silently showing the admin menu to everyone.
  const normalizedRole = (role || "student").toLowerCase();

  return (
    <div className="mt-4 text-sm px-2">
      {menuItems.map((section) => {
        const visibleItems = section.items.filter((item) =>
          item.roles.includes(normalizedRole)
        );

        if (visibleItems.length === 0) return null;

        return (
        <div className="flex flex-col gap-1 mb-4" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-bold text-[11px] tracking-wider my-2 px-3">
            {section.title}
          </span>
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                href={item.href}
                key={item.label}
                className={`flex items-center justify-center lg:justify-start gap-4 text-gray-600 py-2.5 px-3 rounded-xl transition duration-150 ${
                  isActive
                    ? "bg-[#EDF9FD] text-[#0084B4] font-semibold"
                    : "hover:bg-[#F1F0FF] hover:text-blue-600"
                }`}
                title={item.label}
              >
                <IconComponent size={18} className={isActive ? "text-[#0084B4]" : "text-gray-500"} />
                <span className="hidden lg:block text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
        );
      })}
    </div>
  );
}