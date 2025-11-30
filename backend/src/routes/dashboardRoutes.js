const express = require("express");
const router = express.Router();

const {
  getEmployeeDashboardStats,
  getManagerDashboardStats,
} = require("../controllers/dashboardController");

const { protect, requireRole } = require("../middleware/authMiddleware");

// Employee dashboard
router.get(
  "/employee",
  protect,
  requireRole("employee"),
  getEmployeeDashboardStats
);

// Manager dashboard
router.get(
  "/manager",
  protect,
  requireRole("manager"),
  getManagerDashboardStats
);

module.exports = router;
