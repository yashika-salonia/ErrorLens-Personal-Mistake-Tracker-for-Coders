import { useEffect, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";

function Dashboard() {
  const [mistakes, setMistakes] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("mistakes")) || [];
    setMistakes(data);
  }, []);

  // 🔥 Format Date + Time (IMPORTANT)
  const formatDate = (m) => {
    if (m.time) return `${m.date} • ${m.time}`;

    const d = new Date(m.date);

    return (
      d.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) +
      " • " +
      d.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const total = mistakes.length;

  const categoryCount = {};
  mistakes.forEach((m) => {
    categoryCount[m.category] = (categoryCount[m.category] || 0) + 1;
  });

  const mostCommon =
    Object.keys(categoryCount).length > 0
      ? Object.keys(categoryCount).reduce((a, b) =>
          categoryCount[a] > categoryCount[b] ? a : b
        )
      : "None";

  const lastMistake = mistakes[mistakes.length - 1];

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto">

        {/* 🔥 Heading */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Track your coding mistakes & improve smarter 🚀
          </p>
        </div>

        {/* 🔥 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white/70 backdrop-blur-lg border border-gray-200 p-6 rounded-2xl shadow hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">Total Mistakes</p>
            <h2 className="text-3xl font-bold mt-2">{total}</h2>
          </div>

          <div className="bg-white/70 backdrop-blur-lg border border-gray-200 p-6 rounded-2xl shadow hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">Top Category</p>
            <h2 className="text-2xl font-semibold mt-2 text-indigo-600">
              {mostCommon}
            </h2>
          </div>

          <div className="bg-white/70 backdrop-blur-lg border border-gray-200 p-6 rounded-2xl shadow hover:shadow-xl transition">
            <p className="text-gray-500 text-sm">Last Mistake</p>
            <h2 className="text-sm mt-2 font-medium">
              {lastMistake ? lastMistake.title : "No data"}
            </h2>
          </div>

        </div>

        {/* 🔥 Insights */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 p-6 rounded-2xl border border-yellow-200 shadow-sm">
            <h3 className="font-semibold mb-2 text-yellow-700">
              ⚠️ Pattern Detection
            </h3>
            <p className="text-sm text-gray-700">
              You frequently make{" "}
              <span className="font-bold text-yellow-700">
                {mostCommon}
              </span>{" "}
              mistakes.
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-2xl border border-indigo-200 shadow-sm">
            <h3 className="font-semibold mb-2 text-indigo-700">
              💡 Smart Suggestion
            </h3>
            <p className="text-sm text-gray-700">
              Focus more on{" "}
              <span className="font-bold text-indigo-700">
                {mostCommon}
              </span>{" "}
              problems to improve faster.
            </p>
          </div>

        </div>

        {/* 🔥 Recent Activity */}
        <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-lg font-semibold mb-4">
            Recent Activity
          </h2>

          {mistakes.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No mistakes added yet.
            </p>
          ) : (
            mistakes
              .slice(-5)
              .reverse()
              .map((m) => (
                <div
                  key={m.id}
                  className="flex justify-between items-center border-b last:border-none py-3 hover:bg-gray-50 px-2 rounded-lg transition"
                >
                  <div>
                    <p className="font-medium">{m.title}</p>
                    <p className="text-xs text-gray-500">
                      {m.category}
                    </p>
                  </div>

                  {/* ✅ FINAL DATE + TIME FIX */}
                  <span className="text-xs text-gray-400">
                    {formatDate(m)}
                  </span>
                </div>
              ))
          )}
        </div>

      </div>
    </PageWrapper>
  );
}

export default Dashboard;