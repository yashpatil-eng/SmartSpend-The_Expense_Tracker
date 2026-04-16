// ✅ SINGLE HARDCODED ADMIN - Only one admin in the system
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin@123";

/**
 * ✅ Check if credentials match the hardcoded admin
 * Only admin@gmail.com with Admin@123 is allowed
 * This is NOT stored in the database
 */
export const isHardcodedAdmin = (email, password) => {
  if (!email || !password) return false;
  return (
    email.toLowerCase() === ADMIN_EMAIL &&
    password === ADMIN_PASSWORD
  );
};

/**
 * ✅ Get hardcoded admin credentials (for reference only)
 */
export const getAdminCredentials = () => ({
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD
});
