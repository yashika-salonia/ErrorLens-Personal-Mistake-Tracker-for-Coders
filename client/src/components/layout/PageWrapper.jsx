import { Link, useNavigate } from "react-router-dom";
import { clearAuth } from "../../services/api";

export default function PageWrapper({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <nav className="bg-white shadow px-6 py-3 flex justify-between items-center">
        <h1 className="font-bold text-lg text-indigo-600">
          ErrorLens
        </h1>

        <div className="flex gap-4 items-center">
          <Link to="/dashboard" className="hover:text-indigo-600">
            Dashboard
          </Link>
          <Link to="/mistakes" className="hover:text-indigo-600">
            Mistakes
          </Link>
          <Link to="/analytics" className="hover:text-indigo-600">
            Analytics
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <div className="p-6">{children}</div>
    </div>
  );
}