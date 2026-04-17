import React, { useEffect, useState } from "react";
import { Building2, Users, Copy, Check, LogOut } from "lucide-react";
import { useOrganization } from "../../hooks/useOrganization";
import api from "../../api/axios";

const OrganizationPanel = () => {
  const { organization, getMembers } = useOrganization();
  const [members, setMembers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (organization) {
      loadMembers();
    }
  }, [organization]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const membersList = await getMembers();
      setMembers(membersList);
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!organization) {
    return null;
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const adminCount = members.filter(m => m.orgRole === "ORG_ADMIN" || m.orgRole === "MANAGER").length;

  return (
    <div className="surface-card p-6 rounded-lg">
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
              <Building2 size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{organization.name}</h3>
              <p className="text-sm text-gray-400">Organization Code</p>
            </div>
          </div>
        </div>

        {/* Organization Code Box */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Share with team members</p>
              <code className="text-2xl font-bold text-blue-400 tracking-wider">
                {organization.orgCode}
              </code>
            </div>
            <button
              onClick={() => copyToClipboard(organization.orgCode)}
              className="flex flex-col items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              title="Copy to clipboard"
            >
              {copiedCode ? (
                <>
                  <Check size={18} className="text-white" />
                  <span className="text-xs text-white">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={18} className="text-white" />
                  <span className="text-xs text-white">Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Organization Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Total Members</p>
            <p className="text-2xl font-bold text-white">{members.length}</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">Admins</p>
            <p className="text-2xl font-bold text-white">{adminCount}</p>
          </div>
        </div>

        {organization.description && (
          <p className="text-sm text-gray-300 mb-4">{organization.description}</p>
        )}
      </div>

      {/* Members Section */}
      <div className="border-t border-gray-700 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-blue-400" />
          <h4 className="font-semibold text-white">Team Members ({members.length})</h4>
        </div>

        {loading ? (
          <div className="text-center py-4 text-gray-400">Loading members...</div>
        ) : members.length > 0 ? (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-white">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.email}</p>
                </div>
                <div className="text-right">
                  {member.orgRole ? (
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-purple-500/20 text-purple-300">
                      {member.orgRole === "ORG_ADMIN" ? "Admin" : "Manager"}
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-1 text-xs text-gray-400">
                      Member
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gray-400">No members yet</p>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-gray-700 mt-6 pt-6">
        <p className="text-xs text-gray-400 mb-3">Actions</p>
        <button
          onClick={loadMembers}
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition text-sm"
        >
          {loading ? "Loading..." : "Refresh Members"}
        </button>
      </div>
    </div>
  );
};

export default OrganizationPanel;
