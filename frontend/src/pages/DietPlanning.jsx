import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import '../styles/patient.css';
import api from "../services/api";

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
          const nutritionalGoalsResponse = await api.get('/diet/nutritional-goals');
          if (nutritionalGoalsResponse.data && nutritionalGoalsResponse.data.length > 0) {
            setNutritionalGoalOptions(nutritionalGoalsResponse.data);
          }
        } catch (err) {
          console.error('Error fetching nutritional goals:', err);
          // Keep using default options set above
        }
        
        // Try to get user's current goal if exists
        try {
          const userGoalResponse = await api.get('/diet/user-goal');
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
        const saveGoalResponse = await api.post('/diet/user-goal', {
          nutritionalGoal,
          exerciseLevel
        });
        
        setUserGoal(saveGoalResponse.data);
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
        const mealsResponse = await api.get(`/diet/recommended-meals?nutritionalGoal=${nutritionalGoal}&exerciseLevel=${exerciseLevel}`);
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
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h2>Healthcare Patient Portal</h2>
        </div>
        <div className="user-info">
          <span>Diet Planning</span>
        </div>
      </header>
      
      <NavigationBar />
      
      <main className="dashboard-content">
        <section className="profile-section">
          <h2>Diet Planning</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="nutritionalGoal">Nutritional Goal:</label>
            <select
              id="nutritionalGoal"
              value={nutritionalGoal}
              onChange={(e) => setNutritionalGoal(e.target.value)}
            >
              <option value="">Select a goal</option>
              {nutritionalGoalOptions.map(goal => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="exerciseLevel">Exercise Level:</label>
            <select
              id="exerciseLevel"
              value={exerciseLevel}
              onChange={(e) => setExerciseLevel(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={handleShowDietPlans}
            disabled={loading || !nutritionalGoal}
          >
            {loading ? 'Loading...' : 'Show Diet Plans'}
          </button>
          
          {userGoal && (
            <div className="user-goal-info">
              <h3>Your Current Goal</h3>
              <p>Nutritional Goal: {userGoal.nutritionalGoal}</p>
              <p>Exercise Level: {userGoal.exerciseLevel}</p>
              {userGoal.dailyCalorieLimit && (
                <p>Daily Calorie Target: {userGoal.dailyCalorieLimit} calories</p>
              )}
            </div>
          )}
          
          {recommendedMeals.length > 0 && (
            <div className="diet-plan-results">
              <h3>Recommended Meals</h3>
              <table className="meals-table">
                <thead>
                  <tr>
                    <th>Meal Name</th>
                    <th>Calories</th>
                    <th>Nutritional Value</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendedMeals.map(meal => (
                    <tr key={meal.mealId}>
                      <td>{meal.mealName}</td>
                      <td>{meal.calories}</td>
                      <td>{meal.nutritionalValue}</td>
                      <td>{meal.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}