import { useState } from "react";
import axios from "axios";

const Auth = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/user/login", {
        username,
        password,
      });
      localStorage.setItem("userid", res.data.id);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("password", password);
      setError(res.data.message || "Login successful");
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/user/register", {
        username,
        password,
      });
      setError(res.data.message || "Registration successful");
      localStorage.setItem("userid", res.data.id);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("password", password);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 font-sans p-4">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white border border-white/10">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome</h1>

        <form className="space-y-5" onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none placeholder:text-white/70"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none placeholder:text-white/70"
          />

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex gap-4 pt-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2.5 rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={handleRegister}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2.5 rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
