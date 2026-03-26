# capstone
# UCU Innovators Hub
**CSC1202 – Web and Mobile Application Development | Advent 2025 Exam**  
Uganda Christian University — Faculty of Engineering, Design and Technology

---

## 🗂 Project Structure

```
ucu-innovators-hub/
├── backend/          ← Node.js + Express REST API
└── frontend/         ← React SPA
```

---

## ⚙️ Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React 18, React Router  |
| Backend    | Node.js, Express.js     |
| Database   | MySQL 8                 |
| Auth       | JWT (jsonwebtoken)      |
| Charts     | Recharts                |
| Uploads    | Multer                  |
| Validation | express-validator       |

---

## 🚀 Setup Instructions

### 1. Database
```bash
mysql -u root -p < backend/database/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials and JWT secret
npm install
npm run dev       # runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start         # runs on http://localhost:3000
```

---

## 👥 User Roles & Access

| Role        | Capabilities                                      |
|-------------|---------------------------------------------------|
| Student     | Register, submit projects, view own projects      |
| Supervisor  | Review, approve, reject submissions + comments    |
| Admin       | All above + user management + analytics dashboard |

**Default Admin:** `admin@ucu.ac.ug` / `Admin@123`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| POST   | /api/auth/register | Register user       |
| POST   | /api/auth/login    | Login user          |
| GET    | /api/auth/me       | Get current user    |

### Projects
| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /api/projects               | Public gallery (approved)|
| GET    | /api/projects/my            | Student's own projects   |
| GET    | /api/projects/pending       | Pending (supervisor)     |
| GET    | /api/projects/:id           | Project detail           |
| POST   | /api/projects               | Submit project           |
| PATCH  | /api/projects/:id/status    | Approve / reject         |
| POST   | /api/projects/:id/comments  | Add comment              |

### Analytics & Admin
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | /api/analytics/overview | Dashboard data    |
| GET    | /api/users            | All users (admin)   |
| PATCH  | /api/users/:id/toggle | Activate/deactivate |
| GET    | /api/categories       | All categories      |

---

## 📋 Milestones Coverage

| Milestone | Feature                                       | Status |
|-----------|-----------------------------------------------|--------|
| 1         | Architecture, ER diagram, mockups             | ✅     |
| 2         | Auth, project submission, API, database       | ✅     |
| 3         | Analytics dashboard, charts                   | ✅     |
| 4         | Clean code, validation, security, responsive  | ✅     |
| 5         | Complete demo-ready application               | ✅     |

---

## 🗄 Database Schema (ER Summary)

```
users ──< projects ──< project_members >── users
  │                └──< comments >── users
  └── (role: student | supervisor | admin)

categories ──< projects
```

---

## 🔒 Security Features
- JWT authentication on all protected routes
- Role-based access control (RBAC)
- Password hashing with bcryptjs (12 rounds)
- Input validation on all endpoints
- File type and size restrictions (Multer)
- CORS restricted to frontend origin

---

## 📁 GitHub Repository Structure
- `main` — production-ready code
- Feature branches per team member (e.g. `feature/auth`, `feature/dashboard`)
- Pull requests used for code review

---

*UCU Innovators Hub — "A Complete Education for A Complete Person"*
