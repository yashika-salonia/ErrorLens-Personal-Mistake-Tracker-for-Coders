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

      // ✅ Indian Date Format
      date: now.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      // ✅ Indian Time Format
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
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-semibold mb-4">
        Add New Mistake
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          placeholder="Mistake Title"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full p-3 border rounded-lg"
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
          placeholder="Description"
          className="w-full p-3 border rounded-lg"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg hover:scale-105 transition">
          Add Mistake 🚀
        </button>

      </form>
    </div>
  );
}

export default MistakeForm;