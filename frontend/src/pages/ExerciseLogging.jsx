import React, { useState, useEffect } from 'react';
import { exerciseService } from '../services/api';
import NavigationBar from '../components/NavigationBar';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import '../styles/patient.css';

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
    
    setLoading(true);
    try {
      await exerciseService.addExercise(exerciseData);
      // Refresh exercise logs after adding new entry
      fetchExerciseLogs();
    } catch (error) {
      console.error('Error logging exercise:', error);
      alert('Failed to log exercise. Please try again.');
    } finally {
      setLoading(false);
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
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h2>NutriTrack Home Portal</h2>
        </div>
        <div className="user-info">
          <span>Exercise Logging</span>
        </div>
      </header>
      
      <NavigationBar />
      
      <main className="dashboard-content">
        <section className="profile-section">
          <h2>Exercise Logging</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="activityType">Activity Type:</label>
              <select
                id="activityType"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
              >
                {Object.keys(CALORIE_BURN_RATES).map(activity => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="duration">Duration:</label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option>30 minutes</option>
                <option>60 minutes</option>
                <option>90 minutes</option>
                <option>120 minutes</option>
                <option>150 minutes</option>
                <option>180 minutes</option>
                <option>210 minutes</option>
                <option>240 minutes</option>
                <option>270 minutes</option>
                <option>300 minutes</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="exerciseDate">Date:</label>
              <input 
                id="exerciseDate"
                type="date" 
                value={exerciseDate}
                onChange={(e) => setExerciseDate(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="calories">Calories Burned:</label>
              <input 
                id="calories"
                type="number" 
                placeholder="Calories" 
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                readOnly
              />
              <small>Automatically calculated based on activity type and duration</small>
            </div>
            
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Loader size="small" /> : 'Log Exercise'}
            </Button>
          </form>
          
          <div className="exercise-log-section">
            <div className="log-header">
              <h3>Activity Log</h3>
              <div className="filter-controls">
                <label htmlFor="filterPeriod">Filter by:</label>
                <select
                  id="filterPeriod"
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                >
                  <option value="all">All time</option>
                  <option value="day">Past day</option>
                  <option value="week">Past week</option>
                  <option value="month">Past month</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <Loader />
            ) : (
              <>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Activity Type</th>
                      <th>Duration</th>
                      <th>Date</th>
                      <th>Calories Burned</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercises && exercises.length > 0 ? (
                      exercises.map((exercise) => (
                        <tr key={exercise.ExerciseLogID}>
                          <td>{exercise.ActivityType}</td>
                          <td>{exercise.Duration}</td>
                          <td>{new Date(exercise.Date).toLocaleDateString()}</td>
                          <td>{exercise.CaloriesBurned}</td>
                          <td>
                            <button 
                              className="delete-btn" 
                              onClick={() => handleDeleteExercise(exercise.ExerciseLogID)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">No exercise logs found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="summary-section">
                  <p className="total-calories">
                    <strong>Total Calories Burned ({filterPeriod === 'all' ? 'All Time' : 
                          filterPeriod === 'day' ? 'Today' : 
                          filterPeriod === 'week' ? 'This Week' : 'This Month'}):</strong> 
                    {totalCaloriesBurned}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}