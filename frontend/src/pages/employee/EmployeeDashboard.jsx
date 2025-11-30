import { useEffect, useState } from "react";
import { fetchEmployeeDashboard } from "../../api/dashboardApi";

function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchEmployeeDashboard();
        setData(res);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Failed to load dashboard data. (Is backend + DB running?)"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div>
        <h2>Employee Dashboard</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { today, month, recent } = data;

  return (
    <div>
      <h2>Employee Dashboard</h2>

      {/* Today's status */}
      <section style={{ marginBottom: 20 }}>
        <h3>Today</h3>
        <p>Date: {today.date}</p>
        <p>Status: {today.status}</p>
        <p>Checked In: {today.checkedIn ? "Yes" : "No"}</p>
        <p>Checked Out: {today.checkedOut ? "Yes" : "No"}</p>
      </section>

      {/* Month summary */}
      <section style={{ marginBottom: 20 }}>
        <h3>This Month Summary ({month.month})</h3>
        <ul>
          <li>Present days: {month.present}</li>
          <li>Late days: {month.late}</li>
          <li>Half days: {month.halfDay}</li>
          <li>Total hours: {month.totalHours}</li>
        </ul>
      </section>

      {/* Recent attendance */}
      <section>
        <h3>Recent Attendance (Last {recent.length} days)</h3>
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((rec) => (
              <tr key={rec._id}>
                <td>{rec.date}</td>
                <td>{rec.status}</td>
                <td>{rec.totalHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default EmployeeDashboard;
