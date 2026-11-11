"use client";

import React, { useState } from "react";
import { PlusIcon, EyeIcon, Trash2Icon, XIcon } from "./Icons";
import { useRouter } from "next/navigation";
import {
  createStudentAction,
  deleteStudentAction,
  createTeacherAction,
  deleteTeacherAction,
  createCourseAction,
  deleteCourseAction,
  createSectionAction,
  deleteSectionAction,
  createPerformanceAction,
  deletePerformanceAction,
  createCampusAction,
  deleteCampusAction,
} from "@/lib/actions";

interface CourseOption {
  course_id: string;
  course_name: string;
}

interface TeacherOption {
  teacher_id: string;
  first_name: string;
  last_name: string;
}

interface EnrollmentOption {
  enrollment_id: number;
  student_id: string;
  student_name: string;
  section_name: string;
}

interface FormModalProps {
  table: "student" | "teacher" | "course" | "section" | "campus" | "performance" | "user";
  type: "create" | "update" | "delete";
  data?: any;
  id?: string | number;
  // Real option lists for dropdowns, so forms never accept a free-text ID
  // that doesn't actually exist in the database.
  courses?: CourseOption[];
  teachers?: TeacherOption[];
  enrollments?: EnrollmentOption[];
}

export default function FormModal({ table, type, data, id, courses, teachers, enrollments }: FormModalProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-[#FAE27C] text-amber-950 hover:bg-amber-300"
      : type === "update"
      ? "bg-[#C3EBFA] text-sky-900 hover:bg-sky-200"
      : "bg-[#CFCEFF] text-purple-900 hover:bg-purple-200";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    let res: any = { success: true };

    try {
      if (type === "delete") {
        if (table === "student") res = await deleteStudentAction(String(id || data?.student_id));
        else if (table === "teacher") res = await deleteTeacherAction(String(id || data?.teacher_id));
        else if (table === "course") res = await deleteCourseAction(String(id || data?.course_id));
        else if (table === "section") res = await deleteSectionAction(Number(id || data?.section_id));
        else if (table === "performance") res = await deletePerformanceAction(Number(id || data?.performance_id));
        else if (table === "campus") res = await deleteCampusAction(Number(id || data?.campus_id));
      } else if (type === "create") {
        if (table === "student") res = await createStudentAction(formData);
        else if (table === "teacher") res = await createTeacherAction(formData);
        else if (table === "course") res = await createCourseAction(formData);
        else if (table === "section") res = await createSectionAction(formData);
        else if (table === "performance") res = await createPerformanceAction(formData);
        else if (table === "campus") res = await createCampusAction(formData);
      } else {
        // View / details update
        res = { success: true };
      }

      if (res?.error) {
        setError(res.error);
        setSubmitting(false);
        return;
      }

      setOpen(false);
      setSubmitting(false);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Operation failed.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setError("");
        }}
        className={`${size} flex items-center justify-center rounded-full ${bgColor} transition shadow-xs`}
        title={`${type.toUpperCase()} ${table}`}
      >
        {type === "create" && <PlusIcon size={16} />}
        {type === "update" && <EyeIcon size={14} />}
        {type === "delete" && <Trash2Icon size={14} />}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
            >
              <XIcon size={20} />
            </button>

            {/* FORM TITLE */}
            <h1 className="text-base font-bold text-gray-800 mb-4 capitalize">
              {type === "delete"
                ? `Delete ${table}`
                : `${type} ${table}`}
            </h1>

            {error && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl mb-4 border border-red-200">
                {error}
              </div>
            )}

            {type === "delete" ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <p className="text-xs text-gray-600">
                  Are you sure you want to delete this {table} record from PostgreSQL? This action will remove the record and any associated profiles.
                </p>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
                  >
                    {submitting ? "Deleting..." : "Confirm Delete"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
                {/* DYNAMIC FORM FIELDS */}
                {table === "student" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Student ID *</label>
                      <input
                        required
                        name="student_id"
                        placeholder="e.g. STD-2026-010"
                        defaultValue={data?.student_id || `STD-2026-${Math.floor(Math.random() * 900 + 100)}`}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Year Level *</label>
                      <select
                        name="year_level"
                        defaultValue={data?.year_level || "1st Year"}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-white"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">First Name *</label>
                      <input
                        required
                        name="first_name"
                        placeholder="First name"
                        defaultValue={data?.first_name || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Last Name *</label>
                      <input
                        required
                        name="last_name"
                        placeholder="Last name"
                        defaultValue={data?.last_name || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Sex *</label>
                      <select
                        name="sex"
                        defaultValue={data?.sex || "Male"}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Contact Number</label>
                      <input
                        name="contact_number"
                        placeholder="+63 900 000 0000"
                        defaultValue={data?.contact_number || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                  </div>
                )}

                {table === "teacher" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Teacher ID *</label>
                      <input
                        required
                        name="teacher_id"
                        placeholder="e.g. TCH-015"
                        defaultValue={data?.teacher_id || `TCH-${Math.floor(Math.random() * 900 + 100)}`}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Sex *</label>
                      <select
                        name="sex"
                        defaultValue={data?.sex || "Male"}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">First Name *</label>
                      <input
                        required
                        name="first_name"
                        placeholder="First name"
                        defaultValue={data?.first_name || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Last Name *</label>
                      <input
                        required
                        name="last_name"
                        placeholder="Last name"
                        defaultValue={data?.last_name || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-gray-600 font-medium block mb-1">Contact Number</label>
                      <input
                        name="contact_number"
                        placeholder="+63 917 000 0000"
                        defaultValue={data?.contact_number || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                  </div>
                )}

                {table === "course" && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Course Code *</label>
                      <input
                        required
                        name="course_id"
                        placeholder="e.g. CS305"
                        defaultValue={data?.course_id || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50 font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Course Title *</label>
                      <input
                        required
                        name="course_name"
                        placeholder="e.g. Software Engineering & Architecture"
                        defaultValue={data?.course_name || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Academic Units *</label>
                      <input
                        required
                        name="units"
                        type="number"
                        min="1"
                        max="6"
                        defaultValue={data?.units || 3}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                  </div>
                )}

                {table === "section" && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Section Name *</label>
                      <input
                        required
                        name="section_name"
                        placeholder="e.g. CS101-Section B"
                        defaultValue={data?.section_name || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Course *</label>
                      <select
                        required
                        name="course_id"
                        defaultValue={data?.course_id || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-white"
                      >
                        <option value="" disabled>
                          Select a course
                        </option>
                        {(courses || []).map((c) => (
                          <option key={c.course_id} value={c.course_id}>
                            {c.course_id} — {c.course_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Assigned Teacher *</label>
                      <select
                        required
                        name="teacher_id"
                        defaultValue={data?.teacher_id || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-white"
                      >
                        <option value="" disabled>
                          Select a teacher
                        </option>
                        {(teachers || []).map((t) => (
                          <option key={t.teacher_id} value={t.teacher_id}>
                            {t.teacher_id} — {t.first_name} {t.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {table === "performance" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-gray-600 font-medium block mb-1">Student *</label>
                      <select
                        required
                        name="enrollment_id"
                        defaultValue={data?.enrollment_id || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-white"
                      >
                        <option value="" disabled>
                          Select a student
                        </option>
                        {(enrollments || []).map((e) => (
                          <option key={e.enrollment_id} value={e.enrollment_id}>
                            {e.student_id} — {e.student_name} ({e.section_name})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Midterm Grade (0-100)</label>
                      <input
                        required
                        name="midterm_grade"
                        type="number"
                        step="0.01"
                        placeholder="85.5"
                        defaultValue={data?.midterm_grade || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Final Grade (0-100)</label>
                      <input
                        required
                        name="final_grade"
                        type="number"
                        step="0.01"
                        placeholder="89.0"
                        defaultValue={data?.final_grade || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-gray-600 font-medium block mb-1">Faculty Remarks</label>
                      <input
                        name="remarks"
                        placeholder="e.g. Passed with High Honors"
                        defaultValue={data?.remarks || "Passed"}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                  </div>
                )}

                {table === "campus" && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Campus Name *</label>
                      <input
                        required
                        name="campus_name"
                        placeholder="e.g. North Tech Campus"
                        defaultValue={data?.campus_name || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div>
                      <label className="text-gray-600 font-medium block mb-1">Street Address</label>
                      <input
                        name="street_address"
                        placeholder="e.g. 500 Technological Ave"
                        defaultValue={data?.address?.street_address || ""}
                        className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-600 font-medium block mb-1">City</label>
                        <input
                          name="city"
                          placeholder="e.g. Pasig City"
                          defaultValue={data?.address?.city || ""}
                          className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                        />
                      </div>
                      <div>
                        <label className="text-gray-600 font-medium block mb-1">Province / State</label>
                        <input
                          name="province_state"
                          placeholder="e.g. Metro Manila"
                          defaultValue={data?.address?.province_state || ""}
                          className="w-full p-2 border rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition disabled:opacity-50"
                  >
                    {submitting ? "Saving to Database..." : "Save to Database"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}