# CampusConnect — College Counselling Platform

A full-stack web platform where students can discover colleges, connect with verified mentors, and get real guidance about higher education.

## Tech Stack

- **Frontend:** React 18 + Vite, React Router v6, Vanilla CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + Google OAuth 2.0 (Passport.js)

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB running locally (or MongoDB Atlas connection string)

### 1. Backend Setup

```bash
cd server
npm install

# Create .env file (copy from .env.example)
cp .env.example .env
# Edit .env with your settings

# Seed admin user
node seed-admin.js

# Start development server
npm run dev
```

The server runs at `http://localhost:5000`

### 2. Frontend Setup

```bash
cd client
npm install

# Start development server
npm run dev
```

The client runs at `http://localhost:5173`

### 3. Default Admin Login

```
Email: admin@campusconnect.com
Password: admin123
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `CLIENT_URL` | Frontend URL (default: http://localhost:5173) |

## Features

- 🔐 Email/password & Google OAuth authentication
- 🎓 Browse and search colleges
- 👨‍🏫 Apply to become a college mentor
- 📋 Admin dashboard to manage colleges & mentor applications
- 🔗 Registration referral links per college
- 📱 Fully responsive design
- 🌙 Premium dark theme with glassmorphism UI
