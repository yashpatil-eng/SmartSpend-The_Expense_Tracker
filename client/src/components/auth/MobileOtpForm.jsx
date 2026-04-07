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
      className="w-full rounded-lg border px-3 py-2"
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
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-600 py-2 text-indigo-700 disabled:opacity-70"
    >
      {sendingOtp ? <LoadingSpinner /> : null}
      Send OTP
    </button>
    {otpSent && (
      <>
        <input
          className="w-full rounded-lg border px-3 py-2"
          inputMode="numeric"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => onOtpChange(e.target.value)}
        />
        <button
          type="button"
          onClick={onVerifyOtp}
          disabled={verifyingOtp}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-white disabled:opacity-70"
        >
          {verifyingOtp ? <LoadingSpinner /> : null}
          Verify OTP
        </button>
      </>
    )}
  </div>
);

export default MobileOtpForm;
