import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function PageWrapper({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="ml-60 w-full">
        <Navbar />

        <div className="p-6 bg-gray-100 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}

export default PageWrapper;