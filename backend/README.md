# 📌 BU TRANSAKTO – Registrar System (Backend)

## 📖 Overview
This backend system is part of the BU TRANSAKTO – Registrar System, a web-based platform designed to manage and streamline student document requests.

The backend is built using Node.js, Express, and MongoDB, providing RESTful APIs for handling users, document requests, and reviews.

---

## 🚀 Features
- User Authentication (Student & Staff)
- Student Document Request System
- Request Status Tracking
- Staff Request Management
- Dashboard Statistics API
- Review and Feedback System

---

## 🛠️ Technologies Used
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- bcryptjs
- dotenv
- cors

---

## 📂 Project Structure
backend/
├── server.js
├── package.json
├── .env
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   └── Request.js
├── controllers/
│   ├── authController.js
│   ├── requestController.js
│   └── staffController.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── requestRoutes.js
│   └── staffRoutes.js
├── middleware/
│   └── authMiddleware.js
└── README.md

---

## 🔌 Database Connection Setup
The system uses MongoDB Atlas for database management.

In .env file:
MONGO_URI=mongodb+srv://KMJs:KMJs@finalprojectbutransakto.ftmikhy.mongodb.net/?appName=FinalProjectBUTransakto
PORT=5000
JWT_SECRET=aefb48916ad1a3291bee3e7f33cfb82afe3ec70b0b1baba8eaa343a1919f3642

Connection is handled in:
config/db.js

---

## 📦 Models

### 👤 User Model
- name
- email
- password
- role (student / staff)
- studentInfo
- staffInfo

### 📄 Request Model
- studentId
- studentEmail
- documentType
- purpose
- notes
- status (pending, processing, completed, rejected)
- dateRequested
- dateCompleted

### ⭐ Review Model
- studentEmail
- message
- rating
- date

---

## 🌐 API Routes

### 👤 User Routes (/api/users)
| Method | Endpoint | Description |
|--------|---------|------------|
| POST | /register | Register user |
| POST | /login | Login user |
| GET | / | Get all users |
| PUT | /:email | Update user profile |

---

### 📄 Request Routes (/api/requests)
| Method | Endpoint | Description |
|--------|---------|------------|
| POST | / | Create request |
| GET | / | Get all requests |
| GET | /student/:email | Get student requests |
| GET | /recent/:email | Get recent requests |
| GET | /history/:email | Get completed requests |
| GET | /stats/:email | Dashboard statistics |
| PUT | /:id/status | Update request status |
| DELETE | /:id | Delete request |

---

### ⭐ Review Routes (/api/reviews)
| Method | Endpoint | Description |
|--------|---------|------------|
| POST | / | Add review |
| GET | / | Get all reviews |

---

## ▶️ How to Run the Server Locally

### 1. Install dependencies
npm install

### 2. Start the server
npm start

or (for auto-reload):
npm run dev

---

## 🧪 API Testing
The API endpoints were tested using Thunder Client in VS Code.

---

## 👥 Contributors
- Backend Developer – Handles API and server logic
- Database Manager – Handles MongoDB and models
- Frontend Developer – Handles UI/UX
- GitHub Manager – Handles repository and commits
- Documentation Officer – Prepares reports and documentation

---

## 📌 Notes
- Ensure MongoDB Atlas is connected before running the server.
- Use correct API endpoints when testing (e.g., /api/users, /api/requests).
- Backend runs on: http://localhost:5000

---

## ✅ Status
✔ Backend Development Completed (Phase 2)  
✔ Ready for Frontend Integration (Phase 3)