import { withRoleLayout } from "@/lib/withrolelayout";

export const dynamic = "force-dynamic";

// Any logged-in role can view their own profile.
export default withRoleLayout(["Admin", "Teacher", "Student"]);