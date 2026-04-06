function MistakeList({ mistakes }) {

  const formatDate = (m) => {
    if (m.time) {
      return `${m.date} • ${m.time}`;
    }

    const d = new Date(m.date);

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

  if (!mistakes.length) {
    return (
      <p className="text-center text-gray-400 mt-6">
        🚀 No mistakes yet. Start adding!
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-4">

      {mistakes.map((m) => (
        <div
          key={m.id}
          className="bg-white/70 backdrop-blur-md p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >

          {/* Title */}
          <h3 className="font-semibold text-gray-800 text-lg">
            {m.title}
          </h3>

          {/* Category */}
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-600 mt-2">
            {m.category}
          </span>

          {/* Description */}
          {m.desc && (
            <p className="text-sm text-gray-600 mt-2">
              {m.desc}
            </p>
          )}

          {/* Date & Time */}
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
            ⏱ {formatDate(m)}
          </p>

        </div>
      ))}

    </div>
  );
}

export default MistakeList;