# HND Facial Attendance System - User & Administration Guide

Welcome to the **Hans Nayi Disha (HND) Facial Attendance & Mid-Day Meal Management System** user manual. This guide contains everything you need to know to run, administer, and update the application.

---

## 📱 System Overview & Architecture

The HND Attendance system is designed as a modern **Progressive Web App (PWA)** built with React, Vite, and Vanilla CSS. It runs entirely in the browser (client-side) and is designed for deployment on Vercel.

*   **Offline First**: The app runs offline on school tablets.
*   **Local Secure Storage**: Facial recognition descriptors are stored locally on each tablet device using **Dexie.js IndexedDB** for maximum security, speed, and privacy.
*   **Zero-Maintenance Backend**: The student roster, teacher accounts, and credentials are kept in a single, human-readable configuration file: `school_data.json`. Editing this file on GitHub automatically redeploys the app to the school's tablets via Vercel.

---

## 🔑 Login Accounts & Credentials

### 1. Headmaster & Admin Accounts
*   **Headmaster (Ms. Seema)**: `seema@hnd.edu` (Password: `headmaster123`)
*   **System Administrator**: `admin@hnd.edu` (Password: `admin123`)

### 2. Teacher Accounts (Password: `teacher123`)
Teachers can log in using their school email addresses:
1.  **Jaiwanti Bisht (Balwadi / UKG)**: `jaiwanti@hnd.edu`
2.  **Ritika (Group 1 - Rose - Class I)**: `ritika@hnd.edu`
3.  **Gayatree Sahoo (Group 2 - Orchid - Class II)**: `gayatree@hnd.edu`
4.  **Debasmita Ghosh (Group 3 - Lily - Class III)**: `debasmita@hnd.edu`
5.  **Satyendra Dhakad (Group 4 - Daisy - Class IV)**: `satyendra@hnd.edu`
6.  **Anita Kumari (Group 5 - Marigold - Class V)**: `anita@hnd.edu`
7.  **Abhinesh Kumar (Computer Trainer)**: `abhinesh@hnd.edu`

### 3. Parent Login Accounts (Password: `parent123`)
Parents can log in to view their child's daily attendance, meal status, and fees. They can use **three convenient formats** as their username:
*   **Option A (Mobile Number)**: The parent's 10-digit mobile number as registered in the student directory (e.g. `9599846877`).
*   **Option B (Admission Number)**: The student's unique admission number (e.g. `CSCBV-HR4237-25-14`).
*   **Option C (Email format)**: E.g., `parent_cscbv-hr4237-25-14@hnd.edu` or `9599846877@hnd.edu`.

---

## 🗄️ Backend Data Management (How to Update Roster & Passwords)

The system's "backend database" is stored in [school_data.json](file:///Users/jaadu_king/Desktop/new_project/hnd-facial-attendance/src/services/school_data.json). There is **no database server to manage**. If you need to edit class teachers, add students, change phone numbers, or update passwords, follow these simple steps:

### How to Edit Data (Zero-Code Method):
1.  Log into your **GitHub Account** and navigate to your project repository: `hnd-facial-attendance`.
2.  Navigate to the file path: `src/services/school_data.json`.
3.  Click the **Edit (pencil icon)** button in the top right corner of the file viewer.
4.  Make your changes directly in the text editor.
5.  Scroll to the bottom, write a short message (e.g., "Added new student Rahul"), and click **Commit changes**.
6.  **Done!** Vercel will automatically build the changes and update the live website on all devices within **30 seconds**.

---

### JSON Structure Examples:

#### 1. Adding a Teacher
To add a new teacher, append a new object to the `"teachers"` array in `school_data.json`:
```json
{
  "id": "teacher-new",
  "name": "New Teacher Name",
  "email": "newteacher@hnd.edu",
  "password": "teacherpassword",
  "role": "teacher",
  "schoolId": "school-001",
  "assignedClasses": ["class-1a"],
  "phone": "+91-98765-00008",
  "avatar": "NT"
}
```

