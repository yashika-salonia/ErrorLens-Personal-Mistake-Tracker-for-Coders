function Navbar() {
  return (
    <div className="w-full bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-bold">Personal Mistake Tracker</h1>

      <button className="bg-red-500 text-white px-4 py-1 rounded">
        Logout
      </button>
    </div>
  );
}

export default Navbar;