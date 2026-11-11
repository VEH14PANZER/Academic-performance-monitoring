import React from "react";
import FormModal from "./FormModal";

interface RowActionsProps {
  table: "student" | "teacher" | "course" | "section" | "campus" | "user" | "performance";
  canEdit: boolean;
  updateData: any;
  deleteId: string | number;
  // Extra dropdown option lists some tables' forms need (e.g. Section
  // needs courses+teachers, Performance needs enrollments). Passed
  // straight through to FormModal, which ignores whatever it doesn't use.
  formOptions?: Record<string, any>;
}

/**
 * Renders the Update/Delete FormModal pair for a table row, or a quiet
 * "View only" label when the current user isn't allowed to edit this
 * resource. Replaces the canEdit ? (...) : (<span>View only</span>)
 * block that used to be copy-pasted into every list page's renderRow.
 */
export default function RowActions({ table, canEdit, updateData, deleteId, formOptions }: RowActionsProps) {
  if (!canEdit) {
    return <span className="text-[10px] text-gray-300">View only</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <FormModal table={table} type="update" data={updateData} {...formOptions} />
      <FormModal table={table} type="delete" id={deleteId} />
    </div>
  );
}