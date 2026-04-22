# Sequence Diagram — CampusConnect

## Overview

This document illustrates the end-to-end main flow of the platform: from user registration to discovering a college and connecting with a mentor.

---

## Flow 1: User Registration & Login

```mermaid
sequenceDiagram
    actor Student
    participant Client as React Client
    participant Server as Express Server
    participant DB as MongoDB
    participant Google as Google OAuth

    Note over Student, Google: Email/Password Signup Flow
    Student->>Client: Fill signup form (name, email, password)
    Client->>Server: POST /api/auth/signup
    Server->>DB: Check if email exists
    DB-->>Server: No existing user
    Server->>DB: Create User (hash password with bcrypt)
    DB-->>Server: User created
    Server->>Server: Generate JWT token
    Server-->>Client: Set HTTP-only cookie + return user & token
    Client->>Client: Store token in localStorage
    Client-->>Student: Redirect to Dashboard

    Note over Student, Google: Google OAuth Login Flow
    Student->>Client: Click "Login with Google"
    Client->>Server: GET /api/auth/google
    Server->>Google: Redirect to Google consent screen
    Google-->>Student: Show consent screen
    Student->>Google: Approve access
    Google->>Server: GET /api/auth/google/callback (with auth code)
    Server->>Google: Exchange code for profile
    Google-->>Server: Return profile (name, email, avatar)
    Server->>DB: Find or Create user by googleId/email
    DB-->>Server: User record
    Server->>Server: Generate JWT token
    Server-->>Client: Redirect to /auth/callback?token=xxx
    Client->>Client: Store token in localStorage
    Client-->>Student: Redirect to Dashboard
```

---

## Flow 2: College Discovery & Mentor Connection

```mermaid
sequenceDiagram
    actor Student
    participant Client as React Client
    participant Server as Express Server
    participant DB as MongoDB

    Note over Student, DB: Browse & Search Colleges
    Student->>Client: Navigate to /colleges
    Client->>Server: GET /api/colleges?search=IIT
    Server->>DB: Query colleges with search filter
    DB-->>Server: Return matching colleges
    Server-->>Client: JSON response with colleges array
    Client-->>Student: Display college cards

    Note over Student, DB: View College Detail
    Student->>Client: Click on a college card
    Client->>Server: GET /api/colleges/:slug
    Server->>DB: Find college by slug
    Server->>DB: Find mentors (role=mentor, mentorColleges includes college)
    Server->>DB: Find professors (role=professor, mentorColleges includes college)
    DB-->>Server: College + Mentors + Professors
    Server-->>Client: JSON response
    Client-->>Student: Display college info, mentor cards, professor cards

    Note over Student, DB: Contact a Mentor
    Student->>Client: Click mentor's WhatsApp button
    Client-->>Student: Open WhatsApp link (wa.me/number)
```

---

## Flow 3: Mentor Application & Approval

```mermaid
sequenceDiagram
    actor Student
    actor Admin
    participant Client as React Client
    participant Server as Express Server
    participant DB as MongoDB

    Note over Student, DB: Student Applies as Mentor
    Student->>Client: Fill mentor application (select college, write experience)
    Client->>Server: POST /api/mentors/apply (collegeId, experience)
    Server->>Server: Verify JWT (authenticate middleware)
    Server->>DB: Check for duplicate application
    DB-->>Server: No duplicate found
    Server->>DB: Create MentorApplication (status=pending)
    DB-->>Server: Application created
    Server-->>Client: 201 Created
    Client-->>Student: Show success toast

    Note over Admin, DB: Admin Reviews Application
    Admin->>Client: Navigate to Admin Dashboard
    Client->>Server: GET /api/mentors/applications
    Server->>Server: Verify JWT + requireAdmin middleware
    Server->>DB: Fetch all applications (populate user & college)
    DB-->>Server: Applications list
    Server-->>Client: JSON response
    Client-->>Admin: Display applications table

    Note over Admin, DB: Admin Approves Application
    Admin->>Client: Click "Approve" on application
    Client->>Server: PUT /api/mentors/applications/:id {status: "approved"}
    Server->>DB: Update application status to "approved"
    Server->>DB: Update User role to "mentor"
    Server->>DB: Add college to user.mentorColleges
    DB-->>Server: Updated
    Server-->>Client: JSON response
    Client-->>Admin: Show success toast, update UI
```

---

## Flow 4: Admin College Management

```mermaid
sequenceDiagram
    actor Admin
    participant Client as React Client
    participant Server as Express Server
    participant DB as MongoDB

    Note over Admin, DB: Admin Login
    Admin->>Client: Enter admin password
    Client->>Server: POST /api/auth/admin/login {password}
    Server->>DB: Find Settings / Admin User
    Server->>Server: Compare bcrypt hash
    Server->>Server: Generate JWT token
    Server-->>Client: Return admin user + token
    Client-->>Admin: Redirect to Admin Dashboard

    Note over Admin, DB: Create a New College
    Admin->>Client: Fill college form (name, desc, location, tags...)
    Client->>Server: POST /api/colleges
    Server->>Server: authenticate + requireAdmin
    Server->>DB: Check slug uniqueness
    Server->>DB: Create College document
    DB-->>Server: College created
    Server-->>Client: 201 Created
    Client-->>Admin: Show success, refresh list

    Note over Admin, DB: Delete a College
    Admin->>Client: Click "Delete" on a college
    Client->>Server: DELETE /api/colleges/:id
    Server->>Server: authenticate + requireAdmin
    Server->>DB: Delete college document
    Server->>DB: Remove college from all users' mentorColleges
    DB-->>Server: Done
    Server-->>Client: Success response
    Client-->>Admin: Remove from UI
```

---

**Date**: 22 April 2026
