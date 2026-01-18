import axios from "axios";
import { logoutVendor } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});


api.interceptors.response.use(
  (res) => res,
  (err) => {
   if (err.response?.status === 401) {
  // ⚠️ Ignore socket / transient auth failures
  const url = err.config?.url || "";

  if (!url.includes("/vendordashboard")) {
    return Promise.reject(err);
  }

  logoutVendor();
  window.location.href = "/login";
}

    return Promise.reject(err);
  }
);

export default api;

// ❌ KEEP BASE_URL (not deleting old code)
// const BASE_URL = "http://localhost:5000/api";

// ---------------------------
// Vendor Login API
// ---------------------------
export const loginVendor = async (email, password) => {
  const response = await api.post(`/vendor/login`, { email, password });
  return response.data;
};

// ---------------------------
// Fetch Vendor Dashboard API
// ---------------------------
export const getVendorDashboard = async (token) => {
  const response = await api.get(`/vendor/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// ---------------------------
// Mark File as Printed API
// ---------------------------
// ---------------------------
// Mark File as Printed API
// ---------------------------
export const markFileAsPrinted = async (fileId, token) => {
  const response = await api.patch(
    `/vendor/files/${fileId}/printed`,
    {}, // body intentionally empty — backend reads fileId from params
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// ---------------------------
// Single Delete File
// ---------------------------
export const deleteFile = async (fileId, token) => {
  const response = await api.patch(
    `/vendor/files/${fileId}/delete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// ---------------------------
// Bulk Delete Files
// ---------------------------
export const bulkDeleteFiles = async (fileIds, token) => {
  const response = await api.patch(
    `/vendor/files/bulk-delete`,
    { fileIds },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

