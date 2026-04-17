import React, { useState } from "react";
import { X, Loader } from "lucide-react";
import api from "../../api/axios";

const JoinOrganizationModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState("choice"); // "choice" | "input"
  const [orgCode, setOrgCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSkip = () => {
    setStep("choice");
    setOrgCode("");
    setError(null);
    onClose();
  };

  const handleWantToJoin = () => {
    setStep("input");
    setError(null);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!orgCode.trim()) {
      setError("Please enter an organization code");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.post("/org/join-by-code", {
        orgCode: orgCode.toUpperCase()
      });

      // Success!
      setOrgCode("");
      if (onSuccess) {
        onSuccess();
      }
      handleSkip();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join organization. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="surface-card w-full max-w-md rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 p-6">
          <h2 className="text-xl font-bold">
            {step === "choice" ? "Join Organization?" : "Enter Organization Code"}
          </h2>
          <button
            onClick={handleSkip}
            className="text-gray-400 hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === "choice" ? (
            <div className="space-y-4">
              <p className="text-gray-300">
                Would you like to join an organization? You can enter an organization code to join now, or skip for later.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleWantToJoin}
                  className="btn-primary w-full py-2"
                >
                  Yes, Join Organization
                </button>
                <button
                  onClick={handleSkip}
                  className="btn-secondary w-full py-2"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Organization Code
                </label>
                <input
                  type="text"
                  placeholder="e.g., ORG-ABC123"
                  value={orgCode}
                  onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                  className="field-input"
                  disabled={loading}
                  autoFocus
                />
                <p className="mt-1 text-xs text-gray-400">
                  Ask your organization administrator for the code
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={loading || !orgCode.trim()}
                  className="btn-primary w-full py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader size={16} className="animate-spin" />}
                  {loading ? "Joining..." : "Join Organization"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("choice");
                    setOrgCode("");
                    setError(null);
                  }}
                  disabled={loading}
                  className="btn-secondary w-full py-2 disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinOrganizationModal;
