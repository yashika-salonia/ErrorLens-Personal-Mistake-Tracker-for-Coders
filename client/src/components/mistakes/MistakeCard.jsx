import Card from "../ui/Card";

const STATUS_COLOR = {
  "Accepted": "text-green-600",
  "Wrong Answer": "text-red-500",
  "Time Limit Exceeded": "text-orange-500",
  "Runtime Error": "text-yellow-600",
  "Compilation Error": "text-gray-500",
};

function MistakeCard({ mistake }) {
  return (
    <Card>

      {/* Problem Title */}
      <h3 className="font-bold text-lg text-gray-800">
        {mistake.problem?.title || mistake.title || "Unknown Problem"}
      </h3>

      {/* Domain + Difficulty */}
      <div className="flex gap-2 mt-1">
        {mistake.problem?.domain && (
          <p className="text-sm text-gray-500">{mistake.problem.domain}</p>
        )}
        {mistake.problem?.difficulty && (
          <span className="text-sm text-gray-400">• {mistake.problem.difficulty}</span>
        )}
      </div>

      {/* Status */}
      {mistake.status && (
        <p className={`text-sm font-medium mt-2 ${STATUS_COLOR[mistake.status] || "text-gray-500"}`}>
          {mistake.status}
        </p>
      )}

      {/* Mistake Tags */}
      {mistake.mistakeTags && mistake.mistakeTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {mistake.mistakeTags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

    </Card>
  );
}

export default MistakeCard;