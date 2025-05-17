const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// Get all dieticians
router.get('/dieticians', protect, async (req, res) => {
  try {
    const [dieticians] = await db.execute('SELECT * FROM dieticians ORDER BY Name');
    
    res.status(200).json({
      success: true,
      dieticians
    });
  } catch (error) {
    console.error('Error fetching dieticians:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dieticians'
    });
  }
});

// Get user's appointments
router.get('/user', protect, async (req, res) => {
  try {
    const [appointments] = await db.execute(
      `SELECT a.AppointmentID, a.Date, a.Time, d.Name AS DieticianName, d.Specialization 
       FROM appointments a 
       JOIN dieticians d ON a.DieticianID = d.DieticianID 
       WHERE a.UserID = ? 
       ORDER BY a.Date, a.Time`,
      [req.user.id]
    );
    
    res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments'
    });
  }
});

// Schedule new appointment
router.post('/', protect, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { dieticianId, date, time } = req.body;
    const userId = req.user.id;
    
    // Check if user already has an appointment at the same time
    const [existingAppointments] = await connection.execute(
      `SELECT * FROM appointments 
       WHERE UserID = ? AND Date = ? AND Time = ?`,
      [userId, date, time]
    );
    
    if (existingAppointments.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'You already have an appointment scheduled at this time'
      });
    }
    
    // Call the stored procedure for appointment validation and scheduling
    const [result] = await connection.execute(
      'CALL ScheduleAppointment(?, ?, ?, ?, @success, @message)',
      [userId, dieticianId, date, time]
    );
    
    // Get the output variables
    const [output] = await connection.execute('SELECT @success as success, @message as message');
    
    if (output[0].success === 1) {
      // Get the newly created appointment
      const [appointments] = await connection.execute(
        `SELECT a.AppointmentID, a.Date, a.Time, d.Name AS DieticianName, d.Specialization 
         FROM appointments a 
         JOIN dieticians d ON a.DieticianID = d.DieticianID 
         WHERE a.UserID = ? 
         ORDER BY a.Date DESC, a.Time DESC LIMIT 1`,
        [userId]
      );
      
      await connection.commit();
      
      res.status(201).json({
        success: true,
        message: 'Appointment scheduled successfully',
        appointment: appointments[0]
      });
    } else {
      await connection.rollback();
      
      res.status(400).json({
        success: false,
        message: output[0].message
      });
    }
  } catch (error) {
    await connection.rollback();
    console.error('Error scheduling appointment:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while scheduling appointment'
    });
  } finally {
    connection.release();
  }
});

// Cancel appointment
router.delete('/:id', protect, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const appointmentId = req.params.id;
    const userId = req.user.id;
    
    // Verify appointment belongs to user
    const [appointments] = await connection.execute(
      'SELECT * FROM appointments WHERE AppointmentID = ? AND UserID = ?',
      [appointmentId, userId]
    );
    
    if (appointments.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or does not belong to you'
      });
    }
    
    // Delete the appointment
    await connection.execute(
      'DELETE FROM appointments WHERE AppointmentID = ?',
      [appointmentId]
    );
    
    await connection.commit();
    
    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error cancelling appointment:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling appointment'
    });
  } finally {
    connection.release();
  }
});

module.exports = router;