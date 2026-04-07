import LoadingSpinner from "./LoadingSpinner";

const MobileOtpForm = ({
  mobile,
  otp,
  onMobileChange,
  onOtpChange,
  onSendOtp,
  onVerifyOtp,
  sendingOtp,
  verifyingOtp,
  otpSent
}) => (
  <div className="space-y-3">
    <input
      className="field-input"
      type="tel"
      placeholder="Mobile Number"
      value={mobile}
      onChange={(e) => onMobileChange(e.target.value)}
      required
    />
    <button
      type="button"
      disabled={sendingOtp}
      onClick={onSendOtp}
      className="btn-secondary w-full"
    >
      {sendingOtp ? <LoadingSpinner /> : null}
      Send OTP
    </button>
    {otpSent && (
      <>
        <input
          className="field-input"
          inputMode="numeric"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => onOtpChange(e.target.value)}
        />
        <button
          type="button"
          onClick={onVerifyOtp}
          disabled={verifyingOtp}
          className="btn-primary w-full"
        >
          {verifyingOtp ? <LoadingSpinner /> : null}
          Verify OTP
        </button>
      </>
    )}
  </div>
);

export default MobileOtpForm;
