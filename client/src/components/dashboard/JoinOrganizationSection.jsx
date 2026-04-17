import React, { useState } from "react";
import { Building2, ArrowRight, Loader } from "lucide-react";
import api from "../../api/axios";

const JoinOrganizationSection = ({ onJoinSuccess, user }) => {
  const [orgCode, setOrgCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Only show this section if user is personal and not in an organization
  if (user?.orgRole || user?.organizationId) {
    return null;
  }

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

      setSuccess(true);
      setOrgCode("");
      
      // Call callback to refresh user data
      if (onJoinSuccess) {
        setTimeout(() => {
          onJoinSuccess();
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join organization. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="surface-card border border-green-500/30 bg-green-500/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
            <span className="text-lg">✓</span>
          </div>
          <div>
            <h3 className="font-semibold text-green-400">Success!</h3>
            <p className="text-sm text-gray-300">You've successfully joined the organization. Refreshing...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card border border-blue-500/30 bg-blue-500/10 p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
            <Building2 size={20} className="text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white">Join an Organization</h3>
            <p className="text-sm text-gray-300">Enter an organization code to join a team and collaborate with others.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleJoin} className="mt-4 flex flex-col gap-3 md:flex-row md:gap-2">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Enter organization code (e.g., ORG-ABC123)"
            value={orgCode}
            onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
            disabled={loading}
            className="field-input"
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading || !orgCode.trim()}
          className="btn-primary flex items-center gap-2 whitespace-nowrap md:mt-0"
        >
          {loading ? (
            <>
              <Loader size={16} className="animate-spin" />
              Joining...
            </>
          ) : (
            <>
              Join
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default JoinOrganizationSection;
