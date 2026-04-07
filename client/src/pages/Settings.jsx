import { useState } from "react";
import api from "../api/axios";
import ExportImport from "../components/settings/ExportImport";
import { useAuth } from "../hooks/useAuth";

const Settings = () => {
  const { user, logout, refreshUser } = useAuth();
  const [tab, setTab] = useState("profile");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    avatar: user?.avatar || "",
    password: "",
    currency: user?.currency || "INR",
    theme: user?.theme || "dark",
    language: user?.preferences?.language || "en"
  });

  const update = async (payload) => {
    setLoading(true);
    try {
      await api.put("/user/update", payload);
      await refreshUser();
      setMessage("Settings updated successfully.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Delete account permanently?")) return;
    await api.delete("/user/delete");
    logout();
  };

  const tabs = ["profile", "account", "preferences", "sync"];

  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
      <div className="surface-card p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((item) => (
            <button key={item} type="button" className={tab === item ? "btn-primary" : "btn-secondary"} onClick={() => setTab(item)}>
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {message ? <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-sm">{message}</div> : null}

      {tab === "profile" ? (
        <div className="surface-card space-y-3 p-4">
          <h3 className="text-lg font-semibold">Profile Settings</h3>
          <input className="field-input" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="field-input" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <input className="field-input" placeholder="Mobile Number" value={form.mobile} onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))} />
          <input className="field-input" placeholder="Profile Picture URL" value={form.avatar} onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))} />
          <button className="btn-primary" disabled={loading} onClick={() => update({ name: form.name, email: form.email, mobile: form.mobile, avatar: form.avatar })}>Save Profile</button>
        </div>
      ) : null}

      {tab === "account" ? (
        <div className="surface-card space-y-3 p-4">
          <h3 className="text-lg font-semibold">Account Settings</h3>
          <input className="field-input" type="password" placeholder="New Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" disabled={loading} onClick={() => update({ password: form.password })}>Change Password</button>
            <button className="btn-secondary" onClick={logout}>Logout</button>
            <button className="btn-danger" onClick={deleteAccount}>Delete Account</button>
          </div>
        </div>
      ) : null}

      {tab === "preferences" ? (
        <div className="surface-card space-y-3 p-4">
          <h3 className="text-lg font-semibold">Preferences</h3>
          <select className="field-input" value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <select className="field-input" value={form.theme} onChange={(e) => setForm((p) => ({ ...p, theme: e.target.value }))}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
          <select className="field-input" value={form.language} onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
          <button className="btn-primary" disabled={loading} onClick={() => update({ currency: form.currency, theme: form.theme, language: form.language })}>Save Preferences</button>
        </div>
      ) : null}

      {tab === "sync" ? <ExportImport onImported={() => setMessage("Data imported. Refresh dashboard/analytics to view.")} /> : null}
    </div>
  );
};

export default Settings;
