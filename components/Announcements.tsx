import React from "react";

export default function Announcements() {
  const announcements = [
    {
      id: 1,
      title: "New Semester Grading System Update",
      date: "2026-11-01",
      description: "Midterm and final grade submissions for 2025-2026 Term 1 are now open via the Performance portal.",
      bg: "bg-[#EDF9FD]",
    },
    {
      id: 2,
      title: "Campus Security & Access Control",
      date: "2026-10-28",
      description: "All registered students and faculty must scan their biometric or campus IDs at the main gate.",
      bg: "bg-[#F1F0FF]",
    },
    {
      id: 3,
      title: "Database Server Maintenance Scheduled",
      date: "2026-10-25",
      description: "Routine PostgreSQL backup and optimization window on Sunday from 1:00 AM to 3:00 AM UTC.",
      bg: "bg-[#FEFCE8]",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-sm font-semibold text-gray-800">Announcements</h1>
        <span className="text-xs text-gray-400 hover:text-purple-600 cursor-pointer font-medium">
          View All
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {announcements.map((item) => (
          <div key={item.id} className={`${item.bg} rounded-xl p-3`}>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-xs text-gray-800">{item.title}</h2>
              <span className="text-[10px] text-gray-500 bg-white px-1.5 py-0.5 rounded-md font-medium">
                {item.date}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

