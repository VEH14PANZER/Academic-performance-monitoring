"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "./Icons";

export default function Pagination({
  page = 1,
  count = 10,
  pageSize = 10,
}: {
  page?: number;
  count?: number;
  pageSize?: number;
}) {
  const totalPages = Math.ceil(count / pageSize) || 1;

  return (
    <div className="p-4 flex items-center justify-between text-gray-500 text-xs border-t border-gray-100">
      <button
        disabled={page <= 1}
        className="py-1.5 px-3 rounded-md bg-gray-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
      >
        Prev
      </button>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageIndex = index + 1;
          const isActive = page === pageIndex;
          return (
            <button
              key={pageIndex}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                isActive ? "bg-[#C3EBFA] text-sky-900 font-bold" : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>
      <button
        disabled={page >= totalPages}
        className="py-1.5 px-3 rounded-md bg-gray-100 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
      >
        Next
      </button>
    </div>
  );
}

