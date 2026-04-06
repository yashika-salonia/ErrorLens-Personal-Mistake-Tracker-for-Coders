import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userService } from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password kam se kam 6 characters ka hona chahiye");
      return;
    }

    setLoading(true);
    try {
      await userService.register({ name, email, password });
      // ✅ Register ke baad login pe bhejo
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">

        <h2 className="text-2xl font-bold mb-4">Register</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
            required
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Pehle se account hai?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login karo
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;