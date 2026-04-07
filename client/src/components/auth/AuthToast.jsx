const AuthToast = ({ toast, onClose }) => {
  if (!toast?.message) return null;

  return (
    <div className={`mb-3 rounded-lg px-3 py-2 text-sm ${toast.type === "error" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
      <div className="flex items-center justify-between gap-3">
        <p>{toast.message}</p>
        <button type="button" onClick={onClose} className="text-xs opacity-80 hover:opacity-100">
          Close
        </button>
      </div>
    </div>
  );
};

export default AuthToast;
