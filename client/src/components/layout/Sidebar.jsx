import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: "⊞" },
  { to: "/mistakes",  label: "Mistakes",  icon: "⚠" },
  { to: "/analytics", label: "Analytics", icon: "↗" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-screen w-60 bg-gray-950 text-white p-5 fixed flex flex-col">

      {/* Logo */}
      <div className="mb-10">
        <h2 className="text-xl font-extrabold tracking-tight text-white">
          Error<span className="text-indigo-400">Lens</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Mistake Tracker</p>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_LINKS.map(({ to, label, icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom version tag */}
      <p className="text-xs text-gray-600 mt-4">v1.0.0</p>

    </div>
  );
}

export default Sidebar;