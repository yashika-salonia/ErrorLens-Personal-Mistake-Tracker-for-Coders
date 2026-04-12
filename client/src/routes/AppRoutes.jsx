import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import Navbar from '../components/layout/Navbar';
import AdminPage from '../pages/AdminPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProblemsPage from '../pages/ProblemsPage';
import ProblemDetailPage from '../pages/ProblemDetailPage';
import SubmitPage from '../pages/SubmitPage';
import SubmissionsPage from '../pages/SubmissionsPage';
import ProfilePage from '../pages/ProfilePage';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/dashboard" element={
        <ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/problems" element={
        <ProtectedRoute><AppLayout><ProblemsPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/problems/:id" element={
        <ProtectedRoute><AppLayout><ProblemDetailPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/problems/:id/submit" element={
        <ProtectedRoute><AppLayout><SubmitPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/submissions" element={
        <ProtectedRoute><AppLayout><SubmissionsPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute><AppLayout><AdminPage /></AppLayout></ProtectedRoute>
      } />
    </Routes>
  );
}