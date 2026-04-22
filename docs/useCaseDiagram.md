# Use Case Diagram — CampusConnect

## Overview

This diagram shows the interactions between the four actors (Student, Mentor, Professor, Admin) and the system's major use cases.

---

```mermaid
graph LR
    subgraph Actors
        S["🎓 Student"]
        M["👨‍🏫 Mentor"]
        P["📚 Professor"]
        A["🔑 Admin"]
    end

    subgraph Authentication
        UC1["Sign Up with Email"]
        UC2["Login with Email"]
        UC3["Login with Google OAuth"]
        UC4["Logout"]
        UC5["View Own Profile"]
        UC6["Edit Profile"]
    end

    subgraph College Discovery
        UC7["Browse Colleges"]
        UC8["Search Colleges"]
        UC9["View College Detail"]
        UC10["View College Mentors"]
        UC11["View College Professors"]
    end

    subgraph Mentor System
        UC12["Apply as Mentor"]
        UC13["View My Applications"]
        UC14["Contact Mentor via WhatsApp"]
    end

    subgraph Admin Panel
        UC15["Admin Login - Password Only"]
        UC16["Create College"]
        UC17["Edit College"]
        UC18["Delete College"]
        UC19["Approve Mentor Application"]
        UC20["Reject Mentor Application"]
        UC21["Create Mentor"]
        UC22["Delete Mentor"]
        UC23["Create Professor"]
        UC24["Delete Professor"]
        UC25["Toggle Special Mentor"]
        UC26["Change Admin Password"]
    end

    %% Student connections
    S --> UC1
    S --> UC2
    S --> UC3
    S --> UC4
    S --> UC5
    S --> UC6
    S --> UC7
    S --> UC8
    S --> UC9
    S --> UC10
    S --> UC11
    S --> UC12
    S --> UC13
    S --> UC14

    %% Mentor inherits student use cases
    M --> UC5
    M --> UC6
    M --> UC10

    %% Professor inherits viewing
    P --> UC5
    P --> UC6

    %% Admin connections
    A --> UC15
    A --> UC16
    A --> UC17
    A --> UC18
    A --> UC19
    A --> UC20
    A --> UC21
    A --> UC22
    A --> UC23
    A --> UC24
    A --> UC25
    A --> UC26
```

---

## Use Case Descriptions

| # | Use Case                    | Actor(s)       | Description                                                  |
|---|-----------------------------|----------------|--------------------------------------------------------------|
| 1 | Sign Up with Email          | Student        | Register a new account with name, email, and password        |
| 2 | Login with Email             | Student        | Authenticate using email and password                        |
| 3 | Login with Google OAuth      | Student        | Authenticate using Google account                            |
| 4 | Logout                       | All            | Clear session and JWT cookie                                 |
| 5 | View Own Profile             | All            | View personal profile details                                |
| 6 | Edit Profile                 | All            | Update name, bio, phone, WhatsApp, avatar                    |
| 7 | Browse Colleges              | Student        | View list of all available colleges                          |
| 8 | Search Colleges              | Student        | Filter colleges by name, location, or tags                   |
| 9 | View College Detail          | Student        | View full college information with mentors and professors    |
| 10| View College Mentors         | Student        | See approved mentors for a specific college                  |
| 11| View College Professors      | Student        | See professors linked to a specific college                  |
| 12| Apply as Mentor              | Student        | Submit application to become a mentor for a college          |
| 13| View My Applications         | Student/Mentor | Check status of submitted mentor applications                |
| 14| Contact Mentor via WhatsApp  | Student        | Reach out to a mentor via their WhatsApp number              |
| 15| Admin Login                  | Admin          | Login with admin-only password                               |
| 16| Create College               | Admin          | Add a new college to the platform                            |
| 17| Edit College                 | Admin          | Update college details                                       |
| 18| Delete College               | Admin          | Remove a college from the platform                           |
| 19| Approve Mentor Application   | Admin          | Accept a student's mentor application                        |
| 20| Reject Mentor Application    | Admin          | Decline a student's mentor application                       |
| 21| Create Mentor                | Admin          | Directly add a mentor without application                    |
| 22| Delete Mentor                | Admin          | Remove a mentor from the platform                            |
| 23| Create Professor             | Admin          | Add a professor linked to colleges                           |
| 24| Delete Professor             | Admin          | Remove a professor from the platform                         |
| 25| Toggle Special Mentor        | Admin          | Mark/unmark a mentor as featured on homepage                 |
| 26| Change Admin Password        | Admin          | Update the admin login password                              |

---

**Date**: 22 April 2026
