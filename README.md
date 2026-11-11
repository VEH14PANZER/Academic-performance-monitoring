# AcademiaHub - Role-Based School Management System

Full-stack school management system recreated inspired by Lama Dev's Next.js dashboard tutorial, fully mapped to your PostgreSQL DBML schema with custom Next.js authentication and RBAC.

---

## 🛠️ Tech Stack & Schema Implementation

- **Framework**: Next.js 16 (App Router, Server & Client Components)
- **Styling**: Tailwind CSS v4 with custom Lama Dev soft pastel palette (`lamaPurple`, `lamaYellow`, `lamaSky`)
- **Database ORM**: Prisma 6 mapped to PostgreSQL
- **Authentication**: Next.js custom session & credentials authentication matching `user_sessions`, `users`, and `roles`
- **Charts & UI**: Recharts + custom SVG demographic donut chart & academic performance comparisons
- **Components**: Reusable responsive Sidebar (`Menu`), Header (`Navbar`), `Table`, `TableSearch`, `Pagination`, `FormModal` (CRUD modals)

---

## 📁 Schema Entity Mapping (`prisma/schema.prisma`)

| DBML Entity | Prisma Model | Purpose |
| :--- | :--- | :--- |
| `Users` | `User` | Authentication accounts, bcrypt password hash, role linkage, session tracking |
| `Roles` | `Role` | RBAC roles (`Admin`, `Teacher`, `Student`) |
| `Permissions` | `Permission` | Granular permission capabilities |
| `Role_Permissions` | `RolePermission` | Many-to-many role-permission mapping |
| `User_Sessions` | `UserSession` | Next.js cookie session management & revocation |
| `Campuses` | `Campus` | School campuses linked to addresses |
| `Addresses` | `Address` | Street address, city, province/state, postal code |
| `Students` | `Student` | Student profile (ID, user_id, contact, sex, year level, campus, address) |
| `Teachers` | `Teacher` | Faculty profile (ID, user_id, contact, sex, campus) |
| `Admin_Profiles` | `AdminProfile` | Admin profile (ID, user_id, name, department) |
| `Courses` | `Course` | Academic courses (course_id, title, units) |
| `Academic_Terms` | `AcademicTerm` | Academic year and semester terms |
| `Class_Sections` | `ClassSection` | Scheduled classes linking Course, Teacher, and Term |
| `Student_Enrollments` | `StudentEnrollment`| Students enrolled in Class Sections |
| `Academic_Performance`| `AcademicPerformance`| Midterm grade, final grade, and official faculty remarks |

---

## 🚀 Quick Start Guide

### 1. Environment Configuration
Check `.env` (configured for PostgreSQL):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/school_management?schema=public"
AUTH_SECRET="school-management-secret-key-32charactersmin"
```

### 2. Database Sync & Seeding (when your PostgreSQL is running)
Push schema tables to your PostgreSQL instance:
```bash
npm run db:push
```
Or run Prisma Studio to browse your tables:
```bash
npm run db:studio
```

*(Note: The system includes a built-in memory fallback layer so you can run and preview the dashboard immediately even before your PostgreSQL server is spun up!)*

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
- Redirects to `/admin` dashboard
- Visit `/login` for the credentials sign-in and 1-click demo role switcher (Admin, Teacher, Student)

---

## 🌐 Role-Based Dashboard Views & Routes

- **`/admin`**: Executive school statistics (total students, faculty, sections, campuses), student demographic radial donut chart, section grade performance comparison, upcoming academic calendar, and campus announcements.
- **`/teacher`**: Assigned class sections, student rosters, quick grade submission sheet, and teaching calendar.
- **`/student`**: Active course enlisting, midterm and final grade reports, remarks (e.g. "Dean's Lister", "Passed with Distinction"), and schedule.
- **`/list/students`**: Enrolled students table with search, year-level badges, contact info, campus, and CRUD action modals.
- **`/list/teachers`**: Faculty roster table with search, department affiliation, campus assignment, and action modals.
- **`/list/sections`**: Class sections table linking courses to teachers and semester terms.
- **`/list/courses`**: Curriculum table with course codes and unit credits.
- **`/list/performance`**: Academic grade sheets (midterm, final grades, remarks).
- **`/list/campuses`**: Campuses and geographic addresses.
- **`/list/users`**: Security & user accounts with role badges and active session status.
- **`/list/roles`**: System roles and granular RBAC permissions.
- **`/profile`**: Authenticated user identity and active permission list.
- **`/login`**: Next.js authentication portal with instant role preview switchers.
