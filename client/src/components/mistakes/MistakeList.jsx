import { useState } from "react";

const STATUS_COLOR = {
  "Accepted": "bg-green-100 text-green-600",
  "Wrong Answer": "bg-red-100 text-red-500",
  "Time Limit Exceeded": "bg-orange-100 text-orange-600",
  "Runtime Error": "bg-yellow-100 text-yellow-600",
  "Compilation Error": "bg-gray-100 text-gray-600",
  "Pending": "bg-blue-100 text-blue-500",
};

const DIFFICULTY_COLOR = {
  "Easy": "bg-green-100 text-green-600",
  "Medium": "bg-yellow-100 text-yellow-600",
  "Hard": "bg-red-100 text-red-500",
};

function MistakeList({ mistakes, onUpdateTags }) {
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tagInput, setTagInput] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [saving, setSaving] = useState(false);

  const MISTAKE_TAGS = [
    "Off by one error", "Wrong algorithm", "Edge case missed", "Overflow",
    "Wrong data structure", "Logic error", "Syntax error", "Null pointer",
    "Infinite loop", "Wrong complexity", "Other",
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
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

  const startEditing = (m) => {
    setEditingId(m._id);
    setTagInput(m.mistakeTags || []);
    setNoteInput(m.notes || "");
  };

  const toggleTag = (tag) => {
    setTagInput((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const saveEdit = async (id) => {
    setSaving(true);
    await onUpdateTags(id, tagInput, noteInput);
    setSaving(false);
    setEditingId(null);
  };

  if (!mistakes || mistakes.length === 0) {
    return (
      <p className="text-center text-gray-400 mt-6">
        🚀 No mistakes yet. Start adding!
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {mistakes.map((m) => {
        const isExpanded = expandedId === m._id;
        const isEditing = editingId === m._id;

        return (
          <div
            key={m._id}
            className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* Problem title */}
                <h3 className="font-semibold text-gray-800 text-lg">
                  {m.problem?.title || "Unknown Problem"}
                </h3>

                {/* Tags row */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* Status */}
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLOR[m.status] || "bg-gray-100 text-gray-500"}`}>
                    {m.status}
                  </span>

                  {/* Difficulty */}
                  {m.problem?.difficulty && (
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${DIFFICULTY_COLOR[m.problem.difficulty] || "bg-gray-100 text-gray-500"}`}>
                      {m.problem.difficulty}
                    </span>
                  )}

                  {/* Language */}
                  <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600">
                    {m.language}
                  </span>

                  {/* Domain */}
                  {m.problem?.domain && (
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                      {m.problem.domain}
                    </span>
                  )}
                </div>

                {/* Mistake tags */}
                {m.mistakeTags && m.mistakeTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {m.mistakeTags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">
                        ⚠️ {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Expand button */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : m._id)}
                className="text-gray-400 hover:text-indigo-500 transition ml-4 text-sm"
              >
                {isExpanded ? "▲ Less" : "▼ More"}
              </button>
            </div>

            {/* Date + time taken */}
            <p className="text-xs text-gray-400 mt-3 flex items-center gap-2">
              ⏱ {formatDate(m.createdAt)}
              {m.timeTaken > 0 && (
                <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full">
                  🕐 {m.timeTaken} min
                </span>
              )}
            </p>

            {/* Expanded details */}
            {isExpanded && (
              <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">

                {/* Notes */}
                {m.notes && !isEditing && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{m.notes}</p>
                  </div>
                )}

                {/* Code */}
                {m.code && m.code !== "// no code provided" && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Code</p>
                    <pre className="text-xs bg-gray-900 text-green-300 p-3 rounded-lg overflow-x-auto">
                      {m.code}
                    </pre>
                  </div>
                )}

                {/* Edit mistake tags */}
                {isEditing ? (
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-gray-500">Mistake Tags Select karo:</p>
                    <div className="flex flex-wrap gap-2">
                      {MISTAKE_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`text-xs px-3 py-1 rounded-full border transition ${
                            tagInput.includes(tag)
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="Notes update karo..."
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(m._id)}
                        disabled={saving}
                        className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditing(m)}
                    className="text-xs text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
                  >
                    ✏️ Mistake Tags Edit karo
                  </button>
                )}

              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}

export default MistakeList;