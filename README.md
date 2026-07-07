# 🍔 FoodHub Pro

> A Premium Integrated Food Delivery & Dine-Out Hospitality Platform.

![FoodHub Pro Banner](https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop)

## 📖 Overview

**FoodHub Pro** is a modern, full-stack web application designed to seamlessly connect hungry customers with top-tier restaurants. Built as an end-to-end internship project, it mirrors the core functionalities of industry giants like Swiggy, Zomato, and EazyDiner, but sets itself apart with a stunning, premium dark-mode glassmorphic user interface.

## 🚀 Key Features (In Development - Day 13/23)

- **🔐 Secure Authentication:** JWT-based stateless authentication with robust role-based access control (Customer, Owner, Admin, Delivery).
- **👤 User Profiles:** Dynamic user settings dashboard with local `multer` image uploads.
- **🏬 Restaurant Management:** Full CRUD capabilities for Restaurant Owners to register and manage their digital storefronts.
- **🍕 Menu Management:** Nested RESTful routing allowing owners to categorize and update food items in real-time.
- **🔍 Advanced Browsing:** Customer-facing search with regex keyword matching, multi-parameter filtering, sorting, and pagination.
- **🛒 Dynamic Shopping Cart:** Redux-powered persistent state management for fluid add-to-cart interactions and checkout flows.
- **💳 Order Processing:** End-to-end checkout pipeline bridging the frontend cart with secure backend MongoDB storage.

## 🛠 Technology Stack

### Frontend (Client)
- **Framework:** React.js + Vite
- **Styling:** Tailwind CSS (Premium Dark Mode + Glassmorphism)
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Forms:** React Hook Form
- **Animations:** Framer Motion
- **HTTP Client:** Axios (with interceptors)

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose ORM
- **Security:** Helmet, CORS, bcryptjs
- **File Uploads:** Multer (Local Storage)
- **Logging:** Morgan

## 🚦 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URI)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/foodhub-pro.git
   cd foodhub-pro
   ```

2. **Setup Backend Environment Variables**
   Create a `.env` file inside the `/backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```

3. **Install Backend Dependencies & Run**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Install Frontend Dependencies & Run**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the Application**
   Open your browser and navigate to `http://localhost:5173`.

## 📂 Project Structure

```
foodhub-pro/
├── backend/
│   ├── public/uploads/      # Local image storage
│   ├── src/
│   │   ├── config/          # DB connection
│   │   ├── controllers/     # Route logic
│   │   ├── middlewares/     # Auth, error, upload handlers
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routers
│   │   └── server.js        # Entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Route views
    │   ├── redux/           # Global state slices
    │   ├── services/        # Axios API configurations
    │   ├── App.jsx          # Router configuration
    │   └── main.jsx         # Entry point
    ├── tailwind.config.js
    └── package.json
```

## 👨‍💻 Architecture

The project strictly follows **Clean Architecture** and **RESTful** design principles. The backend is decoupled from the frontend, acting as a standalone JSON API. Role-Based Access Control (RBAC) securely gates sensitive endpoints via middleware at the routing layer.

---
*Built with ❤️ as a 23-Day Master Internship Project.*
