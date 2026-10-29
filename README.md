# 🚀 MailGen AI - AI-Powered Cold Email Generator

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://ai-powered-cold-email-generator.vercel.app/)
[![API Status](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://ai-powered-cold-email-generator.onrender.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

> An end-to-end full-stack MERN application that generates high-converting cold outreach campaigns in seconds using Groq-accelerated AI models. Powered by React, Vite, Tailwind CSS, Express, MongoDB Atlas, and Nodemailer.

---

## 🌐 Live Deployments

- **Frontend App**: [https://ai-powered-cold-email-generator.vercel.app/](https://ai-powered-cold-email-generator.vercel.app/)
- **Backend API**: [https://ai-powered-cold-email-generator.onrender.com/](https://ai-powered-cold-email-generator.onrender.com/)

---

## ✨ Features

- **⚡ Instant Multi-Channel Outreach Generation**:
  - **High-Converting Subject Line**: 6–9 punchy words highlighting value or experience.
  - **Structured Cold Email Body**: 60–90 words with personalized observations, impact metrics, and a clear call-to-action (CTA).
  - **LinkedIn Direct Message (DM)**: 30–50 words casual yet impactful outreach.
  - **Strategic Follow-up Email**: 50–80 words with a fresh angle and professional urgency.
- **🔐 Secure Authentication & Verification**:
  - User registration & password hashing with `bcryptjs`.
  - 6-digit OTP email verification powered by `nodemailer` and Gmail SMTP.
  - JWT (JSON Web Token) authentication with bearer authorization middleware.
- **📋 User History & Dashboard**:
  - Automatically stores generated outreach campaigns linked to your user account in MongoDB Atlas.
  - One-click **Copy to Clipboard** with visual feedback.
  - Real-time toast feedback with `react-hot-toast`.
- **🎨 Modern, Responsive UI**:
  - Built with React and Vite.
  - Tailwind CSS styling with Heroicons.
  - Clean responsive layout for mobile, tablet, and desktop.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 / 19 + Vite
- **Styling**: Tailwind CSS
- **Routing**: `react-router-dom`
- **HTTP Client**: `axios`
- **Icons**: `@heroicons/react`
- **Notifications**: `react-hot-toast`
- **Hosting**: [Vercel](https://vercel.com)

### Backend
- **Runtime & Framework**: Node.js & Express
- **Database**: MongoDB Atlas (via Mongoose ODM)
- **AI Engine**: Groq Cloud API (`openai/gpt-oss-20b` ultra-fast inference)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcryptjs`
- **Email Service**: Nodemailer (Gmail SMTP for OTP delivery)
- **Hosting**: [Render](https://render.com)

---

## 📁 Project Structure

```text
AI-Powered-Cold-Email-Generator/
├── Backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── aiController.js       # Groq AI generation & history logic
│   │   └── authController.js     # User registration, OTP, and login
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT route protection middleware
│   ├── models/
│   │   ├── EmailHistory.js       # Outreach campaign MongoDB schema
│   │   └── User.js               # User credentials & OTP schema
│   ├── routes/
│   │   ├── aiRoutes.js           # /api/ai endpoints
│   │   └── authRoutes.js         # /api/auth endpoints
│   ├── utils/
│   │   └── emailService.js       # Nodemailer OTP sender
│   ├── .env                      # Environment variables (ignored in Git)
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
├── Frontend/
│   ├── public/                   # Static assets & favicon
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, Layout
│   │   ├── context/              # AuthContext (state management)
│   │   ├── pages/                # Landing, Login, Signup, VerifyOtp, Dashboard
│   │   ├── utils/                # Axios API instance
│   │   ├── App.jsx               # Route definitions
│   │   ├── index.css             # Base styles & custom scrollbars
│   │   └── main.jsx              # React app entry point
│   ├── index.html                # HTML entry + Tailwind CDN config
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration
└── README.md
```

---

## 📡 API Endpoints

### 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register new user & dispatch 6-digit OTP email | ❌ |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit OTP and activate account | ❌ |
| `POST` | `/api/auth/login` | Login with email and password (returns JWT) | ❌ |

### 2. AI & Outreach (`/api/ai`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/ai/generate-email` | Generate complete cold outreach package | ✅ Bearer Token |
| `GET` | `/api/ai/history` | Fetch all previously generated campaigns | ✅ Bearer Token |

### 3. Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Confirms backend server is running and healthy |

---

## 🚀 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- [Groq Cloud](https://console.groq.com) API Key (Free)
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/<your-username>/AI-Powered-Cold-Email-Generator.git
cd AI-Powered-Cold-Email-Generator
```

---

### Step 2: Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   npm install
   ```

2. Create a `.env` file inside `Backend/`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai-cold-email?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   Server will run at `http://localhost:5000`.

---

### Step 3: Frontend Setup

1. Open a new terminal and navigate to `Frontend`:
   ```bash
   cd Frontend
   npm install
   ```

2. *(Optional)* Create a `.env` file in `Frontend/` if you wish to override the API URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   *(By default, it falls back to the live Render API URL).*

3. Start the frontend dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🚢 Deployment Guide

### Deploy Backend (Render)
1. Create a **New Web Service** connected to your GitHub repo.
2. Set **Root Directory** to `Backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `node server.js`.
5. Add your Environment Variables (`MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `EMAIL_USER`, `EMAIL_PASS`).

### Deploy Frontend (Vercel)
1. Import your GitHub repository to Vercel.
2. Set **Root Directory** to `Frontend`.
3. Framework Preset: **Vite**.
4. Set Environment Variable:
   - `VITE_API_URL` = `https://your-backend-service.onrender.com/api`
5. Click **Deploy**.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
