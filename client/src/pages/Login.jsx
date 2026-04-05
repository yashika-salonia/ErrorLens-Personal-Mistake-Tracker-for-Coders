import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <div className="bg-white p-6 rounded shadow w-80">

        <h2 className="text-xl mb-4 font-bold">
          Login
        </h2>

        <input
          placeholder="Email"
          className="border p-2 w-full mb-3"
        />

        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full mb-3"
        />

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 text-white w-full p-2"
        >
          Login
        </button>

      </div>

    </div>
  );
}