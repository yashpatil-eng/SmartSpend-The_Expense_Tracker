import React, { useState } from "react";
import { Building2, Loader, Copy, Check } from "lucide-react";
import { useOrganization } from "../../hooks/useOrganization";
import api from "../../api/axios";

const OrganizationSetup = ({ onSuccess, showSkip = true }) => {
  const { createOrganization, joinOrganization } = useOrganization();
  const [mode, setMode] = useState("choice"); // "choice" | "create" | "join" | "created"
  const [orgName, setOrgName] = useState("");
  const [orgCode, setOrgCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [createdOrg, setCreatedOrg] = useState(null);

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) {
      setError("Organization name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const org = await createOrganization(orgName.trim());
      setCreatedOrg(org);
      setMode("created");
      if (onSuccess) {
        setTimeout(() => onSuccess(org), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOrg = async (e) => {
    e.preventDefault();
    if (!orgCode.trim()) {
      setError("Organization code is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await joinOrganization(orgCode.trim());
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join organization");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (onSuccess) {
      onSuccess();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (mode === "created" && createdOrg) {
    return (
      <div className="surface-card rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 mx-auto">
            <span className="text-3xl">✓</span>
          </div>
          <h3 className="text-2xl font-bold text-green-400">Organization Created!</h3>
          <p className="text-gray-300">Share this code with your team to let them join:</p>
          
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
            <p className="text-xs text-gray-400 mb-2">Organization Code</p>
            <div className="flex items-center justify-between gap-3">
              <code className="text-2xl font-bold text-white tracking-wider">{createdOrg.orgCode}</code>
              <button
                onClick={() => copyToClipboard(createdOrg.orgCode)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white transition"
              >
                {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                {copiedCode ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-400">Redirecting to dashboard in 2 seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card rounded-lg max-w-md mx-auto">
      <div className="border-b border-gray-700 p-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 size={24} className="text-blue-400" />
          {mode === "choice" ? "Get Started" : mode === "create" ? "Create Organization" : "Join Organization"}
        </h2>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {mode === "choice" && (
          <div className="space-y-4">
            <p className="text-gray-300 text-center">
              Welcome! Would you like to create a new organization or join an existing one?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setMode("create")}
                className="btn-primary w-full py-2 flex items-center justify-center gap-2"
              >
                <Building2 size={18} />
                Create Organization
              </button>
              <button
                onClick={() => setMode("join")}
                className="btn-secondary w-full py-2"
              >
                Join Organization
              </button>
              {showSkip && (
                <button
                  onClick={handleSkip}
                  className="w-full py-2 text-gray-400 hover:text-gray-300 text-sm"
                >
                  Skip for Now
                </button>
              )}
            </div>
          </div>
        )}

        {mode === "create" && (
          <form onSubmit={handleCreateOrg} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                placeholder="e.g., My Team, Company XYZ"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                disabled={loading}
                className="field-input"
              />
            </div>
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || !orgName.trim()}
                className="btn-primary w-full py-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Building2 size={16} />
                    Create Organization
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode("choice")}
                className="btn-secondary w-full py-2"
              >
                Back
              </button>
            </div>
          </form>
        )}

        {mode === "join" && (
          <form onSubmit={handleJoinOrg} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Organization Code
              </label>
              <input
                type="text"
                placeholder="e.g., ORG-ABC123"
                value={orgCode}
                onChange={(e) => setOrgCode(e.target.value.toUpperCase())}
                disabled={loading}
                className="field-input"
              />
              <p className="text-xs text-gray-400 mt-1">
                Ask your organization admin for the code
              </p>
            </div>
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || !orgCode.trim()}
                className="btn-primary w-full py-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Organization"
                )}
              </button>
              <button
                type="button"
                onClick={() => setMode("choice")}
                className="btn-secondary w-full py-2"
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrganizationSetup;
