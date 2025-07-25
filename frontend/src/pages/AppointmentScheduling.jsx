import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { appointmentService } from '../services/api';
import '../styles/patient.css';

export default function AppointmentScheduling() {
  const [dieticians, setDieticians] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dieticianId, setDieticianId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Generate time slots from 9am to 9pm with 1-hour intervals
  const timeSlots = [];
  for (let hour = 9; hour <= 21; hour++) {
    const formattedHour = hour.toString().padStart(2, '0');
    timeSlots.push(`${formattedHour}:00:00`);
  }
  
  // Fetch dieticians and appointments on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dieticiansRes, appointmentsRes] = await Promise.all([
          appointmentService.getDieticians(),
          appointmentService.getUserAppointments()
        ]);
        
        setDieticians(dieticiansRes.dieticians);
        setAppointments(appointmentsRes.appointments);
        
        // Set default dietician if available
        if (dieticiansRes.dieticians.length > 0) {
          setDieticianId(dieticiansRes.dieticians[0].DieticianID);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validation: Check if appointments are at capacity
    if (appointments.length >= 3) {
      setError('You cannot book more than 3 appointments.');
      return;
    }
    
    try {
      setLoading(true);
      const response = await appointmentService.scheduleAppointment({
        dieticianId,
        date,
        time
      });
      
      if (response.success) {
        setSuccess('Appointment scheduled successfully!');
        setAppointments([...appointments, response.appointment]);
        // Reset form
        setDate('');
        setTime('');
      } else {
        setError(response.message || 'Failed to schedule appointment.');
      }
    } catch (err) {
      console.error('Error scheduling appointment:', err);
      setError('Failed to schedule appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel = async (appointmentId) => {
    try {
      setLoading(true);
      const response = await appointmentService.cancelAppointment(appointmentId);
      
      if (response.success) {
        setSuccess('Appointment cancelled successfully!');
        // Remove the cancelled appointment from state
        setAppointments(appointments.filter(app => app.AppointmentID !== appointmentId));
      } else {
        setError(response.message || 'Failed to cancel appointment.');
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError('Failed to cancel appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const formatTime = (timeString) => {
    return timeString.substring(0, 5); // Format HH:MM
  };

  if (loading && !dieticians.length) return <Loader />;

  return (
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <div className="logo">
          <h2>NutriTrack Home Portal</h2>
        </div>
        <div className="user-info">
          <span>Appointment Scheduling</span>
        </div>
      </header>
      
      <NavigationBar />
      
      <main className="dashboard-content">
        <section className="profile-section">
          <h2>Appointment Scheduling</h2>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="dietician">Dietician:</label>
              <select
                id="dietician"
                value={dieticianId}
                onChange={(e) => setDieticianId(e.target.value)}
                required
              >
                <option value="">Select a dietician</option>
                {dieticians.map(dietician => (
                  <option 
                    key={dietician.DieticianID} 
                    value={dietician.DieticianID}
                  >
                    {dietician.Name} - {dietician.Specialization}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input 
                id="date"
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="time">Time:</label>
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              >
                <option value="">Select a time</option>
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>
                    {formatTime(slot)}
                  </option>
                ))}
              </select>
            </div>
            
            <Button 
              type="submit" 
              disabled={loading || appointments.length >= 3}
            >
              Schedule Appointment
            </Button>
          </form>
          
          <h3>Upcoming Appointments</h3>
          {appointments.length === 0 ? (
            <p>You have no upcoming appointments.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Dietician</th>
                  <th>Specialization</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment.AppointmentID}>
                    <td>{appointment.DieticianName}</td>
                    <td>{appointment.Specialization}</td>
                    <td>{formatDate(appointment.Date)}</td>
                    <td>{formatTime(appointment.Time)}</td>
                    <td>
                      <Button 
                        variant="danger" 
                        onClick={() => handleCancel(appointment.AppointmentID)}
                      >
                        Cancel
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
