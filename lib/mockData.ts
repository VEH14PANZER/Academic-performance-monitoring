export interface RoleItem {
  role_id: number;
  role_name: string;
  description: string;
}

export interface AddressItem {
  address_id: number;
  street_address: string;
  city: string;
  province_state: string;
  postal_code: string;
}

export interface CampusItem {
  campus_id: number;
  campus_name: string;
  address_id: number;
  address?: AddressItem;
}

export interface UserItem {
  user_id: number;
  username: string;
  email: string;
  role_id: number;
  role_name?: string;
  is_active: boolean;
  must_change_password: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface TeacherItem {
  teacher_id: string;
  user_id: number;
  first_name: string;
  last_name: string;
  contact_number: string;
  sex: string;
  campus_id: number;
  campus_name?: string;
  email?: string;
  username?: string;
}

export interface StudentItem {
  student_id: string;
  user_id: number;
  first_name: string;
  last_name: string;
  contact_number: string;
  sex: string;
  year_level: string;
  campus_id: number;
  campus_name?: string;
  address_id: number;
  city?: string;
  email?: string;
  username?: string;
}

export interface CourseItem {
  course_id: string;
  course_name: string;
  units: number;
}

export interface AcademicTermItem {
  term_id: number;
  academic_year: string;
  term_name: string;
}

export interface ClassSectionItem {
  section_id: number;
  section_name: string;
  course_id: string;
  course_name?: string;
  teacher_id: string;
  teacher_name?: string;
  term_id: number;
  term_name?: string;
  student_count?: number;
}

export interface PerformanceItem {
  performance_id: number;
  enrollment_id: number;
  student_id: string;
  student_name: string;
  section_name: string;
  course_name: string;
  midterm_grade: number | null;
  final_grade: number | null;
  remarks: string | null;
}

export const initialRoles: RoleItem[] = [
  { role_id: 1, role_name: "Admin", description: "Full system administration and campus management" },
  { role_id: 2, role_name: "Teacher", description: "Class instruction, section management, and grading" },
  { role_id: 3, role_name: "Student", description: "Enrolled student with access to classes and grade performance" },
];

export const initialAddresses: AddressItem[] = [
  { address_id: 1, street_address: "124 University Ave", city: "Quezon City", province_state: "Metro Manila", postal_code: "1101" },
  { address_id: 2, street_address: "45 Innovation Blvd", city: "Taguig City", province_state: "Metro Manila", postal_code: "1630" },
  { address_id: 3, street_address: "78 Capitol Hills", city: "Cebu City", province_state: "Cebu", postal_code: "6000" },
  { address_id: 4, street_address: "12 Aguinaldo Hwy", city: "Dasmariñas", province_state: "Cavite", postal_code: "4114" },
];

export const initialCampuses: CampusItem[] = [
  { campus_id: 1, campus_name: "Main Campus (Quezon City)", address_id: 1, address: initialAddresses[0] },
  { campus_id: 2, campus_name: "Global City Campus (BGC)", address_id: 2, address: initialAddresses[1] },
  { campus_id: 3, campus_name: "Visayas Regional Center (Cebu)", address_id: 3, address: initialAddresses[2] },
];

export const initialCourses: CourseItem[] = [
  { course_id: "CS101", course_name: "Introduction to Computer Science", units: 3 },
  { course_id: "CS202", course_name: "Data Structures & Algorithms", units: 4 },
  { course_id: "DB301", course_name: "Database Systems & Architecture", units: 3 },
  { course_id: "WEB302", course_name: "Web Systems & Technologies", units: 3 },
  { course_id: "MATH101", course_name: "Calculus for Engineers", units: 4 },
  { course_id: "ENG101", course_name: "Technical Communication & Ethics", units: 3 },
];

export const initialAcademicTerms: AcademicTermItem[] = [
  { term_id: 1, academic_year: "2025-2026", term_name: "1st Semester" },
  { term_id: 2, academic_year: "2025-2026", term_name: "2nd Semester" },
  { term_id: 3, academic_year: "2026-2027", term_name: "1st Semester" },
];

export const initialTeachers: TeacherItem[] = [
  { teacher_id: "TCH-001", user_id: 2, first_name: "Juan", last_name: "Reyes", contact_number: "+63 917 123 4567", sex: "Male", campus_id: 1, campus_name: "Main Campus (Quezon City)", email: "j.reyes@school.edu", username: "teacher.reyes" },
  { teacher_id: "TCH-002", user_id: 3, first_name: "Ana", last_name: "Dizon", contact_number: "+63 918 234 5678", sex: "Female", campus_id: 1, campus_name: "Main Campus (Quezon City)", email: "a.dizon@school.edu", username: "teacher.dizon" },
  { teacher_id: "TCH-003", user_id: 4, first_name: "Roberto", last_name: "Lim", contact_number: "+63 919 345 6789", sex: "Male", campus_id: 2, campus_name: "Global City Campus (BGC)", email: "r.lim@school.edu", username: "teacher.lim" },
  { teacher_id: "TCH-004", user_id: 5, first_name: "Corazon", last_name: "Mendoza", contact_number: "+63 920 456 7890", sex: "Female", campus_id: 3, campus_name: "Visayas Regional Center (Cebu)", email: "c.mendoza@school.edu", username: "teacher.mendoza" },
];

export const initialStudents: StudentItem[] = [
  { student_id: "STD-2024-001", user_id: 6, first_name: "Carlo", last_name: "Cruz", contact_number: "+63 921 555 1201", sex: "Male", year_level: "2nd Year", campus_id: 1, campus_name: "Main Campus (Quezon City)", address_id: 1, city: "Quezon City", email: "carlo.cruz@school.edu", username: "student.cruz" },
  { student_id: "STD-2024-002", user_id: 7, first_name: "Bea", last_name: "Garcia", contact_number: "+63 922 555 1202", sex: "Female", year_level: "2nd Year", campus_id: 1, campus_name: "Main Campus (Quezon City)", address_id: 2, city: "Taguig City", email: "bea.garcia@school.edu", username: "student.garcia" },
  { student_id: "STD-2025-003", user_id: 8, first_name: "Kevin", last_name: "Tan", contact_number: "+63 923 555 1203", sex: "Male", year_level: "1st Year", campus_id: 2, campus_name: "Global City Campus (BGC)", address_id: 3, city: "Cebu City", email: "kevin.tan@school.edu", username: "student.tan" },
  { student_id: "STD-2023-004", user_id: 9, first_name: "Chloe", last_name: "Flores", contact_number: "+63 924 555 1204", sex: "Female", year_level: "3rd Year", campus_id: 1, campus_name: "Main Campus (Quezon City)", address_id: 4, city: "Dasmariñas", email: "chloe.flores@school.edu", username: "student.flores" },
  { student_id: "STD-2022-005", user_id: 10, first_name: "Miguel", last_name: "Santos", contact_number: "+63 925 555 1205", sex: "Male", year_level: "4th Year", campus_id: 3, campus_name: "Visayas Regional Center (Cebu)", address_id: 3, city: "Cebu City", email: "miguel.santos@school.edu", username: "student.santos" },
  { student_id: "STD-2024-006", user_id: 11, first_name: "Alyssa", last_name: "Navarro", contact_number: "+63 926 555 1206", sex: "Female", year_level: "2nd Year", campus_id: 1, campus_name: "Main Campus (Quezon City)", address_id: 1, city: "Quezon City", email: "alyssa.navarro@school.edu", username: "student.navarro" },
];

export const initialSections: ClassSectionItem[] = [
  { section_id: 1, section_name: "CS101-Section A", course_id: "CS101", course_name: "Introduction to Computer Science", teacher_id: "TCH-001", teacher_name: "Prof. Juan Reyes", term_id: 1, term_name: "2025-2026 - 1st Semester", student_count: 28 },
  { section_id: 2, section_name: "CS202-Section B", course_id: "CS202", course_name: "Data Structures & Algorithms", teacher_id: "TCH-002", teacher_name: "Prof. Ana Dizon", term_id: 1, term_name: "2025-2026 - 1st Semester", student_count: 24 },
  { section_id: 3, section_name: "DB301-Section A", course_id: "DB301", course_name: "Database Systems & Architecture", teacher_id: "TCH-002", teacher_name: "Prof. Ana Dizon", term_id: 1, term_name: "2025-2026 - 1st Semester", student_count: 30 },
  { section_id: 4, section_name: "MATH101-Section C", course_id: "MATH101", course_name: "Calculus for Engineers", teacher_id: "TCH-003", teacher_name: "Prof. Roberto Lim", term_id: 1, term_name: "2025-2026 - 1st Semester", student_count: 32 },
  { section_id: 5, section_name: "WEB302-Section A", course_id: "WEB302", course_name: "Web Systems & Technologies", teacher_id: "TCH-001", teacher_name: "Prof. Juan Reyes", term_id: 1, term_name: "2025-2026 - 1st Semester", student_count: 26 },
];

export const initialPerformances: PerformanceItem[] = [
  { performance_id: 1, enrollment_id: 1, student_id: "STD-2024-001", student_name: "Carlo Cruz", section_name: "CS101-Section A", course_name: "Introduction to Computer Science", midterm_grade: 88.5, final_grade: 91.0, remarks: "Passed with Distinction" },
  { performance_id: 2, enrollment_id: 2, student_id: "STD-2024-002", student_name: "Bea Garcia", section_name: "CS101-Section A", course_name: "Introduction to Computer Science", midterm_grade: 93.0, final_grade: 95.5, remarks: "Excellent Performance" },
  { performance_id: 3, enrollment_id: 3, student_id: "STD-2024-001", student_name: "Carlo Cruz", section_name: "CS202-Section B", course_name: "Data Structures & Algorithms", midterm_grade: 84.0, final_grade: 87.5, remarks: "Passed" },
  { performance_id: 4, enrollment_id: 4, student_id: "STD-2023-004", student_name: "Chloe Flores", section_name: "DB301-Section A", course_name: "Database Systems & Architecture", midterm_grade: 96.0, final_grade: 98.0, remarks: "Dean's Lister" },
  { performance_id: 5, enrollment_id: 5, student_id: "STD-2025-003", student_name: "Kevin Tan", section_name: "MATH101-Section C", course_name: "Calculus for Engineers", midterm_grade: 81.0, final_grade: 83.5, remarks: "Satisfactory" },
  { performance_id: 6, enrollment_id: 6, student_id: "STD-2024-006", student_name: "Alyssa Navarro", section_name: "WEB302-Section A", course_name: "Web Systems & Technologies", midterm_grade: 90.0, final_grade: 92.0, remarks: "Passed with Honors" },
];

export const initialUsers: UserItem[] = [
  { user_id: 1, username: "admin", email: "admin@school.edu", role_id: 1, role_name: "Admin", is_active: true, must_change_password: false, last_login_at: "2026-11-03 16:30", created_at: "2026-01-10" },
  { user_id: 2, username: "teacher.reyes", email: "j.reyes@school.edu", role_id: 2, role_name: "Teacher", is_active: true, must_change_password: false, last_login_at: "2026-11-03 14:15", created_at: "2026-01-15" },
  { user_id: 3, username: "teacher.dizon", email: "a.dizon@school.edu", role_id: 2, role_name: "Teacher", is_active: true, must_change_password: false, last_login_at: "2026-11-02 09:40", created_at: "2026-01-15" },
  { user_id: 6, username: "student.cruz", email: "carlo.cruz@school.edu", role_id: 3, role_name: "Student", is_active: true, must_change_password: false, last_login_at: "2026-11-03 11:20", created_at: "2026-02-01" },
  { user_id: 7, username: "student.garcia", email: "bea.garcia@school.edu", role_id: 3, role_name: "Student", is_active: true, must_change_password: false, last_login_at: "2026-11-01 17:05", created_at: "2026-02-01" },
];

