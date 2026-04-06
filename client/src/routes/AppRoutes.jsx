import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Mistakes from "../pages/Mistakes";
import Analytics from "../pages/Analytics";

import { isLoggedIn } from "../services/api";

// 🔐 Protected Route
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/" replace />;
};

// 🔓 Public Route (login/register)
const PublicRoute = ({ children }) => {
  return !isLoggedIn() ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>

      {/* Default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mistakes"
        element={
          <ProtectedRoute>
            <Mistakes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>
  );
}

export default AppRoutes;