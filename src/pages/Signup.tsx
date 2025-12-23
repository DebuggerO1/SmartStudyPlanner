import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import AuthTheme from "../components/AuthTheme";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ confirm password check
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      toast.success("Account created successfully");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTheme>
      <h2 className="text-white text-2xl font-semibold text-center mb-6">
        Create your account 🚀
      </h2>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="Your name"
          className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-lg outline-none focus:border-orange-500"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="example@gmail.com"
          className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-lg outline-none focus:border-orange-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-lg outline-none focus:border-orange-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {/* ✅ Confirm Password */}
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full bg-black/40 border border-white/10 text-white px-4 py-3 rounded-lg outline-none focus:border-orange-500"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className={`w-full font-semibold py-3 rounded-lg transition
            ${loading
              ? "bg-gray-400 cursor-not-allowed text-black"
              : "bg-orange-500 hover:bg-orange-600 text-black"
            }`}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-white/50 mt-5">
        Already have an account?{" "}
        <Link to="/login" className="text-orange-400 hover:underline">
          Login
        </Link>
      </p>
    </AuthTheme>
  );
};

export default Signup;
