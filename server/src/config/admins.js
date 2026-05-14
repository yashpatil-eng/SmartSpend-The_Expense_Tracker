// ⚠️ SECURITY: ONLY ONE SUPER_ADMIN in entire system
// This is the system-level admin with access to admin dashboard
export const SUPER_ADMIN_EMAIL = "admin@gmail.com";
export const SUPER_ADMIN_PASSWORD = "Admin@123";

// Function to check if an email is super admin
export const isSuperAdminEmail = (email) => {
  if (!email) return false;
  return email.toLowerCase() === SUPER_ADMIN_EMAIL;
};

// Function to verify super admin credentials
export const verifySuperAdmin = (email, password) => {
  return email.toLowerCase() === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD;
};

// Legacy function for backward compatibility
export const isAdminEmail = (email) => {
  return isSuperAdminEmail(email);
};
