const AuthToast = ({ toast, onClose }) => {
  if (!toast?.message) return null;

  return (
    <div className={`mb-3 rounded-xl border px-3 py-2 text-sm ${toast.type === "error" ? "border-zinc-700 bg-zinc-900 text-white" : "border-zinc-700 bg-zinc-800 text-white"}`}>
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
