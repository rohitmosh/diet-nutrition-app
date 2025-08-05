import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  PlusIcon,
  XMarkIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import UserTable from '../components/admin/UserTable';
import AddUserForm from '../components/admin/AddUserForm';
import Button from '../components/common/Button';
import { authService } from '../services/api';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const slideVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);

    // Simulate loading stats (in real app, this would be an API call)
    setTimeout(() => {
      setStats({
        totalUsers: 77,
        newUsersToday: 3,
        activeUsers: 41
      });
    }, 500);
  }, []);
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  const handleAddUser = () => {
    setShowAddForm(!showAddForm);
  };
  
  const refreshUsers = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowAddForm(false);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-soft"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                NutriTrack Admin
              </h1>
            </motion.div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-sm text-gray-600"
              >
                Welcome, <span className="font-medium text-gray-900">{user?.name || 'Admin'}</span>
              </motion.div>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
              <p className="text-gray-600">Manage users, view statistics, and monitor system activity</p>
            </div>
            <motion.button
              onClick={handleAddUser}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center px-6 py-3 rounded-xl font-medium shadow-md transition-all duration-200 ${
                showAddForm
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg'
                  : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-lg'
              }`}
            >
              {showAddForm ? (
                <>
                  <XMarkIcon className="w-5 h-5 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Add New User
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {stats.totalUsers}
                  </motion.p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <UserGroupIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Today</p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {stats.newUsersToday}
                  </motion.p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                    className="text-2xl font-bold text-gray-900"
                  >
                    {stats.activeUsers}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Add User Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.div
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft border border-white/20"
                >
                  <AddUserForm onUserAdded={refreshUsers} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Users Table */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
              </div>
            </div>
            <div className="p-8">
              <UserTable key={refreshTrigger} />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
