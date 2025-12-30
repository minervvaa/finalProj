import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: JSX.Element;
  requireAdmin?: boolean;
}) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/vacations" replace />;
  }

  return children;
}
