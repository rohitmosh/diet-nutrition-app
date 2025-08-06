import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Squares2X2Icon,
  ChartBarIcon,
  FireIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import NavigationBar from '../components/NavigationBar';
import { dietService } from "../services/api";

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

export default function DietPlanning() {
  const [exerciseLevel, setExerciseLevel] = useState('Low');
  const [nutritionalGoal, setNutritionalGoal] = useState('');
  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userGoal, setUserGoal] = useState(null);
  const [nutritionalGoalOptions, setNutritionalGoalOptions] = useState([
    'Weight Loss',
    'Muscle Gain',
    'Heart Health',
    'Diabetes Management',
    'Low Carb'
  ]); // Provide default options to handle API failures

  // Fetch available nutritional goals and user's current goal on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Try to get available nutritional goals
        try {
          const nutritionalGoalsResponse = await dietService.getNutritionalGoals();
          if (nutritionalGoalsResponse.data && nutritionalGoalsResponse.data.length > 0) {
            setNutritionalGoalOptions(nutritionalGoalsResponse.data);
          }
        } catch (err) {
          console.error('Error fetching nutritional goals:', err);
          // Keep using default options set above
        }

        // Try to get user's current goal if exists
        try {
          const userGoalResponse = await dietService.getUserGoal();
          if (userGoalResponse.data) {
            setUserGoal(userGoalResponse.data);
            setNutritionalGoal(userGoalResponse.data.nutritionalGoal);
          }
        } catch (err) {
          console.error('Error fetching user goal:', err);
          // We'll continue without user goal
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error in fetchInitialData:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleShowDietPlans = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to save the user's nutritional goal
      try {
        const saveGoalResponse = await dietService.saveUserGoal({
          nutritionalGoal,
          exerciseLevel
        });

        setUserGoal({
          nutritionalGoal,
          exerciseLevel,
          dailyCalorieLimit: exerciseLevel === 'Low' ? 1800 : (exerciseLevel === 'Medium' ? 2200 : 2600)
        });
      } catch (err) {
        console.error('Error saving user goal:', err);
        // Create a fallback user goal object if the API call fails
        setUserGoal({
          nutritionalGoal,
          exerciseLevel,
          dailyCalorieLimit: exerciseLevel === 'Low' ? 1800 : (exerciseLevel === 'Medium' ? 2200 : 2600)
        });
      }

      // Try to get recommended meals or provide demo data if API fails
      try {
        const mealsResponse = await dietService.getRecommendedMeals(nutritionalGoal, exerciseLevel);
        setRecommendedMeals(mealsResponse.data);
      } catch (err) {
        console.error('Error fetching meals:', err);
        // Provide fallback demo meals if API call fails
        const demoMeals = [
          {
            mealId: 1,
            mealName: 'Grilled Chicken Salad',
            calories: 350,
            nutritionalValue: 'High protein, low carb',
            type: 'Lunch'
          },
          {
            mealId: 2,
            mealName: 'Vegetable Stir Fry',
            calories: 300,
            nutritionalValue: 'High fiber, low fat',
            type: 'Dinner'
          },
          {
            mealId: 3,
            mealName: 'Greek Yogurt with Berries',
            calories: 200,
            nutritionalValue: 'High protein, low sugar',
            type: 'Breakfast'
          }
        ];
        setRecommendedMeals(demoMeals);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error in handleShowDietPlans:', err);
      setError('Failed to generate diet plan. Please try again.');
      setLoading(false);
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
              <span className="font-medium text-gray-900">Diet Planning</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Diet Planning</h1>
            <p className="text-gray-600">Create personalized meal plans based on your goals and lifestyle</p>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Diet Planning Form */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Squares2X2Icon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Plan Your Diet</h2>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <label htmlFor="nutritionalGoal" className="block text-sm font-medium text-gray-700">
                    Nutritional Goal
                  </label>
                  <select
                    id="nutritionalGoal"
                    value={nutritionalGoal}
                    onChange={(e) => setNutritionalGoal(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  >
                    <option value="">Select a goal</option>
                    {nutritionalGoalOptions.map(goal => (
                      <option key={goal} value={goal}>{goal}</option>
                    ))}
                  </select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <label htmlFor="exerciseLevel" className="block text-sm font-medium text-gray-700">
                    Exercise Level
                  </label>
                  <select
                    id="exerciseLevel"
                    value={exerciseLevel}
                    onChange={(e) => setExerciseLevel(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center pt-6"
              >
                <motion.button
                  type="button"
                  onClick={handleShowDietPlans}
                  disabled={loading || !nutritionalGoal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <ChartBarIcon className="w-5 h-5 mr-2" />
                      Show Diet Plans
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* User Goal Info */}
          <AnimatePresence>
            {userGoal && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Current Goal</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-600">Nutritional Goal</p>
                    <p className="text-lg font-semibold text-blue-900">{userGoal.nutritionalGoal}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-600">Exercise Level</p>
                    <p className="text-lg font-semibold text-green-900">{userGoal.exerciseLevel}</p>
                  </div>
                  {userGoal.dailyCalorieLimit && (
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-orange-600">Daily Calorie Target</p>
                      <p className="text-lg font-semibold text-orange-900">{userGoal.dailyCalorieLimit} calories</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recommended Meals */}
          <AnimatePresence>
            {recommendedMeals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                variants={itemVariants}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-gray-200/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <FireIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Recommended Meals</h3>
                  </div>
                </div>
                <div className="p-8">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Meal Name</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Calories</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Nutritional Value</th>
                          <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 bg-gray-50/50">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recommendedMeals.map((meal, index) => (
                          <motion.tr
                            key={meal.mealId}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                          >
                            <td className="py-4 px-6 text-sm font-medium text-gray-900">{meal.mealName}</td>
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-2">
                                <FireIcon className="w-4 h-4 text-orange-500" />
                                <span className="text-sm text-gray-600">{meal.calories}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600">{meal.nutritionalValue}</td>
                            <td className="py-4 px-6">
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                {meal.type}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}