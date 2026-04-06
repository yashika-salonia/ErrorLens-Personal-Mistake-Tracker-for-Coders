# Mistake Tracker

Full-stack MERN project using:

- React + Vite
- Tailwind CSS
- Node.js + Express
- MongoDB
- JWT Authentication


# 📘 API Documentation

## 👤 Users — `/api/users`

- **POST** `/api/users/register` → Register user (No Auth)
- **POST** `/api/users/login` → Login user (No Auth)
- **GET** `/api/users/me` → Get current user (Auth)
- **PUT** `/api/users/me` → Update profile (Auth)
- **PUT** `/api/users/me/password` → Change password (Auth)

---

## 🧩 Problems — `/api/problems`

- **GET** `/api/problems` → Get all problems (Auth)  
  Query params: `domain`, `difficulty`, `tag`, `search`, `page`, `limit`

- **GET** `/api/problems/:id` → Get single problem (Auth)
- **POST** `/api/problems` → Create problem (Auth)
- **PUT** `/api/problems/:id` → Update problem (Auth)
- **DELETE** `/api/problems/:id` → Delete problem (Auth)

---

## 🧪 Test Cases — `/api/testcases`

- **POST** `/api/testcases` → Create test case
- **GET** `/api/testcases/problem/:problemId` → Visible test cases
- **GET** `/api/testcases/problem/:problemId/all` → All test cases (including hidden)
- **GET** `/api/testcases/:id` → Get single test case
- **PUT** `/api/testcases/:id` → Update test case
- **DELETE** `/api/testcases/:id` → Delete test case
  
---

## 📤 Submissions — `/api/submissions`

- **POST** `/api/submissions` → Create submission
- **GET** `/api/submissions/me` → Get user submissions  
  Query params: `status`, `problemId`
- **GET** `/api/submissions/problem/:problemId` → Submissions for a problem
- **GET** `/api/submissions/:id` → Get single submission (owner only)
- **PUT** `/api/submissions/:id/mistakes` → Update mistake tags

---

## 📊 Analytics — `/api/analytics`

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
