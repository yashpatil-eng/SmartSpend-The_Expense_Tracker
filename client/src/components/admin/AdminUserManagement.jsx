import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Trash2, Shield, User } from "lucide-react";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? All their transactions will be deleted.")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter((u) => u._id !== userId));
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`);
      setUsers(users.map((u) => (u._id === userId ? response.data : u)));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update user status");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobile.includes(searchTerm);

    const matchesRole =
      filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <div className="p-6 text-center">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-400">Total users: {users.length}</p>
      </div>

      {/* Filters */}
      <div className="surface-card p-4 rounded-lg flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="field-input flex-1 min-w-64"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="field-input"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && <div className="p-4 bg-red-900 text-red-200 rounded">Error: {error}</div>}

      {/* Users Table */}
      <div className="surface-card p-6 rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Access Level</th>
              <th className="text-left py-3 px-4">Account Type</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                <td className="py-3 px-4 font-medium">{user.name}</td>
                <td className="py-3 px-4 text-sm text-gray-300">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.role === "admin"
                      ? "bg-purple-900 text-purple-200"
                      : "bg-blue-900 text-blue-200"
                  }`}>
                    {user.role === "admin" ? "🔐 Admin" : "👤 User"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-200">
                    {user.accountRole === "organization" ? "Organization" : "Personal"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleStatus(user._id)}
                    className={`px-2 py-1 rounded text-xs ${
                      user.isActive
                        ? "bg-green-900 text-green-200"
                        : "bg-red-900 text-red-200"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-400 hover:text-red-300 transition"
                    title="Delete user"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-400 py-8">No users found</div>
      )}
    </div>
  );
};

export default AdminUserManagement;
