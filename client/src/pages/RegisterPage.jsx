import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Mail, Smartphone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthOptionButton from "../components/auth/AuthOptionButton";
import AuthToast from "../components/auth/AuthToast";
import LoadingSpinner from "../components/auth/LoadingSpinner";
import MobileOtpForm from "../components/auth/MobileOtpForm";
import RoleSelector from "../components/auth/RoleSelector";
import { OrganizationSignupFields, PersonalSignupFields } from "../components/auth/SignupFormSections";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const { register, loginWithGoogle, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState("email");
  const [role, setRole] = useState("personal");
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    organizationName: "",
    email: "",
    mobile: "",
    gstNumber: "",
    password: ""
  });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState({ email: false, google: false, otp: false, verifyOtp: false });
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => setToast({ type, message });
  const onAuthSuccess = (user) => navigate(user.onboardingCompleted ? "/dashboard" : "/onboarding");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, email: true }));
    try {
      const payload = {
        role,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        name: form.name,
        ownerName: form.ownerName,
        organizationName: form.organizationName,
        gstNumber: form.gstNumber
      };
      const user = await register(payload);
      showToast("success", "Account created successfully");
      onAuthSuccess(user);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Registration failed");
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  };

  const handleGoogleSuccess = async (googleResponse) => {
    try {
      setLoading((prev) => ({ ...prev, google: true }));
      const user = await loginWithGoogle(googleResponse.credential);
      showToast("success", "Google sign-up successful");
      onAuthSuccess(user);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Google sign-up failed");
    } finally {
      setLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading((prev) => ({ ...prev, otp: true }));
      const response = await sendOtp(form.mobile);
      setOtpSent(true);
      const devOtpHint = response.devOtp ? ` (Dev OTP: ${response.devOtp})` : "";
      showToast("success", `OTP sent successfully${devOtpHint}`);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading((prev) => ({ ...prev, otp: false }));
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading((prev) => ({ ...prev, verifyOtp: true }));
      const user = await verifyOtp({
        mobile: form.mobile,
        otp,
        role,
        email: form.email || undefined,
        name: role === "organization" ? form.ownerName : form.name
      });
      showToast("success", "Mobile signup successful");
      onAuthSuccess(user);
    } catch (err) {
      showToast("error", err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Create Account</h1>
      <AuthToast toast={toast} onClose={() => setToast({ type: "", message: "" })} />
      <RoleSelector role={role} onChange={setRole} />
      <div className="mt-3 space-y-2">
        <AuthOptionButton label="Continue with Google" icon="G" active={method === "google"} onClick={() => setMethod("google")} />
        <AuthOptionButton label="Continue with Mobile Number" icon={<Smartphone size={16} />} active={method === "mobile"} onClick={() => setMethod("mobile")} />
        <AuthOptionButton label="Continue with Email" icon={<Mail size={16} />} active={method === "email"} onClick={() => setMethod("email")} />
      </div>
      <div className="my-4 flex items-center gap-3 text-xs text-slate-500">
        <span className="h-px flex-1 bg-slate-200" />
        OR
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      {method === "google" ? (
        <div className="space-y-2">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => showToast("error", "Google sign-up failed")} />
          {loading.google ? <p className="text-sm text-slate-500">Signing up...</p> : null}
        </div>
      ) : null}
      {method === "email" ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          {role === "personal" ? (
            <PersonalSignupFields form={form} onChange={(key, value) => setForm((p) => ({ ...p, [key]: value }))} />
          ) : (
            <OrganizationSignupFields form={form} onChange={(key, value) => setForm((p) => ({ ...p, [key]: value }))} />
          )}
          <input
            className="w-full rounded-lg border px-3 py-2"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
            minLength={6}
          />
          <button disabled={loading.email} className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-white disabled:opacity-70">
            {loading.email ? <LoadingSpinner /> : null}
            Create Account
          </button>
        </form>
      ) : null}
      {method === "mobile" ? (
        <div className="space-y-3">
          {role === "personal" ? (
            <PersonalSignupFields form={form} onChange={(key, value) => setForm((p) => ({ ...p, [key]: value }))} />
          ) : (
            <OrganizationSignupFields form={form} onChange={(key, value) => setForm((p) => ({ ...p, [key]: value }))} />
          )}
          <MobileOtpForm
            mobile={form.mobile}
            otp={otp}
            onMobileChange={(value) => setForm((p) => ({ ...p, mobile: value }))}
            onOtpChange={setOtp}
            onSendOtp={handleSendOtp}
            onVerifyOtp={handleVerifyOtp}
            otpSent={otpSent}
            sendingOtp={loading.otp}
            verifyingOtp={loading.verifyOtp}
          />
        </div>
      ) : null}
      <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-indigo-600">Login</Link></p>
    </div>
  );
};

export default RegisterPage;
