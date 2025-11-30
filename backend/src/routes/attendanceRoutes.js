const express = require("express");
const router = express.Router();

const {
  // employee
  checkIn,
  checkOut,
  getMyHistory,
  getMySummary,
  getMyTodayStatus,
  // manager
  getAllAttendance,
  getEmployeeAttendance,
  getTeamSummary,
  exportAttendanceCSV,
  getTodayTeamStatus,
} = require("../controllers/attendanceController");

const { protect, requireRole } = require("../middleware/authMiddleware");

// ---------------- Employee Routes ---------------- //
router.post("/checkin", protect, requireRole("employee"), checkIn);
router.post("/checkout", protect, requireRole("employee"), checkOut);
router.get("/my-history", protect, requireRole("employee"), getMyHistory);
router.get("/my-summary", protect, requireRole("employee"), getMySummary);
router.get("/today", protect, requireRole("employee"), getMyTodayStatus);

// ---------------- Manager Routes ---------------- //

// View all attendance with filters
router.get("/all", protect, requireRole("manager"), getAllAttendance);

// Attendance of specific employee
router.get("/employee/:id", protect, requireRole("manager"), getEmployeeAttendance);

// Team summary
router.get("/summary", protect, requireRole("manager"), getTeamSummary);

// Export CSV
router.get("/export", protect, requireRole("manager"), exportAttendanceCSV);

// Today's team status
router.get("/today-status", protect, requireRole("manager"), getTodayTeamStatus);

module.exports = router;
