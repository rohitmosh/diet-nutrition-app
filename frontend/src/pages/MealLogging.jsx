import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import { mealService } from '../services/api';
import '../styles/patient.css';

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
      }
    } catch (error) {
      console.error('Error logging meal:', error);
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
      <div className="patient-dashboard">
        <header className="dashboard-header">
          <div className="logo">
            <h2>Healthcare Patient Portal</h2>
          </div>
          <div className="user-info">
            <span>Meal Logging</span>
          </div>
        </header>
        
        <NavigationBar />
        
        <main className="dashboard-content">
          <p>Loading meal data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h2>Healthcare Patient Portal</h2>
        </div>
        <div className="user-info">
          <span>Meal Logging</span>
        </div>
      </header>
      
      <NavigationBar />
      
      <main className="dashboard-content">
        <section className="profile-section">
          <h2>Log a New Meal</h2>
          
          {/* Display warnings if any */}
          {Object.values(warnings).length > 0 && (
            <div className="warnings">
              {Object.values(warnings).map((warning, index) => (
                <div key={index} className="warning-message">
                  {warning}
                </div>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="mealDate">Date:</label>
              <input
                id="mealDate"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="meal">Select Meal:</label>
              <select
                id="meal"
                value={selectedMeal}
                onChange={(e) => setSelectedMeal(e.target.value)}
                required
              >
                <option value="">-- Select a Meal --</option>
                {meals.map((meal) => (
                  <option key={meal.MealID} value={meal.MealID}>
                    {meal.MealName} ({meal.Type}) - {meal.Calories} cal
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="mealType">Meal Type:</label>
              <select
                id="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Calories:</label>
              <div className="calorie-display">
                {getSelectedMealCalories()} calories
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">Log Meal</button>
          </form>
        </section>
        
        <section className="meal-logs-section">
          <h2>Today's Meals</h2>
          <div className="total-calories">
            Total Calories: {totalCalories} / {dailyLimit} 
            {totalCalories > dailyLimit && (
              <span className="calorie-warning"> (Exceeded)</span>
            )}
          </div>
          
          {mealLogs.length > 0 ? (
            <table className="meal-logs-table">
              <thead>
                <tr>
                  <th>Meal</th>
                  <th>Type</th>
                  <th>Calories</th>
                  <th>Nutritional Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mealLogs.map((log) => (
                  <tr key={log.MealLogID}>
                    <td>{log.MealName}</td>
                    <td>{log.MealType}</td>
                    <td>{log.CalorieIntake}</td>
                    <td>{log.Type}</td>
                    <td>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDeleteLog(log.MealLogID)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No meals logged for this date.</p>
          )}
        </section>
      </main>
    </div>
  );
}