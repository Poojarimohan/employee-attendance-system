const Attendance = require("../models/Attendance");

// Helper: get today's date as 'YYYY-MM-DD'
const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper: get month string 'YYYY-MM'
const getCurrentMonthString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

// ---------------- EMPLOYEE ENDPOINTS ---------------- //

// @desc    Employee check-in
// @route   POST /api/attendance/checkin
// @access  Employee (protected)
const checkIn = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = getTodayString();
    const now = new Date();

    // Find existing today's record
    let attendance = await Attendance.findOne({ user: userId, date: today });

    if (attendance && attendance.checkInTime) {
      return res.status(400).json({ message: "Already checked in for today" });
    }

    let status = "present";

    // Simple "late" logic: check-in after 10:15 AM
    const lateThreshold = new Date(now);
    lateThreshold.setHours(10, 15, 0, 0);
    if (now > lateThreshold) {
      status = "late";
    }

    if (!attendance) {
      // Create new attendance record
      attendance = await Attendance.create({
        user: userId,
        date: today,
        checkInTime: now,
        status,
      });
    } else {
      // Existing record (no check-in yet)
      attendance.checkInTime = now;
      attendance.status = status;
      await attendance.save();
    }

    res.status(200).json({
      message: "Check-in successful",
      attendance,
    });
  } catch (error) {
    console.error("Check-in error:", error.message);
    res.status(500).json({ message: "Server error during check-in" });
  }
};

// @desc    Employee check-out
// @route   POST /api/attendance/checkout
// @access  Employee (protected)
const checkOut = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = getTodayString();
    const now = new Date();

    const attendance = await Attendance.findOne({ user: userId, date: today });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: "You have not checked in today" });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: "Already checked out for today" });
    }

    attendance.checkOutTime = now;

    // Calculate total hours
    const diffMs = attendance.checkOutTime - attendance.checkInTime;
    const diffHours = diffMs / (1000 * 60 * 60);
    attendance.totalHours = Number(diffHours.toFixed(2));

    // Simple "half-day" logic: less than 4 hours
    if (attendance.totalHours < 4) {
      attendance.status = "half-day";
    }

    await attendance.save();

    res.status(200).json({
      message: "Check-out successful",
      attendance,
    });
  } catch (error) {
    console.error("Check-out error:", error.message);
    res.status(500).json({ message: "Server error during check-out" });
  }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history?month=YYYY-MM (optional)
// @access  Employee (protected)
const getMyHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { month } = req.query; // "YYYY-MM" optional

    const query = { user: userId };

    if (month) {
      // filter date starting with 'YYYY-MM'
      query.date = { $regex: `^${month}` };
    }

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .lean();

    res.json(records);
  } catch (error) {
    console.error("GetMyHistory error:", error.message);
    res.status(500).json({ message: "Server error fetching history" });
  }
};

// @desc    Get my monthly summary (present/absent/late/half-day, total hours)
// @route   GET /api/attendance/my-summary?month=YYYY-MM (optional)
// @access  Employee (protected)
const getMySummary = async (req, res) => {
  try {
    const userId = req.user._id;
    let { month } = req.query;
    if (!month) {
      month = getCurrentMonthString(); // default to current month
    }

    const records = await Attendance.find({
      user: userId,
      date: { $regex: `^${month}` },
    }).lean();

    let present = 0;
    let late = 0;
    let halfDay = 0;
    let totalHours = 0;

    records.forEach((rec) => {
      if (rec.status === "present") present++;
      if (rec.status === "late") late++;
      if (rec.status === "half-day") halfDay++;
      totalHours += rec.totalHours || 0;
    });

    const summary = {
      month,
      present,
      late,
      halfDay,
      // "absent" can be derived in UI if needed
      totalHours: Number(totalHours.toFixed(2)),
    };

    res.json(summary);
  } catch (error) {
    console.error("GetMySummary error:", error.message);
    res.status(500).json({ message: "Server error fetching summary" });
  }
};

// @desc    Get today's status for logged-in employee
// @route   GET /api/attendance/today
// @access  Employee (protected)
const getMyTodayStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = getTodayString();

    const attendance = await Attendance.findOne({
      user: userId,
      date: today,
    }).lean();

    res.json({
      date: today,
      hasRecord: !!attendance,
      checkedIn: !!attendance?.checkInTime,
      checkedOut: !!attendance?.checkOutTime,
      status: attendance?.status || "not-marked",
      totalHours: attendance?.totalHours || 0,
    });
  } catch (error) {
    console.error("GetMyTodayStatus error:", error.message);
    res.status(500).json({ message: "Server error fetching today status" });
  }
};

// ---------------- MANAGER ENDPOINTS ---------------- //

