import { withRoleLayout } from "@/lib/withrolelayout";

export const dynamic = "force-dynamic";

// Admins can preview the Teacher view; Students cannot view it.
export default withRoleLayout(["Admin", "Teacher"]);