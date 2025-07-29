# 📘 E-Learning Platform

A full-featured E-Learning Platform built with **NestJS (Backend)**, **Next.js (Frontend)**, and **PostgreSQL** using **TypeORM**.

## 🚀 Features

### 👨‍🎓 Student
- Register/login with JWT authentication
- Browse and enroll in courses
- Track lesson progress
- Submit reviews & ratings
- Automatically receive a certificate upon course completion
- Receive email notifications on enrollment and completion

### 👩‍🏫 Instructor
- Create and manage courses
- Upload lessons (videos)

### 🛠️ Admin
- Approve or reject newly created courses

---

## ⚙️ Installation

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/elearning-platform.git
cd elearning-platform
````

### 2. Set up environment variables

Create a `.env` file in both `frontend/` and `backend/`.

**Backend (`backend/.env`)**

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/elearning
JWT_SECRET=your_jwt_secret
MAIL_USER=youremail@gmail.com
MAIL_PASS=your_email_password
```

**Frontend (`frontend/.env.local`)**

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Install dependencies

**Backend:**

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run start:dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing the App

### Student Flow

* Register → Login
* Enroll in course → Track progress
* Submit review → See certificate after 100%

### Instructor Flow

* Create course → Add lessons
* View analytics after student enrolls/completes

### Admin Flow

* Approve pending courses
* Monitor system-wide usage (optional)

---

## 📬 Email Notifications

* Sent via **Nodemailer (Gmail)** on:

  * ✅ Course enrollment
  * 🎉 Course completion
* Customize templates inside `mail.service.ts`
---

## 🛡️ Security

* Protected routes using JWT + Role guards
* Passwords hashed with bcrypt
* Input validation on both frontend and backend

---
