const RoleSelector = ({ role, onChange }) => (
  <div className="space-y-2">
    <p className="text-sm font-medium text-gray-400">Are you using SmartSpend as:</p>
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange("personal")}
        className={`rounded-xl border px-3 py-2 text-sm ${role === "personal" ? "border-white bg-white text-black" : "border-zinc-700 bg-zinc-900 text-white"}`}
      >
        Personal User
      </button>
      <button
        type="button"
        onClick={() => onChange("organization")}
        className={`rounded-xl border px-3 py-2 text-sm ${role === "organization" ? "border-white bg-white text-black" : "border-zinc-700 bg-zinc-900 text-white"}`}
      >
        Organization
      </button>
    </div>
  </div>
);

export default RoleSelector;
