import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// only attach JWT if it exists
api.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  return config;
});

export const createHomeCategories = async (categories) => {
  const res = await api.post("/home/categories", categories);
  return res.data;
};

export const updateHomeCategory = async (id, data) => {
  const res = await api.patch(`/home/home-category/${id}`, data);
  return res.data;
};
