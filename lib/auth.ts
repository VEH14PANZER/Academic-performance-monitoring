import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import crypto from "crypto";

export interface CurrentUser {
  userId: number;
  username: string;
  email: string;
  roleId: number;
  roleName: string;
  name: string;
  profileId?: string | number;
  department?: string;
  yearLevel?: string;
  campusName?: string;
}

export const SESSION_COOKIE_NAME = "school_session_id";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number, reqHeaders?: Headers): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const userAgent = reqHeaders?.get("user-agent") || "Unknown";
  const ipAddress = reqHeaders?.get("x-forwarded-for") || "127.0.0.1";

  try {
    await prisma.userSession.create({
      data: {
        session_id: sessionId,
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        expires_at: expiresAt,
        is_revoked: false,
      },
    });

    // Update last login
    await prisma.user.update({
      where: { user_id: userId },
      data: { last_login_at: new Date() },
    });
  } catch (error) {
    console.error("Database error creating session:", error);
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return sessionId;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const session = await prisma.userSession.findUnique({
      where: { session_id: sessionCookie.value },
      include: {
        user: {
          include: {
            role: true,
            admin_profile: true,
            teacher: { include: { campus: true } },
            student: { include: { campus: true } },
          },
        },
      },
    });

    if (!session || session.is_revoked || session.expires_at < new Date() || !session.user.is_active) {
      return null;
    }

    const { user } = session;
    let name = user.username;
    let profileId: string | number | undefined;
    let department: string | undefined;
    let yearLevel: string | undefined;
    let campusName: string | undefined;

    if (user.admin_profile) {
      name = `${user.admin_profile.first_name} ${user.admin_profile.last_name}`;
      profileId = user.admin_profile.admin_id;
      department = user.admin_profile.department;
    } else if (user.teacher) {
      name = `${user.teacher.first_name} ${user.teacher.last_name}`;
      profileId = user.teacher.teacher_id;
      campusName = user.teacher.campus.campus_name;
    } else if (user.student) {
      name = `${user.student.first_name} ${user.student.last_name}`;
      profileId = user.student.student_id;
      yearLevel = user.student.year_level;
      campusName = user.student.campus.campus_name;
    }

    return {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      roleId: user.role_id,
      roleName: user.role.role_name,
      name,
      profileId,
      department,
      yearLevel,
      campusName,
    };
  } catch (error) {
    console.error("Database session retrieval error:", error);
    return null;
  }
}

/**
 * Returns the default landing route for a given role name.
 * Keeps unauthorized users on a page they're actually allowed to see,
 * instead of just bouncing everyone to /login.
 */
function getDefaultRouteForRole(roleName: string): string {
  const role = roleName.toLowerCase();
  if (role === "admin") return "/admin";
  if (role === "teacher") return "/teacher";
  return "/student";
}

/**
 * Use at the top of a layout/page to enforce that the current user is
 * logged in AND holds one of the allowed roles. Anyone who isn't logged
 * in is sent to /login; anyone logged in but with the wrong role is sent
 * to their own default view rather than being allowed through.
 *
 * Example: await requireRole(["Admin"]) in AdminLayout.
 */
export async function requireRole(allowedRoles: string[]): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
  const hasAccess = normalizedAllowed.includes(user.roleName.toLowerCase());

  if (!hasAccess) {
    redirect(getDefaultRouteForRole(user.roleName));
  }

  return user;
}

/**
 * Use inside a server action (anything in actions.ts) to enforce role
 * before a mutation runs. Unlike requireRole, this never redirects —
 * server actions need to return { error } so the calling form/modal can
 * show it, rather than navigating the user away mid-submit.
 *
 * Example:
 *   const check = await assertRole(["Admin"]);
 *   if ("error" in check) return check;
 */
export async function assertRole(
  allowedRoles: string[]
): Promise<{ user: CurrentUser } | { error: string }> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "You must be logged in to perform this action." };
  }

  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());
  if (!normalizedAllowed.includes(user.roleName.toLowerCase())) {
    return { error: `Your role (${user.roleName}) is not authorized to perform this action.` };
  }

  return { user };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (sessionCookie?.value) {
    try {
      await prisma.userSession.update({
        where: { session_id: sessionCookie.value },
        data: { is_revoked: true },
      });
    } catch {
      // Ignore if session not in DB
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}