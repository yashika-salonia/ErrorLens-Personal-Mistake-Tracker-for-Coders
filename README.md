# ErrorLens — Personal Mistake Tracker for Coders

> **Turn your coding errors into learning opportunities.**  
> ErrorLens tracks every submission, identifies recurring mistake patterns, and builds a personalized *Mistake Personality* profile to help you grow as a developer.


## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Features](#features)


## Overview

ErrorLens is a full-stack MERN web application built for developers who want to do more than just fix bugs — they want to understand *why* they keep making the same mistakes.

The platform lets users log their coding submissions, tag mistake types, and view deep analytics including:

- Acceptance rate and submission trends
- Performance by domain (DSA, backend, frontend, etc.)
- Performance by difficulty (easy, medium, hard)
- Top recurring failure patterns
- Language-wise accuracy stats
- An AI-derived **Mistake Personality** profile unique to each user


## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Frontend     | React 18, Vite, Tailwind CSS      |
| Backend      | Node.js, Express.js               |
| Database     | MongoDB Atlas, Mongoose           |
| Auth         | JWT (JSON Web Tokens), bcrypt     |
| HTTP Client  | Axios                             |
| Routing      | React Router DOM v6               |
| Security     | Helmet, CORS                      |


## Project Structure

```
mistake-tracker/
├── client/                        # React frontend
│   └── src/
│       ├── services/              # All API call functions
│       │   ├── api.js             # Axios base instance with interceptors
│       │   ├── authService.js
│       │   ├── analyticsService.js
│       │   ├── submissionService.js
│       │   └── problemService.js
│       │   └── testCaseService.js
│       ├── context/
│       │   └── AuthContext.jsx    # Global auth state
│       ├── components/
│       │   └── analytics/
│       │   |   └── DomainPerformance.jsx
│       │   |   └── MistakeFrequency.jsx
│       │   |   └── PersonalityBadge.jsx
│       │   |   └── StatusPieChart.jsx
│       │   |   └── SummaryCard.jsx
│       │   |   └── TrendChart.jsx
│       │   └── layout/
│       │   |   └── Navbar.jsx
│       │   |   └── ProtectedRoute.jsx
│       │   |   └── Sidebar.jsx
│       │   └── mistakes/
│       │   |   └── MistakeTag.jsx
│       │   └── ui/
│       │   |   └── Badges.jsx
│       │   |   └── Button.jsx
│       │   |   └── Card.jsx
│       │   |   └── Loader.jsx
│       │   |   └── Modal.jsx
│       │   |   └── Toast.jsx
│       ├── pages/
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── AdminPage.jsx
│       │   ├── ProblemDetailPage.jsx
│       │   ├── ProblemsPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── SubmissionPage.jsx
│       │   ├── SubmitPage.jsx 
│       ├── routes/
│       │   └── AppRoutes.jsx
│       ├── App.jsx
│       └── main.jsx
│       └── App.css
│       └── index.css
│
└── server/                        # Express backend
    ├── config/
    │   └── db.js                  # MongoDB connection
    ├── controllers/
    │   ├── userController.js
    │   ├── problemController.js
    │   ├── submissionController.js
    │   ├── testCaseController.js
    │   ├── analyticsController.js
    │   └── analyticsHelpers.js    # Shared utility functions
    ├── middleware/
    │   ├── authMiddleware.js      # JWT verification
    │   └── errorMiddleware.js
    │   └── roleMiddleware.js
    │   └── asynHandler.js
    ├── models/
    │   ├── User.js
    │   ├── Problem.js
    │   ├── Submission.js
    │   └── Testcase.js
    ├── routes/
    │   ├── userRoutes.js
    │   ├── problemRoutes.js
    │   ├── submissionRoutes.js
    │   ├── testCaseRoutes.js
    │   └── analyticsRoutes.js
    ├── .env                       # Environment variables (not in git)
    └── server.js                  # Entry point
```


## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/yashika-salonia/ErrorLens-Personal-Mistake-Tracker-for-Coders
cd mistake-tracker
```

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/` (see [Environment Variables](#environment-variables)).

```bash
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Setup the frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

> Make sure both servers are running at the same time.


## Environment Variables

Create a `.env` file inside the `server/` folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<cluster-name>
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=5000
```

## API Documentation

## Users — `/api/users`

- **POST** `/api/users/register` → Register user (No Auth)
- **POST** `/api/users/login` → Login user (No Auth)
- **GET** `/api/users/me` → Get current user (Auth)
- **PUT** `/api/users/me` → Update profile (Auth)
- **PUT** `/api/users/me/password` → Change password (Auth)


## Problems — `/api/problems`

- **GET** `/api/problems` → Get all problems (Auth)  
  Query params: `domain`, `difficulty`, `tag`, `search`, `page`, `limit`

- **GET** `/api/problems/:id` → Get single problem (Auth)
- **POST** `/api/problems` → Create problem (Auth)
- **PUT** `/api/problems/:id` → Update problem (Auth)
- **DELETE** `/api/problems/:id` → Delete problem (Auth)

## Test Cases — `/api/testcases`

- **POST** `/api/testcases` → Create test case
- **GET** `/api/testcases/problem/:problemId` → Visible test cases
- **GET** `/api/testcases/problem/:problemId/all` → All test cases (including hidden)
- **GET** `/api/testcases/:id` → Get single test case
- **PUT** `/api/testcases/:id` → Update test case
- **DELETE** `/api/testcases/:id` → Delete test case
  

## Submissions — `/api/submissions`

- **POST** `/api/submissions` → Create submission
- **GET** `/api/submissions/me` → Get user submissions  
  Query params: `status`, `problemId`
- **GET** `/api/submissions/problem/:problemId` → Submissions for a problem
- **GET** `/api/submissions/:id` → Get single submission (owner only)
- **PUT** `/api/submissions/:id/mistakes` → Update mistake tags

## Analytics — `/api/analytics`

- **GET** `/api/analytics/summary`
- **GET** `/api/analytics/status-breakdown`
- **GET** `/api/analytics/mistake-types`
- **GET** `/api/analytics/domain-performance`
- **GET** `/api/analytics/difficulty-performance`
- **GET** `/api/analytics/trend` → `range = week | month | year`
- **GET** `/api/analytics/recurring-mistakes` → `limit (default: 5, range: 1–20)`
- **GET** `/api/analytics/language-stats`
- **GET** `/api/analytics/mistake-personality`
- **GET** `/api/analytics/admin/overview`

## Features

### Authentication
- JWT-based secure login and registration
- Passwords hashed with bcrypt (10 salt rounds)
- Auto token refresh via Axios interceptors
- Protected routes on both frontend and backend

### Mistake Tracking
- Log submissions with code, language, and status
- Tag one or multiple mistake types per submission
- Update mistake tags any time after submission
- Filter submission history by status or problem

### Analytics Dashboard
- Summary cards: total submissions, accepted, acceptance rate
- Submission trend chart (weekly / monthly / yearly)
- Submission status breakdown
- Top mistake types frequency chart

### Deep Analytics Page
- Domain-wise performance with accuracy bars
- Difficulty-wise performance (easy → medium → hard)
- Top recurring failure problems
- Language accuracy stats
- **Mistake Personality Profile** — derived from your dominant mistake pattern

### Mistake Personality System
Each user gets a unique personality label based on their top mistake type:

| Personality            | Dominant Mistake     |
|------------------------|----------------------|
| The Overthinker        | Logic errors         |
| The Speed Coder        | Syntax errors        |
| The Optimist           | Edge case failures   |
| The Brute-Forcer       | Performance issues   |
| The Risk Taker         | Runtime errors       |
| The Juggler            | State management     |
| The Bridge Builder     | API integration      |
| The Data Whisperer     | Database queries     |
| The Rusher             | Validation errors    |
| The Explorer           | Mixed / Unknown      |

*Made with purpose — because fixing bugs is easy, understanding them is hard.*
