import axiosClient from "./axiosClient";

// All attendance with optional filters
export const fetchAllAttendance = async ({ employeeId, date, status } = {}) => {
  const res = await axiosClient.get("/attendance/all", {
    params: { employeeId, date, status },
  });
  return res.data;
};

// Team summary for a date range
export const fetchTeamSummary = async ({ from, to } = {}) => {
  const res = await axiosClient.get("/attendance/summary", {
    params: { from, to },
  });
  return res.data;
};

// Today's team status
export const fetchTodayStatus = async () => {
  const res = await axiosClient.get("/attendance/today-status");
  return res.data;
};
