import React from "react";
import { MoreHorizontalIcon } from "./Icons";

const events = [
  {
    id: 1,
    title: "Midterm Examination Period",
    time: "10:00 AM - 2:00 PM",
    description: "Department-wide midterm examinations across all registered sections.",
  },
  {
    id: 2,
    title: "Faculty & Teacher Assembly",
    time: "02:00 PM - 4:30 PM",
    description: "Quarterly syllabus and academic performance review meeting.",
  },
  {
    id: 3,
    title: "Class Section Enlistment Deadline",
    time: "11:59 PM",
    description: "Last day for enrolled students to add or drop courses for 2025-2026 Term 1.",
  },
];

export default function EventCalendar() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-800">Academic Calendar</h2>
        <span className="text-xs text-purple-600 font-medium">November 2026</span>
      </div>

      {/* MINI CALENDAR GRID */}
      <div className="border border-gray-100 rounded-xl p-2.5 mb-4 bg-gray-50/50">
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-gray-400 mb-2">
          {days.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {dates.map((date) => {
            const isToday = date === 3;
            const hasEvent = date === 5 || date === 12 || date === 18;

            return (
              <div
                key={date}
                className={`py-1 rounded-full cursor-pointer transition ${
                  isToday
                    ? "bg-[#C3EBFA] text-sky-900 font-bold"
                    : hasEvent
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {date}
              </div>
            );
          })}
        </div>
      </div>

      {/* UPCOMING EVENTS LIST */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-sm font-semibold text-gray-800">Upcoming Schedule</h1>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontalIcon size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {events.map((event, index) => (
          <div
            className={`p-3 rounded-xl border border-gray-100 ${
              index === 0
                ? "border-t-4 border-t-[#C3EBFA]"
                : index === 1
                ? "border-t-4 border-t-[#CFCEFF]"
                : "border-t-4 border-t-[#FAE27C]"
            }`}
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-xs text-gray-700">{event.title}</h2>
              <span className="text-[10px] text-gray-400">{event.time}</span>
            </div>
            <p className="mt-1 text-[11px] text-gray-500 leading-relaxed line-clamp-2">
              {event.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

