import { useEffect, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import { analyticsService, submissionService, getStoredUser } from "../services/api";

function Dashboard() {
  const user = getStoredUser();

  const [summary, setSummary] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [mistakeTypes, setMistakeTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [summaryRes, submissionsRes, mistakesRes] = await Promise.all([
          analyticsService.getSummary(),
          submissionService.getMine(),
          analyticsService.getMistakeTypes(),
        ]);
        setSummary(summaryRes.data);
        setRecentSubmissions(submissionsRes.data.slice(0, 5));
        setMistakeTypes(mistakesRes.data);
      } catch {
        setError("Data load karne mein problem aayi.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
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

  const STATUS_COLOR = {
    "Accepted": "bg-green-100 text-green-600",
    "Wrong Answer": "bg-red-100 text-red-500",
    "Time Limit Exceeded": "bg-orange-100 text-orange-500",
    "Runtime Error": "bg-yellow-100 text-yellow-600",
    "Compilation Error": "bg-gray-100 text-gray-500",
  };

  const mostCommon = mistakeTypes[0]?.type || "None";

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400 animate-pulse">Loading dashboard...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto">

        {/* Heading - logout button NAHI hai yahan, sirf Navbar mein hai */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, {user?.name || "Coder"} 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Track your coding mistakes & improve smarter 🚀
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Total Submissions</p>
            <h2 className="text-4xl font-bold mt-2 text-gray-900">{summary?.totalSubmissions ?? 0}</h2>
            <p className="text-xs text-green-500 mt-2 font-medium">✅ {summary?.accepted ?? 0} Accepted</p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Top Mistake</p>
            <h2 className="text-xl font-bold mt-2 text-indigo-600 leading-snug">{mostCommon}</h2>
            <p className="text-xs text-gray-400 mt-2">Most recurring pattern</p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Acceptance Rate</p>
            <h2 className="text-4xl font-bold mt-2 text-green-500">{summary?.acceptanceRate ?? 0}%</h2>
            <p className="text-xs text-gray-400 mt-2">{summary?.problemsSolved ?? 0} problems attempted</p>
          </div>

        </div>

        {/* Insights */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl">
            <h3 className="font-semibold text-amber-700 text-sm mb-2">⚠️ Pattern Detection</h3>
            <p className="text-sm text-gray-700">
              You frequently make <span className="font-bold text-amber-700">{mostCommon}</span> mistakes.
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl">
            <h3 className="font-semibold text-indigo-700 text-sm mb-2">💡 Smart Suggestion</h3>
            <p className="text-sm text-gray-700">
              Focus on <span className="font-bold text-indigo-700">{mostCommon}</span> to improve faster.
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Recent Activity</h2>
          </div>

          {recentSubmissions.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-gray-400 text-sm">No submissions yet. Start solving! 💪</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentSubmissions.map((s) => (
                <div key={s._id} className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{s.problem?.title || "Problem"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.problem?.domain} • {s.language}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[s.status] || "bg-gray-100 text-gray-500"}`}>
                      {s.status}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(s.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  );
}

export default Dashboard;