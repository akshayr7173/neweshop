import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const currentRole = user?.role || localStorage.getItem("role");

  // Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // If role is required and does not match
  if (role && currentRole.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return children;
}
