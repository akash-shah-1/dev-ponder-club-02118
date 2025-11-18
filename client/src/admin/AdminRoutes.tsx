import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Reports from "./pages/Reports";
import AdminLogin from "./pages/AdminLogin"; // Import AdminLogin

// A simple wrapper to check for authentication
const PrivateAdminRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('admin_access_token');
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} /> {/* Admin Login Route */}
      <Route
        path="/"
        element={
          <PrivateAdminRoute>
            <AdminLayout />
          </PrivateAdminRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="chatbot" element={<Chatbot />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}