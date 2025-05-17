import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import PatientDashboard from './pages/PatientDashboard';
import MealLogging from './pages/MealLogging';
import ExerciseLogging from './pages/ExerciseLogging';
import DietPlanning from './pages/DietPlanning';
import AppointmentScheduling from './pages/AppointmentScheduling';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/app.css';
import './styles/navigation.css';
import './styles/patient.css';

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
