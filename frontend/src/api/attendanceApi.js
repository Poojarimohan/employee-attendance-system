import axiosClient from "./axiosClient";

// Employee endpoints
export const checkIn = async () => {
  const res = await axiosClient.post("/attendance/checkin");
  return res.data;
};

export const checkOut = async () => {
  const res = await axiosClient.post("/attendance/checkout");
  return res.data;
};

export const fetchMyTodayStatus = async () => {
  const res = await axiosClient.get("/attendance/today");
  return res.data;
};

export const fetchMyHistory = async (month) => {
  const res = await axiosClient.get("/attendance/my-history", {
    params: { month },
  });
  return res.data;
};

export const fetchMySummary = async (month) => {
  const res = await axiosClient.get("/attendance/my-summary", {
    params: { month },
  });
  return res.data;
};
