# Class Diagram — CampusConnect

## Overview

This diagram represents the major classes (Models, Controllers/Routes, Middleware, Config) and their relationships in the CampusConnect platform.

---

## Class Diagram

```mermaid
classDiagram
    direction TB

    class User {
        +ObjectId _id
        +String name
        +String email
        +String password
        +String avatar
        +String role
        +String googleId
        +String phone
        +String bio
        +String whatsapp
        +ObjectId[] mentorColleges
        +Boolean isSpecial
        +Date createdAt
        +Date updatedAt
        +comparePassword(candidatePassword) Boolean
        +toJSON() Object
    }

    class College {
        +ObjectId _id
        +String name
        +String slug
        +String description
        +String location
        +String image
        +String registrationLink
        +String[] tags
        +String ranking
        +String fees
        +String website
        +ObjectId addedBy
        +Date createdAt
        +Date updatedAt
    }

    class MentorApplication {
        +ObjectId _id
        +ObjectId user
        +ObjectId college
        +String experience
        +String status
        +Date createdAt
        +Date updatedAt
    }

    class Settings {
        +ObjectId _id
        +String adminPassword
        +Date createdAt
        +Date updatedAt
        +compareAdminPassword(candidatePassword) Boolean
    }

    class AuthController {
        +signup(req, res) void
        +login(req, res) void
        +googleAuth(req, res) void
        +googleCallback(req, res) void
        +getMe(req, res) void
        +logout(req, res) void
        +adminLogin(req, res) void
        +changeAdminPassword(req, res) void
    }

    class CollegeController {
        +listColleges(req, res) void
        +getCollegeBySlug(req, res) void
        +createCollege(req, res) void
        +updateCollege(req, res) void
        +deleteCollege(req, res) void
    }

    class MentorController {
        +applyAsMentor(req, res) void
        +getMentorsByCollege(req, res) void
        +listApplications(req, res) void
        +updateApplication(req, res) void
        +getMyApplications(req, res) void
    }

    class UserController {
        +getProfile(req, res) void
        +updateProfile(req, res) void
        +getMentorProfile(req, res) void
        +listMentors(req, res) void
        +createMentor(req, res) void
        +deleteMentor(req, res) void
        +listSpecialMentors(req, res) void
        +toggleSpecialMentor(req, res) void
        +listProfessors(req, res) void
        +createProfessor(req, res) void
        +deleteProfessor(req, res) void
    }

    class AuthMiddleware {
        +authenticate(req, res, next) void
        +requireAdmin(req, res, next) void
        +generateToken(userId) String
    }

    class PassportConfig {
        +LocalStrategy
        +GoogleStrategy
        +serializeUser()
        +deserializeUser()
    }

    class DatabaseConfig {
        +connectDB() void
    }

    %% Model Relationships
    User "1" --> "*" College : mentorColleges
    College "1" --> "1" User : addedBy
    MentorApplication "1" --> "1" User : user
    MentorApplication "1" --> "1" College : college

    %% Controller-Model Dependencies
    AuthController ..> User : uses
    AuthController ..> Settings : uses
    CollegeController ..> College : uses
    CollegeController ..> User : uses
    MentorController ..> MentorApplication : uses
    MentorController ..> User : uses
    MentorController ..> College : uses
    UserController ..> User : uses

    %% Middleware Dependencies
    AuthMiddleware ..> User : queries
    AuthController ..> AuthMiddleware : protected by
    CollegeController ..> AuthMiddleware : protected by
    MentorController ..> AuthMiddleware : protected by
    UserController ..> AuthMiddleware : protected by

    %% Config Dependencies
    PassportConfig ..> User : authenticates
    AuthController ..> PassportConfig : uses
    DatabaseConfig ..> College : connects
```

---

## Class Descriptions

### Models (Data Layer)

| Class               | Purpose                                              |
|---------------------|------------------------------------------------------|
| **User**            | Represents all users (student, mentor, professor, admin). Includes bcrypt password hashing and comparison methods. |
| **College**         | Represents a college entity with metadata. Auto-generates URL slug from name. |
| **MentorApplication** | Tracks mentor applications with status (pending/approved/rejected). Unique index on user+college. |
| **Settings**        | Stores platform-level settings like the admin password (hashed). |

### Controllers (Business Logic Layer)

| Class                | Purpose                                              |
|----------------------|------------------------------------------------------|
| **AuthController**   | Handles signup, login (local + Google), logout, admin auth, and password changes. |
| **CollegeController**| CRUD operations for colleges, search and filter functionality. |
| **MentorController** | Mentor application lifecycle: apply, list, approve, reject. |
| **UserController**   | Profile management, admin CRUD for mentors/professors, special mentor toggling. |

### Infrastructure

| Class               | Purpose                                              |
|---------------------|------------------------------------------------------|
| **AuthMiddleware**  | JWT verification, admin role checking, token generation. |
| **PassportConfig**  | Configures Local and Google OAuth strategies.        |
| **DatabaseConfig**  | MongoDB connection via Mongoose.                     |

---

## Design Patterns Used

| Pattern                  | Where Applied                                      |
|--------------------------|---------------------------------------------------|
| **MVC Architecture**     | Models → Controllers → Routes → Views (React)     |
| **Middleware Pattern**   | AuthMiddleware for authentication & authorization  |
| **Strategy Pattern**     | Passport.js strategies (Local, Google)             |
| **Repository Pattern**   | Mongoose models encapsulate all DB operations      |
| **Observer Pattern**     | Mongoose pre-save hooks for password hashing       |

---

**Date**: 22 April 2026
