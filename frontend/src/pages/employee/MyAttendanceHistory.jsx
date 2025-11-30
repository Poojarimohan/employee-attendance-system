import { useEffect, useState } from "react";
import { fetchMyHistory } from "../../api/attendanceApi";
import AttendanceCalendar from "../../components/AttendanceCalendar";

function MyAttendanceHistory() {
  const [history, setHistory] = useState([]);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetchMyHistory(month);
      setHistory(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [month]);

  return (
    <div>
      <h2>My Attendance History</h2>

      <label>Select Month: </label>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        style={{ marginBottom: "20px" }}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <AttendanceCalendar data={history} />
      )}
    </div>
  );
}

export default MyAttendanceHistory;
