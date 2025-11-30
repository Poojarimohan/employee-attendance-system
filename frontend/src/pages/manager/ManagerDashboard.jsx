import { useEffect, useState } from "react";
import { fetchManagerDashboard } from "../../api/dashboardApi";

function ManagerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchManagerDashboard();
        setData(res);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.data?.message ||
            "Failed to load manager dashboard. (Check backend/DB)"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p>Loading manager dashboard...</p>;
  if (error)
    return (
      <div>
        <h2>Manager Dashboard</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  if (!data) return null;

  const { totalEmployees, today, departmentWise, weeklyTrend } = data;

  return (
    <div>
      <h2>Manager Dashboard</h2>

      {/* Top stats */}
      <section style={{ marginBottom: 20 }}>
        <h3>Today ({today.date})</h3>
        <ul>
          <li>Total employees: {totalEmployees}</li>
          <li>Present today: {today.present}</li>
          <li>Absent today: {today.absent}</li>
          <li>Late arrivals today: {today.late}</li>
        </ul>
      </section>

      {/* Department-wise attendance */}
      <section style={{ marginBottom: 20 }}>
        <h3>Department-wise Attendance (Present Today)</h3>
        {departmentWise.length === 0 ? (
          <p>No data.</p>
        ) : (
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Department</th>
                <th>Present Count</th>
              </tr>
            </thead>
            <tbody>
              {departmentWise.map((row) => (
                <tr key={row.department}>
                  <td>{row.department}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Weekly trend */}
      <section>
        <h3>Weekly Attendance Trend (Present per day)</h3>
        {weeklyTrend.length === 0 ? (
          <p>No data.</p>
        ) : (
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Date</th>
                <th>Present Count</th>
              </tr>
            </thead>
            <tbody>
              {weeklyTrend.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td>{row.present}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default ManagerDashboard;
