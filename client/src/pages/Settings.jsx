import { useState } from "react";
import api from "../api/axios";
import ExportImport from "../components/settings/ExportImport";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { Upload } from "lucide-react";
import { getTranslation } from "../utils/translations";

const Settings = () => {
  const { user, logout, refreshUser } = useAuth();
  const { switchTheme: updateTheme } = useTheme();
  const { language, switchLanguage: updateLanguage } = useLanguage();
  const t = (key) => getTranslation(key, language);
  const [tab, setTab] = useState("profile");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
    avatarUrl: user?.avatar || "",
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

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const response = await api.post("/user/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      await refreshUser();
      setMessage(t("profile_updated"));
    } catch (err) {
      setMessage(t("upload_failed") + ": " + (err.response?.data?.message || err.message));
    } finally {
      setUploadingAvatar(false);
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
              {item === "profile" && t("profile_settings")}
              {item === "account" && t("account_settings")}
              {item === "preferences" && t("preferences")}
              {item === "sync" && "Sync"}
            </button>
          ))}
        </div>
      </div>

      {message ? <div className="rounded-xl border border-zinc-700 bg-zinc-800 p-3 text-sm">{message}</div> : null}

      {tab === "profile" ? (
        <div className="surface-card space-y-3 p-4">
          <h3 className="text-lg font-semibold">{t("profile_settings")}</h3>
          
          {/* Profile Picture Preview and Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">{t("profile_picture")}</label>
            <div className="flex items-center gap-4">
              {user?.avatar && (
                <img
                  src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5001${user.avatar}`}
                  alt="Profile"
                  className="h-20 w-20 rounded-full border-2 border-zinc-600 object-cover"
                />
              )}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
                <span className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  <Upload size={16} />
                  {uploadingAvatar ? t("uploading") : t("upload_photo")}
                </span>
              </label>
            </div>
          </div>

          <input className="field-input" placeholder={t("name")} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          <input className="field-input" placeholder={t("email")} value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          <input className="field-input" placeholder={t("mobile")} value={form.mobile} onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))} />
          <input className="field-input" placeholder={t("profile_picture")} value={form.avatarUrl} onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))} />
          <button className="btn-primary" disabled={loading} onClick={() => update({ name: form.name, email: form.email, mobile: form.mobile, avatar: form.avatarUrl })}>{t("save_profile")}</button>
        </div>
      ) : null}

      {tab === "account" ? (
        <div className="surface-card space-y-3 p-4">
          <h3 className="text-lg font-semibold">{t("account_settings")}</h3>
          <input className="field-input" type="password" placeholder={t("new_password")} value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" disabled={loading} onClick={() => update({ password: form.password })}>{t("change_password")}</button>
            <button className="btn-secondary" onClick={logout}>{t("logout")}</button>
            <button className="btn-danger" onClick={deleteAccount}>{t("delete_account")}</button>
          </div>
        </div>
      ) : null}

      {tab === "preferences" ? (
        <div className="surface-card space-y-3 p-4">
          <h3 className="text-lg font-semibold">{t("preferences")}</h3>
          <select className="field-input" value={form.currency} onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">{t("theme")}</label>
            <select 
              className="field-input" 
              value={form.theme} 
              onChange={(e) => {
                const newTheme = e.target.value;
                setForm((p) => ({ ...p, theme: newTheme }));
                updateTheme(newTheme);
              }}
            >
              <option value="dark">{t("dark_mode")}</option>
              <option value="light">{t("light_mode")}</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">{t("language")}</label>
            <select 
              className="field-input" 
              value={form.language}
              onChange={(e) => {
                const newLanguage = e.target.value;
                setForm((p) => ({ ...p, language: newLanguage }));
                updateLanguage(newLanguage);
              }}
            >
              <option value="en">{t("english")}</option>
              <option value="hi">{t("hindi")}</option>
            </select>
          </div>
          <button className="btn-primary" disabled={loading} onClick={() => update({ currency: form.currency, theme: form.theme, language: form.language })}>{t("save_preferences")}</button>
        </div>
      ) : null}

      {tab === "sync" ? <ExportImport onImported={() => setMessage("Data imported. Refresh dashboard/analytics to view.")} /> : null}
    </div>
  );
};

export default Settings;
