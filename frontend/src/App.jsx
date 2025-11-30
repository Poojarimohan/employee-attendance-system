import ProtectedRoute from "./components/ProtectedRoute";

import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

// Employee pages
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MarkAttendance from "./pages/employee/MarkAttendance";
import MyAttendanceHistory from "./pages/employee/MyAttendanceHistory";
import EmployeeProfile from "./pages/employee/EmployeeProfile";

// Manager pages
import ManagerLogin from "./pages/manager/ManagerLogin";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import AllEmployeesAttendance from "./pages/manager/AllEmployeesAttendance";
import TeamCalendarView from "./pages/manager/TeamCalendarView";
import Reports from "./pages/manager/Reports";

function App() {
  return (
    <Routes>
      {/* Wrap everything with main layout */}
      <Route element={<MainLayout />}>
        {/* Default route */}
        <Route path="/" element={<Navigate to="/employee/login" />} />

        {/* Employee routes */}
        <Route path="/employee/login" element={<EmployeeLogin />} />
        <Route path="/employee/dashboard" element={<ProtectedRoute allowedRoles={["employee"]}>
      <EmployeeDashboard />
    </ProtectedRoute>} />
        <Route path="/employee/mark-attendance" element={<ProtectedRoute allowedRoles={["employee"]}>
      <MarkAttendance />
    </ProtectedRoute>} />
        <Route path="/employee/history" element={<MyAttendanceHistory />} />
        <Route path="/employee/profile" element={<EmployeeProfile />} />

        {/* Manager routes */}
<Route path="/manager/login" element={<ManagerLogin />} />
<Route
  path="/manager/dashboard"
  element={
    <ProtectedRoute allowedRoles={["manager"]}>
      <ManagerDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/attendance"
  element={
    <ProtectedRoute allowedRoles={["manager"]}>
      <AllEmployeesAttendance />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/calendar"
  element={
    <ProtectedRoute allowedRoles={["manager"]}>
      <TeamCalendarView />
    </ProtectedRoute>
  }
/>
<Route
  path="/manager/reports"
  element={
    <ProtectedRoute allowedRoles={["manager"]}>
      <Reports />
    </ProtectedRoute>
  }
/>
      </Route>
    </Routes>
  );
}

export default App;
