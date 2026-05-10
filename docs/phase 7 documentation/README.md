# BU Transakto – Registrar Document Request Management System

![BU Logo](img/transakto1.png)
## 📌 Live Demo
[https://bu-transakto.onrender.com](https://bu-transakto.onrender.com)   <!-- replace with your actual Render URL -->

## 📄 Description
BU Transakto is a full‑stack web application that streamlines document requests at Bicol University – Polangui Campus. Students can request transcripts, certificates, and other documents online, track their request status, and receive notifications. Staff manage requests, update statuses, and view analytics. The app is a **Progressive Web App (PWA)** – installable on devices and works offline (static assets cached).

## ✨ Features

### Students
- Register / Login
- Request documents (document type, purpose, copies, semester/year)
- Edit/delete **pending** requests only
- View request status and history
- Receive notifications on status changes
- Provide feedback with optional anonymous submission
- Edit profile (all fields required, email validation)
- Change password (min 6 characters)
- Dark mode toggle

### Staff
- Dashboard with statistics (total requests, pending, processing, completed, rejected)
- View all student requests with search/filter
- Update request status (pending → processing → completed/rejected)
- View registered students
- Read student feedback (anonymised if checked)
- Change password

### General
- Fully responsive UI (mobile, tablet, desktop)
- Progressive Web App (installable, offline caching)
- JWT authentication & role‑based access
- RESTful API with Express & MongoDB Atlas
- Toast notifications for user actions

## 🛠️ Technologies Used

**Frontend**  
- HTML5, CSS3 (custom design with glassmorphism)  
- JavaScript (ES6+)  
- Font Awesome Icons, Google Fonts  

**Backend**  
- Node.js, Express.js  
- MongoDB Atlas, Mongoose ODM  
- JWT for authentication, bcrypt for password hashing  

**DevOps & PWA**  
- Render (hosting with HTTPS)  
- Web App Manifest, Service Worker  

## 📦 Installation (Local Development)

1. **Clone the repository**  
   ```bash
   git clone https://github.com/Juvybaldovinobellen/FINAL-PROJECT-KMJs-BSIT2A.git
   cd FINAL-PROJECT-KMJs-BSIT2A
   ```

2. **Install backend dependencies**  
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file inside `backend/` with:
   ```
   MONGO_URI= mongodb+srv://KMJs:KMJs@finalprojectbutransakto.ftmikhy.mongodb.net/?appName=FinalProjectBUTransakto
   JWT_SECRET= aefb48916ad1a3291bee3e7f33cfb82afe3ec70b0b1baba8eaa343a1919f3642
   PORT= 5000
   ```

4. **Run the backend**  
   ```bash
   nodemon server.js
   ```
   The server runs on `http://localhost:5000`

5. **Access the frontend**  
   Open your browser and go to `http://localhost:5000` – the static files are served from the `frontend` folder.

## 👥 Contributors

- **Janet Realubit** – Backend Developer (API design, authentication, database, PWA integration)  
- **Kimberky Anne Intia** – UI/UX, dashboard logic, form handling  
- **Ma. mera Hermo** – MongoDB schema design, data validation  
- **Juvy Bellen** – Repository management, branch merging  
- **Jesseca Mae Septo** – Reporting, README, diagrams  

## 📁 Folder Structure

```
FINAL-PROJECT-KMJs-BSIT2A/
├── backend/           # Express server, routes, controllers, models
├── frontend/          # HTML, CSS, JS, images, PWA files
├── .gitignore
└── README.md
```

## 📸 Screenshots
![Landing Page](img/landingPage.png)
- **Landing Page** – role selection with glassmorphism design
![Student Dashboard](img/studentDashboard.png)
- **Student Dashboard** – statistics and recent requests
![New Request Form](img/newRequestForm.png)
- **New Request Form** – dropdowns for course, year, semester
![Edit Request Modal](img/editRequestModal.png)
- **Edit Request Modal** – pre‑filled dropdowns for pending requests
![Feedback Form](img/feedbackForm.png)
- **Feedback Form** – anonymous submission checkbox
![Staff Dashboard](img/studentDashboard.png)
- **Staff Dashboard** – statistics and request summary
![Staff All Requests](img/staffAllRequests.png)
- **Staff All Requests** – search/filter and status update
![Staff Feedback](img/staffFeedback.png)
- **Staff Feedback** – anonymised entries when chosen
![PWA Offline Mode](img/PWAOfflineMode.png)
- **PWA Offline Mode** – page loads even with network offline

## 🧪 Testing

Lighthouse scores (localhost): Performance 96, Accessibility 100, Best Practices 83.

## 🔗 Links

- **GitHub Repository:** https://github.com/Juvybaldovinobellen/FINAL-PROJECT-KMJs-BSIT2A.git  
- **Live Demo:** https://bu-transakto.onrender.com/

---

_This project was developed as the final requirement for IT 112 – Web Systems and Technologies._
