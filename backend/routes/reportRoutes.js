const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const db = require('../config/db');

// Hardcoded mock data for demonstration
const generateMockReportData = (reportType, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dailyData = [];

  // Generate mock data for each day in the range
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];

    // Generate realistic mock data with some variation
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayOfMonth = d.getDate();

    // Create some patterns for positive/negative days
    const isGoodDay = (dayOfMonth % 3 === 0) || (dayOfWeek === 1) || (dayOfWeek === 3); // Every 3rd day, Mondays, Wednesdays

    let calorieIntake, calorieBurned;

    if (isGoodDay) {
      // Good days: Lower intake, higher burn (positive net calories - burn > intake)
      const baseIntake = isWeekend ? 1200 : 1000;
      const baseBurned = isWeekend ? 1400 : 1200;

      const intakeVariation = Math.random() * 0.1 - 0.05; // ±5% variation for intake
      const burnVariation = Math.random() * 0.1 + 0.05; // +5% to +15% variation for burn

      calorieIntake = Math.round(baseIntake * (1 + intakeVariation));
      calorieBurned = Math.round(baseBurned * (1 + burnVariation));

      // Ensure burn is always higher than intake on good days
      if (calorieBurned <= calorieIntake) {
        calorieBurned = calorieIntake + Math.round(Math.random() * 200 + 100); // Add 100-300 extra burn
      }
    } else {
      // Regular days: Higher intake, moderate burn (negative net calories - intake > burn)
      const baseIntake = isWeekend ? 2200 : 1900;
      const baseBurned = isWeekend ? 400 : 450;

      const variation = Math.random() * 0.3 - 0.15; // ±15% variation
      calorieIntake = Math.round(baseIntake * (1 + variation));
      calorieBurned = Math.round(baseBurned * (1 + variation));
    }

    const netCalories = calorieIntake - calorieBurned;
    const progress = netCalories <= 0 ? 'Positive' : 'Negative';

    dailyData.push({
      date: dateStr,
      calorieIntake,
      calorieBurned,
      progress
    });
  }

  return dailyData;
};

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

    // For demonstration: Use hardcoded mock data instead of database
    const dailyData = generateMockReportData(reportType, startDate, endDate);
    
    // Calculate summary statistics
    const calculateSummary = (data) => {
      let totalIntake = 0;
      let totalBurned = 0;
      let daysWithData = data.length;

      data.forEach(day => {
        totalIntake += Number(day.calorieIntake);
        totalBurned += Number(day.calorieBurned);
      });

      const avgIntake = daysWithData > 0 ? Math.round(totalIntake / daysWithData) : 0;
      const avgBurned = daysWithData > 0 ? Math.round(totalBurned / daysWithData) : 0;
      const netCalories = totalIntake - totalBurned;
      const netProgress = netCalories <= 0 ? 'Positive' : 'Negative';

      return {
        totalIntake,
        totalBurned,
        netCalories,
        avgIntake,
        avgBurned,
        netProgress,
        daysTracked: daysWithData
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