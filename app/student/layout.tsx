import { withRoleLayout } from "@/lib/withrolelayout";

export const dynamic = "force-dynamic";

// Admins can preview the Student view; Teachers cannot view it.
export default withRoleLayout(["Admin", "Student"]);