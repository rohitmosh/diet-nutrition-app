import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const IS_DEMO_MODE = import.meta.env.VITE_API_URL === 'demo';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data for demo mode
const mockUsers = [
  { UserID: 1, Name: 'Rohit', Email: 'rohit@nutritrack.com', Role: 'patient', Height: 175, Weight: 70 },
  { UserID: 2, Name: 'Jane Smith', Email: 'jane@example.com', Role: 'patient', Height: 165, Weight: 60 },
  { UserID: 3, Name: 'Admin User', Email: 'admin@nutritrack.com', Role: 'admin', Height: 180, Weight: 80 },
];

const mockMeals = [
  { MealID: 1, MealName: 'Oats Bowl', Calories: 250, NutritionalValue: 'High Fiber', Type: 'Veg' },
  { MealID: 2, MealName: 'Grilled Chicken', Calories: 400, NutritionalValue: 'High Protein', Type: 'Non-Veg' },
  { MealID: 3, MealName: 'Fruit Salad', Calories: 180, NutritionalValue: 'Vitamins', Type: 'Veg' },
  { MealID: 4, MealName: 'Veg Sandwich', Calories: 300, NutritionalValue: 'Balanced', Type: 'Veg' },
  { MealID: 5, MealName: 'Paneer Wrap', Calories: 350, NutritionalValue: 'Protein Rich', Type: 'Veg' },
  { MealID: 6, MealName: 'Smoothie', Calories: 220, NutritionalValue: 'Fruit Boost', Type: 'Veg' },
];

