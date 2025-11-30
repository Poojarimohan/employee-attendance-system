require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // React (Vite) frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Employee Attendance API is running ✅' });
});

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Attendance routes
app.use('/api/attendance', require('./routes/attendanceRoutes'));

// TODO: Dashboard routes
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// TODO: Attendance routes
// app.use('/api/attendance', require('./routes/attendanceRoutes'));

// TODO: Dashboard routes
// app.use('/api/dashboard', require('./routes/dashboardRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
