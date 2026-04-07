import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Mail, Smartphone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthOptionButton from "../components/auth/AuthOptionButton";
import AuthToast from "../components/auth/AuthToast";
import EmailAuthForm from "../components/auth/EmailAuthForm";
import MobileOtpForm from "../components/auth/MobileOtpForm";
import { useAuth } from "../hooks/useAuth";

const LoginPage = () => {
  const { login, loginWithGoogle, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState("email");
  const [form, setForm] = useState({ email: "", password: "" });
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState({ email: false, otp: false, verifyOtp: false, google: false });
  const [toast, setToast] = useState({ type: "", message: "" });

  const onAuthSuccess = (user) => {
    navigate(user.onboardingCompleted ? "/dashboard" : "/onboarding");
  };

  const showToast = (type, message) => setToast({ type, message });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, email: true }));
    try {
      const user = await login(form.email, form.password);
      showToast("success", "Login successful");
      onAuthSuccess(user);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Login failed");
    } finally {
      setLoading((prev) => ({ ...prev, email: false }));
    }
  };

  const handleGoogleSuccess = async (googleResponse) => {
    try {
      setLoading((prev) => ({ ...prev, google: true }));
      const user = await loginWithGoogle(googleResponse.credential);
      showToast("success", "Google sign-in successful");
      onAuthSuccess(user);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Google sign-in failed");
    } finally {
      setLoading((prev) => ({ ...prev, google: false }));
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading((prev) => ({ ...prev, otp: true }));
      const response = await sendOtp(mobile);
      setOtpSent(true);
      const devOtpHint = response.devOtp ? ` (Dev OTP: ${response.devOtp})` : "";
      showToast("success", `OTP sent successfully${devOtpHint}`);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading((prev) => ({ ...prev, otp: false }));
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading((prev) => ({ ...prev, verifyOtp: true }));
      const user = await verifyOtp({ mobile, otp });
      showToast("success", "Mobile login successful");
      onAuthSuccess(user);
    } catch (err) {
      showToast("error", err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  return (
    <div className="surface-card mx-auto mt-10 max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Welcome Back</h1>
      <AuthToast toast={toast} onClose={() => setToast({ type: "", message: "" })} />
      <div className="space-y-2">
        <AuthOptionButton label="Continue with Google" icon="G" active={method === "google"} onClick={() => setMethod("google")} />
        <AuthOptionButton label="Continue with Mobile Number" icon={<Smartphone size={16} />} active={method === "mobile"} onClick={() => setMethod("mobile")} />
        <AuthOptionButton label="Continue with Email" icon={<Mail size={16} />} active={method === "email"} onClick={() => setMethod("email")} />
      </div>
      <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
        <span className="h-px flex-1 bg-zinc-700" />
        OR
        <span className="h-px flex-1 bg-zinc-700" />
      </div>
      {method === "google" ? (
        <div className="space-y-2">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => showToast("error", "Google sign-in failed")} />
          {loading.google ? <p className="text-sm text-gray-400">Signing in...</p> : null}
        </div>
      ) : null}
      {method === "email" ? (
        <EmailAuthForm
          form={form}
          loading={loading.email}
          onChange={(key, value) => setForm((p) => ({ ...p, [key]: value }))}
          onSubmit={handleSubmit}
        />
      ) : null}
      {method === "mobile" ? (
        <MobileOtpForm
          mobile={mobile}
          otp={otp}
          onMobileChange={setMobile}
          onOtpChange={setOtp}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
          otpSent={otpSent}
          sendingOtp={loading.otp}
          verifyingOtp={loading.verifyOtp}
        />
      ) : null}
      <p className="mt-4 text-sm text-gray-400">No account? <Link to="/register" className="text-white underline-offset-2 hover:underline">Create one</Link></p>
    </div>
  );
};

export default LoginPage;
