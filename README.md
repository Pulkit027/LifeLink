# ❤️ LifeLink – Role-Based Blood Bank Management System

LifeLink is a full-stack MERN application designed to streamline blood donation and blood bank operations through a secure role-based platform. It enables donors, blood banks, hospitals, and administrators to efficiently manage blood inventory, donation requests, and user information while ensuring secure authentication and seamless communication.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Secure password hashing using bcrypt
- Role-Based Access Control (RBAC)
- Protected routes and middleware

### 👥 User Roles
- Donor
- Blood Bank
- Hospital
- Administrator

### 🩸 Blood Management
- Blood inventory management
- Blood donation tracking
- Blood request management
- Blood availability updates
- Inventory history

### 📋 Dashboard
- Role-specific dashboards
- Blood stock overview
- User profile management
- Request status tracking
- Analytics cards and summaries

### 🌐 Frontend
- Responsive React.js interface
- React Router based navigation
- Protected routes
- Reusable UI components
- REST API integration
- Loading states and error handling

### ⚙️ Backend
- Express.js REST APIs
- Modular MVC architecture
- JWT Authentication
- Middleware for authorization
- MongoDB data modeling using Mongoose
- Image upload support

---

# 🛠 Tech Stack

## Frontend
- React.js
- React Router
- Axios
- CSS

## Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt.js

## Database
- MongoDB
- Mongoose

## Tools
- Git
- GitHub
- Postman

---

# 📂 Project Structure

```
LifeLink
│
├── client
│   ├── public
│   ├── src
│   ├── package.json
│   └── README.md
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# 🔑 Core Functionalities

- User Registration & Login
- JWT Authentication
- Role-Based Authorization
- Blood Inventory Management
- Blood Request Processing
- Donor Management
- Hospital Management
- Blood Bank Dashboard
- Admin Controls
- RESTful APIs
- Secure Backend Architecture

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/LifeLink.git
```

## Navigate

```bash
cd LifeLink
```

---

## Install Client

```bash
cd client
npm install
```

---

## Install Server

```bash
cd ../server
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the **server** directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

# ▶️ Run Application

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm start
```

---

# 🏗 Architecture

The project follows the MVC (Model-View-Controller) architecture.

```
React Client
      │
 REST API (Axios)
      │
Express Server
      │
Controllers
      │
Models (Mongoose)
      │
MongoDB
```

---

# 📌 Future Enhancements

- Email notifications
- Real-time blood request updates
- Appointment scheduling
- Blood donation analytics
- SMS notifications
- Cloud image storage
- Admin reporting dashboard
- Docker deployment

---

# 📖 Learning Outcomes

- Full-Stack MERN Development
- REST API Design
- Authentication & Authorization
- MongoDB Data Modeling
- Role-Based Access Control (RBAC)
- Secure Backend Development
- MVC Architecture
- Git & GitHub Workflow

---

# 👨‍💻 Author

**Pulkit Maheshwari**

GitHub: https://github.com/pulkit027

LinkedIn: https://www.linkedin.com/in/pulkit-maheshwari-3a2727303/
