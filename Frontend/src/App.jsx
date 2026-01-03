import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import VendorDashboard from "./pages/VendorDashboard";
// import TestDashboard from "./pages/TestDashboard";
import ProtectedVendorRoute from "./routes/ProtectedVendorRoute";
import VendorUploadPage from "./pages/VendorUploadPage";
// import LoginPage from "./pages/Loginpage";
// import Registerpage from "./pages/Registerpage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/vendordashboard"
          element={
            <ProtectedVendorRoute>
              <VendorDashboard />
            </ProtectedVendorRoute>
          }
        />
        {/* <Route path="/testdashboard" element={<TestDashboard />} /> */}
        {/* <Route path="/loginpage" element={<LoginPage />} /> */}
        {/* <Route path="/registerpage" element={<Registerpage />} /> */}
        <Route path="/upload" element={<VendorUploadPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
