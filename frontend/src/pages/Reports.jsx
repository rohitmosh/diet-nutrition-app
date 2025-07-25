import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import { reportService } from '../services/api';
import '../styles/patient.css';

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
      
      // Call the report service to get the data
      const response = await reportService.generateReport(reportType, startDate, endDate);
      
      if (response.success) {
        setReportData(response.data);
      } else {
        setError(response.message || 'Failed to generate report');
      }
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h2>NutriTrack Home Portal</h2>
        </div>
        <div className="user-info">
          <span>Health Reports</span>
        </div>
      </header>
      
      <NavigationBar />
      
      <main className="dashboard-content">
        <section className="profile-section">
          <h2>Reports</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="reportType">Select Report Type:</label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option>Weekly Summary</option>
                <option>Monthly Summary</option>
                <option>Yearly Summary</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </form>
          
          {error && <div className="error-message">{error}</div>}
          
          {reportData && (
            <div className="report-results">
              <h3>{reportType}</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Calorie Intake</th>
                    <th>Calorie Burned</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.dailyData.map((day, index) => (
                    <tr key={index}>
                      <td>{day.date}</td>
                      <td>{day.calorieIntake}</td>
                      <td>{day.calorieBurned}</td>
                      <td className={day.progress === 'Positive' ? 'positive' : 'negative'}>
                        {day.progress}
                      </td>
                    </tr>
                  ))}
                  {reportData.dailyData.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>No data available for the selected period</td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              <div className="summary-stats">
                <div className="stat-box">
                  <h4>Average Daily Intake</h4>
                  <p className="stat-value">{reportData.summary.avgIntake} calories</p>
                </div>
                <div className="stat-box">
                  <h4>Average Calories Burned</h4>
                  <p className="stat-value">{reportData.summary.avgBurned} calories</p>
                </div>
                <div className="stat-box">
                  <h4>Net Progress</h4>
                  <p className={`stat-value ${reportData.summary.netProgress === 'Positive' ? 'positive' : 'negative'}`}>
                    {reportData.summary.netProgress}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}