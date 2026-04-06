import { useEffect, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import { analyticsService } from "../services/api";

function Analytics() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    analyticsService.getSummary()
      .then(res => setSummary(res.data))
      .catch(() => {});
  }, []);

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-6">📊 Analytics</h1>

      {!summary ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Submissions</p>
            <h2 className="text-2xl font-bold">
              {summary.totalSubmissions || 0}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Accepted</p>
            <h2 className="text-2xl font-bold text-green-600">
              {summary.accepted || 0}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Acceptance Rate</p>
            <h2 className="text-2xl font-bold text-indigo-600">
              {summary.acceptanceRate || 0}%
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <p className="text-sm text-gray-500">Problems Solved</p>
            <h2 className="text-2xl font-bold">
              {summary.problemsSolved || 0}
            </h2>
          </div>

        </div>
      )}
    </PageWrapper>
  );
}

export default Analytics;