import { prisma } from "./prisma";
import {
  initialAddresses,
  initialCampuses,
  initialCourses,
  initialAcademicTerms,
  initialTeachers,
  initialStudents,
  initialSections,
  initialPerformances,
  initialUsers,
  initialRoles,
} from "./mockData";

/* =========================================================================
   STUDENTS
========================================================================= */
export async function getStudents(query?: string) {
  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
        campus: true,
        address: true,
      },
      orderBy: { student_id: "asc" },
    });

    let result = students.map((s) => ({
      student_id: s.student_id,
      user_id: s.user_id,
      first_name: s.first_name,
      last_name: s.last_name,
      contact_number: s.contact_number || "N/A",
      sex: s.sex,
      year_level: s.year_level,
      campus_id: s.campus_id,
      campus_name: s.campus.campus_name,
      address_id: s.address_id,
      city: s.address.city,
      email: s.user.email,
      username: s.user.username,
    }));

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.first_name.toLowerCase().includes(q) ||
          s.last_name.toLowerCase().includes(q) ||
          s.student_id.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
      );
    }
    return result;
  } catch (error) {
    console.warn("Using fallback students data due to database error:", error);
    let result = initialStudents;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.first_name.toLowerCase().includes(q) ||
          s.last_name.toLowerCase().includes(q) ||
          s.student_id.toLowerCase().includes(q) ||
          (s.email && s.email.toLowerCase().includes(q))
      );
    }
    return result;
  }
}

/* =========================================================================
   TEACHERS
========================================================================= */
export async function getTeachers(query?: string) {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        campus: true,
      },
      orderBy: { teacher_id: "asc" },
    });

    let result = teachers.map((t) => ({
      teacher_id: t.teacher_id,
      user_id: t.user_id,
      first_name: t.first_name,
      last_name: t.last_name,
      contact_number: t.contact_number || "N/A",
      sex: t.sex,
      campus_id: t.campus_id,
      campus_name: t.campus.campus_name,
      email: t.user.email,
      username: t.user.username,
    }));

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.first_name.toLowerCase().includes(q) ||
          t.last_name.toLowerCase().includes(q) ||
          t.teacher_id.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q)
      );
    }
    return result;
  } catch (error) {
    console.warn("Using fallback teachers data due to database error:", error);
    let result = initialTeachers;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (t) =>
          t.first_name.toLowerCase().includes(q) ||
          t.last_name.toLowerCase().includes(q) ||
          t.teacher_id.toLowerCase().includes(q) ||
          (t.email && t.email.toLowerCase().includes(q))
      );
    }
    return result;
  }
}

/* =========================================================================
   COURSES & SECTIONS
========================================================================= */
export async function getCourses(query?: string) {
  try {
    const courses = await prisma.course.findMany({ orderBy: { course_id: "asc" } });
    if (query) {
      const q = query.toLowerCase();
      return courses.filter((c) => c.course_id.toLowerCase().includes(q) || c.course_name.toLowerCase().includes(q));
    }
    return courses;
  } catch (error) {
    console.warn("Using fallback courses data:", error);
    let result = initialCourses;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((c) => c.course_id.toLowerCase().includes(q) || c.course_name.toLowerCase().includes(q));
    }
    return result;
  }
}

export async function getSections(query?: string) {
  try {
    const sections = await prisma.classSection.findMany({
      include: {
        course: true,
        teacher: true,
        term: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { section_id: "asc" },
    });

    let result = sections.map((s) => ({
      section_id: s.section_id,
      section_name: s.section_name,
      course_id: s.course_id,
      course_name: s.course.course_name,
      teacher_id: s.teacher_id,
      teacher_name: `${s.teacher.first_name} ${s.teacher.last_name}`,
      term_id: s.term_id,
      term_name: `${s.term.academic_year} - ${s.term.term_name}`,
      student_count: s._count.enrollments,
    }));

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.section_name.toLowerCase().includes(q) ||
          s.course_name.toLowerCase().includes(q) ||
          s.teacher_name.toLowerCase().includes(q)
      );
    }
    return result;
  } catch (error) {
    console.warn("Using fallback sections data:", error);
    let result = initialSections;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (s) =>
          s.section_name.toLowerCase().includes(q) ||
          (s.course_name && s.course_name.toLowerCase().includes(q)) ||
          (s.teacher_name && s.teacher_name.toLowerCase().includes(q))
      );
    }
    return result;
  }
}

export async function getEnrollmentOptions() {
  try {
    const enrollments = await prisma.studentEnrollment.findMany({
      include: { student: true, section: true },
      orderBy: { enrollment_id: "asc" },
    });
    return enrollments.map((e) => ({
      enrollment_id: e.enrollment_id,
      student_id: e.student_id,
      student_name: `${e.student.first_name} ${e.student.last_name}`,
      section_name: e.section.section_name,
    }));
  } catch (error) {
    console.warn("Using empty enrollment options due to database error:", error);
    return [];
  }
}

