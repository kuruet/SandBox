import { Navigate } from "react-router-dom";

const ProtectedVendorRoute = ({ children }) => {
  const token = localStorage.getItem("vendorToken");

  // 🔒 Only check presence
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedVendorRoute;
