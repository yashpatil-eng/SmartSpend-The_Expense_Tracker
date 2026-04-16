import api from "../api/axios";

export const fetchTransactions = (params) => api.get("/transactions", { params });

export const createTransaction = (payload) =>
  api.post("/transactions/add", payload, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const removeTransaction = (id) => api.delete(`/transactions/${id}`);

export const fetchChartData = (params) => api.get("/analytics/charts", { params });