/* =========================================================================
   STUDENT ENROLLMENT STATUS
========================================================================= */
export async function getSectionsForStudent(studentId: string) {
  try {
    const enrollments = await prisma.studentEnrollment.findMany({
      where: { student_id: studentId },
      include: {
        section: {
          include: { course: true, teacher: true, term: true },
        },
      },
      orderBy: { enrollment_id: "asc" },
    });

    return enrollments.map((e) => ({
      section_id: e.section.section_id,
      section_name: e.section.section_name,
      course_id: e.section.course_id,
      course_name: e.section.course.course_name,
      teacher_id: e.section.teacher_id,
      teacher_name: `${e.section.teacher.first_name} ${e.section.teacher.last_name}`,
      term_id: e.section.term_id,
      term_name: `${e.section.term.academic_year} - ${e.section.term.term_name}`,
    }));
  } catch (error) {
    console.warn("Using empty enrolled-sections list due to database error:", error);
    return [];
  }
}

export async function getEnrolledSectionIds(studentId: string): Promise<number[]> {
  try {
    const enrollments = await prisma.studentEnrollment.findMany({
      where: { student_id: studentId },
      select: { section_id: true },
    });
    return enrollments.map((e) => e.section_id);
  } catch (error) {
    console.warn("Using empty enrollment list due to database error:", error);
    return [];
  }
}

/* =========================================================================
   CAMPUSES & TERMS
========================================================================= */
export async function getCampuses() {
  try {
    const campuses = await prisma.campus.findMany({
      include: { address: true },
      orderBy: { campus_id: "asc" },
    });
    return campuses.map((c) => ({
      campus_id: c.campus_id,
      campus_name: c.campus_name,
      address_id: c.address_id,
      address: c.address,
    }));
  } catch (error) {
    console.warn("Using fallback campuses data:", error);
    return initialCampuses;
  }
}

export async function getAcademicTerms() {
  try {
    const terms = await prisma.academicTerm.findMany({ orderBy: { term_id: "asc" } });
    return terms;
  } catch (error) {
    console.warn("Using fallback terms data:", error);
    return initialAcademicTerms;
  }
}

/* =========================================================================
   PERFORMANCE & GRADES
========================================================================= */
/**
 * Same shape as getPerformances, but scoped to a single student at the
 * database level — a student only ever sees their own grades, not every
 * student's. Used on the Performance list page when the viewer is a Student.
 */
export async function getPerformancesForStudent(studentId: string, query?: string) {
  try {
    const perfs = await prisma.academicPerformance.findMany({
      where: { enrollment: { student_id: studentId } },
      include: {
        enrollment: {
          include: {
            student: true,
            section: { include: { course: true } },
          },
        },
      },
      orderBy: { performance_id: "asc" },
    });

    let result = perfs.map((p) => ({
      performance_id: p.performance_id,
      enrollment_id: p.enrollment_id,
      student_id: p.enrollment.student_id,
      student_name: `${p.enrollment.student.first_name} ${p.enrollment.student.last_name}`,
      section_name: p.enrollment.section.section_name,
      course_name: p.enrollment.section.course.course_name,
      midterm_grade: p.midterm_grade ? Number(p.midterm_grade) : null,
      final_grade: p.final_grade ? Number(p.final_grade) : null,
      remarks: p.remarks,
    }));

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.student_name.toLowerCase().includes(q) ||
          p.course_name.toLowerCase().includes(q)
      );
    }
    return result;
  } catch (error) {
    console.warn("Using fallback student performances data:", error);
    let result = initialPerformances.filter((p) => p.student_id === studentId);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((p) => p.course_name.toLowerCase().includes(q));
    }
    return result;
  }
}

export async function getPerformances(query?: string) {
  try {
    const perfs = await prisma.academicPerformance.findMany({
      include: {
        enrollment: {
          include: {
            student: true,
            section: { include: { course: true } },
          },
        },
      },
      orderBy: { performance_id: "asc" },
    });

    let result = perfs.map((p) => ({
      performance_id: p.performance_id,
      enrollment_id: p.enrollment_id,
      student_id: p.enrollment.student_id,
      student_name: `${p.enrollment.student.first_name} ${p.enrollment.student.last_name}`,
      section_name: p.enrollment.section.section_name,
      course_name: p.enrollment.section.course.course_name,
      midterm_grade: p.midterm_grade ? Number(p.midterm_grade) : null,
      final_grade: p.final_grade ? Number(p.final_grade) : null,
      remarks: p.remarks,
    }));

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.student_name.toLowerCase().includes(q) ||
          p.student_id.toLowerCase().includes(q) ||
          p.course_name.toLowerCase().includes(q)
      );
    }
    return result;
  } catch (error) {
    console.warn("Using fallback performances data:", error);
    let result = initialPerformances;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.student_name.toLowerCase().includes(q) ||
          p.student_id.toLowerCase().includes(q) ||
          p.course_name.toLowerCase().includes(q)
      );
    }
    return result;
  }
}

