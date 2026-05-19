import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;