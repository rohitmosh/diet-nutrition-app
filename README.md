
# 🏥 NutriTrack - Your Complete Smart Health Companion

A full-stack **Database Management System (DBMS)** project designed to help users manage and track diet, nutrition, exercise, appointments, and health goals. It features intelligent data processing using MySQL and a clean, fast frontend powered by **React + Vite**.

> Built using **React + Vite**, **Node.js (Express)** for backend API, and **MySQL Server** as the database engine.

---

## 📌 Table of Contents

- [🎯 Project Objectives](#-project-objectives)
- [💡 Features](#-features)
- [🧱 Database Schema](#-database-schema)
- [📐 Architecture Overview](#-architecture-overview)
- [🔐 Security & Constraints](#-security--constraints)
- [⚙️ Tech Stack](#️-tech-stack)
- [🚀 Installation & Setup](#-installation--setup)
- [🧪 Testing & Validation](#-testing--validation)
- [📄 Future Enhancements](#-future-enhancements)
- [👥 Author](#-author)

---

## 🎯 Project Objectives

This system aims to:

- Enable real-time updates of health and user profiles.
- Generate personalized diet plans based on BMI, goals, and medical history.
- Track meals, calories, exercise, and provide recommendations.
- Schedule and manage appointments with dieticians.
- Analyze health progress using SQL-driven reports.

---

## 💡 Features

### 🏠 **Landing Page & User Experience**
- 🎨 **Modern Responsive Landing Page** with animated nutrition-themed graphics
- 📱 **Mobile-First Design** with comprehensive responsive breakpoints (1024px, 768px, 480px)
- ⚡ **Performance Optimized** with CSS fallbacks and GPU-accelerated animations
- 🎭 **Interactive Food Orbital Animation** with smooth rotating food emojis
- ♿ **Accessibility Support** including reduced motion preferences
- 🌐 **Cross-Browser Compatibility** with fallback support for older browsers

### 🏥 **Core Health Management**
- 🔁 **Dynamic BMI and Health Profile Calculation**
- 🥗 **Personalized Diet Plan Generation**
- 🧾 **Meal & Calorie Logging**
- 🏃 **Exercise & Activity Tracking**
- 🗓️ **Appointment Scheduling**
- 📈 **Goal Tracking & Progress Reports**
- ⚠️ **Alert Triggers for Unhealthy Logs**
- 💬 **Role-based Access (Admin, Patient)**

### 🎯 **User Interface Enhancements**
- 🏷️ **Consistent Branding** with "NutriTrack Home Portal" across all pages
- 📊 **Intuitive Dashboard** with easy navigation between features
- 🎨 **Modern CSS Design System** with custom properties and utility classes
- 📱 **Responsive Grid Layouts** that adapt to all screen sizes

---

## 🧱 Database Schema

### 🔑 Users Table
- `UserID`, `Name`, `Email`, `Password`, `Height`, `Weight`, `BMI`, `MedicalHistoryID`

### 🔐 Credentials
- `CredentialID`, `Email`, `PasswordHash`, `Role (admin/patient)`, `UserID`

### 🗓️ Appointments
- `AppointmentID`, `Date`, `Time`, `UserID`, `DieticianID`

### 👩‍⚕️ Dieticians
- `DieticianID`, `Name`, `Specialization`

### 📋 Diet Plans & Meals
- `DietPlanID`, `PlanName`, `Description`, `UserID`, `NutritionalGoal`
- `Meals`: `MealID`, `MealName`, `Calories`, `NutritionalValue`, `Type (Veg/Non-Veg)`
- `DietPlanMeals`: `DietPlanID`, `MealID`

### 🍱 Meal Logs
- `MealLogID`, `Date`, `MealType`, `CalorieIntake`, `UserID`, `MealID`

### 🏃 Exercise Logs
- `ExerciseLogID`, `Date`, `ActivityType`, `Duration`, `CaloriesBurned`, `UserID`

### 🎯 User Goals
- `GoalID`, `UserID`, `DailyCalorieLimit`, `NutritionalGoal`

---

## 📐 Architecture Overview

- **Frontend**: Built with React + Vite, using hooks and context API for clean state management.
- **Backend**: Node.js with Express to handle RESTful APIs for user management, diet planning, appointments, and logs.
- **Database**: MySQL relational schema with normalized tables, foreign keys, triggers, and stored procedures.

---

## 🔐 Security & Constraints

- Role-based access using `enum('admin', 'patient')`
- All sensitive actions are gated via token/session logic (JWT recommended)
- Referential integrity ensured using foreign key constraints
- Triggers can be used to:
  - Auto-calculate BMI
  - Alert on unhealthy food patterns
  - Prevent appointment conflicts

---

## ⚙️ Tech Stack

| Layer        | Tech                         |
|--------------|------------------------------|
| Frontend     | React + Vite, Tailwind CSS   |
| Backend      | Node.js + Express            |
| Database     | MySQL Server                 |
| Auth (suggested) | JWT / bcrypt for hashing  |
| Hosting (suggested) | Railway / Vercel / Render |

---

## 🚀 Installation & Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/healthcare-dbms.git
   cd healthcare-dbms
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Set DB credentials in `.env`
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **MySQL Setup**
   - Create the database:
     ```sql
     CREATE DATABASE healthcare_db;
     ```
   - Run schema scripts from `/sql/schema.sql` to set up tables and constraints.

---

## 🧪 Testing & Validation

- Unit tests with `Jest` for backend logic.
- SQL trigger testing via `INSERT` simulations.
- BMI trigger, appointment scheduler, meal tracking tested manually.

---

## 📄 Future Enhancements

- 🌍 Multilingual frontend
- 📱 Mobile version (React Native)
- 📤 Export reports to PDF, CSV, JSON
- 📊 Charts with Chart.js or Recharts
- 🧠 AI-driven meal recommendations

---

## 👥 Author

- **Rohit Mohanty**
