import React from "react";

interface Column {
  header: string;
  accessor: string;
  className?: string;
}

interface TableProps {
  columns: Column[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}

export default function Table({ columns, renderRow, data }: TableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full mt-4 text-left border-collapse">
        <thead>
          <tr className="text-gray-400 text-xs border-b border-gray-100 font-semibold">
            {columns.map((col) => (
              <th key={col.accessor} className={`py-3 px-3 ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item) => renderRow(item))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-xs text-gray-400">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

