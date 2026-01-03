// src/utils/auth.js

export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000; // seconds → milliseconds
    return Date.now() > expiry;
  } catch {
    return true; // invalid token = expired
  }
};

export const logoutVendor = () => {
  localStorage.removeItem("vendorToken");
  localStorage.removeItem("vendorId");
};
