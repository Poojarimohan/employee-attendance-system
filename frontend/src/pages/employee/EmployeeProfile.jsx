import { useSelector } from "react-redux";

function EmployeeProfile() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return (
      <div>
        <h2>My Profile</h2>
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h2>My Profile</h2>
      <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Employee ID:</strong> {user.employeeId}
        </p>
        <p>
          <strong>Department:</strong> {user.department}
        </p>
        <p>
          <strong>User ID (DB):</strong> {user._id}
        </p>
      </div>
      <p style={{ marginTop: 10, fontSize: 14, color: "#555" }}>
        (Profile is read-only for this demo.)
      </p>
    </div>
  );
}

export default EmployeeProfile;
