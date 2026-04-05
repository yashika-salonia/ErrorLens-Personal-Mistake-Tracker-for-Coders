import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="h-screen w-60 bg-gray-900 text-white p-5 fixed">
      <h2 className="text-2xl font-bold mb-8">ErrorLens</h2>

      <nav className="flex flex-col gap-4">
        <Link
          to="/dashboard"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Dashboard
        </Link>

        <Link
          to="/mistakes"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Mistakes
        </Link>

        <Link
          to="/analytics"
          className="hover:bg-gray-700 p-2 rounded"
        >
          Analytics
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;