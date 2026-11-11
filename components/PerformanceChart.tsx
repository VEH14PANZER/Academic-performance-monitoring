import React from "react";
import { MoreHorizontalIcon } from "./Icons";

export default function PerformanceChart() {
  const data = [
    { section: "CS101-A", midterm: 88, final: 91 },
    { section: "CS202-B", midterm: 84, final: 87 },
    { section: "DB301-A", midterm: 96, final: 98 },
    { section: "MATH101", midterm: 81, final: 83 },
    { section: "WEB302", midterm: 90, final: 92 },
  ];

  const maxScore = 100;

  return (
    <div className="bg-white rounded-2xl p-4 h-full shadow-sm border border-gray-100 flex flex-col justify-between">
      {/* TITLE & LEGEND */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-base font-semibold text-gray-800">Grade Performance</h1>
          <p className="text-xs text-gray-400">Class Section Averages (Midterm vs Final)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FAE27C] rounded-full" />
            <span className="text-xs text-gray-500">Midterm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#C3EBFA] rounded-full" />
            <span className="text-xs text-gray-500">Final</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreHorizontalIcon size={18} />
          </button>
        </div>
      </div>

      {/* BAR CHART DISPLAY */}
      <div className="h-[220px] flex items-end justify-around gap-2 pt-6 pb-2 border-b border-gray-100">
        {data.map((item) => {
          const midHeight = (item.midterm / maxScore) * 160;
          const finHeight = (item.final / maxScore) * 160;

          return (
            <div key={item.section} className="flex flex-col items-center gap-2 flex-1 max-w-[60px]">
              <div className="flex items-end gap-1.5 h-[160px]">
                {/* Midterm Bar */}
                <div
                  style={{ height: `${midHeight}px` }}
                  className="w-3 md:w-4 bg-[#FAE27C] rounded-t-md hover:opacity-85 transition relative group"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {item.midterm}%
                  </span>
                </div>
                {/* Final Bar */}
                <div
                  style={{ height: `${finHeight}px` }}
                  className="w-3 md:w-4 bg-[#C3EBFA] rounded-t-md hover:opacity-85 transition relative group"
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {item.final}%
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-medium text-gray-500 truncate w-full text-center">
                {item.section}
              </span>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="text-right pt-2 text-[11px] text-gray-400">
        Scale: 0 - 100% Academic Grading
      </div>
    </div>
  );
}

