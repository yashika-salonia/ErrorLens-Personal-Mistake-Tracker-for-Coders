import React, { useState } from "react";

const MistakeForm = ({ addMistake }) => {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !category) return;

    const newMistake = {
      id: Date.now(),
      title,
      category,
      description,
      date: new Date().toLocaleDateString()
    };

    addMistake(newMistake);

    setTitle("");
    setCategory("");
    setDescription("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Add New Mistake
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Mistake Title"
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Study">Study</option>
          <option value="Coding">Coding</option>
          <option value="Communication">Communication</option>
          <option value="Time Management">Time Management</option>
        </select>

        <textarea
          placeholder="Description"
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
        >
          Add Mistake
        </button>

      </form>

    </div>
  );
};

export default MistakeForm;