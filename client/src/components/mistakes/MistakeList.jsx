function MistakeList({ mistakes }) {

  // ✅ Date-Time formatter (old + new dono handle karega)
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

  return (
    <div className="mt-6 space-y-3">
      {mistakes.map((m) => (
        <div
          key={m.id}
          className="bg-white p-4 rounded-lg shadow hover:scale-[1.02] transition"
        >
          <h3 className="font-bold">{m.title}</h3>
          <p className="text-sm text-gray-500">{m.category}</p>

          {/* ✅ Sirf yaha change kiya hai */}
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            ⏱ {formatDate(m)}
          </p>

        </div>
      ))}
    </div>
  );
}

export default MistakeList;