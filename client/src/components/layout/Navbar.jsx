import { useNavigate, useLocation } from "react-router-dom";
import { clearAuth, getStoredUser } from "../../services/api";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/mistakes": "Mistakes",
  "/analytics": "Analytics",
};

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const pageTitle = PAGE_TITLES[location.pathname] || "ErrorLens";

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
      
      <div>
        <h1 className="text-lg font-bold text-gray-800">{pageTitle}</h1>
        <p className="text-xs text-gray-400">Personal Mistake Tracker</p>
      </div>

      <div className="flex items-center gap-3">
        {/* User avatar + name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-sm text-gray-700 font-medium hidden sm:block">
            {user?.name || "User"}
          </span>
        </div>

        {/* Single logout button */}
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default Navbar;