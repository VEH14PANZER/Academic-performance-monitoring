import React from "react";
import Table from "@/components/Table";
import Pagination from "@/components/Pagination";
import FormModal from "@/components/FormModal";
import { MapPinIcon } from "@/components/Icons";
import { getCampuses } from "@/lib/data";

const columns = [
  { header: "Campus ID", accessor: "campus_id" },
  { header: "Campus Name", accessor: "campus_name" },
  { header: "Street Address", accessor: "street_address" },
  { header: "City & Province", accessor: "city" },
  { header: "Postal Code", accessor: "postal_code" },
  { header: "Actions", accessor: "action" },
];

export default async function CampusesListPage() {
  const data = await getCampuses();

  const renderRow = (item: any) => (
    <tr
      key={item.campus_id}
      className="border-b border-gray-100 even:bg-slate-50 text-xs hover:bg-[#F1F0FF]/40 transition"
    >
      <td className="py-3 px-3 font-mono font-medium text-gray-500">#{item.campus_id}</td>
      <td className="py-3 px-3 font-bold text-gray-800 flex items-center gap-2">
        <MapPinIcon size={16} className="text-purple-600" />
        {item.campus_name}
      </td>
      <td className="py-3 px-3 text-gray-600">{item.address?.street_address || "N/A"}</td>
      <td className="py-3 px-3">
        <span className="bg-[#EDF9FD] text-sky-900 font-semibold px-2 py-0.5 rounded text-[11px]">
          {item.address?.city || "N/A"}, {item.address?.province_state || ""}
        </span>
      </td>
      <td className="py-3 px-3 font-mono text-gray-500">{item.address?.postal_code || "N/A"}</td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <FormModal table="campus" type="update" data={item} />
          <FormModal table="campus" type="delete" id={item.campus_id} />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-2xl flex-1 m-0 shadow-sm border border-gray-100">
      {/* TOP */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-800">Campuses & Geographic Locations</h1>
          <p className="text-xs text-gray-400">Total Facilities: {data.length} registered campuses</p>
        </div>
        <div className="flex items-center gap-2">
          <FormModal table="campus" type="create" />
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination count={data.length} page={1} />
    </div>
  );
}
