import { useState } from "react";

function MistakeForm({ addMistake }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !category) return;

    const now = new Date();

    const newMistake = {
      id: Date.now(),
      title,
      category,
      desc,
      date: now.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };

    addMistake(newMistake);

    setTitle("");
    setCategory("");
    setDesc("");
  };

  return (
    <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100">
      
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        Add New Mistake
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        Track, analyze and improve your coding mistakes 🚀
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          placeholder="Mistake Title"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option>Syntax</option>
          <option>Logic</option>
          <option>Runtime</option>
          <option>UI</option>
        </select>

        <textarea
          placeholder="Description (optional)"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300">
          Add Mistake 🚀
        </button>

      </form>
    </div>
  );
}

export default MistakeForm;