import { withRoleLayout } from "@/lib/withrolelayout";

export const dynamic = "force-dynamic";

// /list/* pages are shared by all three roles; each individual page
// decides what data to show and whether edit controls render
// (see lib/permissions.ts). This layout just requires being logged in.
export default withRoleLayout(["Admin", "Teacher", "Student"]);