import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserIcon,
  PencilSquareIcon,
  HeartIcon,
  ScaleIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  ChartBarIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import NavigationBar from '../components/NavigationBar';
import EditProfileModal from '../components/EditProfileModal';
import { authService, patientService } from '../services/api';

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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [healthStats, setHealthStats] = useState({
    bmi: null,
    bmiCategory: '',
    weeklyProgress: '+2.1%',
    lastUpdated: new Date().toLocaleDateString()
  });
  const navigate = useNavigate();
  
  const calculateBMI = (height, weight) => {
    if (!height || !weight) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await patientService.getProfile();
      setProfile(result.user);

      // Calculate health stats
      const bmi = calculateBMI(result.user.height, result.user.weight);
      setHealthStats(prev => ({
        ...prev,
        bmi,
        bmiCategory: getBMICategory(bmi)
      }));

      setError(null);
    } catch (err) {
      setError('Failed to load profile data. Please try again.');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setShowEditModal(true);
  };
  
  const handleCancelEdit = () => {
    setShowEditModal(false);
  };
  
  const handleSaveProfile = async (updatedData) => {
    try {
      await patientService.updateProfile(updatedData);
      setShowEditModal(false);
      // Refetch profile to get updated data
      fetchProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  };

  const getBMIColor = (category) => {
    switch (category) {
      case 'Underweight': return 'from-blue-500 to-blue-600';
      case 'Normal': return 'from-green-500 to-green-600';
      case 'Overweight': return 'from-yellow-500 to-yellow-600';
      case 'Obese': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };
  
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 flex items-center justify-center">
      <Loader />
    </div>
  );

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
                NutriTrack Home
              </h1>
            </motion.div>

            {/* User Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-gray-600"
            >
              Welcome, <span className="font-medium text-gray-900">{profile?.name || 'Patient'}</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <NavigationBar />

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Health Profile</h1>
              <p className="text-gray-600">Track your health journey and monitor your progress</p>
            </div>
            <motion.button
              onClick={handleEdit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <PencilSquareIcon className="w-5 h-5 mr-2" />
              Edit Profile
            </motion.button>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
            >
              {error}
            </motion.div>
          )}

          {/* Health Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* BMI Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${getBMIColor(healthStats.bmiCategory)} rounded-xl flex items-center justify-center`}>
                  <ScaleIcon className="w-6 h-6 text-white" />
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  healthStats.bmiCategory === 'Normal' ? 'bg-green-100 text-green-800' :
                  healthStats.bmiCategory === 'Underweight' ? 'bg-blue-100 text-blue-800' :
                  healthStats.bmiCategory === 'Overweight' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {healthStats.bmiCategory}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Body Mass Index</h3>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="text-2xl font-bold text-gray-900"
              >
                {healthStats.bmi || 'N/A'}
              </motion.p>
            </motion.div>

            {/* Progress Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Weekly Progress</h3>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                className="text-2xl font-bold text-green-600"
              >
                {healthStats.weeklyProgress}
              </motion.p>
            </motion.div>

            {/* Last Updated Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-white/20"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <CalendarDaysIcon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Last Updated</h3>
              <motion.p
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                className="text-2xl font-bold text-gray-900"
              >
                {healthStats.lastUpdated}
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Profile Details Card */}
          {profile && (
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-gray-200/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50/50 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-medium">
                        {profile.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Full Name</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50/50 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">@</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Email Address</p>
                        <p className="text-lg font-semibold text-gray-900">{profile.email}</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50/50 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">H</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Height</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {profile.height ? `${profile.height} cm` : 'Not recorded'}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-50/50 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">W</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Weight</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {profile.weight ? `${profile.weight} kg` : 'Not recorded'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && profile && (
          <EditProfileModal
            profile={profile}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PatientDashboard;