const db = require('../config/db');

exports.getUserExerciseLogs = async (userId) => {
    try {
      const [rows] = await db.execute(
        `CALL sp_GetUserExerciseLogs(?)`,
        [userId]
      );
      
      // Stored procedure result is in the first element of the array
      return rows[0];
    } catch (error) {
      console.error('Error fetching exercise logs:', error);
      throw error;
    }
  };
  
  exports.getFilteredExerciseLogs = async (userId, filterType) => {
    try {
      const [rows] = await db.execute(
        `CALL sp_GetFilteredExerciseLogs(?, ?)`,
        [userId, filterType]
      );
      
      return rows[0];
    } catch (error) {
      console.error('Error fetching filtered exercise logs:', error);
      throw error;
    }
  };
  
  exports.addExerciseLog = async (exerciseData) => {
    try {
      const { userId, activityType, duration, date, caloriesBurned } = exerciseData;
      
      const [result] = await db.execute(
        `CALL sp_AddExerciseLog(?, ?, ?, ?, ?)`,
        [userId, activityType, duration, date, caloriesBurned]
      );
      
      // The stored procedure returns the inserted ID
      return result[0][0].ExerciseLogID;
    } catch (error) {
      console.error('Error adding exercise log:', error);
      throw error;
    }
  };
  
  exports.deleteExerciseLog = async (logId, userId) => {
    try {
      const [result] = await db.execute(
        `DELETE FROM exerciselogs WHERE ExerciseLogID = ? AND UserID = ?`,
        [logId, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error deleting exercise log:', error);
      throw error;
    }
  };
  
  exports.getTotalCaloriesBurned = async (userId, filterType) => {
    try {
      const [rows] = await db.execute(
        `CALL sp_GetTotalCaloriesBurned(?, ?)`,
        [userId, filterType]
      );
      
      return rows[0][0].TotalCalories || 0;
    } catch (error) {
      console.error('Error calculating total calories burned:', error);
      throw error;
    }
  };