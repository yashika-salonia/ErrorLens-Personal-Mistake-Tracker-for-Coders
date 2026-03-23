import { useEffect, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import MistakeForm from "../components/mistakes/MistakeForm";
import MistakeList from "../components/mistakes/MistakeList";

function Dashboard() {
  const [mistakes, setMistakes] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("mistakes")) || [];
    setMistakes(data);
  }, []);

  // Add mistake
  const addMistake = (newMistake) => {
    const updated = [...mistakes, newMistake];
    setMistakes(updated);
    localStorage.setItem("mistakes", JSON.stringify(updated));
  };

  // Pattern detection
  const detectPatterns = () => {
    const count = {};
    mistakes.forEach((m) => {
      count[m.category] = (count[m.category] || 0) + 1;
    });

    return Object.entries(count)
      .filter(([_, val]) => val >= 2)
      .map(([key]) => key);
  };

  const patterns = detectPatterns();

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Dashboard 🚀
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl shadow-lg">
          <h2>Total Mistakes</h2>
          <p className="text-3xl font-bold">{mistakes.length}</p>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white p-6 rounded-xl shadow-lg">
          <h2>Categories</h2>
          <p className="text-3xl font-bold">
            {[...new Set(mistakes.map((m) => m.category))].length}
          </p>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-6 rounded-xl shadow-lg">
          <h2>Latest</h2>
          <p className="text-lg">
            {mistakes.length > 0
              ? mistakes[mistakes.length - 1].title
              : "No mistakes"}
          </p>
        </div>
      </div>

      {/* Pattern Warning */}
      {patterns.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded">
          ⚠️ You frequently make mistakes in:{" "}
          <b>{patterns.join(", ")}</b>
        </div>
      )}

      {/* Form */}
      <MistakeForm addMistake={addMistake} />
      <MistakeList mistakes={mistakes} />
      
    </PageWrapper>
  );
}

export default Dashboard;