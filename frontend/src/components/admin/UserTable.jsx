import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { adminService } from '../../services/api';
import Button from '../common/Button';
import Loader from '../common/Loader';

// Animation variants
const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: { duration: 0.3 }
  }
};

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAllUsers();
      setUsers(result.users);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setDeletingUserId(userId);
        await adminService.deleteUser(userId);
        setUsers(users.filter(user => user.UserID !== userId));
        setDeletingUserId(null);
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        setDeletingUserId(null);
        console.error('Error deleting user:', err);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center py-12">
      <Loader />
    </div>
  );

  return (
    <div className="overflow-hidden">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
        >
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </motion.div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">ID</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Name</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Email</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Role</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Height</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Weight</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            variants={tableVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {users.length > 0 ? (
                users.map((user) => (
                  <motion.tr
                    key={user.UserID}
                    variants={rowVariants}
                    layout
                    className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <td className="py-4 px-6 text-sm text-gray-900">{user.UserID}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                          {user.Name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{user.Name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.Email}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.Role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.Role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.Height ? `${user.Height} cm` : '-'}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{user.Weight ? `${user.Weight} kg` : '-'}</td>
                    <td className="py-4 px-6">
                      <motion.button
                        onClick={() => handleDelete(user.UserID)}
                        disabled={deletingUserId === user.UserID}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingUserId === user.UserID ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        ) : (
                          <TrashIcon className="w-4 h-4 mr-2" />
                        )}
                        Delete
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr variants={rowVariants}>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <ExclamationTriangleIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <span>No users found</span>
                    </div>
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
