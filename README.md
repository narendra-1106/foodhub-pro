# 🍔 FoodHub Pro - Master Internship Project

> A Premium Integrated Food Delivery & Dine-Out Hospitality Platform.

![FoodHub Pro Banner](https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop)

## 🎉 Project Status: 100% COMPLETED (23/23 Days)

FoodHub Pro has been successfully built from scratch over an intensive 23-day sprint. It is a production-ready, full-stack application connecting Customers, Restaurant Owners, Delivery Partners, and Admins.

## 🚀 Final Features Implemented

- **🔐 Robust Auth & RBAC:** Complete multi-role login system (Customer, Owner, Delivery, Admin).
- **🏬 Restaurant Management:** Full CRUD operations for owners to manage locations, cuisines, and menus.
- **🔍 Advanced Discovery:** Live case-insensitive search by name, address, or cuisine with beautiful grid UI.
- **🛒 Global State Cart:** Redux Toolkit integrated cart supporting dynamic quantity updates and price calculations.
- **💳 End-to-End Checkout:** Secure mock payment pipeline processing orders into MongoDB.
- **📦 Live Delivery Tracking:** Dedicated delivery partner dashboard allowing live GPS location mocking and order status transitions (Picked Up -> Delivered).
- **⭐ Ratings & Reviews:** Customers can leave 1-5 star reviews on restaurants. Mongoose aggregate pipelines automatically calculate and update the restaurant's average rating in real-time.
- **📊 Admin Control Panel:** A master view of all global metrics (Total Revenue, User Count) with the ability to delete users.
- **✨ Premium UI/UX:** Built with Tailwind CSS and Framer Motion for a sleek, glassmorphic dark-mode aesthetic.

## 🛠 Technology Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS + Framer Motion
- **State Management:** Redux Toolkit
- **Icons:** React Icons

### Backend
- **Environment:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Security:** bcryptjs, JSON Web Tokens (JWT), Helmet, CORS
- **File Uploads:** Multer

## 🚦 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB connection string

### Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/foodhub-pro.git
   cd foodhub-pro
   ```

2. **Environment Variables:**
   Create a `.env` in the `/backend` folder:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:5173
   ```

3. **Run Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Run Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Test Accounts:**
   - You can register a new account on the frontend.
   - To access the Admin or Delivery dashboards, change your user role directly in the MongoDB `users` collection to `admin` or `delivery`.

## 👨‍💻 Architecture & Clean Code

The project adheres to Clean Architecture. Controllers act strictly as request handlers, models handle business logic (like average rating calculation pre/post-save hooks), and the frontend is cleanly divided into reusable components and global Redux slices.

---
*Built with ❤️ as a rigorous 23-Day coding bootcamp challenge.*
