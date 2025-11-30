import { useEffect, useState } from "react";
import {
  fetchMyTodayStatus,
  checkIn,
  checkOut,
} from "../../api/attendanceApi";

function MarkAttendance() {
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMyTodayStatus();
      setTodayStatus(res);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to load today status. (Backend/DB issue?)"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      setActionMessage("");
      setError(null);
      const res = await checkIn();
      setActionMessage(res.message || "Checked in successfully");
      await loadStatus();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Check-in failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      setActionMessage("");
      setError(null);
      const res = await checkOut();
      setActionMessage(res.message || "Checked out successfully");
      await loadStatus();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Check-out failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Loading today status...</p>;

  return (
    <div>
      <h2>Mark Attendance</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {actionMessage && <p style={{ color: "green" }}>{actionMessage}</p>}

      {todayStatus && (
        <div style={{ marginBottom: 20 }}>
          <p>Date: {todayStatus.date}</p>
          <p>Status: {todayStatus.status}</p>
          <p>Checked In: {todayStatus.checkedIn ? "Yes" : "No"}</p>
          <p>Checked Out: {todayStatus.checkedOut ? "Yes" : "No"}</p>
          <p>Total Hours: {todayStatus.totalHours}</p>
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={handleCheckIn} disabled={actionLoading}>
          {actionLoading ? "Processing..." : "Check In"}
        </button>
        <button onClick={handleCheckOut} disabled={actionLoading}>
          {actionLoading ? "Processing..." : "Check Out"}
        </button>
      </div>
    </div>
  );
}

export default MarkAttendance;
