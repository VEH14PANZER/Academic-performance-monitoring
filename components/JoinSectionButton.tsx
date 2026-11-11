"use client";

import React, { useState, useTransition } from "react";
import { enrollInSectionAction, unenrollFromSectionAction } from "@/lib/actions";
import { CheckIcon, PlusIcon } from "./Icons";

export default function JoinSectionButton({
  sectionId,
  initiallyEnrolled,
}: {
  sectionId: number;
  initiallyEnrolled: boolean;
}) {
  const [enrolled, setEnrolled] = useState(initiallyEnrolled);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleClick = () => {
    setError("");
    startTransition(async () => {
      const action = enrolled ? unenrollFromSectionAction : enrollInSectionAction;
      const res = await action(sectionId);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setEnrolled((prev) => !prev);
    });
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={isPending}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition disabled:opacity-50 ${
          enrolled
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
        title={enrolled ? "Click to leave this section" : "Join this section"}
      >
        {isPending ? (
          "..."
        ) : enrolled ? (
          <>
            <CheckIcon size={12} /> Joined
          </>
        ) : (
          <>
            <PlusIcon size={12} /> Join
          </>
        )}
      </button>
      {error && <span className="text-[10px] text-red-600">{error}</span>}
    </div>
  );
}