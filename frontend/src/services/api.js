import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  getProfile: async () => {
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
    const response = await api.get('/admin/users');
    return response.data;
  },
  addUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },
};

// Patient services
export const patientService = {
  getProfile: async () => {
    const response = await api.get('/patient/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/patient/profile', profileData);
    return response.data;
  }
};

// Add this to your api.js file
export const appointmentService = {
  getDieticians: async () => {
    const response = await api.get('/appointments/dieticians');
    return response.data;
  },
  getUserAppointments: async () => {
    const response = await api.get('/appointments/user');
    return response.data;
  },
  scheduleAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  cancelAppointment: async (appointmentId) => {
    const response = await api.delete(`/appointments/${appointmentId}`);
    return response.data;
  }
};
// Add this to api.js
export const exerciseService = {
  getExercises: async (filterType = 'all') => {
    try {
      const response = await api.get(`/exercises?filter=${filterType}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  addExercise: async (exerciseData) => {
    try {
      const response = await api.post('/exercises', exerciseData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  deleteExercise: async (exerciseLogId) => {
    try {
      const response = await api.delete(`/exercises/${exerciseLogId}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Meal logging services
export const mealService = {
  getAllMeals: async () => {
    try {
      const response = await api.get('/meals/meals');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  getDailyCalorieLimit: async () => {
    try {
      const response = await api.get('/meals/dailylimit');
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  logMeal: async (mealData) => {
    try {
      const response = await api.post('/meals/log', mealData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  getDailyLogs: async (date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      const response = await api.get(`/meals/logs/${formattedDate}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  deleteMealLog: async (logId) => {
    try {
      const response = await api.delete(`/meals/log/${logId}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export const reportService = {
  generateReport: async (reportType, startDate, endDate) => {
    try {
      const response = await api.get('/reports/generate', {
        params: { reportType, startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

export const dietService = {
  getNutritionalGoals: async () => {
    try {
      const response = await api.get('/diet/nutritional-goals');
      return response.data;
    } catch (error) {
      console.error('Diet API Error:', error);
      throw error;
    }
  },
  getUserGoal: async () => {
    try {
      const response = await api.get('/diet/user-goal');
      return response.data;
    } catch (error) {
      console.error('Diet API Error:', error);
      throw error;
    }
  },
  saveUserGoal: async (nutritionalGoal, exerciseLevel) => {
    try {
      const response = await api.post('/diet/user-goal', {
        nutritionalGoal,
        exerciseLevel
      });
      return response.data;
    } catch (error) {
      console.error('Diet API Error:', error);
      throw error;
    }
  },
  getRecommendedMeals: async (nutritionalGoal, exerciseLevel) => {
    try {
      const response = await api.get('/diet/recommended-meals', {
        params: { nutritionalGoal, exerciseLevel }
      });
      return response.data;
    } catch (error) {
      console.error('Diet API Error:', error);
      throw error;
    }
  }
};

export default api;
