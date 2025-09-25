import { Navigate } from "react-router-dom";
import { isTokenValid } from "../utils/auth";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const tokenValid = isTokenValid();

  if (!tokenValid) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
