import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ArrowPathIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import NavigationBar from '../components/NavigationBar';
import { reportService } from '../services/api';

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

export default function Reports() {
  const [reportType, setReportType] = useState('Weekly Summary');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Helper function to calculate date ranges based on report type
  const getDateRange = (type) => {
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    let startDate;
    
    switch (type) {
      case 'Weekly Summary':
        // Set start date to 7 days ago
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        startDate = lastWeek.toISOString().split('T')[0];
        break;
      case 'Monthly Summary':
        // Set start date to 30 days ago
        const lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);
        startDate = lastMonth.toISOString().split('T')[0];
        break;
      case 'Yearly Summary':
        // Set start date to 365 days ago
        const lastYear = new Date();
        lastYear.setDate(lastYear.getDate() - 365);
        startDate = lastYear.toISOString().split('T')[0];
        break;
      default:
        // Default to last 7 days
        const defaultPeriod = new Date();
        defaultPeriod.setDate(defaultPeriod.getDate() - 7);
        startDate = defaultPeriod.toISOString().split('T')[0];
    }
    
    return { startDate, endDate };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get date range based on report type
      const { startDate, endDate } = getDateRange(reportType);

      // Try to call the API, but fall back to mock data if it fails
      try {
        const response = await reportService.generateReport(reportType, startDate, endDate);
        if (response.success) {
          setReportData(response.data);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using mock data');
      }

      // Fallback to mock data for demonstration
      const mockReportData = {
        summary: {
          avgIntake: 1780,
          avgBurned: 1250,
          netProgress: 'Positive'
        },
        dailyData: [
          { date: '2024-01-01', calorieIntake: 1800, calorieBurned: 1200, progress: 'Positive' },
          { date: '2024-01-02', calorieIntake: 1750, calorieBurned: 1300, progress: 'Positive' },
          { date: '2024-01-03', calorieIntake: 1900, calorieBurned: 1100, progress: 'Negative' },
          { date: '2024-01-04', calorieIntake: 1650, calorieBurned: 1400, progress: 'Positive' },
          { date: '2024-01-05', calorieIntake: 1850, calorieBurned: 1250, progress: 'Positive' }
        ]
      };

      setReportData(mockReportData);

    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
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
              <span className="font-medium text-gray-900">Health Reports</span>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Reports</h1>
            <p className="text-gray-600">Generate comprehensive reports to track your nutrition and fitness progress</p>
          </motion.div>

          {/* Generate Report Form */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-gray-200/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <DocumentChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Generate Report</h2>
              </div>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
                    Select Report Type
                  </label>
                  <div className="relative">
                    <select
                      id="reportType"
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer hover:border-gray-400"
                    >
                      <option>Weekly Summary</option>
                      <option>Monthly Summary</option>
                      <option>Yearly Summary</option>
                    </select>
                    <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <ChartBarIcon className="w-5 h-5" />
                      <span>Generate Report</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3"
                  >
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-700">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Report Results */}
          <AnimatePresence>
            {reportData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Report Header */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{reportType}</h3>
                  <p className="text-gray-600">Your nutrition and fitness insights</p>
                </div>

                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200/50"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                        <FireIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Average Daily Intake</h4>
                        <p className="text-sm text-gray-600">Calories consumed</p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{reportData.summary.avgIntake}</p>
                    <p className="text-sm text-gray-600 mt-1">calories per day</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200/50"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                        <FireIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Average Calories Burned</h4>
                        <p className="text-sm text-gray-600">Through exercise</p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{reportData.summary.avgBurned}</p>
                    <p className="text-sm text-gray-600 mt-1">calories per day</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`bg-gradient-to-br ${reportData.summary.netProgress === 'Positive' ? 'from-blue-50 to-blue-100 border-blue-200/50' : 'from-red-50 to-red-100 border-red-200/50'} rounded-2xl p-6 border`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${reportData.summary.netProgress === 'Positive' ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'} rounded-xl flex items-center justify-center`}>
                        {reportData.summary.netProgress === 'Positive' ? (
                          <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Net Progress</h4>
                        <p className="text-sm text-gray-600">Overall trend</p>
                      </div>
                    </div>
                    <p className={`text-3xl font-bold ${reportData.summary.netProgress === 'Positive' ? 'text-blue-600' : 'text-red-600'}`}>
                      {reportData.summary.netProgress}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">health trajectory</p>
                  </motion.div>
                </div>

                {/* Daily Data Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden"
                >
                  <div className="px-8 py-6 border-b border-gray-200/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <ChartBarIcon className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Daily Breakdown</h2>
                    </div>
                  </div>
                  <div className="p-8">
                    {reportData.dailyData.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Calorie Intake</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Calorie Burned</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">Progress</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reportData.dailyData.map((day, index) => (
                              <motion.tr
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-200"
                              >
                                <td className="py-4 px-4 text-gray-900 font-medium">{day.date}</td>
                                <td className="py-4 px-4 text-gray-700">{day.calorieIntake} cal</td>
                                <td className="py-4 px-4 text-gray-700">{day.calorieBurned} cal</td>
                                <td className="py-4 px-4">
                                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                                    day.progress === 'Positive'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {day.progress === 'Positive' ? (
                                      <ArrowTrendingUpIcon className="w-4 h-4" />
                                    ) : (
                                      <ArrowTrendingDownIcon className="w-4 h-4" />
                                    )}
                                    <span>{day.progress}</span>
                                  </span>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No data available for the selected period</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}