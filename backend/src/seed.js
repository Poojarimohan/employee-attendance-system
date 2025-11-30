require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");
const Attendance = require("./models/Attendance");

const getDateOffset = (daysAgo) => {
  const now = new Date();
  now.setDate(now.getDate() - daysAgo);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const seed = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Attendance.deleteMany({});

    const plainPassword = "password123";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    console.log("Creating sample users...");

    const manager = await User.create({
      name: "Manager One",
      email: "manager1@example.com",
      password: hashedPassword,
      role: "manager",
      employeeId: "MGR001",
      department: "Management",
    });

    const emp1 = await User.create({
      name: "Employee One",
      email: "emp1@example.com",
      password: hashedPassword,
      role: "employee",
      employeeId: "EMP001",
      department: "Engineering",
    });

    const emp2 = await User.create({
      name: "Employee Two",
      email: "emp2@example.com",
      password: hashedPassword,
      role: "employee",
      employeeId: "EMP002",
      department: "HR",
    });

    console.log("Creating sample attendance records...");

    const now = new Date();

    const makeAttendance = (user, daysAgo, status, hours) => {
      const dateStr = getDateOffset(daysAgo);
      const checkIn = new Date(now);
      checkIn.setDate(now.getDate() - daysAgo);
      checkIn.setHours(9, 30, 0, 0);

      const checkOut = new Date(checkIn);
      checkOut.setHours(checkIn.getHours() + hours);

      return {
        user: user._id,
        date: dateStr,
        checkInTime: checkIn,
        checkOutTime: checkOut,
        status,
        totalHours: hours,
      };
    };

    const attendanceData = [
      makeAttendance(emp1, 1, "present", 8),
      makeAttendance(emp1, 2, "late", 7.5),
      makeAttendance(emp1, 3, "half-day", 3.5),

      makeAttendance(emp2, 1, "present", 8),
      makeAttendance(emp2, 2, "present", 8),
      makeAttendance(emp2, 3, "late", 7),
    ];

    await Attendance.insertMany(attendanceData);

    console.log("✅ Seeding complete!");
    console.log("Login samples:");
    console.log("Manager -> email: manager1@example.com | password: password123");
    console.log("Employee1 -> email: emp1@example.com | password: password123");
    console.log("Employee2 -> email: emp2@example.com | password: password123");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seed();
