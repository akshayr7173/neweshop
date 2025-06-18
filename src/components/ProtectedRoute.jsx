import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const currentRole = user?.role || localStorage.getItem("role");

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // If user is Admin and no specific role is required, redirect to admin dashboard
  if (currentRole?.toLowerCase() === "admin" && !role) {
    return <Navigate to="/admin" replace />;
  }

  // If role is required and does not match
  if (role && currentRole?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
}