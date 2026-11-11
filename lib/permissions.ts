/**
 * Single source of truth for which roles can create/edit/delete each
 * resource. Keep this in sync with the role checks inside lib/actions.ts —
 * this file controls what the UI shows, actions.ts controls what the
 * server actually allows, and they should always agree.
 */
export const EDIT_PERMISSIONS: Record<string, string[]> = {
  student: ["admin"],
  teacher: ["admin"],
  course: ["admin"],
  section: ["admin"],
  campus: ["admin"],
  user: ["admin"],
  performance: ["admin", "teacher"], // grading is a teacher task
};

export function hasEditPermission(
  role: string | undefined,
  resource: keyof typeof EDIT_PERMISSIONS
): boolean {
  const allowed = EDIT_PERMISSIONS[resource];
  if (!allowed) return false;
  return allowed.includes((role || "").toLowerCase());
}