const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const patientRoutes = require('./routes/patient');
const appointmentsRoutes = require('./routes/appointments');
const exerciseRoutes = require('./routes/exerciseRoutes');
const mealRoutes = require('./routes/mealRoutes');
const reportRoutes = require('./routes/reportRoutes'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/exercises', exerciseRoutes); 
app.use('/api/meals', mealRoutes);
app.use('/api/reports', reportRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('Healthcare API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error'
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
