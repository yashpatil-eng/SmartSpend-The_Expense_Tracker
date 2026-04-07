import LoadingSpinner from "./LoadingSpinner";

const EmailAuthForm = ({ form, onChange, onSubmit, loading, isRegister = false }) => (
  <form onSubmit={onSubmit} className="space-y-3">
    <input
      className="w-full rounded-lg border px-3 py-2"
      placeholder="Email"
      type="email"
      value={form.email}
      onChange={(e) => onChange("email", e.target.value)}
      required
    />
    <input
      className="w-full rounded-lg border px-3 py-2"
      type="password"
      placeholder="Password"
      value={form.password}
      onChange={(e) => onChange("password", e.target.value)}
      required
      minLength={6}
    />
    <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-white disabled:opacity-70">
      {loading ? <LoadingSpinner /> : null}
      {isRegister ? "Continue with Email" : "Login with Email"}
    </button>
  </form>
);

export default EmailAuthForm;
