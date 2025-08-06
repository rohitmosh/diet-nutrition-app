import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import MealLogging from './pages/MealLogging';
import ExerciseLogging from './pages/ExerciseLogging';
import DietPlanning from './pages/DietPlanning';
import AppointmentScheduling from './pages/AppointmentScheduling';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';

// CSS imports removed - now using Tailwind CSS from main.jsx

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
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
          
          {/* Catch all - 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
