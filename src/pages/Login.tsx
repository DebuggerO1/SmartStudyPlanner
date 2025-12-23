import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import AuthTheme from "../components/AuthTheme";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include", // ✅ VERY IMPORTANT (refresh token cookie)
          body: JSON.stringify({
            email,
            password,
            rememberMe
          })
        });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      // ✅ AuthContext handles local/session storage
      login(data.token, rememberMe);

      toast.success("Login successful");
      navigate("/", { replace: true });

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTheme>
      <h2 className="text-white text-2xl font-semibold text-center mb-6">
        Welcome back 👋
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* EMAIL */}
        <input
          type="email"
          placeholder="example@gmail.com"
          className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-lg outline-none focus:border-orange-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-lg outline-none focus:border-orange-500 pr-14"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-3 text-sm text-orange-400 hover:text-orange-300"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* REMEMBER ME */}
        <div className="flex items-center text-sm text-white/70">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(prev => !prev)}
              className="accent-orange-500"
            />
            <span>Remember me</span>
          </label>
        </div>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className={`w-full font-semibold py-3 rounded-lg transition
            ${loading
              ? "bg-gray-400 cursor-not-allowed text-black"
              : "bg-orange-500 hover:bg-orange-600 text-black"
            }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-white/50 mt-5">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-orange-400 hover:underline">
          Signup
        </Link>
      </p>
    </AuthTheme>
  );
};

export default Login;
