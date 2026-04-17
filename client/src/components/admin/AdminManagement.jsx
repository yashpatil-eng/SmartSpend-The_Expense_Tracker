import { useState, useEffect } from "react";
import api from "../../api/axios";
import CreateAdminForm from "./CreateAdminForm";
import { Trash2, Shield, AlertCircle } from "lucide-react";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      const adminUsers = response.data.filter((user) => user.orgRole === "SUPER_ADMIN" || user.orgRole === "MANAGER" || user.orgRole === "ORG_ADMIN");
      setAdmins(adminUsers);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admins");
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId, adminEmail) => {
    try {
      setDeleting(adminId);
      const response = await api.delete(`/admin/users/${adminId}`);
      
      if (response.status === 200) {
        setAdmins((prev) => prev.filter((a) => a._id !== adminId));
        setDeleteConfirm(null);
        alert(`Admin ${adminEmail} has been deleted successfully`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete admin");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-400">Loading admin management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield size={32} className="text-blue-500" />
              Admin Management
            </h1>
            <p className="text-gray-400">Manage admin accounts and permissions</p>
          </div>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              + Create New Admin
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Create Admin Form */}
      {showCreateForm && (
        <div>
          <CreateAdminForm
            onAdminCreated={() => {
              setShowCreateForm(false);
              fetchAdmins();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admin List */}
        <div className="lg:col-span-2">
          <div className="surface-card rounded-lg border border-zinc-700 p-6">
            <h2 className="mb-4 text-xl font-semibold">Active Admin Accounts ({admins.length})</h2>

            {admins.length === 0 ? (
              <div className="py-8 text-center text-gray-400">
                No admin accounts found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-zinc-700">
                    <tr>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Created</th>
                      <th className="text-center py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin._id} className="border-b border-zinc-800 hover:bg-zinc-900/50 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Shield size={16} className="text-blue-500" />
                            {admin.name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-zinc-300">{admin.email}</td>
                        <td className="py-3 px-4 text-zinc-400 text-xs">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {deleteConfirm === admin._id ? (
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleDeleteAdmin(admin._id, admin.email)}
                                disabled={deleting === admin._id}
                                className="px-3 py-1 rounded bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                              >
                                {deleting === admin._id ? "Deleting..." : "Confirm"}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting === admin._id}
                                className="px-3 py-1 rounded bg-zinc-700 text-white text-xs font-medium hover:bg-zinc-600 disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(admin._id)}
                              className="inline-flex items-center gap-1 rounded px-3 py-1 text-red-400 hover:bg-red-500/10 transition"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Admin Guidelines */}
        <div className="space-y-4">
          <div className="surface-card rounded-lg border border-zinc-700 p-6">
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle size={20} className="text-yellow-500 mt-0.5" />
              <h3 className="text-lg font-semibold">Important</h3>
            </div>
            <ul className="space-y-3 text-sm text-zinc-300">
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">→</span>
                <span>Only logged-in admins can add or delete admins</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">→</span>
                <span>Share temporary password securely</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">→</span>
                <span>Admins must change password after first login</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">→</span>
                <span>Admin actions are logged for audit trail</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500 font-bold">→</span>
                <span>Keep admin count minimal for security</span>
              </li>
            </ul>
          </div>

          <div className="surface-card rounded-lg border border-zinc-700 p-6">
            <h3 className="mb-3 font-semibold">Admin Permissions</h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li>✓ View all users</li>
              <li>✓ View all transactions</li>
              <li>✓ Delete users</li>
              <li>✓ Toggle user status</li>
              <li>✓ Delete transactions</li>
              <li>✓ View system analytics</li>
              <li>✓ Create new admins</li>
              <li>✓ Delete admin accounts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
