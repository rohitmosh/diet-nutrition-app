import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  XMarkIcon,
  UserIcon,
  ScaleIcon,
  ArrowsPointingOutIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const EditProfileModal = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    height: profile.height || '',
    weight: profile.weight || ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.height || formData.height <= 0) {
      newErrors.height = 'Please enter a valid height';
    }
    
    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSave({
        height: Number(formData.height),
        weight: Number(formData.weight)
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Health Profile</h2>
          </div>
          <motion.button
            onClick={onCancel}
            disabled={isSubmitting}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
          >
            <XMarkIcon className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Height Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <label htmlFor="height" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <ArrowsPointingOutIcon className="w-4 h-4" />
              <span>Height (cm)</span>
            </label>
            <input
              type="number"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Enter your height in cm"
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:opacity-50"
            />
            {errors.height && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-sm"
              >
                {errors.height}
              </motion.div>
            )}
          </motion.div>

          {/* Weight Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <label htmlFor="weight" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <ScaleIcon className="w-4 h-4" />
              <span>Weight (kg)</span>
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter your weight in kg"
              disabled={isSubmitting}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm disabled:opacity-50"
            />
            {errors.weight && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-sm"
              >
                {errors.weight}
              </motion.div>
            )}
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex space-x-3 pt-4"
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </motion.button>

            <motion.button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditProfileModal;