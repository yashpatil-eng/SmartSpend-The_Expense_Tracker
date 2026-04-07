const AuthOptionButton = ({ label, icon, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2 text-sm font-medium transition ${
      active ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white hover:bg-slate-50"
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

export default AuthOptionButton;
