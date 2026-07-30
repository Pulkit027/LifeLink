import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BloodRequest from "./pages/BloodRequest";
import MakeDonation from "./pages/MakeDonation";
import RequestList from "./pages/RequestList";
import RecentDonation from "./pages/RecentDonation";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Unauthorized from "./pages/Unauthorized";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBloodBanks from "./pages/admin/AdminBloodBanks";

import BankDashboard from "./pages/bloodbank/BankDashboard";
import BankInventory from "./pages/bloodbank/Inventory";
import BankRequests from "./pages/bloodbank/BankRequests";

function App() {
  return (
    <AuthProvider>
      <ToastProvider />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Public lists */}
          <Route path="/requests" element={<RequestList />} />
          <Route path="/donations" element={<RecentDonation />} />
          <Route path="/request" element={<BloodRequest />} />
          <Route path="/donate" element={<MakeDonation />} />

          {/* Protected General Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/bloodbanks" element={<ProtectedRoute roles={["admin"]}><AdminBloodBanks /></ProtectedRoute>} />

          {/* Blood Bank Routes */}
          <Route path="/bank" element={<ProtectedRoute roles={["bloodbank"]}><BankDashboard /></ProtectedRoute>} />
          <Route path="/bank/inventory" element={<ProtectedRoute roles={["bloodbank"]}><BankInventory /></ProtectedRoute>} />
          <Route path="/bank/requests" element={<ProtectedRoute roles={["bloodbank"]}><BankRequests /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;