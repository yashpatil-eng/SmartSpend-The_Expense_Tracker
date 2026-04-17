import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    // Redirect if not SUPER_ADMIN
    if (user && user.orgRole !== "SUPER_ADMIN") {
      navigate("/dashboard");
    }
    fetchOrganizations();
  }, [user, navigate]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/org/all");
      setOrganizations(response.data.organizations || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Organization name is required");
      return;
    }

    try {
      const response = await api.post("/org/create", {
        name: formData.name,
        description: formData.description
      });
      
      setFormData({ name: "", description: "" });
      setShowCreateForm(false);
      alert(`Organization created! Code: ${response.data.organization.orgCode}`);
      fetchOrganizations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create organization");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Super Admin Dashboard</h1>
            <p className="text-gray-400">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-2">Total Organizations</h3>
            <p className="text-3xl font-bold">{organizations.length}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-gray-400 text-sm mb-2">Role</h3>
            <p className="text-xl font-bold bg-purple-600 inline-block px-3 py-1 rounded">
              {user?.orgRole}
            </p>
          </div>
        </div>

        {/* Create Organization Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold"
          >
            {showCreateForm ? "Cancel" : "+ Create Organization"}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Create New Organization</h2>
            <form onSubmit={handleCreateOrganization} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Organization Name*</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white"
                  placeholder="Enter organization description"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
              >
                Create Organization
              </button>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-600 p-4 rounded mb-6 text-red-200">
            {error}
          </div>
        )}

        {/* Organizations List */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
            <h2 className="text-xl font-bold">Organizations</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {organizations.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-400">
                No organizations yet. Create one to get started.
              </div>
            ) : (
              organizations.map((org) => (
                <div key={org._id} className="px-6 py-4 hover:bg-gray-700 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{org.name}</h3>
                      <div className="space-y-1 text-sm text-gray-400">
                        <p>Code: <span className="font-mono text-blue-400">{org.orgCode}</span></p>
                        <p>Users: {org.users?.length || 0}</p>
                        <p>Admins: {org.admins?.length || 0}</p>
                        <p>Created: {new Date(org.createdAt).toLocaleDateString()}</p>
                        {org.description && <p>Description: {org.description}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded text-sm ${
                        org.isActive ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"
                      }`}>
                        {org.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
