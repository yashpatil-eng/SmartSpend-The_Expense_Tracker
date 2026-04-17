import { createContext, useCallback, useMemo, useState } from "react";
import api from "../api/axios";

export const OrganizationContext = createContext(null);

export const OrganizationProvider = ({ children }) => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's organization
  const fetchMyOrganization = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/org/my-organization");
      setOrganization(response.data.organization);
      return response.data.organization;
    } catch (err) {
      if (err.response?.status === 404) {
        // User not in any organization
        setOrganization(null);
      } else {
        setError(err.response?.data?.message || "Failed to fetch organization");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create organization
  const createOrganization = useCallback(async (name, description = "") => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/org/create-personal", {
        name,
        description
      });
      setOrganization(response.data.organization);
      return response.data.organization;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to create organization";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Join organization by code
  const joinOrganization = useCallback(async (orgCode) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post("/org/join-by-code", {
        orgCode: orgCode.toUpperCase()
      });
      await fetchMyOrganization(); // Refresh org data
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to join organization";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyOrganization]);

  // Leave organization
  const leaveOrganization = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await api.post("/org/remove-user", { userId: null });
      setOrganization(null);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to leave organization";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get organization members
  const getMembers = useCallback(async () => {
    try {
      const response = await api.get("/org/users");
      return response.data.users || [];
    } catch (err) {
      console.error("Failed to fetch members:", err);
      return [];
    }
  }, []);

  const value = useMemo(
    () => ({
      organization,
      loading,
      error,
      fetchMyOrganization,
      createOrganization,
      joinOrganization,
      leaveOrganization,
      getMembers
    }),
    [organization, loading, error, fetchMyOrganization, createOrganization, joinOrganization, leaveOrganization, getMembers]
  );

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};
