import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Mail, Smartphone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthOptionButton from "../components/auth/AuthOptionButton";
import AuthToast from "../components/auth/AuthToast";
import LoadingSpinner from "../components/auth/LoadingSpinner";
import MobileOtpForm from "../components/auth/MobileOtpForm";
import EmailOtpForm from "../components/auth/EmailOtpForm";
import RoleSelector from "../components/auth/RoleSelector";
import JoinOrganizationModal from "../components/auth/JoinOrganizationModal";
import { OrganizationSignupFields, PersonalSignupFields } from "../components/auth/SignupFormSections";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const { register, loginWithGoogle, sendOtp, verifyOtp, sendEmailOtp, verifyEmailOtp, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [method, setMethod] = useState("email");
  const [accountRole, setAccountRole] = useState("personal");
  const [form, setForm] = useState({
    name: "",
    ownerName: "",
    organizationName: "",
    email: "",
    mobile: "",
    gstNumber: "",
    password: "",
    adminSecret: ""
  });
  const [otp, setOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [loading, setLoading] = useState({ email: false, google: false, otp: false, verifyOtp: false, sendEmailOtp: false, verifyEmailOtp: false });
  const [toast, setToast] = useState({ type: "", message: "" });
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const showToast = (type, message) => setToast({ type, message });
  
  const onAuthSuccess = (user) => {
    // Prompt regular (personal) users who are not part of any organization
    // to optionally join an organization after registration. Skip users who
    // already belong to an org or have an orgRole (admins).
    if (user.accountRole === "personal" && !user.organizationId && !user.orgRole) {
      setRegisteredUser(user);
      setShowJoinModal(true);
      return;
    }

    // Role-based redirect: admins go to admin dashboard, others to onboarding/dashboard
    if (user.orgRole === "SUPER_ADMIN" || user.orgRole === "MANAGER" || user.orgRole === "ORG_ADMIN") {
      navigate("/admin");
    } else {
      navigate(user.onboardingCompleted ? "/dashboard" : "/onboarding");
    }
  };

  const handleJoinOrgSuccess = async () => {
    // Refresh user data and then navigate
    await refreshUser();
    setShowJoinModal(false);
    navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.email || !form.password || !form.name) {
      showToast("error", "Please fill in all required fields");
      return;
    }

    if (form.password.length < 6) {
      showToast("error", "Password must be at least 6 characters");
      return;
    }

    setLoading((prev) => ({ ...prev, sendEmailOtp: true }));
    try {
      await sendEmailOtp(form.email);
      setEmailOtpSent(true);
      showToast("success", "Verification email sent! Please check your inbox.");
    } catch (err) {
      showToast("error", err.response?.data?.message || "Failed to send verification email");
    } finally {
      setLoading((prev) => ({ ...prev, sendEmailOtp: false }));
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
      showToast("success", "OTP sent successfully");
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
        accountRole,
        email: form.email || undefined,
        name: accountRole === "organization" ? form.ownerName : form.name
      });
      showToast("success", "Mobile signup successful");
      onAuthSuccess(user);
    } catch (err) {
      showToast("error", err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading((prev) => ({ ...prev, verifyOtp: false }));
    }
  };

  const handleSendEmailOtp = async () => {
    if (!form.email) {
      showToast("error", "Please enter your email address");
      return;
    }

    setLoading((prev) => ({ ...prev, sendEmailOtp: true }));
    try {
      await sendEmailOtp(form.email);
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
        email: form.email,
        otp,
        accountRole,
        name: accountRole === "organization" ? form.ownerName : form.name,
        ownerName: form.ownerName,
        organizationName: form.organizationName,
        mobile: form.mobile || undefined,
        gstNumber: form.gstNumber,
        password: form.password
      });
      showToast("success", "Email verified and account created!");
      onAuthSuccess(user);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Email verification failed");
    } finally {
      setLoading((prev) => ({ ...prev, verifyEmailOtp: false }));
    }
  };

  return (
    <>
      <div className="surface-card mx-auto mt-10 max-w-md p-6">
        <h1 className="mb-4 text-2xl font-bold">Create Account</h1>
        <AuthToast toast={toast} onClose={() => setToast({ type: "", message: "" })} />
        
        <RoleSelector role={accountRole} onChange={setAccountRole} />
        
        <div className="mt-3 space-y-2">
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
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => showToast("error", "Google sign-up failed")} />
            {loading.google ? <p className="text-sm text-gray-400">Signing up...</p> : null}
          </div>
        ) : null}
        {method === "email" ? (
          <div className="space-y-3">
            {accountRole === "personal" ? (
              <PersonalSignupFields form={form} onChange={(key, value) => setForm((p) => ({ ...p, [key]: value }))} />
            ) : (
              <OrganizationSignupFields form={form} onChange={(key, value) => setForm((p) => ({ ...p, [key]: value }))} />
            )}
            <input
              className="field-input"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
              minLength={6}
            />
            
            {!emailOtpSent ? (
              <button
                onClick={handleSubmit}
                disabled={loading.sendEmailOtp}
                className="btn-primary w-full"
              >
                {loading.sendEmailOtp ? <LoadingSpinner /> : null}
                Create Account
              </button>
            ) : (
              <>
                <div className="text-center text-sm text-gray-400 mb-4">
                  We've sent a verification code to <strong>{form.email}</strong>
                </div>
                <EmailOtpForm
                  email={form.email}
                  otp={otp}
                  onEmailChange={(value) => setForm((p) => ({ ...p, email: value }))}
                  onOtpChange={setOtp}
                  onSendEmailOtp={handleSubmit}
                  onVerifyEmailOtp={handleVerifyEmailOtp}
                  sendingEmailOtp={loading.sendEmailOtp}
                  verifyingEmailOtp={loading.verifyEmailOtp}
                  emailOtpSent={emailOtpSent}
                  showEmailInput={false}
                />
              </>
            )}
          </div>
        ) : null}
        {method === "mobile" ? (
          <div className="space-y-3">
            {accountRole === "personal" ? (
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
        <p className="mt-4 text-sm text-gray-400">Already have an account? <Link to="/login" className="text-white underline-offset-2 hover:underline">Login</Link></p>
      </div>

      {/* Join Organization Modal */}
      <JoinOrganizationModal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false);
          // Navigate after closing modal
          if (registeredUser) {
            navigate(registeredUser.onboardingCompleted ? "/dashboard" : "/onboarding");
          }
        }}
        onSuccess={handleJoinOrgSuccess}
      />
    </>
  );
};

export default RegisterPage;
