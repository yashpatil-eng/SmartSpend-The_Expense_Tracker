import { useState } from "react";
import { Shield, Mail, Lock, User } from "lucide-react";

const CreateAdminForm = ({ onAdminCreated, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage({ type: "", text: "" }); // Clear previous messages
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Validate inputs
      if (!form.name.trim()) {
        setMessage({ type: "error", text: "Admin name is required" });
        setLoading(false);
        return;
      }

      if (!form.email.trim()) {
        setMessage({ type: "error", text: "Admin email is required" });
        setLoading(false);
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setMessage({ type: "error", text: "Please enter a valid email address" });
        setLoading(false);
        return;
      }

      if (!form.password || form.password.length < 6) {
        setMessage({ type: "error", text: "Password must be at least 6 characters" });
        setLoading(false);
        return;
      }

      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "error", text: "Authentication required" });
        setLoading(false);
        return;
      }

      // Call API
      const response = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.message || "Failed to create admin" });
        setLoading(false);
        return;
      }

      setMessage({ type: "success", text: `Admin ${form.email} created successfully!` });
      setForm({ name: "", email: "", password: "" });

      // Notify parent component
      if (onAdminCreated) {
        onAdminCreated(data.admin);
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        setForm({ name: "", email: "", password: "" });
        setMessage({ type: "", text: "" });
      }, 2000);

    } catch (error) {
      console.error("Create admin error:", error);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card space-y-4 rounded-lg border border-zinc-700 p-6">
      <div className="mb-4 flex items-center gap-2">
        <Shield className="text-blue-500" size={24} />
        <h3 className="text-xl font-semibold text-white">Create New Admin</h3>
      </div>

      {message.text && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "border border-green-500/30 bg-green-500/10 text-green-400"
              : "border border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-zinc-300">Admin Name</label>
          <div className="relative flex items-center">
            <User size={16} className="absolute left-3 text-zinc-600" />
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={loading}
              className="field-input pl-10"
            />
          </div>
        </div>

        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-zinc-300">Admin Email</label>
          <div className="relative flex items-center">
            <Mail size={16} className="absolute left-3 text-zinc-600" />
            <input
              type="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={loading}
              className="field-input pl-10"
            />
          </div>
        </div>

        <div className="relative">
          <label className="mb-1 block text-sm font-medium text-zinc-300">Temporary Password</label>
          <div className="relative flex items-center">
            <Lock size={16} className="absolute left-3 text-zinc-600" />
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              disabled={loading}
              className="field-input pl-10"
            />
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            ℹ️ Share this with the new admin. They should change it after first login.
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 rounded-lg border border-zinc-600 px-4 py-2 font-medium text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-400">
        <strong>⚠️ Security Notice:</strong> Only create admin accounts for trusted team members.
        Admins have full system access.
      </div>
    </div>
  );
};

export default CreateAdminForm;
