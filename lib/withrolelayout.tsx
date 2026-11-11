import React from "react";
import DashboardShell from "@/components/DashboardShell";
import { requireRole } from "@/lib/auth";

/**
 * Builds a Next.js layout component that enforces role access before
 * rendering DashboardShell. Replaces the 5 near-identical
 * AdminLayout/TeacherLayout/StudentLayout/ListLayout/ProfileLayout files,
 * each of which only differed by which roles were allowed through.
 *
 * Usage in a layout.tsx file:
 *   export const dynamic = "force-dynamic";
 *   export default withRoleLayout(["Admin"]);
 */
export function withRoleLayout(allowedRoles: string[]) {
  return async function RoleGatedLayout({ children }: { children: React.ReactNode }) {
    await requireRole(allowedRoles);
    return <DashboardShell>{children}</DashboardShell>;
  };
}