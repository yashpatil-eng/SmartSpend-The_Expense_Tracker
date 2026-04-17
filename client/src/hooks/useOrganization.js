import { useContext } from "react";
import { OrganizationContext } from "../context/OrganizationContext";

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error("useOrganization must be used within OrganizationProvider");
  }
  return context;
};
