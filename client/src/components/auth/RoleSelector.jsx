const RoleSelector = ({ role, onChange }) => (
  <div className="space-y-2">
    <p className="text-sm font-medium text-slate-700">Are you using SmartSpend as:</p>
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange("personal")}
        className={`rounded-lg border px-3 py-2 text-sm ${role === "personal" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200"}`}
      >
        Personal User
      </button>
      <button
        type="button"
        onClick={() => onChange("organization")}
        className={`rounded-lg border px-3 py-2 text-sm ${role === "organization" ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200"}`}
      >
        Organization
      </button>
    </div>
  </div>
);

export default RoleSelector;
