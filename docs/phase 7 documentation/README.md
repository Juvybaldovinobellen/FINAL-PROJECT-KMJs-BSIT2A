Here is a **ready‑to‑paste** `README.md` file. Replace only the placeholders in `[ ]` (live URL, contributor names, screenshot descriptions). The rest is final.

```markdown
# BU Transakto – Registrar Document Request Management System

![BU Logo](frontend/img/transakto-logo.png)
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
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_key
   PORT=5000
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

(Add screenshots here: landing page, student dashboard, staff dashboard, edit request modal, feedback form, offline mode, etc.)

- **Landing Page** – role selection with glassmorphism design
- **Student Dashboard** – statistics and recent requests
- **New Request Form** – dropdowns for course, year, semester
- **Edit Request Modal** – pre‑filled dropdowns for pending requests
- **Feedback Form** – anonymous submission checkbox
- **Staff Dashboard** – statistics and request summary
- **Staff All Requests** – search/filter and status update
- **Staff Feedback** – anonymised entries when chosen
- **PWA Offline Mode** – page loads even with network offline

## 🧪 Testing

Lighthouse scores (localhost): Performance 96, Accessibility 100, Best Practices 83.

## 🔗 Links

- **GitHub Repository:** https://github.com/Juvybaldovinobellen/FINAL-PROJECT-KMJs-BSIT2A.git  
- **Live Demo:**https://bu-transakto.onrender.com/

---

_This project was developed as the final requirement for IT 112 – Web Systems and Technologies._
```

Copy the whole block above into your `README.md` file, replace the live URL and contributor names, and add your actual screenshots. Then commit and push.
