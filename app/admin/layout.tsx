import { withRoleLayout } from "@/lib/withrolelayout";

export const dynamic = "force-dynamic";

// Only Admins may view /admin and anything nested under it.
export default withRoleLayout(["Admin"]);