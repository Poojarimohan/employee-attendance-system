import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/employee/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // if role not allowed, redirect to appropriate page
    if (user.role === "manager") return <Navigate to="/manager/dashboard" replace />;
    return <Navigate to="/employee/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
