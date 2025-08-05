import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartIcon,
  CalendarDaysIcon,
  FireIcon,
  TrashIcon,
  PlusIcon,
  SparklesIcon,
  ChartBarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { exerciseService } from '../services/api';
import NavigationBar from '../components/NavigationBar';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

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

// Calorie burn rates for different activities (calories per minute)
const CALORIE_BURN_RATES = {
  'Running': 10,
  'Swimming': 8,
  'Cycling': 7,
  'Walking': 4,
  'Jumping Rope': 12,
  'Boxing': 9,
  'Dancing': 6,
  'Gymnastics': 5,
  'Hiking': 6,
  'Yoga': 3
};

// Extract duration minutes from string (e.g., "30 minutes" -> 30)
const extractMinutes = (durationString) => {
  return parseInt(durationString.split(' ')[0], 10);
};

// Format date to YYYY-MM-DD
const formatDateForInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ExerciseLogging() {
  const [activityType, setActivityType] = useState('Running');
  const [duration, setDuration] = useState('30 minutes');
  const [exerciseDate, setExerciseDate] = useState(formatDateForInput(new Date()));
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);

  // Calculate calories burned based on activity type and duration
  useEffect(() => {
    const minutes = extractMinutes(duration);
    const rate = CALORIE_BURN_RATES[activityType] || 5; // Default to 5 if not found
    const calculatedCalories = minutes * rate;
    setCaloriesBurned(calculatedCalories.toString());
  }, [activityType, duration]);

  // Fetch user's exercise logs when component mounts or filter changes
  useEffect(() => {
    fetchExerciseLogs();
  }, [filterPeriod]);

  // Fetch exercise logs from the server using the selected filter
  const fetchExerciseLogs = async () => {
    setLoading(true);
    try {
      const data = await exerciseService.getExercises(filterPeriod);
      setExercises(data.exercises || []);
      setTotalCaloriesBurned(data.totalCalories || 0);
    } catch (error) {
      console.error('Error fetching exercise logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!exerciseDate || !caloriesBurned) {
      alert('Please fill in all required fields');
      return;
    }

    // Prepare exercise data for submission
    const exerciseData = {
      ActivityType: activityType,
      Duration: duration,
      Date: exerciseDate,
      CaloriesBurned: parseInt(caloriesBurned, 10)
    };

    setSubmitting(true);
    try {
      await exerciseService.addExercise(exerciseData);
      // Refresh exercise logs after adding new entry
      fetchExerciseLogs();
      // Reset form
      setCaloriesBurned('');
    } catch (error) {
      console.error('Error logging exercise:', error);
      alert('Failed to log exercise. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle deleting an exercise log
  const handleDeleteExercise = async (logId) => {
    if (window.confirm('Are you sure you want to delete this exercise log?')) {
      setLoading(true);
      try {
        await exerciseService.deleteExercise(logId);
        fetchExerciseLogs();
      } catch (error) {
        console.error('Error deleting exercise log:', error);
        alert('Failed to delete exercise log. Please try again.');
      } finally {
        setLoading(false);
      }
    }
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-gray-600"
            >
              <span className="font-medium text-gray-900">Exercise Logging</span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <NavigationBar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Log Your Exercise</h1>
            <p className="text-gray-600">Track your workouts and monitor your fitness progress</p>
          </motion.div>

          {/* Exercise Logging Form */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <HeartIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Exercise</h2>
              </div>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
                    <label htmlFor="activityType" className="block text-sm font-medium text-gray-700">
                      Activity Type
                    </label>
                    <select
                      id="activityType"
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    >
                      {Object.keys(CALORIE_BURN_RATES).map(activity => (
                        <option key={activity} value={activity}>{activity}</option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                      Duration
                    </label>
                    <select
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    >
                      <option value="15 minutes">15 minutes</option>
                      <option value="30 minutes">30 minutes</option>
                      <option value="45 minutes">45 minutes</option>
                      <option value="60 minutes">60 minutes</option>
                      <option value="90 minutes">90 minutes</option>
                      <option value="120 minutes">120 minutes</option>
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <label htmlFor="exerciseDate" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>Date</span>
                    </label>
                    <input
                      id="exerciseDate"
                      type="date"
                      value={exerciseDate}
                      onChange={(e) => setExerciseDate(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-2"
                  >
                    <label htmlFor="caloriesBurned" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <FireIcon className="w-4 h-4" />
                      <span>Calories Burned</span>
                    </label>
                    <input
                      id="caloriesBurned"
                      type="number"
                      value={caloriesBurned}
                      onChange={(e) => setCaloriesBurned(e.target.value)}
                      placeholder="Enter calories burned"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-end pt-4"
                >
                  <motion.button
                    type="submit"
                    disabled={submitting || !caloriesBurned}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Logging...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Log Exercise
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Calorie Summary */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Calories Burned Summary</h3>
                  <p className="text-sm text-gray-600">
                    {filterPeriod === 'all' ? 'All Time' :
                     filterPeriod === 'day' ? 'Today' :
                     filterPeriod === 'week' ? 'This Week' : 'This Month'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{totalCaloriesBurned}</p>
                <p className="text-sm text-gray-600">calories burned</p>
              </div>
            </div>
          </motion.div>

          {/* Exercise Logs */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <HeartIcon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Activity Log</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="w-4 h-4 text-gray-500" />
                  <select
                    id="filterPeriod"
                    value={filterPeriod}
                    onChange={(e) => setFilterPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                  >
                    <option value="all">All time</option>
                    <option value="day">Past day</option>
                    <option value="week">Past week</option>
                    <option value="month">Past month</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-8">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-600">Loading exercise data...</p>
                  </div>
                </div>
              ) : (
                <>
                  {exercises && exercises.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Activity Type</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Duration</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Date</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Calories Burned</th>
                            <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence>
                            {exercises.map((exercise, index) => (
                              <motion.tr
                                key={exercise.ExerciseLogID}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: index * 0.1 }}
                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                              >
                                <td className="py-4 px-6 text-sm font-medium text-gray-900">{exercise.ActivityType}</td>
                                <td className="py-4 px-6">
                                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                    {exercise.Duration}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-600">{new Date(exercise.Date).toLocaleDateString()}</td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center space-x-2">
                                    <FireIcon className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm font-medium text-gray-900">{exercise.CaloriesBurned}</span>
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <motion.button
                                    onClick={() => handleDeleteExercise(exercise.ExerciseLogID)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                                  >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Delete
                                  </motion.button>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HeartIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500">No exercise logs found</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}