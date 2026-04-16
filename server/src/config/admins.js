// Hardcoded list of admin emails - only these users have admin access
export const ADMIN_EMAILS = [
  "dipak@gmail.com",
  "jayesh@gmail.com",
  "yash@gmail.com",
  "tejas@gmail.com",
  "khillaredipak908@gmail.com"
];

// Function to check if an email is admin
export const isAdminEmail = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
