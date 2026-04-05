import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Mistakes from "../pages/Mistakes";
import Analytics from "../pages/Analytics";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/mistakes" element={<Mistakes />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
}

export default AppRoutes;