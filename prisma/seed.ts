import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Roles
  console.log("Creating roles...");
  const adminRole = await prisma.role.upsert({
    where: { role_name: "Admin" },
    update: {},
    create: { role_name: "Admin", description: "Full system administrator access" },
  });

  const teacherRole = await prisma.role.upsert({
    where: { role_name: "Teacher" },
    update: {},
    create: { role_name: "Teacher", description: "Faculty instruction and grading access" },
  });

  const studentRole = await prisma.role.upsert({
    where: { role_name: "Student" },
    update: {},
    create: { role_name: "Student", description: "Enrolled student portal access" },
  });

  // 2. Permissions
  console.log("Creating permissions...");
  const permUsers = await prisma.permission.upsert({
    where: { permission_name: "manage_users" },
    update: {},
    create: { permission_name: "manage_users", description: "Create and update user accounts" },
  });

  const permGrades = await prisma.permission.upsert({
    where: { permission_name: "enter_grades" },
    update: {},
    create: { permission_name: "enter_grades", description: "Encode midterm and final grades" },
  });

  // 3. Addresses
  console.log("Creating addresses...");
  const addr1 = await prisma.address.create({
    data: {
      street_address: "124 University Ave",
      city: "Quezon City",
      province_state: "Metro Manila",
      postal_code: "1101",
    },
  });

  const addr2 = await prisma.address.create({
    data: {
      street_address: "45 Innovation Blvd",
      city: "Taguig City",
      province_state: "Metro Manila",
      postal_code: "1630",
    },
  });

  // 4. Campuses
  console.log("Creating campuses...");
  const campus1 = await prisma.campus.create({
    data: {
      campus_name: "Main Campus (Quezon City)",
      address_id: addr1.address_id,
    },
  });

  const campus2 = await prisma.campus.create({
    data: {
      campus_name: "Global City Campus (BGC)",
      address_id: addr2.address_id,
    },
  });

  // 5. Courses
  console.log("Creating courses...");
  const cs101 = await prisma.course.upsert({
    where: { course_id: "CS101" },
    update: {},
    create: { course_id: "CS101", course_name: "Introduction to Computer Science", units: 3 },
  });

  const cs202 = await prisma.course.upsert({
    where: { course_id: "CS202" },
    update: {},
    create: { course_id: "CS202", course_name: "Data Structures & Algorithms", units: 4 },
  });

  const db301 = await prisma.course.upsert({
    where: { course_id: "DB301" },
    update: {},
    create: { course_id: "DB301", course_name: "Database Systems & Architecture", units: 3 },
  });

  // 6. Academic Terms
  console.log("Creating academic terms...");
  const term1 = await prisma.academicTerm.create({
    data: {
      academic_year: "2025-2026",
      term_name: "1st Semester",
    },
  });

  // 7. Users
  console.log("Creating users & profiles...");
  const passwordHash = await bcrypt.hash("password123", 10);

  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@school.edu",
      password_hash: passwordHash,
      role_id: adminRole.role_id,
      admin_profile: {
        create: {
          first_name: "Maria Elena",
          last_name: "Santos",
          department: "Academic Affairs Administration",
        },
      },
    },
  });

  // Teacher User
  const teacherUser = await prisma.user.upsert({
    where: { username: "teacher.reyes" },
    update: {},
    create: {
      username: "teacher.reyes",
      email: "j.reyes@school.edu",
      password_hash: passwordHash,
      role_id: teacherRole.role_id,
      teacher: {
        create: {
          teacher_id: "TCH-001",
          first_name: "Juan",
          last_name: "Reyes",
          contact_number: "+63 917 123 4567",
          sex: "Male",
          campus_id: campus1.campus_id,
        },
      },
    },
  });

  // Student User
  const studentUser = await prisma.user.upsert({
    where: { username: "student.cruz" },
    update: {},
    create: {
      username: "student.cruz",
      email: "carlo.cruz@school.edu",
      password_hash: passwordHash,
      role_id: studentRole.role_id,
      student: {
        create: {
          student_id: "STD-2024-001",
          first_name: "Carlo",
          last_name: "Cruz",
          contact_number: "+63 921 555 1201",
          sex: "Male",
          year_level: "2nd Year",
          campus_id: campus1.campus_id,
          address_id: addr1.address_id,
        },
      },
    },
  });

  // 8. Class Sections
  console.log("Creating sections & enrollments...");
  const section1 = await prisma.classSection.create({
    data: {
      section_name: "CS101-Section A",
      course_id: cs101.course_id,
      teacher_id: "TCH-001",
      term_id: term1.term_id,
    },
  });

  // 9. Enrollment & Performance
  const enrollment1 = await prisma.studentEnrollment.create({
    data: {
      student_id: "STD-2024-001",
      section_id: section1.section_id,
      performance: {
        create: {
          midterm_grade: 88.5,
          final_grade: 91.0,
          remarks: "Passed with Distinction",
        },
      },
    },
  });

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

