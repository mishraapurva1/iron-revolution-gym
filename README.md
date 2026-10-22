# IRON REVOLUTION 2.0 — Web-Based Gym Management & Member Information System

A full-stack, responsive, and secure Gym Management System engineered to replace manual registers, paper forms, Word documents, and disorganized Excel sheets with a unified, computerized management hub.

Developed for academic presentation and Software Engineering demonstration.

---

## 1. Project Information

* **Project Title:** Web-Based Gym Management and Member Information System
* **Gym Name:** IRON REVOLUTION 2.0
* **Gym Founder & Head Mentor:** Sachin Patel
* **Co-Mentors:** Akshay Patel (Co-Founder & Coach), Krutika Patel (Diet & Female Fitness Mentor)
* **Facility Location:** Near Primary School, Naroli Road, Naroli, Silvassa, Dadra and Nagar Haveli — 396235
* **Helpline Numbers:** +91 87349 22441 / +91 91042 31111
* **Official Instagram:** [@ironrevolution_2.0](https://www.instagram.com/ironrevolution_2.0)
* **Project Developer:** Apurva Mishra
* **Core Objective:** Centralize membership enrollment, computerized fee receipts, daily attendance tracking with duplicate prevention, trainer assignments, and workout scheduling into a high-performance web platform.

---

## 2. Technology Stack

* **Frontend:**
  * React 18 with Vite
  * TypeScript
  * Tailwind CSS (Athletic Gym Theme: `#050505`, `#121212`, `#FF1E27`, `#FFFFFF`, `#8E8E93`)
  * Lucide React Icons
  * Recharts (for executive analytics, registration trends, attendance graphs, and package distribution)
* **Backend:**
  * Node.js & Express.js REST API Architecture
  * TypeScript
  * JSON Web Tokens (JWT) & bcrypt password hashing
  * Security Middlewares: Helmet, CORS, Rate Limiting
* **Database & ORM:**
  * Prisma ORM
  * SQLite by default for zero-friction local execution (switchable to PostgreSQL with a single configuration line in `.env` and `prisma/schema.prisma`)
* **Testing:**
  * Jest & Supertest integration test suite (12/12 passing)

---

## 3. Demonstration Accounts (Viva / Evaluation)

The database seed script populates fully-configured demonstration accounts for each user role:

| Role | Email Address | Password | Description |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@ironrevolution.com` | `Admin@123` | Full access: Member & Trainer management, financial ledgers, attendance audit, notices, analytics, gym settings. |
| **TRAINER** | `trainer@ironrevolution.com` | `Trainer@123` | Coach Vikram Singh: Assigned trainees, custom workout protocol builder, timetable view, floor attendance. |
| **MEMBER** | `member@ironrevolution.com` | `Member@123` | Member Apurva Mishra (IR-MEM-1001): View personal profile, active annual plan, attendance logs, fee receipts. |

> **Note:** The Sign In page features **1-Click Demo Buttons** allowing you to instantly switch between Admin, Trainer, and Member perspectives during viva demonstrations.

---

## 4. Key Functional Modules

1. **Public Gym Website:**
   * **Hero Section:** "FORGE YOUR STRENGTH. TRANSFORM YOUR LIFE."
   * **About Us:** Mission, vision, training philosophy, and project credits.
   * **Membership Packages:** Monthly (₹999), Quarterly (₹2,499), Half-Yearly (₹4,499), Annual (₹7,999).
   * **Certified Trainers Showcase:** Coaching staff profiles with credentials.
   * **Timetable & Classes:** Live weekly schedule with room and coach information.
   * **Contact & Location:** Official facility address in Naroli, Silvassa, contact desk, and Google Map.
   * **Registration & Sign In:** Validated registration workflow (assigns `PENDING` status to protect admin integrity).

2. **Role-Based Access Control (RBAC):**
   * Strict authorization checks enforced at both the API middleware and client levels.
   * Members can only access their own private records, attendance, and fee receipts.

3. **Admin Management Hub:**
   * **Executive Dashboard:** Live KPI stat cards (Total Members, Active, Expiring Soon, Trainers, Today's Attendance, Revenue).
   * **Interactive Charts:** Recharts visualization of monthly registrations, weekly attendance curves, and package distribution.
   * **Member Management:** Add, edit, search, filter (Active, Pending, Expired, Inactive), view detailed history, and export records to CSV.
   * **Trainer Management:** Register coaches, assign specialties, and track member allocations.
   * **Daily Attendance Ledger:** Date picker, Mark Present/Absent, check-in timestamps, daily attendance statistics, and **database-level duplicate prevention** (cannot mark same member twice on the same day).
   * **Membership Plans Architecture:** Dynamic database-driven pricing and benefits editing.
   * **Fee & Payment Records:** Log payments (Cash, UPI, Card, Bank Transfer), automated unique receipt generation (`REC-2026-0001`), and **Printable Official Receipt Modal**.
   * **Workout Plans Builder:** Prescribe custom day-by-day routines with sets, reps, target muscles, and weights.
   * **Notices & Events:** Broadcast announcements with audience targeting (`ALL`, `MEMBER`, `TRAINER`) and priority flags.
   * **Reports & Audits:** Dedicated printable and CSV-exportable business intelligence reports.
   * **Gym Settings:** Configure official owner name (Sachin Patel), developer name (Apurva Mishra), location, phone, and opening hours.

---

## 5. Local Installation & Setup Instructions

### Prerequisites
* **Node.js** (v18.x or newer)
* **npm** (v9.x or newer)

### Step 1: Open Terminal in Project Directory
```powershell
cd "C:\Users\mishr\.gemini\antigravity\scratch\iron-revolution"
```

### Step 2: Install Dependencies
```powershell
npm.cmd install
```

### Step 3: Initialize Database & Run Seed Data
```powershell
# Generate Prisma Client
npx.cmd prisma generate

# Push database schema
npx.cmd prisma db push

# Seed demo accounts and realistic gym records
npm.cmd run db:seed
```

### Step 4: Start the Full-Stack Application
To start both the Express backend API (Port 5000) and the Vite React frontend (Port 5173):
```powershell
npm.cmd run dev
```

* **Frontend Application:** [http://localhost:5173](http://localhost:5173)
* **Backend REST API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 6. Switching to PostgreSQL (Optional)

If your college environment prefers PostgreSQL over the default local SQLite database:

1. Open `prisma/schema.prisma` and update the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Open `.env` and set your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/iron_revolution?schema=public"
   ```
3. Run migrations and seed:
   ```powershell
   npx.cmd prisma db push
   npm.cmd run db:seed
   ```

---

## 7. Running the Automated Test Suite

To verify authentication, role-based authorization, duplicate attendance prevention, member privacy, and payment receipt creation:

```powershell
npm.cmd test
```

---

## 8. College Viva & Presentation Walkthrough

When presenting this project to your college examiners:

1. **Public Website Tour:** Show the homepage, highlight the Naroli, Silvassa location, Sachin Patel (Owner), and Apurva Mishra (Developer).
2. **One-Click Demo Switcher:** Go to Sign In and click `Admin`.
3. **Admin Dashboard:** Show the live summary cards and charts. Explain that they are calculated from real database records, not hardcoded.
4. **Member Management & Duplicate Prevention:**
   * Go to `Attendance`, select today's date, and mark Apurva Mishra present.
   * Try to mark the same member present again for the same date — highlight the duplicate prevention error alert.
5. **Fee Payment & Printable Receipt:**
   * Go to `Payments`, click `Record Payment` for a member, and submit.
   * Click `Print Receipt` to reveal the computerized receipt with gym branding and click print.
6. **CSV Export:** Click `Export CSV` on the Members or Payments page to show real-time CSV file generation.
7. **Role-Based Privacy:** Logout and sign in as `Member`. Demonstrate that the member can only view their own workout plan, attendance records, and receipts, and cannot access the admin portal.
