import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AppointmentScheduling from "./pages/AppointmentScheduling";
import MealLogging from "./pages/MealLogging";
import ExerciseLogging from "./pages/ExerciseLogging";
import DietPlanning from "./pages/DietPlanning";
import Reports from "./pages/Reports";
import "./App.css";

// This component will live inside <Router> so hooks work!
function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const hideNav = location.pathname === "/login" || location.pathname === "/register";

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <>
      <Header />
      {!hideNav && isAuthenticated && <Nav onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        {isAuthenticated && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<AppointmentScheduling />} />
            <Route path="/meal-logging" element={<MealLogging />} />
            <Route path="/exercise-logging" element={<ExerciseLogging />} />
            <Route path="/diet-planning" element={<DietPlanning />} />
            <Route path="/reports" element={<Reports />} />
          </>
        )}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/patient/dashboard" 
          element={
            <ProtectedRoute allowedRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Patient feature routes */}
        <Route 
          path="/meal-logging" 
          element={
            <ProtectedRoute allowedRole="patient">
              <MealLogging />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/exercise-logging" 
          element={
            <ProtectedRoute allowedRole="patient">
              <ExerciseLogging />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/diet-planning" 
          element={
            <ProtectedRoute allowedRole="patient">
              <DietPlanning />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/appointment-scheduling" 
          element={
            <ProtectedRoute allowedRole="patient">
              <AppointmentScheduling />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/reports" 
          element={
            <ProtectedRoute allowedRole="patient">
              <Reports />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all - 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
