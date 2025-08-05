import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  FireIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  PlusIcon,
  SparklesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import NavigationBar from '../components/NavigationBar';
import { mealService } from '../services/api';

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

export default function MealLogging() {
  const [mealType, setMealType] = useState('Breakfast');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState([]);
  const [mealLogs, setMealLogs] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(2000);
  const [warnings, setWarnings] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all available meals
        const mealsResponse = await mealService.getAllMeals();
        setMeals(mealsResponse.data || []);
        
        // Set default selected meal if available
        if (mealsResponse.data && mealsResponse.data.length > 0) {
          setSelectedMeal(mealsResponse.data[0].MealID.toString());
        }
        
        // Get user's daily calorie limit
        const limitResponse = await mealService.getDailyCalorieLimit();
        if (limitResponse.data && limitResponse.data.dailyLimit) {
          setDailyLimit(limitResponse.data.dailyLimit);
        }
        
        // Get logged meals for today
        await fetchMealLogs();
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch meal logs when date changes
  useEffect(() => {
    fetchMealLogs();
  }, [selectedDate]);
  
  const fetchMealLogs = async () => {
    try {
      const date = new Date(selectedDate);
      const logsResponse = await mealService.getDailyLogs(date);
      
      if (logsResponse.data) {
        setMealLogs(logsResponse.data.logs || []);
        setTotalCalories(logsResponse.data.totalCalories || 0);
        
        // Check if over limit and set warning
        if (logsResponse.data.totalCalories > dailyLimit) {
          setWarnings(prev => ({
            ...prev,
            calorieLimit: `Warning: You've exceeded your daily calorie limit of ${dailyLimit} calories.`
          }));
        } else {
          // Clear warning if under limit
          setWarnings(prev => {
            const newWarnings = { ...prev };
            delete newWarnings.calorieLimit;
            return newWarnings;
          });
        }
      }
    } catch (error) {
      console.error('Error fetching meal logs:', error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      // Prepare data for meal logging
      const mealData = {
        mealId: parseInt(selectedMeal),
        mealType,
        date: selectedDate
      };

      // Submit meal log
      const response = await mealService.logMeal(mealData);

      if (response.success) {
        // Update total calories
        setTotalCalories(response.data.totalCalories);

        // Set warnings if any
        if (response.warnings) {
          setWarnings(prev => ({ ...prev, ...response.warnings }));
        }

        // Refresh meal logs
        await fetchMealLogs();

        // Reset form
        setSelectedMeal('');
      }
    } catch (error) {
      console.error('Error logging meal:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDeleteLog = async (logId) => {
    try {
      const response = await mealService.deleteMealLog(logId);
      
      if (response.success) {
        // Update total calories
        setTotalCalories(response.data.totalCalories);
        
        // Refresh meal logs
        await fetchMealLogs();
      }
    } catch (error) {
      console.error('Error deleting meal log:', error);
    }
  };
  
  // Get calories for selected meal
  const getSelectedMealCalories = () => {
    if (!selectedMeal) return 0;
    
    const meal = meals.find(m => m.MealID.toString() === selectedMeal);
    return meal ? meal.Calories : 0;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Header */}
        <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-soft">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  NutriTrack Home
                </h1>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Meal Logging</span>
              </div>
            </div>
          </div>
        </header>

        <NavigationBar />

        <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600">Loading meal data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
              <span className="font-medium text-gray-900">Meal Logging</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Log Your Meals</h1>
            <p className="text-gray-600">Track your daily nutrition and stay on top of your health goals</p>
          </motion.div>

          {/* Warnings */}
          <AnimatePresence>
            {Object.values(warnings).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                variants={itemVariants}
                className="space-y-2"
              >
                {Object.values(warnings).map((warning, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
                  >
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{warning}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Meal Logging Form */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Meal</h2>
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
                    <label htmlFor="mealDate" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>Date</span>
                    </label>
                    <input
                      id="mealDate"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <label htmlFor="mealType" className="block text-sm font-medium text-gray-700">
                      Meal Type
                    </label>
                    <select
                      id="mealType"
                      value={mealType}
                      onChange={(e) => setMealType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    >
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                      <option>Snack</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label htmlFor="meal" className="block text-sm font-medium text-gray-700">
                    Select Meal
                  </label>
                  <select
                    id="meal"
                    value={selectedMeal}
                    onChange={(e) => setSelectedMeal(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">-- Select a Meal --</option>
                    {meals.map((meal) => (
                      <option key={meal.MealID} value={meal.MealID}>
                        {meal.MealName} ({meal.Type}) - {meal.Calories} cal
                      </option>
                    ))}
                  </select>
                </motion.div>

                {selectedMeal && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                        <FireIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Calories</p>
                        <p className="text-2xl font-bold text-gray-900">{getSelectedMealCalories()}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-end pt-4"
                >
                  <motion.button
                    type="submit"
                    disabled={submitting || !selectedMeal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Logging...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-5 h-5 mr-2" />
                        Log Meal
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
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Daily Calorie Summary</h3>
                  <p className="text-sm text-gray-600">Track your daily intake</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{totalCalories}</p>
                <p className="text-sm text-gray-600">of {dailyLimit} calories</p>
                {totalCalories > dailyLimit && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-sm text-red-600 font-medium"
                  >
                    Limit Exceeded!
                  </motion.p>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((totalCalories / dailyLimit) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-3 rounded-full ${
                    totalCalories > dailyLimit
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : 'bg-gradient-to-r from-green-500 to-blue-500'
                  }`}
                ></motion.div>
              </div>
            </div>
          </motion.div>

          {/* Meal Logs */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Today's Meals</h2>
              </div>
            </div>
            <div className="p-8">
              {mealLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Meal</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Type</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Calories</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Nutritional Type</th>
                        <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {mealLogs.map((log, index) => (
                          <motion.tr
                            key={log.MealLogID}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                          >
                            <td className="py-4 px-6 text-sm font-medium text-gray-900">{log.MealName}</td>
                            <td className="py-4 px-6">
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                {log.MealType}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">{log.CalorieIntake}</td>
                            <td className="py-4 px-6">
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                {log.Type}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <motion.button
                                onClick={() => handleDeleteLog(log.MealLogID)}
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
                    <ClipboardDocumentListIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No meals logged for this date.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}