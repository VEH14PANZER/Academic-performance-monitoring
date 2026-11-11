"use client";

import React from "react";
import Link from "next/link";
import { MoreHorizontalIcon } from "./Icons";

interface UserCardProps {
  type: string;
  count: number | string;
  date?: string;
  bg?: "purple" | "yellow" | "sky" | "emerald";
  // Optional — when provided, the whole card becomes a link to that page.
  // Omit to keep a card purely informational (no navigation).
  href?: string;
}

export default function UserCard({
  type,
  count,
  date = "2025/26",
  bg = "purple",
  href,
}: UserCardProps) {
  const bgStyles = {
    purple: "bg-[#CFCEFF] text-purple-950",
    yellow: "bg-[#FAE27C] text-amber-950",
    sky: "bg-[#C3EBFA] text-sky-950",
    emerald: "bg-[#C8F4DE] text-emerald-950",
  }[bg];

  const cardContent = (
    <>
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-700 font-semibold shadow-xs">
          {date}
        </span>
        <button
          onClick={(e) => {
            // Stop the "..." button from triggering the card's own
            // navigation — it's reserved for a future options menu.
            e.preventDefault();
            e.stopPropagation();
          }}
          className="text-gray-600 hover:text-black"
        >
          <MoreHorizontalIcon size={16} />
        </button>
      </div>
      <h1 className="text-2xl font-bold my-3 text-gray-900">{count}</h1>
      <h2 className="capitalize text-xs font-medium text-gray-600">{type}</h2>
    </>
  );

  const cardClasses = `rounded-2xl ${bgStyles} p-4 flex-1 min-w-[130px] shadow-sm transition hover:shadow-md ${
    href ? "cursor-pointer hover:-translate-y-0.5" : ""
  }`;

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {cardContent}
      </Link>
    );
  }

  return <div className={cardClasses}>{cardContent}</div>;
}