const mockDieticians = [
  { DieticianID: 1, Name: 'Dr. Anita Rao', Specialization: 'Weight Loss' },
  { DieticianID: 2, Name: 'Dr. Ramesh Iyer', Specialization: 'Diabetes' },
  { DieticianID: 3, Name: 'Dr. Sneha Jain', Specialization: 'Sports Nutrition' },
  { DieticianID: 4, Name: 'Dr. Farhan Qureshi', Specialization: 'Ketogenic Diet' },
  { DieticianID: 5, Name: 'Dr. Ishita Reddy', Specialization: 'Gluten-Free Diet' },
];

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Auth services
export const authService = {
  login: async (email, password) => {
    if (IS_DEMO_MODE) {
      await delay(500);

      // Hardcoded login credentials
      if (email === 'admin@nutritrack.com' && password === 'admin123') {
        const user = { id: 3, name: 'Admin User', email: 'admin@nutritrack.com', role: 'admin' };
        const token = 'demo-token-' + Date.now();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return {
          success: true,
          token,
          user
        };
      } else if (email === 'rohit@nutritrack.com' && password === 'patient123') {
        const user = { id: 1, name: 'Rohit', email: 'rohit@nutritrack.com', role: 'patient' };
        const token = 'demo-token-' + Date.now();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return {
          success: true,
          token,
          user
        };
      } else {
        // Invalid credentials
        throw new Error('Invalid email or password');
      }
    }

    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  register: async (name, email, password) => {
    if (IS_DEMO_MODE) {
      await delay(500);
      const user = { id: Date.now(), name, email, role: 'patient' };
      const token = 'demo-token-' + Date.now();

      return {
        success: true,
        message: 'Registration successful',
        token,
        user
      };
    }

    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  getProfile: async () => {
    if (IS_DEMO_MODE) {
      await delay(300);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        success: true,
        user
      };
    }

    const response = await api.get('/auth/profile');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Admin services
export const adminService = {
  getAllUsers: async () => {
    if (IS_DEMO_MODE) {
      await delay(500);
      return {
        success: true,
        users: mockUsers
      };
    }

    const response = await api.get('/admin/users');
    return response.data;
  },
  addUser: async (userData) => {
    if (IS_DEMO_MODE) {
      await delay(700);
      const newUser = {
        UserID: Date.now(),
        Name: userData.name,
        Email: userData.email,
        Role: userData.role,
        Height: userData.height || null,
        Weight: userData.weight || null
      };
      mockUsers.push(newUser);

      return {
        success: true,
        message: 'User added successfully',
        userId: newUser.UserID
      };
    }

    const response = await api.post('/admin/users', userData);
    return response.data;
  },
  deleteUser: async (userId) => {
    if (IS_DEMO_MODE) {
      await delay(500);
      const index = mockUsers.findIndex(user => user.UserID === userId);
      if (index > -1) {
        mockUsers.splice(index, 1);
      }

      return {
        success: true,
        message: 'User deleted successfully'
      };
    }

    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};

// Patient services
export const patientService = {
  getProfile: async () => {
    if (IS_DEMO_MODE) {
      await delay(400);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const mockProfile = mockUsers.find(u => u.UserID === user.id) || {
        id: user.id,
        name: user.name,
        email: user.email,
        height: 175,
        weight: 70
      };

      return {
        success: true,
        user: {
          id: mockProfile.UserID || mockProfile.id,
          name: mockProfile.Name || mockProfile.name,
          email: mockProfile.Email || mockProfile.email,
          height: mockProfile.Height || mockProfile.height,
          weight: mockProfile.Weight || mockProfile.weight
        }
      };
    }

    const response = await api.get('/patient/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    if (IS_DEMO_MODE) {
      await delay(600);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userIndex = mockUsers.findIndex(u => u.UserID === user.id);

      if (userIndex > -1) {
        // Update with uppercase property names to match mockUsers structure
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          Height: profileData.height,
          Weight: profileData.weight
        };
      }

      return {
        success: true,
        message: 'Profile updated successfully',
        user: {
          height: profileData.height,
          weight: profileData.weight
        }
      };
    }

    const response = await api.put('/patient/profile', profileData);
    return response.data;
  },
};

// Meal services
let mockMealLogs = [];
let mockDailyCalorieLimit = 2000;

export const mealService = {
  getAllMeals: async () => {
    if (IS_DEMO_MODE) {
      await delay(400);
      return {
        success: true,
        data: mockMeals
      };
    }

    const response = await api.get('/meals/meals');
    return response.data;
  },
  getDailyCalorieLimit: async () => {
    if (IS_DEMO_MODE) {
      await delay(300);
      return {
        success: true,
        data: { dailyLimit: mockDailyCalorieLimit }
      };
    }

    const response = await api.get('/meals/dailylimit');
    return response.data;
  },
  logMeal: async (mealData) => {
    if (IS_DEMO_MODE) {
      await delay(600);
      const meal = mockMeals.find(m => m.MealID === mealData.mealId);
      if (!meal) {
        throw new Error('Meal not found');
      }

      const logEntry = {
        MealLogID: Date.now(),
        Date: mealData.date,
        MealType: mealData.mealType,
        CalorieIntake: meal.Calories,
        MealName: meal.MealName,
        NutritionalValue: meal.NutritionalValue,
        Type: meal.Type
      };

      mockMealLogs.push(logEntry);

      // Calculate total calories for the day
      const dayLogs = mockMealLogs.filter(log => log.Date === mealData.date);
      const totalCalories = dayLogs.reduce((sum, log) => sum + log.CalorieIntake, 0);

      const response = {
        success: true,
        data: {
          mealLogged: true,
          totalCalories,
          dailyLimit: mockDailyCalorieLimit
        }
      };

      // Add warnings if over limit
      if (totalCalories > mockDailyCalorieLimit) {
        response.warnings = {
          calorieLimit: `Warning: You've exceeded your daily calorie limit of ${mockDailyCalorieLimit} calories.`
        };
      }

      return response;
    }

    const response = await api.post('/meals/log', mealData);
    return response.data;
  },
  getDailyLogs: async (date) => {
    if (IS_DEMO_MODE) {
      await delay(400);
      const dateStr = date.toISOString().split('T')[0];
      const dayLogs = mockMealLogs.filter(log => log.Date === dateStr);
      const totalCalories = dayLogs.reduce((sum, log) => sum + log.CalorieIntake, 0);

      return {
        success: true,
        data: {
          logs: dayLogs,
          totalCalories
        }
      };
    }

    const dateStr = date.toISOString().split('T')[0];
    const response = await api.get(`/meals/logs/${dateStr}`);
    return response.data;
  },
  deleteMealLog: async (logId) => {
    if (IS_DEMO_MODE) {
      await delay(500);
      const logIndex = mockMealLogs.findIndex(log => log.MealLogID === logId);
      if (logIndex > -1) {
        const deletedLog = mockMealLogs[logIndex];
        mockMealLogs.splice(logIndex, 1);

        // Recalculate total calories for the day
        const dayLogs = mockMealLogs.filter(log => log.Date === deletedLog.Date);
        const totalCalories = dayLogs.reduce((sum, log) => sum + log.CalorieIntake, 0);

        return {
          success: true,
          message: 'Meal log deleted successfully',
          data: {
            totalCalories
          }
        };
      } else {
        throw new Error('Meal log not found');
      }
    }

    const response = await api.delete(`/meals/logs/${logId}`);
    return response.data;
  },
};

// Exercise services
let mockExerciseLogs = [
  {
    ExerciseLogID: 1,
    ActivityType: 'Running',
    Duration: 30,
    Date: new Date().toISOString().split('T')[0],
    CaloriesBurned: 300
  },
  {
    ExerciseLogID: 2,
    ActivityType: 'Cycling',
    Duration: 45,
    Date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    CaloriesBurned: 400
  }
];

export const exerciseService = {
  getExercises: async (filter = 'all') => {
    if (IS_DEMO_MODE) {
      await delay(500);

      let filteredExercises = [...mockExerciseLogs];
      const now = new Date();

      if (filter === 'today') {
        const today = now.toISOString().split('T')[0];
        filteredExercises = mockExerciseLogs.filter(ex => ex.Date === today);
      } else if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredExercises = mockExerciseLogs.filter(ex => new Date(ex.Date) >= weekAgo);
      } else if (filter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredExercises = mockExerciseLogs.filter(ex => new Date(ex.Date) >= monthAgo);
      }

      const totalCalories = filteredExercises.reduce((sum, ex) => sum + ex.CaloriesBurned, 0);

      return {
        success: true,
        exercises: filteredExercises,
        totalCalories
      };
    }

    const response = await api.get(`/exercises?filter=${filter}`);
    return response.data;
  },
  addExercise: async (exerciseData) => {
    if (IS_DEMO_MODE) {
      await delay(600);

      const newExercise = {
        ExerciseLogID: Date.now(),
        ActivityType: exerciseData.ActivityType,
        Duration: exerciseData.Duration,
        Date: exerciseData.Date,
        CaloriesBurned: exerciseData.CaloriesBurned
      };

      mockExerciseLogs.push(newExercise);

      return {
        success: true,
        message: 'Exercise logged successfully',
        exerciseLogId: newExercise.ExerciseLogID
      };
    }

    const response = await api.post('/exercises', exerciseData);
    return response.data;
  },
  deleteExercise: async (logId) => {
    if (IS_DEMO_MODE) {
      await delay(500);
      const logIndex = mockExerciseLogs.findIndex(log => log.ExerciseLogID === logId);
      if (logIndex > -1) {
        mockExerciseLogs.splice(logIndex, 1);
        return {
          success: true,
          message: 'Exercise log deleted successfully'
        };
      } else {
        throw new Error('Exercise log not found');
      }
    }

    const response = await api.delete(`/exercises/${logId}`);
    return response.data;
  },
};

// Appointment services
let mockAppointments = [
  {
    AppointmentID: 1,
    Date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
    Time: '10:00',
    DieticianName: 'Dr. Anita Rao',
    Specialization: 'Weight Loss'
  }
];

export const appointmentService = {
  getDieticians: async () => {
    if (IS_DEMO_MODE) {
      await delay(400);
      return {
        success: true,
        dieticians: mockDieticians
      };
    }

    const response = await api.get('/appointments/dieticians');
    return response.data;
  },
  getUserAppointments: async () => {
    if (IS_DEMO_MODE) {
      await delay(500);
      return {
        success: true,
        appointments: mockAppointments
      };
    }

    const response = await api.get('/appointments/user');
    return response.data;
  },
  scheduleAppointment: async (appointmentData) => {
    if (IS_DEMO_MODE) {
      await delay(700);

      const dietician = mockDieticians.find(d => d.DieticianID === appointmentData.dieticianId);
      if (!dietician) {
        throw new Error('Dietician not found');
      }

      // Check for conflicts
      const existingAppointment = mockAppointments.find(
        apt => apt.Date === appointmentData.date && apt.Time === appointmentData.time
      );

      if (existingAppointment) {
        throw new Error('You already have an appointment scheduled at this time');
      }

      const newAppointment = {
        AppointmentID: Date.now(),
        Date: appointmentData.date,
        Time: appointmentData.time,
        DieticianName: dietician.Name,
        Specialization: dietician.Specialization
      };

      mockAppointments.push(newAppointment);

      return {
        success: true,
        message: 'Appointment scheduled successfully',
        appointment: newAppointment
      };
    }

    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  cancelAppointment: async (appointmentId) => {
    if (IS_DEMO_MODE) {
      await delay(500);
      const appointmentIndex = mockAppointments.findIndex(apt => apt.AppointmentID === appointmentId);
      if (appointmentIndex > -1) {
        mockAppointments.splice(appointmentIndex, 1);
        return {
          success: true,
          message: 'Appointment cancelled successfully'
        };
      } else {
        throw new Error('Appointment not found');
      }
    }

    const response = await api.delete(`/appointments/${appointmentId}`);
    return response.data;
  },
};

// Report services
const generateMockReportData = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dailyData = [];
  let dayIndex = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];

    // Generate realistic mock data with deterministic positive days
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Ensure specific days have positive progress (burned > intake)
    let baseIntake, baseBurned;

    // Make every 3rd day a positive progress day (burned > intake)
    if (dayIndex % 3 === 0 || dayOfWeek === 1 || dayOfWeek === 3) {
      // Positive progress days: High exercise, lower intake
      baseIntake = 1600 + Math.random() * 200; // 1600-1800 calories
      baseBurned = 2000 + Math.random() * 400; // 2000-2400 calories burned
    } else if (dayIndex % 4 === 0) {
      // Moderate positive days
      baseIntake = 1800 + Math.random() * 150; // 1800-1950 calories
      baseBurned = 1900 + Math.random() * 200; // 1900-2100 calories burned
    } else {
      // Regular days with negative progress (intake > burned)
      baseIntake = 2000 + Math.random() * 300; // 2000-2300 calories
      baseBurned = 300 + Math.random() * 200;  // 300-500 calories burned
    }

    // Weekend adjustment - slightly higher intake
    if (isWeekend && baseBurned < baseIntake) {
      baseIntake += 100 + Math.random() * 100;
    }

    const intake = Math.round(baseIntake);
    const burned = Math.round(baseBurned);
    const netCalories = intake - burned;

    dailyData.push({
      date: dateStr,
      calorieIntake: intake,
      calorieBurned: burned,
      netCalories: netCalories
    });

    dayIndex++;
  }

  return dailyData;
};

