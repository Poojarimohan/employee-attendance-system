import { useEffect, useState } from "react";
import { fetchAllAttendance } from "../../api/managerAttendanceApi";

const API_BASE = "http://localhost:5000/api";

function AllEmployeesAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetchAllAttendance({
        employeeId: employeeId || undefined,
        date: date || undefined,
        status: status || undefined,
      });

      setRecords(res);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to load attendance records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  const buildExportUrl = () => {
    const params = new URLSearchParams();
    if (employeeId) params.append("employeeId", employeeId);
    if (date) params.append("from", date) && params.append("to", date);
    if (status) params.append("status", status); // not actually used by export but okay

    return `${API_BASE}/attendance/export?${params.toString()}`;
  };

  return (
    <div>
      <h2>All Employees Attendance</h2>

      {/* Filters */}
      <form
        onSubmit={handleFilterSubmit}
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "flex-end",
          marginBottom: "15px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <label>Employee ID (user _id or leave blank)</label>
          <br />
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div>
          <label>Date</label>
          <br />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label>Status</label>
          <br />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="present">Present</option>
            <option value="late">Late</option>
            <option value="half-day">Half-day</option>
          </select>
        </div>
        <button type="submit">Apply Filters</button>

        <a
          href={buildExportUrl()}
          style={{ marginLeft: "auto" }}
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">Export CSV</button>
        </a>
      </form>

      {loading && <p>Loading records...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && records.length === 0 && <p>No records found.</p>}

      {!loading && records.length > 0 && (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec._id}>
                <td>{rec.user?.employeeId}</td>
                <td>{rec.user?.name}</td>
                <td>{rec.user?.department}</td>
                <td>{rec.date}</td>
                <td>{rec.status}</td>
                <td>{rec.totalHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllEmployeesAttendance;