#### 2. Adding a Student
To add a new student, append a new object to the `"students"` array in `school_data.json`:
```json
{
  "id": "student-cscbv-hr4237-26-999",
  "admissionNo": "CSCBV-HR4237-26-999",
  "name": "Student Full Name",
  "rollNo": 95,
  "classId": "class-1a",
  "className": "Class I-A",
  "grade": 1,
  "section": "A",
  "gender": "male",
  "schoolId": "school-001",
  "parentPhone": "9876543210",
  "enrollmentDate": "01-04-2025",
  "faceRegistered": false,
  "avatar": "SN",
  "feesPaid": 600,
  "fatherName": "Father Name",
  "motherName": "Mother Name"
}
```
> [!IMPORTANT]  
> *   `id` must be in lowercase and prefixed with `student-`.
> *   Set `"feesPaid": 600` initially so the student starts with **₹0 due** in June 2026.
> *   `avatar` should be the student's 2-letter initials.

---

## 📷 Facial Recognition Kiosk Flow

The system runs a client-side neural network powered by **face-api.js** to recognize students.

### 1. Registering a Student's Face:
1.  Log in as a **Teacher** or **Admin**, and navigate to the **Face Register** tab.
2.  Select the **Class** and the **Student**.
3.  Turn on the camera and stand in front of it.
4.  Click **Start Scan**. The system will scan and track the face in real-time, showing a green bounding box.
5.  It will capture **5 distinct facial descriptor snapshots**, average them to build a robust facial template, and save it to the tablet's IndexedDB.
6.  The student is now registered (denoted by a green `✓` in selection lists).

### 2. Kiosk Check-In Flow:
1.  Open the **Attendance** tab and toggle the mode to **Facial Recognition**.
2.  Click **Start Scanner Camera**. The system will automatically check if anyone in the class has a registered face.
    *   If **No** faces are registered, the scanner opens in **Demo Simulation Mode** (an amber banner appears at the top) to allow you to run mock check-ins.
    *   If **Yes**, the scanner opens in **Live Webcam Matching Active** mode (green banner), meaning it is actively matching video frames against real biometric templates.
3.  When a student steps in front of the tablet, the scanner detects their face, draws a green label, and freezes.
4.  A **Success Audio Beep** plays, and a green checkout card displays a 5-second countdown.
5.  The attendance log is immediately marked **Present** (marked as `📷 Facial` entry).
6.  After 5 seconds, the scanner automatically resets, ready for the next student.

---

## 📋 Attendance, Meal, & Fees Rules

### 1. Role-Based Date Lock
*   **Teachers** can only mark/edit attendance for **today (the current date)**. If they select a past date in the calendar, the form controls lock, and they must request the Headmaster to make changes.
*   **Headmasters** and **Admins** have unrestricted access to edit attendance logs for any date.

### 2. Mid-Day Meal (MDM) Wastage Tracking
*   The **Meal Planning** tab calculates food requirements based on attendance.
*   Teachers enter the number of meals actually cooked/ordered for their class.
*   If the wastage percentage exceeds **15%** (computed against checked-in students), the system generates a **Red Compliance Alert** on the Dashboard and Meal Planning page.
*   Cost calculations are computed at the compliance rate of **₹34.50 per meal**.

### 3. Student Fees Ledger
*   Students accrue dues at a rate of **₹200 per month** starting from April 2026 (the beginning of the academic year).
*   By June 2026, the target due is **₹600**.
*   To keep initial dues at ₹0, all students are initialized with `feesPaid = 600`.
*   On the first of July 2026, the target advances to ₹800, causing a ₹200 due to automatically appear for unpaid students.
*   Admins can click **Quick Pay (+₹200 / +₹400 / +₹600)** or type custom amounts in the student detail profile to record cash collections.