// @desc    Get all employees attendance (with filters)
// @route   GET /api/attendance/all?employeeId=&date=&status=
// @access  Manager (protected)
const getAllAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.query;

    const query = {};

    // For now, employeeId is user _id (frontend will pass correct id)
    if (employeeId) {
      query["user"] = employeeId;
    }

    if (date) {
      query.date = date; // 'YYYY-MM-DD'
    }

    if (status) {
      query.status = status;
    }

    const records = await Attendance.find(query)
      .populate("user", "name email employeeId department role")
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    console.error("getAllAttendance error:", error.message);
    res.status(500).json({ message: "Server error fetching all attendance" });
  }
};

// @desc    Get attendance for a specific employee
// @route   GET /api/attendance/employee/:id
// @access  Manager (protected)
const getEmployeeAttendance = async (req, res) => {
  try {
    const userId = req.params.id; // user _id
    const { month } = req.query; // optional YYYY-MM

    const query = { user: userId };

    if (month) {
      query.date = { $regex: `^${month}` };
    }

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .lean();

    res.json(records);
  } catch (error) {
    console.error("getEmployeeAttendance error:", error.message);
    res.status(500).json({ message: "Server error fetching employee attendance" });
  }
};

// @desc    Get team summary (aggregated by status, optional date range)
// @route   GET /api/attendance/summary?from=&to=
// @access  Manager (protected)
const getTeamSummary = async (req, res) => {
  try {
    const { from, to } = req.query; // 'YYYY-MM-DD'

    const query = {};
    if (from && to) {
      query.date = { $gte: from, $lte: to };
    }

    const records = await Attendance.find(query).lean();

    let present = 0;
    let late = 0;
    let halfDay = 0;
    let totalHours = 0;

    records.forEach((rec) => {
      if (rec.status === "present") present++;
      if (rec.status === "late") late++;
      if (rec.status === "half-day") halfDay++;
      totalHours += rec.totalHours || 0;
    });

    res.json({
      totalRecords: records.length,
      present,
      late,
      halfDay,
      totalHours: Number(totalHours.toFixed(2)),
    });
  } catch (error) {
    console.error("getTeamSummary error:", error.message);
    res.status(500).json({ message: "Server error fetching team summary" });
  }
};

// @desc    Export attendance as CSV
// @route   GET /api/attendance/export?from=&to=&employeeId=
// @access  Manager (protected)
const exportAttendanceCSV = async (req, res) => {
  try {
    const { from, to, employeeId } = req.query;

    const query = {};
    if (from && to) {
      query.date = { $gte: from, $lte: to };
    }
    if (employeeId) {
      query.user = employeeId;
    }

    const records = await Attendance.find(query)
      .populate("user", "name email employeeId department")
      .sort({ date: 1 })
      .lean();

    // Build CSV content
    const header = [
      "Employee ID",
      "Name",
      "Department",
      "Email",
      "Date",
      "Status",
      "Check In",
      "Check Out",
      "Total Hours",
    ];

    const rows = records.map((rec) => [
      rec.user?.employeeId || "",
      rec.user?.name || "",
      rec.user?.department || "",
      rec.user?.email || "",
      rec.date,
      rec.status,
      rec.checkInTime ? new Date(rec.checkInTime).toISOString() : "",
      rec.checkOutTime ? new Date(rec.checkOutTime).toISOString() : "",
      rec.totalHours ?? "",
    ]);

    const csvLines = [
      header.join(","),
      ...rows.map((row) =>
        row
          .map((field) =>
            typeof field === "string" && field.includes(",")
              ? `"${field}"`
              : field
          )
          .join(",")
      ),
    ];

    const csvContent = csvLines.join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=attendance_export.csv"
    );
    res.send(csvContent);
  } catch (error) {
    console.error("exportAttendanceCSV error:", error.message);
    res.status(500).json({ message: "Server error exporting CSV" });
  }
};

// @desc    Get today's team status (who's present/absent)
// @route   GET /api/attendance/today-status
// @access  Manager (protected)
const getTodayTeamStatus = async (req, res) => {
  try {
    const today = getTodayString();

    const todaysRecords = await Attendance.find({ date: today })
      .populate("user", "name email employeeId department")
      .lean();

    // Present or late or half-day counted as "present today"
    const presentUsers = todaysRecords.filter((rec) =>
      ["present", "late", "half-day"].includes(rec.status)
    );

    res.json({
      date: today,
      totalRecords: todaysRecords.length,
      present: presentUsers.length,
      details: todaysRecords,
    });
  } catch (error) {
    console.error("getTodayTeamStatus error:", error.message);
    res.status(500).json({ message: "Server error fetching today team status" });
  }
};

module.exports = {
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
};
