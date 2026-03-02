import PageWrapper from "../components/layout/PageWrapper";

function Dashboard() {
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500">Total Mistakes</h3>
          <p className="text-3xl text-blue-600">0</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500">Categories</h3>
          <p className="text-3xl text-green-600">0</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500">Latest Mistake</h3>
          <p className="text-red-500">No mistakes yet</p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;