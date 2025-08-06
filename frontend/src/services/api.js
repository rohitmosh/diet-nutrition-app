import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const IS_DEMO = API_URL === 'demo' || API_URL.includes('demo');

// Mock data for demo mode
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'patient' },
  { id: 2, name: 'Dr. Smith', email: 'smith@example.com', role: 'doctor' }
];

const mockAppointments = [
  { id: 1, patientName: 'John Doe', doctorName: 'Dr. Smith', date: '2024-01-15', time: '10:00 AM' }
];

// Mock API responses
const mockAPI = {
  get: (url) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes('/auth/me')) {
          resolve({ data: { success: true, user: mockUsers[0] } });
        } else if (url.includes('/appointments')) {
          resolve({ data: { success: true, appointments: mockAppointments } });
        } else {
          resolve({ data: { success: true, data: [] } });
        }
      }, 500);
    });
  },
  post: (url, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.includes('/auth/login')) {
          resolve({ data: { success: true, token: 'demo-token', user: mockUsers[0] } });
        } else {
          resolve({ data: { success: true, message: 'Demo operation successful' } });
        }
      }, 500);
    });
  },
  put: () => Promise.resolve({ data: { success: true } }),
  delete: () => Promise.resolve({ data: { success: true } })
};

const api = IS_DEMO ? mockAPI : axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

if (!IS_DEMO) {
  // Add auth token to requests (only for real API)
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

  // Handle unauthorized responses (only for real API)
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
}

export default api;
export { IS_DEMO };
