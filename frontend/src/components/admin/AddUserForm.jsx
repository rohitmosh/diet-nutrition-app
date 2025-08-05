import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserPlusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { adminService } from '../../services/api';
import Button from '../common/Button';

// Animation variants
const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const AddUserForm = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    height: '',
    weight: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email and password are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await adminService.addUser(formData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'patient',
        height: '',
        weight: ''
      });
      
      setSuccess('User added successfully');
      
      // Notify parent component
      if (onUserAdded) {
        onUserAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user');
      console.error('Error adding user:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
          <UserPlusIcon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
        >
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2"
        >
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={fieldVariants} className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="Enter full name"
            />
          </motion.div>

          <motion.div variants={fieldVariants} className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="Enter email address"
            />
          </motion.div>
        </div>

        <motion.div variants={fieldVariants} className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div variants={fieldVariants} className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
            >
              <option value="patient">Patient</option>
              <option value="admin">Admin</option>
            </select>
          </motion.div>

          <motion.div variants={fieldVariants} className="space-y-2">
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="e.g. 175"
            />
          </motion.div>

          <motion.div variants={fieldVariants} className="space-y-2">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="e.g. 70"
            />
          </motion.div>
        </div>

        <motion.div
          variants={fieldVariants}
          className="flex justify-end pt-4"
        >
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Add User
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default AddUserForm;
