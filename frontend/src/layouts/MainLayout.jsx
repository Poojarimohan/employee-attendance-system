import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/authSlice";

function MainLayout() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Build nav links based on auth + role
  const renderLinks = () => {
    // Not logged in → only login links
    if (!isAuthenticated || !user) {
      return (
        <>
          <Link to="/employee/login">Employee Login</Link>
          <Link to="/manager/login">Manager Login</Link>
        </>
      );
    }

    // Logged-in employee
    if (user.role === "employee") {
      return (
        <>
          <Link to="/employee/dashboard">Employee Dashboard</Link>
          <Link to="/employee/mark-attendance">Mark Attendance</Link>
          <Link to="/employee/history">My Attendance</Link>
          <Link to="/employee/profile">Profile</Link>
        </>
      );
    }

    // Logged-in manager
    if (user.role === "manager") {
      return (
        <>
          <Link to="/manager/dashboard">Manager Dashboard</Link>
          <Link to="/manager/attendance">All Attendance</Link>
          <Link to="/manager/calendar">Team Calendar</Link>
          <Link to="/manager/reports">Reports</Link>
        </>
      );
    }

    return null;
  };

  return (
    <div>
      <header
        style={{
          padding: "10px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
        }}
      >
        <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {renderLinks()}
        </nav>

        <div>
          {isAuthenticated && user ? (
            <>
              <span style={{ marginRight: 10 }}>
                {user.name} ({user.role})
              </span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <span>Not logged in</span>
          )}
        </div>
      </header>

      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
