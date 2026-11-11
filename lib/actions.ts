"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { SESSION_COOKIE_NAME, assertRole } from "./auth";

/* =========================================================================
   AUTH ACTIONS
========================================================================= */

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Please enter both username and password." };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: username }],
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      return { error: "User not found. Check your credentials or create an account." };
    }

    if (!user.is_active) {
      return { error: "This account is inactive. Please contact an administrator." };
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return { error: "Invalid password. Please try again." };
    }

    // Create session in User_Sessions
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.userSession.create({
      data: {
        session_id: sessionId,
        user_id: user.user_id,
        ip_address: "127.0.0.1",
        user_agent: "Web Browser",
        expires_at: expiresAt,
        is_revoked: false,
      },
    });

    await prisma.user.update({
      where: { user_id: user.user_id },
      data: { last_login_at: new Date() },
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    const roleName = user.role.role_name.toLowerCase();
    if (roleName === "admin") {
      redirect("/admin");
    } else if (roleName === "teacher") {
      redirect("/teacher");
    } else {
      redirect("/student");
    }
  } catch (error: any) {
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Login error:", error);
    return { error: error?.message || "Failed to log in. Please try again." };
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  const username = (formData.get("username") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const password = formData.get("password") as string;
  const roleName = formData.get("role") as string; // "Admin", "Teacher", "Student"
  const firstName = (formData.get("first_name") as string)?.trim();
  const lastName = (formData.get("last_name") as string)?.trim();

  if (!username || !email || !password || !roleName || !firstName || !lastName) {
    return { error: "All required fields must be filled out." };
  }

  // Mirror the client-side rule server-side — never trust the browser alone.
  const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]/;']/;
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return { error: "Password must contain at least one special character (e.g. ! @ # $ % &)." };
  }

  const confirmPassword = formData.get("confirm_password") as string;
  if (confirmPassword !== undefined && confirmPassword !== password) {
    return { error: "Passwords do not match." };
  }

  try {
    // Check if username or email already exists
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existing) {
      return { error: "A user with that username or email already exists." };
    }

    const role = await prisma.role.findUnique({
      where: { role_name: roleName },
    });

    if (!role) {
      return { error: `Role ${roleName} does not exist.` };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Use the campus the user actually picked in the form. Fall back to
    // the first campus in the database only if nothing valid was sent
    // (e.g. Admin registration, which has no campus field at all).
    const submittedCampusId = Number(formData.get("campus_id"));
    let campusId: number;

    if (submittedCampusId) {
      const selectedCampus = await prisma.campus.findUnique({
        where: { campus_id: submittedCampusId },
      });
      if (!selectedCampus) {
        return { error: "Selected campus does not exist. Please choose a valid campus." };
      }
      campusId = selectedCampus.campus_id;
    } else {
      const fallbackCampus = await prisma.campus.findFirst();
      campusId = fallbackCampus ? fallbackCampus.campus_id : 1;
    }

    const address = await prisma.address.findFirst();
    const addressId = address ? address.address_id : 1;

    // Create user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: passwordHash,
        role_id: role.role_id,
        is_active: true,
      },
    });

    // Create Profile depending on role
    if (roleName.toLowerCase() === "admin") {
      await prisma.adminProfile.create({
        data: {
          user_id: newUser.user_id,
          first_name: firstName,
          last_name: lastName,
          department: (formData.get("department") as string) || "General Administration",
        },
      });
    } else if (roleName.toLowerCase() === "teacher") {
      const teacherId = `TCH-${Date.now().toString().slice(-4)}`;
      await prisma.teacher.create({
        data: {
          teacher_id: teacherId,
          user_id: newUser.user_id,
          first_name: firstName,
          last_name: lastName,
          sex: (formData.get("sex") as string) || "Male",
          contact_number: (formData.get("contact_number") as string) || "+63 900 000 0000",
          campus_id: campusId,
        },
      });
    } else {
      const studentId = `STD-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`;
      await prisma.student.create({
        data: {
          student_id: studentId,
          user_id: newUser.user_id,
          first_name: firstName,
          last_name: lastName,
          sex: (formData.get("sex") as string) || "Male",
          year_level: (formData.get("year_level") as string) || "1st Year",
          contact_number: (formData.get("contact_number") as string) || "+63 900 000 0000",
          campus_id: campusId,
          address_id: addressId,
        },
      });
    }

    // Auto-login the newly registered user
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.userSession.create({
      data: {
        session_id: sessionId,
        user_id: newUser.user_id,
        ip_address: "127.0.0.1",
        user_agent: "Web Browser",
        expires_at: expiresAt,
        is_revoked: false,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    if (roleName.toLowerCase() === "admin") {
      redirect("/admin");
    } else if (roleName.toLowerCase() === "teacher") {
      redirect("/teacher");
    } else {
      redirect("/student");
    }
  } catch (error: any) {
    if (error?.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Registration error:", error);
    return { error: error?.message || "Failed to register account." };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (sessionCookie?.value) {
    try {
      await prisma.userSession.update({
        where: { session_id: sessionCookie.value },
        data: { is_revoked: true },
      });
    } catch {
      // Ignore if missing in DB
    }
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}

/* =========================================================================
   STUDENT CRUD ACTIONS
========================================================================= */

export async function createStudentAction(formData: FormData) {
  const authCheck = await assertRole(["Admin"]);
  if ("error" in authCheck) return authCheck;

  const studentId = formData.get("student_id") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const email = (formData.get("email") as string) || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu`;
  const sex = (formData.get("sex") as string) || "Male";
  const yearLevel = (formData.get("year_level") as string) || "1st Year";
  const contactNumber = (formData.get("contact_number") as string) || "+63 900 000 0000";

  try {
    const studentRole = await prisma.role.findFirst({ where: { role_name: "Student" } });
    const campus = await prisma.campus.findFirst();
    const address = await prisma.address.findFirst();

    const passwordHash = await bcrypt.hash("password123", 10);
    const username = `student.${Date.now().toString().slice(-4)}`;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: passwordHash,
        role_id: studentRole?.role_id || 3,
        is_active: true,
      },
    });

    await prisma.student.create({
      data: {
        student_id: studentId,
        user_id: user.user_id,
        first_name: firstName,
        last_name: lastName,
        sex,
        year_level: yearLevel,
        contact_number: contactNumber,
        campus_id: campus?.campus_id || 1,
        address_id: address?.address_id || 1,
      },
    });

    revalidatePath("/list/students");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to create student." };
  }
}

export async function deleteStudentAction(studentId: string) {
  const authCheck = await assertRole(["Admin"]);
  if ("error" in authCheck) return authCheck;

  try {
    const student = await prisma.student.findUnique({ where: { student_id: studentId } });
    if (student) {
      await prisma.user.delete({ where: { user_id: student.user_id } });
    }
    revalidatePath("/list/students");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/* =========================================================================
   TEACHER CRUD ACTIONS
========================================================================= */

export async function createTeacherAction(formData: FormData) {
  const authCheck = await assertRole(["Admin"]);
  if ("error" in authCheck) return authCheck;

  const teacherId = formData.get("teacher_id") as string;
  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const email = (formData.get("email") as string) || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@school.edu`;
  const sex = (formData.get("sex") as string) || "Male";
  const contactNumber = (formData.get("contact_number") as string) || "+63 900 000 0000";

  try {
    const teacherRole = await prisma.role.findFirst({ where: { role_name: "Teacher" } });
    const campus = await prisma.campus.findFirst();

    const passwordHash = await bcrypt.hash("password123", 10);
    const username = `teacher.${Date.now().toString().slice(-4)}`;

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password_hash: passwordHash,
        role_id: teacherRole?.role_id || 2,
        is_active: true,
      },
    });

    await prisma.teacher.create({
      data: {
        teacher_id: teacherId,
        user_id: user.user_id,
        first_name: firstName,
        last_name: lastName,
        sex,
        contact_number: contactNumber,
        campus_id: campus?.campus_id || 1,
      },
    });

    revalidatePath("/list/teachers");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to create teacher." };
  }
}

export async function deleteTeacherAction(teacherId: string) {
  const authCheck = await assertRole(["Admin"]);
  if ("error" in authCheck) return authCheck;

  try {
    const teacher = await prisma.teacher.findUnique({ where: { teacher_id: teacherId } });
    if (teacher) {
      await prisma.user.delete({ where: { user_id: teacher.user_id } });
    }
    revalidatePath("/list/teachers");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/* =========================================================================
   COURSE CRUD ACTIONS
========================================================================= */

export async function createCourseAction(formData: FormData) {
  const authCheck = await assertRole(["Admin"]);
  if ("error" in authCheck) return authCheck;

  const courseId = (formData.get("course_id") as string)?.toUpperCase();
  const courseName = formData.get("course_name") as string;
  const units = parseInt(formData.get("units") as string) || 3;

  try {
    await prisma.course.create({
      data: {
        course_id: courseId,
        course_name: courseName,
        units,
      },
    });
    revalidatePath("/list/courses");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteCourseAction(courseId: string) {
  const authCheck = await assertRole(["Admin"]);
  if ("error" in authCheck) return authCheck;

  try {
    await prisma.course.delete({ where: { course_id: courseId } });
    revalidatePath("/list/courses");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/* =========================================================================
   SECTION CRUD ACTIONS
========================================================================= */

export async function createSectionAction(formData: FormData) {
  const authCheck = await assertRole(["Admin"]);
  if ("error" in authCheck) return authCheck;

  const sectionName = formData.get("section_name") as string;
  const courseId = (formData.get("course_id") as string)?.toUpperCase();
  const teacherId = formData.get("teacher_id") as string;

  try {
    const term = await prisma.academicTerm.findFirst();

    await prisma.classSection.create({
      data: {
        section_name: sectionName,
        course_id: courseId,
        teacher_id: teacherId,
        term_id: term?.term_id || 1,
      },
    });
    revalidatePath("/list/sections");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteSectionAction(sectionId: number) {
  const authCheck = await assertRole(["Admin"]);
  if ("error" in authCheck) return authCheck;

  try {
    await prisma.classSection.delete({ where: { section_id: sectionId } });
    revalidatePath("/list/sections");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/* =========================================================================
   STUDENT SELF-ENROLLMENT
========================================================================= */

export async function enrollInSectionAction(sectionId: number) {
  const authCheck = await assertRole(["Student"]);
  if ("error" in authCheck) return authCheck;

  const studentId = authCheck.user.profileId as string | undefined;
  if (!studentId) {
    return { error: "No student profile is linked to this account." };
  }

  try {
    const existing = await prisma.studentEnrollment.findFirst({
      where: { student_id: studentId, section_id: sectionId },
    });

    if (existing) {
      return { error: "You're already enrolled in this section." };
    }

    await prisma.studentEnrollment.create({
      data: { student_id: studentId, section_id: sectionId },
    });

    revalidatePath("/list/sections");
    revalidatePath("/student");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function unenrollFromSectionAction(sectionId: number) {
  const authCheck = await assertRole(["Student"]);
  if ("error" in authCheck) return authCheck;

  const studentId = authCheck.user.profileId as string | undefined;
  if (!studentId) {
    return { error: "No student profile is linked to this account." };
  }

  try {
    await prisma.studentEnrollment.deleteMany({
      where: { student_id: studentId, section_id: sectionId },
    });

    revalidatePath("/list/sections");
    revalidatePath("/student");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/* =========================================================================
   PERFORMANCE & GRADES CRUD ACTIONS
========================================================================= */

export async function createPerformanceAction(formData: FormData) {
  const authCheck = await assertRole(["Admin", "Teacher"]);
  if ("error" in authCheck) return authCheck;

  const enrollmentId = parseInt(formData.get("enrollment_id") as string) || 1;
  const midtermGrade = parseFloat(formData.get("midterm_grade") as string);
  const finalGrade = parseFloat(formData.get("final_grade") as string);
  const remarks = (formData.get("remarks") as string) || "Passed";

  try {
    await prisma.academicPerformance.upsert({
      where: { enrollment_id: enrollmentId },
      update: {
        midterm_grade: midtermGrade,
        final_grade: finalGrade,
        remarks,
      },
      create: {
        enrollment_id: enrollmentId,
        midterm_grade: midtermGrade,
        final_grade: finalGrade,
        remarks,
      },
    });
    revalidatePath("/list/performance");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deletePerformanceAction(performanceId: number) {
  const authCheck = await assertRole(["Admin", "Teacher"]);
  if ("error" in authCheck) return authCheck;

  try {
    await prisma.academicPerformance.delete({ where: { performance_id: performanceId } });
    revalidatePath("/list/performance");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

/* =========================================================================
   CAMPUS CRUD ACTIONS
========================================================================= */

export async function createCampusAction(formData: FormData) {
  const authCheck = await assertRole(["Admin"]);
  if ("error" in authCheck) return authCheck;

  const campusName = formData.get("campus_name") as string;
  const streetAddress = (formData.get("street_address") as string) || "University Zone";
  const city = (formData.get("city") as string) || "Quezon City";
  const provinceState = (formData.get("province_state") as string) || "Metro Manila";
  const postalCode = (formData.get("postal_code") as string) || "1000";

  try {
    const address = await prisma.address.create({
      data: {
        street_address: streetAddress,
        city,
        province_state: provinceState,
        postal_code: postalCode,
      },
    });

    await prisma.campus.create({
      data: {
        campus_name: campusName,
        address_id: address.address_id,
      },
    });

    revalidatePath("/list/campuses");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteCampusAction(campusId: number) {
  const authCheck = await assertRole(["Admin"]);
  if ("error" in authCheck) return authCheck;

  try {
    await prisma.campus.delete({ where: { campus_id: campusId } });
    revalidatePath("/list/campuses");
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}