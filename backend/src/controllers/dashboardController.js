const Attendance = require("../models/Attendance");
const User = require("../models/User");

const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getCurrentMonthString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

// @desc    Employee dashboard stats
// @route   GET /api/dashboard/employee
// @access  Employee (protected)
const getEmployeeDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = getTodayString();
    const month = getCurrentMonthString();

    const todayAttendance = await Attendance.findOne({
      user: userId,
      date: today,
    }).lean();

    const monthRecords = await Attendance.find({
      user: userId,
      date: { $regex: `^${month}` },
    }).lean();

    let present = 0;
    let late = 0;
    let halfDay = 0;
    let totalHours = 0;

    monthRecords.forEach((rec) => {
      if (rec.status === "present") present++;
      if (rec.status === "late") late++;
      if (rec.status === "half-day") halfDay++;
      totalHours += rec.totalHours || 0;
    });

    const recentRecords = await Attendance.find({ user: userId })
      .sort({ date: -1 })
      .limit(7)
      .lean();

    res.json({
      today: {
        date: today,
        checkedIn: !!todayAttendance?.checkInTime,
        checkedOut: !!todayAttendance?.checkOutTime,
        status: todayAttendance?.status || "not-marked",
      },
      month: {
        month,
        present,
        late,
        halfDay,
        totalHours: Number(totalHours.toFixed(2)),
      },
      recent: recentRecords,
    });
  } catch (error) {
    console.error("getEmployeeDashboardStats error:", error.message);
    res.status(500).json({ message: "Server error fetching employee dashboard" });
  }
};

// @desc    Manager dashboard stats
// @route   GET /api/dashboard/manager
// @access  Manager (protected)
const getManagerDashboardStats = async (req, res) => {
  try {
    const today = getTodayString();
    const month = getCurrentMonthString();

    const totalEmployees = await User.countDocuments({ role: "employee" });

    const todaysRecords = await Attendance.find({ date: today })
      .populate("user", "employeeId name department")
      .lean();

    const presentToday = todaysRecords.filter((rec) =>
      ["present", "late", "half-day"].includes(rec.status)
    );
    const lateArrivals = todaysRecords.filter((rec) => rec.status === "late");

    // Department-wise attendance: count present by department
    const departmentMap = {};
    presentToday.forEach((rec) => {
      const dept = rec.user?.department || "General";
      if (!departmentMap[dept]) departmentMap[dept] = 0;
      departmentMap[dept]++;
    });

    const departmentWise = Object.entries(departmentMap).map(
      ([department, count]) => ({ department, count })
    );

    // Weekly trend: last 7 days, count present per day
    const now = new Date();
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      last7Days.push(`${y}-${m}-${day}`);
    }

    const weeklyTrend = [];
    for (const dateStr of last7Days) {
      const recs = await Attendance.find({ date: dateStr }).lean();
      const presentCount = recs.filter((r) =>
        ["present", "late", "half-day"].includes(r.status)
      ).length;
      weeklyTrend.push({ date: dateStr, present: presentCount });
    }

    res.json({
      totalEmployees,
      today: {
        date: today,
        present: presentToday.length,
        absent: Math.max(totalEmployees - presentToday.length, 0),
        late: lateArrivals.length,
      },
      departmentWise,
      weeklyTrend,
      absentEmployeesToday: Math.max(totalEmployees - presentToday.length, 0),
    });
  } catch (error) {
    console.error("getManagerDashboardStats error:", error.message);
    res.status(500).json({ message: "Server error fetching manager dashboard" });
  }
};

module.exports = {
  getEmployeeDashboardStats,
  getManagerDashboardStats,
};
