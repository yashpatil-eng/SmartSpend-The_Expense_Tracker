import LoadingSpinner from "./LoadingSpinner";

const EmailAuthForm = ({ form, onChange, onSubmit, loading, isRegister = false }) => (
  <form onSubmit={onSubmit} className="space-y-3">
    <input
      className="field-input"
      placeholder="Email"
      type="email"
      value={form.email}
      onChange={(e) => onChange("email", e.target.value)}
      required
    />
    <input
      className="field-input"
      type="password"
      placeholder="Password"
      value={form.password}
      onChange={(e) => onChange("password", e.target.value)}
      required
      minLength={6}
    />
    <button disabled={loading} className="btn-primary w-full">
      {loading ? <LoadingSpinner /> : null}
      {isRegister ? "Continue with Email" : "Login with Email"}
    </button>
  </form>
);

export default EmailAuthForm;
