// Hardcoded list of super admin emails - system-level admins
export const SUPER_ADMIN_EMAILS = [
  "dipak@gmail.com",
  "jayesh@gmail.com",
  "yash@gmail.com",
  "tejas@gmail.com",
  "khillaredipak908@gmail.com"
];

// Function to check if an email is super admin
export const isSuperAdminEmail = (email) => {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
};

// Legacy function for backward compatibility
export const isAdminEmail = (email) => {
  return isSuperAdminEmail(email);
};
