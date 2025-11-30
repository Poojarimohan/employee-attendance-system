import axiosClient from "./axiosClient";

// Employee dashboard stats
export const fetchEmployeeDashboard = async () => {
  const res = await axiosClient.get("/dashboard/employee");
  return res.data;
};

// Manager dashboard stats
export const fetchManagerDashboard = async () => {
  const res = await axiosClient.get("/dashboard/manager");
  return res.data;
};
