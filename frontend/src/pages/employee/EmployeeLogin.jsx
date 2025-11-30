import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetAuthError } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(resetAuthError());

    const resultAction = await dispatch(
      loginUser({ email, password, role: "employee" })
    );

    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/employee/dashboard");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Employee Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            style={{ width: "100%", padding: 8 }}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="employee@example.com"
            required
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            style={{ width: "100%", padding: 8 }}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        {error && (
          <div style={{ color: "red", marginBottom: 10 }}>{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 16px" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {isAuthenticated && user && (
        <p style={{ marginTop: 10 }}>
          Logged in as <strong>{user.name}</strong> ({user.role})
        </p>
      )}
    </div>
  );
}

export default EmployeeLogin;
