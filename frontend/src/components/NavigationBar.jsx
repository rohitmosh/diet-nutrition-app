import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './common/Button';
import '../styles/navigation.css';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <nav className="navigation-bar">
      <ul className="nav-items">
        <li className={isActive('/patient/dashboard')}>
          <button 
            className={`nav-button ${isActive('/patient/dashboard')}`}
            onClick={() => navigate('/patient/dashboard')}
          >
            Dashboard
          </button>
        </li>
        <li className={isActive('/meal-logging')}>
          <button 
            className={`nav-button ${isActive('/meal-logging')}`}
            onClick={() => navigate('/meal-logging')}
          >
            Meal Logging
          </button>
        </li>
        <li className={isActive('/exercise-logging')}>
          <button 
            className={`nav-button ${isActive('/exercise-logging')}`}
            onClick={() => navigate('/exercise-logging')}
          >
            Exercise Logging
          </button>
        </li>
        <li className={isActive('/diet-planning')}>
          <button 
            className={`nav-button ${isActive('/diet-planning')}`}
            onClick={() => navigate('/diet-planning')}
          >
            Diet Planning
          </button>
        </li>
        <li className={isActive('/appointment-scheduling')}>
          <button 
            className={`nav-button ${isActive('/appointment-scheduling')}`}
            onClick={() => navigate('/appointment-scheduling')}
          >
            Appointment Scheduling
          </button>
        </li>
        <li className={isActive('/reports')}>
          <button 
            className={`nav-button ${isActive('/reports')}`}
            onClick={() => navigate('/reports')}
          >
            Reports
          </button>
        </li>
      </ul>
      <div className="logout-container">
        <Button variant="light" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default NavigationBar;

