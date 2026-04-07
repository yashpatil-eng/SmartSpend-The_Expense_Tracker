const AuthOptionButton = ({ label, icon, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-2 text-sm font-medium transition ${
      active ? "border-white bg-white text-black" : "border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

export default AuthOptionButton;
