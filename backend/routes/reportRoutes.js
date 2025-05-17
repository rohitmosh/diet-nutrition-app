const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const db = require('../config/db');

// Generate report based on type and date range
router.get('/generate', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { reportType, startDate, endDate } = req.query;
    
    if (!reportType || !startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Report type and date range are required' 
      });
    }

    // NEW APPROACH: Get all data in a single query with JOIN
    const getReportData = async () => {
      const query = `
        SELECT 
          all_dates.date AS reportDate,
          COALESCE(meal_data.total_intake, 0) AS calorieIntake,
          COALESCE(exercise_data.total_burned, 0) AS calorieBurned
        FROM 
          (
            -- Generate all dates in range
            SELECT DISTINCT DATE(selected_date) AS date
            FROM (
              SELECT DATE(?) + INTERVAL seq DAY AS selected_date
              FROM (
                SELECT 0 AS seq UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION
                SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION
                SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION
                SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION
                SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION
                SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION
                SELECT 30
              ) AS sequence
              WHERE DATE(?) + INTERVAL seq DAY <= DATE(?)
            ) AS date_range
          ) AS all_dates
        LEFT JOIN (
          -- Get meal data for each date
          SELECT 
            Date AS date, 
            SUM(CalorieIntake) AS total_intake
          FROM meallogs
          WHERE UserID = ? AND Date BETWEEN ? AND ?
          GROUP BY Date
        ) AS meal_data ON all_dates.date = meal_data.date
        LEFT JOIN (
          -- Get exercise data for each date
          SELECT 
            Date AS date, 
            SUM(CaloriesBurned) AS total_burned
          FROM exerciselogs
          WHERE UserID = ? AND Date BETWEEN ? AND ?
          GROUP BY Date
        ) AS exercise_data ON all_dates.date = exercise_data.date
        ORDER BY all_dates.date DESC;
      `;

      const [results] = await db.query(query, [
        startDate, startDate, endDate,  // For date range generation
        userId, startDate, endDate,     // For meal logs
        userId, startDate, endDate      // For exercise logs
      ]);
      
      console.log('Raw query results:', results);
      
      return results.map(row => {
        const date = row.reportDate.toISOString().split('T')[0];
        const calorieIntake = row.calorieIntake > 0 ? row.calorieIntake : '-';
        const calorieBurned = row.calorieBurned > 0 ? row.calorieBurned : '-';
        const netCalories = row.calorieIntake - row.calorieBurned;
        const progress = netCalories <= 0 ? 'Positive' : 'Negative';
        
        return {
          date,
          calorieIntake,
          calorieBurned,
          progress
        };
      });
    };
    
    // Get daily data using the new approach
    const dailyData = await getReportData();
    
    // Calculate summary statistics
    const calculateSummary = (data) => {
      let totalIntake = 0;
      let totalBurned = 0;
      let daysWithData = 0;
      
      data.forEach(day => {
        if (day.calorieIntake !== '-') {
          totalIntake += Number(day.calorieIntake);
          daysWithData++;
        }
        if (day.calorieBurned !== '-') {
          totalBurned += Number(day.calorieBurned);
        }
      });
      
      const avgIntake = daysWithData > 0 ? Math.round(totalIntake / daysWithData) : 0;
      const avgBurned = daysWithData > 0 ? Math.round(totalBurned / daysWithData) : 0;
      const netProgress = avgIntake <= avgBurned ? 'Positive' : 'Negative';
      
      return {
        avgIntake,
        avgBurned,
        netProgress
      };
    };
    
    // Generate report summary
    const summary = calculateSummary(dailyData);
    
    res.json({
      success: true,
      data: {
        reportType,
        dateRange: { startDate, endDate },
        dailyData,
        summary
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    console.error(error.stack);  // Log full stack trace for better debugging
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
});

module.exports = router;