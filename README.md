# SmartStudyPlanner 🚀

SmartStudyPlanner is a **full-stack study planner and task management web application** built to help students organize their learning efficiently.

It features **secure authentication**, **task management**, **progress tracking**, and a **modern responsive UI**, implemented using **industry-standard full-stack practices**.

This project is well-suited for **internships, entry-level placements, and portfolio showcasing**.

---

## 🌐 Live Demo

- **Frontend (Vercel)**  
  🔗 https://smart-study-planner-eph5.vercel.app  

- **Backend (Render)**  
  🔗 https://smartstudyplanner-2xpp.onrender.com  

---

## ✨ Key Features

### 🔐 Authentication & Security
- User **Signup & Login**
- **JWT Access Token + Refresh Token** authentication
- **Remember Me** functionality
- Secure **HttpOnly refresh token cookies**
- Automatic token refresh (no forced logout)
- **Protected routes** for authenticated users only

### ✅ Task Management
- Create, update, and delete tasks
- Task attributes:
  - Title
  - Due date
  - Priority (Low / Medium / High)
  - Tags
- Mark tasks as **completed / pending**
- Automatic **overdue task detection**

### 📊 Productivity & Insights
- Progress overview:
  - Completed
  - Remaining
  - Overdue
- Filter tasks by **status & tags**
- Sort tasks by **priority, due date, or title**
- Real-time UI updates

### 🔔 Notifications
- Overdue task notifications
- Notification dropdown with unread count

### 🎨 UI / UX
- Clean and modern UI
- Fully responsive design
- Dark mode support
- Smooth user experience

---

## 🛠️ Tech Stack

### Frontend
- **React + TypeScript**
- **Vite**
- **Tailwind CSS**
- React Router
- Context API
- React Hot Toast

### Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (Access & Refresh Tokens)**
- bcryptjs (password hashing)
- cookie-parser
- CORS

### Deployment
- **Frontend**: Vercel  
- **Backend**: Render  
- **Database**: MongoDB Atlas  

---

## 📂 Project Structure

```
SmartStudyPlanner/
├── server/ # Backend (Node + Express)
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── index.js
│ ├── package.json
│ └── .env
│
├── src/ # Frontend (React + TS)
│ ├── components/
│ ├── context/
│ ├── hooks/
│ ├── pages/
│ ├── types/
│ ├── utils/
│ ├── App.tsx
│ └── main.tsx
│
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md

```

## ▶️ Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/DebuggerO1/SmartStudyPlanner.git
cd SmartStudyPlanner
```
### 2️⃣ Backend Setup
```bash
cd server
npm install
npm start
```   
### 3️⃣ Frontend Setup
```bash
cd ..
npm install
npm run dev
```
Frontend will run at:
    http://localhost:5173

## 🔄 Authentication Flow 

- User logs in → receives short-lived access token

- Refresh token stored securely in HttpOnly cookie

- If access token expires:

    - Backend issues a new access token automatically

    - UI does not break or logout unexpectedly

- Logout clears refresh token & client state

## 🧠 What This Project Demonstrates

- Full-stack architecture

- Secure authentication practices

- Token lifecycle handling

- Clean code structure

- Real production-level deployment workflow

- Debugging & error handling

- Scalable frontend architecture

## 🎯 Suitable For

- Software Engineering Internships

- Full-Stack / Frontend roles

- Resume & Portfolio Projects

- College Project Submission

## 📜 License

This project is open-source under the MIT License.

## 👤 Author

Shiva Sharma
🔗 GitHub: https://github.com/DebuggerO1
