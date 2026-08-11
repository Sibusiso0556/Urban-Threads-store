// Reusable auth guard for routes. Wrap any route element that requires login.
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import {
  selectAuthStatus,
  selectIsAuthenticated,
} from "../redux/slices/authSlice";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children, message }) {
  const status = useSelector(selectAuthStatus);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (status === "loading") {
    return <LoadingSpinner label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: message || "Please log in to continue.",
        }}
      />
    );
  }

  return children;
}
