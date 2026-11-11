"use client";

import React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SearchIcon } from "./Icons";

export default function TableSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-3 py-1.5 bg-white"
    >
      <SearchIcon size={14} className="text-gray-400" />
      <input
        name="search"
        defaultValue={searchParams.get("search") || ""}
        type="text"
        placeholder="Search..."
        className="w-[200px] bg-transparent outline-none text-gray-700 placeholder-gray-400"
      />
    </form>
  );
}

