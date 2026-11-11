import React from "react";
import { MoreHorizontalIcon, UserIcon } from "./Icons";

interface CountChartProps {
  boys: number;
  girls: number;
}

export default function CountChart({ boys = 3, girls = 3 }: CountChartProps) {
  const total = boys + girls || 1;
  const boysPct = Math.round((boys / total) * 100);
  const girlsPct = 100 - boysPct;

  // SVG donut calculation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const boysStroke = (circumference * boysPct) / 100;
  const girlsStroke = circumference - boysStroke;

  return (
    <div className="bg-white rounded-2xl w-full h-full p-4 shadow-sm border border-gray-100 flex flex-col justify-between">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-base font-semibold text-gray-800">Student Demographics</h1>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontalIcon size={18} />
        </button>
      </div>

      {/* DONUT CHART */}
      <div className="relative w-full h-[200px] flex items-center justify-center">
        <svg className="w-48 h-48 transform -rotate-90">
          {/* Girls Circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#FAE27C"
            strokeWidth="20"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={0}
          />
          {/* Boys Circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="#C3EBFA"
            strokeWidth="20"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - boysStroke}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Icon */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <UserIcon size={28} className="text-gray-500" />
          <span className="text-xs font-bold text-gray-700 mt-1">{total} Total</span>
        </div>
      </div>

      {/* BOTTOM LEGEND */}
      <div className="flex justify-center gap-12 pt-2 border-t border-gray-50">
        <div className="flex flex-col items-center gap-1">
          <div className="w-4 h-4 bg-[#C3EBFA] rounded-full" />
          <h1 className="font-bold text-sm text-gray-800">{boys}</h1>
          <h2 className="text-[11px] text-gray-400">Boys ({boysPct}%)</h2>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-4 h-4 bg-[#FAE27C] rounded-full" />
          <h1 className="font-bold text-sm text-gray-800">{girls}</h1>
          <h2 className="text-[11px] text-gray-400">Girls ({girlsPct}%)</h2>
        </div>
      </div>
    </div>
  );
}

