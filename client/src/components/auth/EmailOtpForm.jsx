import LoadingSpinner from "./LoadingSpinner";

const EmailOtpForm = ({
  email,
  otp,
  onEmailChange,
  onOtpChange,
  onSendEmailOtp,
  onVerifyEmailOtp,
  sendingEmailOtp,
  verifyingEmailOtp,
  emailOtpSent,
  showEmailInput = true
}) => (
  <div className="space-y-3">
    {showEmailInput && !emailOtpSent && (
      <>
        <input
          className="field-input"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
        <button
          type="button"
          disabled={sendingEmailOtp}
          onClick={onSendEmailOtp}
          className="btn-secondary w-full"
        >
          {sendingEmailOtp ? <LoadingSpinner /> : null}
          Send Verification Email
        </button>
      </>
    )}
    {emailOtpSent && (
      <>
        <input
          className="field-input"
          inputMode="numeric"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => onOtpChange(e.target.value)}
          maxLength={6}
        />
        <button
          type="button"
          onClick={onVerifyEmailOtp}
          disabled={verifyingEmailOtp}
          className="btn-primary w-full"
        >
          {verifyingEmailOtp ? <LoadingSpinner /> : null}
          Verify Email
        </button>
        {showEmailInput && (
          <button
            type="button"
            onClick={() => {
              // Reset to email input mode
              onOtpChange("");
            }}
            className="btn-secondary w-full text-sm"
          >
            Change Email
          </button>
        )}
      </>
    )}
  </div>
);

export default EmailOtpForm;