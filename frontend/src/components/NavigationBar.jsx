import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  CalendarIcon,
  DocumentChartBarIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import Button from './common/Button';

const NavigationBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/patient/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/meal-logging', label: 'Meal Logging', icon: ClipboardDocumentListIcon },
    { path: '/exercise-logging', label: 'Exercise', icon: HeartIcon },
    { path: '/diet-planning', label: 'Diet Planning', icon: Squares2X2Icon },
    { path: '/appointment-scheduling', label: 'Appointments', icon: CalendarIcon },
    { path: '/reports', label: 'Reports', icon: DocumentChartBarIcon },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="relative z-10 bg-gradient-to-r from-green-500 to-blue-500 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <motion.button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                  className={`relative flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                    active
                      ? 'bg-white/20 text-white shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:block">{item.label}</span>

                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/20 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex items-center space-x-2 px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="hidden sm:block">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavigationBar;