export const reportService = {
  generateReport: async (reportType, startDate, endDate) => {
    if (IS_DEMO_MODE) {
      await delay(800);

      const dailyData = generateMockReportData(startDate, endDate);

      // Calculate summary statistics
      let totalIntake = 0;
      let totalBurned = 0;
      const daysWithData = dailyData.length;

      dailyData.forEach(day => {
        totalIntake += day.calorieIntake;
        totalBurned += day.calorieBurned;
      });

      const avgIntake = daysWithData > 0 ? Math.round(totalIntake / daysWithData) : 0;
      const avgBurned = daysWithData > 0 ? Math.round(totalBurned / daysWithData) : 0;
      const netCalories = totalIntake - totalBurned;
      const netProgress = netCalories <= 0 ? 'Positive' : 'Negative';

      const summary = {
        totalIntake,
        totalBurned,
        netCalories,
        avgIntake,
        avgBurned,
        netProgress,
        daysTracked: daysWithData
      };

      return {
        success: true,
        data: {
          reportType,
          dateRange: { startDate, endDate },
          dailyData,
          summary
        }
      };
    }

    const response = await api.get(`/reports/generate?reportType=${reportType}&startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },
};

// Diet services
const mockNutritionalGoals = [
  'Weight Loss',
  'Muscle Gain',
  'Heart Health',
  'Diabetes Management',
  'Low Carb'
];

// Comprehensive meal plans for different goals and exercise levels
const mealPlans = {
  'Weight Loss': {
    'Low': [
      { mealId: 1, mealName: 'Green Smoothie Bowl', calories: 250, nutritionalValue: 'Low calorie, high fiber', type: 'Breakfast' },
      { mealId: 2, mealName: 'Grilled Chicken Salad', calories: 300, nutritionalValue: 'High protein, low carb', type: 'Lunch' },
      { mealId: 3, mealName: 'Steamed Vegetables with Tofu', calories: 280, nutritionalValue: 'Low calorie, plant protein', type: 'Dinner' },
      { mealId: 4, mealName: 'Cucumber Mint Water', calories: 10, nutritionalValue: 'Hydrating, zero calories', type: 'Snack' }
    ],
    'Medium': [
      { mealId: 5, mealName: 'Oatmeal with Berries', calories: 320, nutritionalValue: 'Complex carbs, antioxidants', type: 'Breakfast' },
      { mealId: 6, mealName: 'Turkey Wrap', calories: 380, nutritionalValue: 'Lean protein, whole grains', type: 'Lunch' },
      { mealId: 7, mealName: 'Grilled Fish with Quinoa', calories: 420, nutritionalValue: 'Omega-3, complete protein', type: 'Dinner' },
      { mealId: 8, mealName: 'Apple with Almond Butter', calories: 180, nutritionalValue: 'Healthy fats, fiber', type: 'Snack' }
    ],
    'High': [
      { mealId: 9, mealName: 'Protein Pancakes', calories: 400, nutritionalValue: 'High protein, complex carbs', type: 'Breakfast' },
      { mealId: 10, mealName: 'Chicken Buddha Bowl', calories: 450, nutritionalValue: 'Balanced macros, nutrient dense', type: 'Lunch' },
      { mealId: 11, mealName: 'Lean Beef Stir Fry', calories: 480, nutritionalValue: 'High protein, iron rich', type: 'Dinner' },
      { mealId: 12, mealName: 'Greek Yogurt with Nuts', calories: 220, nutritionalValue: 'Protein, healthy fats', type: 'Snack' }
    ]
  },
  'Muscle Gain': {
    'Low': [
      { mealId: 13, mealName: 'Protein Smoothie', calories: 450, nutritionalValue: 'High protein, fast absorption', type: 'Breakfast' },
      { mealId: 14, mealName: 'Chicken Rice Bowl', calories: 550, nutritionalValue: 'Protein, complex carbs', type: 'Lunch' },
      { mealId: 15, mealName: 'Salmon with Sweet Potato', calories: 600, nutritionalValue: 'Omega-3, complex carbs', type: 'Dinner' },
      { mealId: 16, mealName: 'Cottage Cheese with Fruit', calories: 200, nutritionalValue: 'Casein protein, vitamins', type: 'Snack' }
    ],
    'Medium': [
      { mealId: 17, mealName: 'Egg Benedict', calories: 520, nutritionalValue: 'Complete protein, healthy fats', type: 'Breakfast' },
      { mealId: 18, mealName: 'Steak Salad', calories: 650, nutritionalValue: 'High protein, iron, B vitamins', type: 'Lunch' },
      { mealId: 19, mealName: 'Chicken Pasta', calories: 700, nutritionalValue: 'Protein, carbs for recovery', type: 'Dinner' },
      { mealId: 20, mealName: 'Protein Bar', calories: 250, nutritionalValue: 'Convenient protein source', type: 'Snack' }
    ],
    'High': [
      { mealId: 21, mealName: 'Mass Gainer Shake', calories: 600, nutritionalValue: 'High protein, high calories', type: 'Breakfast' },
      { mealId: 22, mealName: 'Double Chicken Burrito', calories: 800, nutritionalValue: 'High protein, complex carbs', type: 'Lunch' },
      { mealId: 23, mealName: 'Ribeye with Mashed Potatoes', calories: 900, nutritionalValue: 'High protein, calorie dense', type: 'Dinner' },
      { mealId: 24, mealName: 'Peanut Butter Sandwich', calories: 400, nutritionalValue: 'Protein, healthy fats, carbs', type: 'Snack' }
    ]
  },
  'Heart Health': {
    'Low': [
      { mealId: 25, mealName: 'Oatmeal with Walnuts', calories: 300, nutritionalValue: 'Omega-3, soluble fiber', type: 'Breakfast' },
      { mealId: 26, mealName: 'Mediterranean Salad', calories: 350, nutritionalValue: 'Heart-healthy fats, antioxidants', type: 'Lunch' },
      { mealId: 27, mealName: 'Baked Cod with Vegetables', calories: 320, nutritionalValue: 'Lean protein, low sodium', type: 'Dinner' },
      { mealId: 28, mealName: 'Mixed Berries', calories: 80, nutritionalValue: 'Antioxidants, low sugar', type: 'Snack' }
    ],
    'Medium': [
      { mealId: 29, mealName: 'Avocado Toast', calories: 380, nutritionalValue: 'Monounsaturated fats, fiber', type: 'Breakfast' },
      { mealId: 30, mealName: 'Quinoa Tabbouleh', calories: 420, nutritionalValue: 'Whole grains, fresh herbs', type: 'Lunch' },
      { mealId: 31, mealName: 'Grilled Salmon', calories: 450, nutritionalValue: 'Omega-3 fatty acids', type: 'Dinner' },
      { mealId: 32, mealName: 'Handful of Almonds', calories: 160, nutritionalValue: 'Vitamin E, healthy fats', type: 'Snack' }
    ],
    'High': [
      { mealId: 33, mealName: 'Chia Seed Pudding', calories: 400, nutritionalValue: 'Omega-3, fiber, protein', type: 'Breakfast' },
      { mealId: 34, mealName: 'Lentil Soup with Whole Grain Bread', calories: 480, nutritionalValue: 'Plant protein, complex carbs', type: 'Lunch' },
      { mealId: 35, mealName: 'Mediterranean Chicken', calories: 520, nutritionalValue: 'Lean protein, olive oil', type: 'Dinner' },
      { mealId: 36, mealName: 'Dark Chocolate with Nuts', calories: 200, nutritionalValue: 'Antioxidants, healthy fats', type: 'Snack' }
    ]
  },
  'Diabetes Management': {
    'Low': [
      { mealId: 37, mealName: 'Steel Cut Oats', calories: 280, nutritionalValue: 'Low glycemic, high fiber', type: 'Breakfast' },
      { mealId: 38, mealName: 'Grilled Chicken with Broccoli', calories: 320, nutritionalValue: 'Lean protein, low carb', type: 'Lunch' },
      { mealId: 39, mealName: 'Baked Tilapia with Asparagus', calories: 300, nutritionalValue: 'Low fat, blood sugar friendly', type: 'Dinner' },
      { mealId: 40, mealName: 'Celery with Hummus', calories: 100, nutritionalValue: 'Low glycemic, protein', type: 'Snack' }
    ],
    'Medium': [
      { mealId: 41, mealName: 'Vegetable Omelet', calories: 350, nutritionalValue: 'Protein, low carb, nutrients', type: 'Breakfast' },
      { mealId: 42, mealName: 'Turkey and Avocado Lettuce Wraps', calories: 380, nutritionalValue: 'Lean protein, healthy fats', type: 'Lunch' },
      { mealId: 43, mealName: 'Cauliflower Rice Stir Fry', calories: 400, nutritionalValue: 'Low carb, high fiber', type: 'Dinner' },
      { mealId: 44, mealName: 'Sugar-free Jello with Berries', calories: 60, nutritionalValue: 'Low sugar, antioxidants', type: 'Snack' }
    ],
    'High': [
      { mealId: 45, mealName: 'Protein Smoothie with Spinach', calories: 420, nutritionalValue: 'Protein, low sugar, nutrients', type: 'Breakfast' },
      { mealId: 46, mealName: 'Zucchini Noodles with Meat Sauce', calories: 450, nutritionalValue: 'Low carb, high protein', type: 'Lunch' },
      { mealId: 47, mealName: 'Grilled Pork with Green Beans', calories: 480, nutritionalValue: 'Lean protein, low glycemic', type: 'Dinner' },
      { mealId: 48, mealName: 'Nuts and Seeds Mix', calories: 180, nutritionalValue: 'Healthy fats, protein', type: 'Snack' }
    ]
  },
  'Low Carb': {
    'Low': [
      { mealId: 49, mealName: 'Scrambled Eggs with Cheese', calories: 300, nutritionalValue: 'High fat, zero carbs', type: 'Breakfast' },
      { mealId: 50, mealName: 'Caesar Salad with Chicken', calories: 350, nutritionalValue: 'High fat, low carb', type: 'Lunch' },
      { mealId: 51, mealName: 'Butter Garlic Shrimp', calories: 320, nutritionalValue: 'High fat, zero carbs', type: 'Dinner' },
      { mealId: 52, mealName: 'Cheese Cubes', calories: 110, nutritionalValue: 'High fat, zero carbs', type: 'Snack' }
    ],
    'Medium': [
      { mealId: 53, mealName: 'Bacon and Eggs', calories: 420, nutritionalValue: 'High fat, high protein', type: 'Breakfast' },
      { mealId: 54, mealName: 'Bunless Burger with Avocado', calories: 480, nutritionalValue: 'High fat, high protein', type: 'Lunch' },
      { mealId: 55, mealName: 'Ribeye Steak with Butter', calories: 550, nutritionalValue: 'High fat, high protein', type: 'Dinner' },
      { mealId: 56, mealName: 'Macadamia Nuts', calories: 200, nutritionalValue: 'Very high fat, low carb', type: 'Snack' }
    ],
    'High': [
      { mealId: 57, mealName: 'Keto Pancakes with Butter', calories: 500, nutritionalValue: 'High fat, very low carb', type: 'Breakfast' },
      { mealId: 58, mealName: 'Fatty Fish with Olive Oil', calories: 600, nutritionalValue: 'Omega-3, high fat', type: 'Lunch' },
      { mealId: 59, mealName: 'Pork Belly with Vegetables', calories: 650, nutritionalValue: 'Very high fat, moderate protein', type: 'Dinner' },
      { mealId: 60, mealName: 'Avocado with Salt', calories: 250, nutritionalValue: 'Monounsaturated fats', type: 'Snack' }
    ]
  }
};

let mockUserGoal = {
  nutritionalGoal: 'Weight Loss',
  dailyCalorieLimit: 2000
};

export const dietService = {
  getNutritionalGoals: async () => {
    if (IS_DEMO_MODE) {
      await delay(300);
      return {
        success: true,
        data: mockNutritionalGoals
      };
    }

    const response = await api.get('/diet/nutritional-goals');
    return response.data;
  },
  getUserGoal: async () => {
    if (IS_DEMO_MODE) {
      await delay(400);
      return {
        success: true,
        data: mockUserGoal
      };
    }

    const response = await api.get('/diet/user-goal');
    return response.data;
  },
  saveUserGoal: async (goalData) => {
    if (IS_DEMO_MODE) {
      await delay(500);
      mockUserGoal = { ...mockUserGoal, ...goalData };
      return {
        success: true,
        message: 'Goal saved successfully'
      };
    }

    const response = await api.post('/diet/user-goal', goalData);
    return response.data;
  },
  getRecommendedMeals: async (nutritionalGoal, exerciseLevel) => {
    if (IS_DEMO_MODE) {
      await delay(600);

      // Get specific meal plan based on nutritional goal and exercise level
      let recommendedMeals = [];

      if (mealPlans[nutritionalGoal] && mealPlans[nutritionalGoal][exerciseLevel]) {
        recommendedMeals = mealPlans[nutritionalGoal][exerciseLevel];
      } else {
        // Fallback to Weight Loss Low if combination not found
        recommendedMeals = mealPlans['Weight Loss']['Low'];
      }

      return {
        success: true,
        data: recommendedMeals
      };
    }

    const response = await api.get(`/diet/recommended-meals?nutritionalGoal=${nutritionalGoal}&exerciseLevel=${exerciseLevel}`);
    return response.data;
  },
};

export default api;
