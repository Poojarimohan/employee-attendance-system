import { useState } from "react";
import { fetchTeamSummary } from "../../api/managerAttendanceApi";

function Reports() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSummary(null);

      const res = await fetchTeamSummary({ from, to });
      setSummary(res);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to load summary report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Reports</h2>

      <form
        onSubmit={handleGenerate}
        style={{ display: "flex", gap: 10, marginBottom: 15 }}
      >
        <div>
          <label>From</label>
          <br />
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>To</label>
          <br />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Generate Summary"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
        <div>
          <h3>Summary</h3>
          <ul>
            <li>Total records: {summary.totalRecords}</li>
            <li>Present: {summary.present}</li>
            <li>Late: {summary.late}</li>
            <li>Half-day: {summary.halfDay}</li>
            <li>Total hours: {summary.totalHours}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Reports;
