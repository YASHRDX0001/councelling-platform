# CampusConnect — College Counselling Platform

## Project Idea

**CampusConnect** is a full-stack web platform designed to bridge the gap between prospective students and verified college mentors/professors. The platform empowers students to make informed decisions about higher education by connecting them directly with people already studying at or teaching in their target colleges.

---

## Problem Statement

Students seeking admission to colleges often lack reliable, first-hand information about campus life, admission processes, fees, placements, and culture. Existing resources are either outdated, biased, or lack personal touch. There is no centralized platform where students can directly reach out to verified mentors and professors for authentic guidance.

---

## Target Audience

| Audience       | Description                                                      |
|----------------|------------------------------------------------------------------|
| **Students**   | High school / undergraduate students seeking college admissions  |
| **Mentors**    | Current students of colleges who volunteer to guide aspirants     |
| **Professors** | Faculty members willing to provide academic counselling           |
| **Admin**      | Platform administrator managing colleges, mentors & professors   |

---

## Scope

- **Authentication**: Email/password and Google OAuth 2.0 login
- **College Discovery**: Browse, search, and filter colleges by name, location, and tags
- **Mentor System**: Students can apply to become mentors; admin approves/rejects applications
- **Professor Directory**: Admin can add professors linked to specific colleges
- **Profile Management**: Users can edit their profile, bio, phone, and WhatsApp contact
- **Admin Dashboard**: Full CRUD for colleges, mentor management, professor management, and password settings
- **Referral Links**: Each college can have a unique registration/referral link
- **Responsive Design**: Dark-themed, glassmorphism-based UI optimized for mobile and desktop

---

## Key Features

### 🔐 Authentication & Authorization
- Email/Password signup + login
- Google OAuth 2.0 via Passport.js
- JWT-based session management with HTTP-only cookies
- Role-based access control: `student`, `mentor`, `professor`, `admin`

### 🎓 College Management
- Admin can create, update, and delete colleges
- Auto-generated URL slugs from college names
- Fields: name, description, location, image, registration link, tags, ranking, fees, website
- Public search and filter by name, location, and tags

### 👨‍🏫 Mentor & Professor System
- Students can apply to become mentors for specific colleges
- Admin reviews and approves/rejects mentor applications
- Approved mentors are publicly visible on the college detail page
- Admin can directly create mentors and professors
- Featured/special mentor designation for homepage display

### 📋 Admin Dashboard
- Password-only admin login (separate from regular login)
- Manage colleges (CRUD)
- Manage mentor applications (approve/reject)
- Manage mentors and professors (create/delete)
- Change admin password

### 👤 User Profile
- View and edit personal profile
- Display linked mentor colleges
- Contact details: phone, WhatsApp, bio

### 📱 Responsive & Modern UI
- Dark theme with glassmorphism design
- React 18 + Vite for fast development
- React Router v6 for client-side navigation
- Toast notifications for user feedback

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, React Router v6   |
| Styling    | Vanilla CSS (Dark Glassmorphism)  |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose                |
| Auth       | JWT, Passport.js (Local + Google) |
| HTTP       | Axios                             |
| Deployment | Vercel (Frontend) + Render (API)  |

---

## Date

**22 April 2026**