/* =========================================================================
   USERS & ROLES
========================================================================= */
export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { user_id: "asc" },
    });
    return users.map((u) => ({
      user_id: u.user_id,
      username: u.username,
      email: u.email,
      role_id: u.role_id,
      role_name: u.role.role_name,
      is_active: u.is_active,
      must_change_password: u.must_change_password,
      last_login_at: u.last_login_at ? u.last_login_at.toISOString().slice(0, 16).replace("T", " ") : null,
      created_at: u.created_at.toISOString().slice(0, 10),
    }));
  } catch (error) {
    console.warn("Using fallback users data:", error);
    return initialUsers;
  }
}

export async function getRoles() {
  try {
    const roles = await prisma.role.findMany({ orderBy: { role_id: "asc" } });
    if (roles && roles.length > 0) return roles;
    return initialRoles;
  } catch (error) {
    console.warn("Using fallback roles data:", error);
    return initialRoles;
  }
}

/* =========================================================================
   DASHBOARD STATS
========================================================================= */
/**
 * Distinct students who have at least one StudentEnrollment — i.e.
 * registered students who have actually joined a section, as opposed to
 * total registered student accounts (which includes students who signed
 * up but never joined anything).
 */
export async function getEnrolledStudentCount(): Promise<number> {
  try {
    const distinctStudents = await prisma.studentEnrollment.findMany({
      distinct: ["student_id"],
      select: { student_id: true },
    });
    return distinctStudents.length;
  } catch (error) {
    console.warn("Using fallback enrolled-student count due to database error:", error);
    const enrolledIds = new Set(initialPerformances.map((p) => p.student_id));
    return enrolledIds.size;
  }
}

/**
 * Distinct students enrolled across sections taught by one specific
 * teacher — scoped to that teacher's own classes, for the Teacher dashboard.
 */
export async function getEnrolledStudentCountForTeacher(teacherId: string): Promise<number> {
  try {
    const distinctStudents = await prisma.studentEnrollment.findMany({
      where: { section: { teacher_id: teacherId } },
      distinct: ["student_id"],
      select: { student_id: true },
    });
    return distinctStudents.length;
  } catch (error) {
    console.warn("Using fallback teacher enrolled-student count due to database error:", error);
    return 0;
  }
}

/**
 * Students who have joined at least one section, with their year level and
 * the section(s) they're in. Powers the "Enrolled Students" list shown to
 * admins on the Student View. Same enrollment source as
 * getEnrolledStudentCount, so the two always agree.
 */
export interface EnrolledStudentRow {
  student_id: string;
  name: string;
  year_level: string;
  sections: string[];
}

export async function getEnrolledStudentsList(): Promise<EnrolledStudentRow[]> {
  try {
    const enrollments = await prisma.studentEnrollment.findMany({
      include: { student: true, section: true },
      orderBy: [{ student_id: "asc" }, { enrollment_id: "asc" }],
    });

    const byStudent = new Map<string, EnrolledStudentRow>();
    for (const e of enrollments) {
      const existing = byStudent.get(e.student_id);
      if (existing) {
        existing.sections.push(e.section.section_name);
      } else {
        byStudent.set(e.student_id, {
          student_id: e.student_id,
          name: `${e.student.first_name} ${e.student.last_name}`,
          year_level: e.student.year_level,
          sections: [e.section.section_name],
        });
      }
    }
    return Array.from(byStudent.values());
  } catch (error) {
    console.warn("Using fallback enrolled students list due to database error:", error);
    const byStudent = new Map<string, EnrolledStudentRow>();
    for (const p of initialPerformances) {
      const existing = byStudent.get(p.student_id);
      if (existing) {
        existing.sections.push(p.section_name);
      } else {
        const student = initialStudents.find((s) => s.student_id === p.student_id);
        byStudent.set(p.student_id, {
          student_id: p.student_id,
          name: p.student_name,
          year_level: student?.year_level ?? "N/A",
          sections: [p.section_name],
        });
      }
    }
    return Array.from(byStudent.values());
  }
}

export async function getDashboardStats() {
  const students = await getStudents();
  const teachers = await getTeachers();
  const sections = await getSections();
  const campuses = await getCampuses();
  const enrolledStudentCount = await getEnrolledStudentCount();

  const maleCount = students.filter((s) => s.sex.toLowerCase() === "male").length;
  const femaleCount = students.filter((s) => s.sex.toLowerCase() === "female").length;

  return {
    studentCount: students.length,
    teacherCount: teachers.length,
    sectionCount: sections.length,
    campusCount: campuses.length,
    enrolledStudentCount,
    maleCount,
    femaleCount,
  };
}