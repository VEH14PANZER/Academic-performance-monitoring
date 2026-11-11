import React from "react";
import { SearchIcon, MessageSquareIcon, BellIcon, LogOutIcon } from "./Icons";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/actions";

export default async function Navbar() {
  const user = await getCurrentUser();

  const displayName = user?.name || "Academic User";
  const displayRole = user?.roleName || "Guest";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
      {/* SEARCH BAR */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 py-1.5 w-[220px]">
        <SearchIcon size={14} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* ICONS AND USER */}
      <div className="flex items-center gap-5 justify-end w-full">
        {/* Messages */}
        <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
          <MessageSquareIcon size={16} className="text-gray-600" />
        </div>

        {/* Announcements / Notifications */}
        <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer relative hover:bg-gray-200 transition">
          <BellIcon size={16} className="text-gray-600" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
            2
          </div>
        </div>

        {/* User Badge */}
        <div className="flex flex-col text-right">
          <span className="text-xs leading-3 font-semibold text-gray-800">{displayName}</span>
          <span className="text-[10px] text-gray-500 capitalize">{displayRole}</span>
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-blue-100">
          {initial}
        </div>

        {/* Real Logout Form Action */}
        <form action={logoutAction} className="inline-block ml-1">
          <button
            type="submit"
            title="Sign Out"
            className="text-gray-400 hover:text-red-500 transition p-1 rounded-md"
          >
            <LogOutIcon size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
