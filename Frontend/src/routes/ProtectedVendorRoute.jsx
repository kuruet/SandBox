import { Navigate } from "react-router-dom";
import { isTokenExpired, logoutVendor } from "../utils/auth";

const ProtectedVendorRoute = ({ children }) => {
  const token = localStorage.getItem("vendorToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ NEW: auto logout on expiry
  if (isTokenExpired(token)) {
    logoutVendor();
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedVendorRoute;
