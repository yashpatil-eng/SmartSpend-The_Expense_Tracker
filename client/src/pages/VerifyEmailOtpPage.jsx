import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthToast from "../components/auth/AuthToast";
import EmailOtpForm from "../components/auth/EmailOtpForm";
import LoadingSpinner from "../components/auth/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

const VerifyEmailOtpPage = () => {
  const { sendEmailOtp, verifyEmailOtp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [loading, setLoading] = useState({ sendEmailOtp: false, verifyEmailOtp: false });
  const [toast, setToast] = useState({ type: "", message: "" });

  const showToast = (type, message) => setToast({ type, message });

  const handleSendEmailOtp = async () => {
    if (!email) {
      showToast("error", "Please enter your email address");
      return;
    }

    setLoading((prev) => ({ ...prev, sendEmailOtp: true }));
    try {
      await sendEmailOtp(email);
      setEmailOtpSent(true);
      showToast("success", "Verification email sent! Check your inbox.");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to send verification email");
    } finally {
      setLoading((prev) => ({ ...prev, sendEmailOtp: false }));
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!otp || otp.length !== 6) {
      showToast("error", "Please enter a valid 6-digit code");
      return;
    }

    setLoading((prev) => ({ ...prev, verifyEmailOtp: true }));
    try {
      const user = await verifyEmailOtp({
        email,
        otp,
        accountRole: "personal", // Default to personal, can be changed later
        name: email.split("@")[0], // Use email prefix as default name
        password: "temp123" // This should be changed in a real implementation
      });
      showToast("success", "Email verified successfully!");
      navigate("/dashboard");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Verification failed");
    } finally {
      setLoading((prev) => ({ ...prev, verifyEmailOtp: false }));
    }
  };

  return (
    <div className="surface-card mx-auto mt-10 max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">Verify Your Email</h1>
      <p className="mb-6 text-sm text-gray-400">
        We've sent a verification code to your email address. Please enter it below to complete your registration.
      </p>

      <AuthToast toast={toast} onClose={() => setToast({ type: "", message: "" })} />

      <EmailOtpForm
        email={email}
        otp={otp}
        onEmailChange={setEmail}
        onOtpChange={setOtp}
        onSendEmailOtp={handleSendEmailOtp}
        onVerifyEmailOtp={handleVerifyEmailOtp}
        sendingEmailOtp={loading.sendEmailOtp}
        verifyingEmailOtp={loading.verifyEmailOtp}
        emailOtpSent={emailOtpSent}
      />

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/register")}
          className="text-sm text-gray-400 hover:text-white underline-offset-2 hover:underline"
        >
          Back to Registration
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailOtpPage;