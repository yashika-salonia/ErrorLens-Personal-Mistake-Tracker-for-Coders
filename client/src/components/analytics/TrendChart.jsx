import { PieChart, Pie, Tooltip } from "recharts";

export default function CategoryChart({ data }) {
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="count"
        nameKey="category"
        outerRadius={100}
      />
      <Tooltip />
    </PieChart>
  );
}