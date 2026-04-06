import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(user.onboardingCompleted ? "/dashboard" : "/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Welcome Back</h1>
      {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full rounded-lg border px-3 py-2" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        <input className="w-full rounded-lg border px-3 py-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
        <button className="w-full rounded-lg bg-indigo-600 py-2 text-white">Login</button>
      </form>
      <p className="mt-4 text-sm">No account? <Link to="/register" className="text-indigo-600">Create one</Link></p>
    </div>
  );
};

export default LoginPage;
