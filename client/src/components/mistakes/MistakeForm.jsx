import { useState } from "react";
import { problemService } from "../../services/api";

// Category → mistakeTag mapping (backend enum ke according)
const CATEGORY_OPTIONS = [
  { label: "Syntax", value: "Syntax error" },
  { label: "Logic", value: "Logic error" },
  { label: "Off by One", value: "Off by one error" },
  { label: "Edge Case", value: "Edge case missed" },
  { label: "Wrong Algorithm", value: "Wrong algorithm" },
  { label: "Wrong Data Structure", value: "Wrong data structure" },
  { label: "Overflow", value: "Overflow" },
  { label: "Null Pointer", value: "Null pointer" },
  { label: "Infinite Loop", value: "Infinite loop" },
  { label: "Wrong Complexity", value: "Wrong complexity" },
  { label: "Other", value: "Other" },
];

const LANGUAGE_OPTIONS = [
  "javascript", "python", "java", "cpp", "c", "typescript", "go", "rust"
];

const STATUS_OPTIONS = [
  "Accepted", "Wrong Answer", "Time Limit Exceeded",
  "Runtime Error", "Compilation Error"
];

function MistakeForm({ addMistake }) {
  const [title, setTitle] = useState("");         // problem title (for search)
  const [problemId, setProblemId] = useState(""); // selected problem _id
  const [problems, setProblems] = useState([]);   // search results
  const [searching, setSearching] = useState(false);

  const [category, setCategory] = useState("");   // mistake tag
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [status, setStatus] = useState("Wrong Answer");
  const [notes, setNotes] = useState("");
  const [timeTaken, setTimeTaken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search problems by title as user types
  const handleTitleChange = async (e) => {
    const val = e.target.value;
    setTitle(val);
    setProblemId(""); // reset selection

    if (val.length < 2) {
      setProblems([]);
      return;
    }

    setSearching(true);
    try {
      const { data } = await problemService.getAll({ search: val, limit: 5 });
      setProblems(data.problems || []);
    } catch {
      setProblems([]);
    } finally {
      setSearching(false);
    }
  };

  const selectProblem = (p) => {
    setTitle(p.title);
    setProblemId(p._id);
    setProblems([]); // close dropdown
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!problemId) {
      setError("Select a problem from the search results.");
      return;
    }
    if (!category) {
      setError("Select a mistake type.");
      return;
    }

    setLoading(true);
    try {
      await addMistake({
        problem: problemId,
        code: code || "// no code provided",
        language,
        status,
        mistakeTags: [category],
        notes,
        timeTaken: timeTaken ? parseInt(timeTaken) : 0,
      });

      // Reset form
      setTitle("");
      setProblemId("");
      setCategory("");
      setCode("");
      setLanguage("javascript");
      setStatus("Wrong Answer");
      setNotes("");
      setTimeTaken("");
    } catch {
      setError("Submission is not saved. Try Again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100">

      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        Add New Mistake
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Track, analyze and improve your coding mistakes 🚀
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Problem Search */}
        <div className="relative">
          <input
            placeholder="Select Problem (search by title)"
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            value={title}
            onChange={handleTitleChange}
            autoComplete="off"
          />
          {searching && (
            <p className="text-xs text-gray-400 mt-1 ml-1">Searching...</p>
          )}
          {/* Dropdown */}
          {problems.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
              {problems.map((p) => (
                <div
                  key={p._id}
                  onClick={() => selectProblem(p)}
                  className="px-4 py-2 hover:bg-indigo-50 cursor-pointer flex justify-between items-center"
                >
                  <span className="text-sm text-gray-800">{p.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    p.difficulty === "Easy" ? "bg-green-100 text-green-600" :
                    p.difficulty === "Medium" ? "bg-yellow-100 text-yellow-600" :
                    "bg-red-100 text-red-500"
                  }`}>
                    {p.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}
          {/* Show selected */}
          {problemId && (
            <p className="text-xs text-green-600 mt-1 ml-1">✅ Problem selected</p>
          )}
        </div>

        {/* Mistake Category */}
        <select
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Mistake Type</option>
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Status + Language (2 columns) */}
        <div className="grid grid-cols-2 gap-3">
          <select
            className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-sm"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGE_OPTIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        {/* Time Taken */}
        <input
          type="number"
          placeholder="Time taken (minutes)"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          value={timeTaken}
          onChange={(e) => setTimeTaken(e.target.value)}
          min="0"
        />

        {/* Notes */}
        <textarea
          placeholder="Notes / what went wrong (optional)"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />

        {/* Code (optional) */}
        <textarea
          placeholder="Your code (optional)"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition font-mono text-sm"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={4}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 disabled:opacity-50 disabled:scale-100"
        >
          {loading ? "Saving..." : "Add Mistake 🚀"}
        </button>

      </form>
    </div>
  );
}

export default MistakeForm;