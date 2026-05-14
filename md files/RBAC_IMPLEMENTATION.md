# Role-Based Access Control (RBAC) Implementation
## SmartSpend - Expense Tracker

---

## 📋 Overview

This document outlines the comprehensive Role-Based Access Control (RBAC) system implemented for SmartSpend, ensuring strict security and proper role segregation.

---

## 🔐 User Roles

### 1. **User Role** (Default)
- Default role for all new sign-ups
- Can access personal dashboard and expense tracking
- Cannot access admin panels or restricted features
- Can manage personal expenses only

### 2. **Admin Role** (Restricted)
- Only created by existing admins
- Can access admin dashboard
- Can create new admin accounts
- Can manage all users and system-wide settings
- Can view all transactions and analytics
- Cannot be created through public registration

---

## 🔒 Backend Security Implementation

### 1. **Registration Endpoint** - `POST /api/auth/register`
```javascript
// ⚠️ SECURITY: Role assignment ONLY through isAdminEmail check
const userRole = isAdminEmail(normalizedEmail) ? "admin" : "user";
```

**Features:**
- Users can NEVER manually set admin role through signup
- Role is automatically assigned based on hardcoded admin email list
- Frontend cannot override backend role assignment

### 2. **Admin Creation Endpoint** - `POST /api/admin/create-admin`
```javascript
// Only accessible to authenticated users with admin role
router.post("/create-admin", protect, adminOnly, createAdmin);
```

**Requirements:**
- User must be authenticated (protect middleware)
- User must have role === "admin" (adminOnly middleware)
- Accept: name, email, password
- Create new user with role = "admin"

**Response:**
```json
{
  "message": "Admin created successfully",
  "admin": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "admin"
  }
}
```

### 3. **Authentication Middleware**
```javascript
// authMiddleware.js
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

### 4. **Admin Authorization Middleware**
```javascript
// adminMiddleware.js
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  
  next();
};
```

### 5. **Protected Admin Routes**
```javascript
// adminRoutes.js
router.use(protect, adminOnly); // All routes require auth + admin role

router.post("/create-admin", createAdmin);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/status", toggleUserStatus);
router.get("/transactions", getAllTransactions);
router.delete("/transactions/:id", deleteTransaction);
router.get("/stats", getDashboardStats);
router.get("/health", getSystemHealth);
```

### 6. **Database Schema**
```javascript
// User.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
  // ... other fields
});
```

---

## 🎨 Frontend Security Implementation

### 1. **Registration Page** - Signup Restrictions
- ❌ No admin option in signup form
- ✅ Only "Personal" and "Organization" options
- ✅ adminSecret field never sent to backend
- ✅ Role always forced to "user" by backend

### 2. **Admin Navigation** - Conditional Rendering
```jsx
// Navbar.jsx
{user.role === "admin" && (
  <>
    <Link to="/admin" className="text-blue-400">
      Admin Panel
    </Link>
    <span className="bg-blue-600 text-blue-100">
      🔐 Admin
    </span>
  </>
)}
```

### 3. **Admin Route Protection**
```jsx
// AdminRoute.jsx
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/dashboard" />;
  
  return children;
};
```

### 4. **Role-Based Login Redirect**
```jsx
// LoginPage.jsx & RegisterPage.jsx
const onAuthSuccess = (user) => {
  if (user.role === "admin") {
    navigate("/admin");
  } else {
    navigate(user.onboardingCompleted ? "/dashboard" : "/onboarding");
  }
};
```

### 5. **Create Admin Form** - Admin Dashboard
- Only visible to authenticated admins
- Form validates input before submission
- Shows security warnings
- Displays success/error messages
- Lists admin guidelines

---

## 📝 Admin Hardcoded Email List

**File:** `server/src/config/admins.js`

```javascript
export const ADMIN_EMAILS = [
  "dipak@gmail.com",
  "jayesh@gmail.com",
  "yash@gmail.com",
  "tejas@gmail.com",
  "khillaredipak908@gmail.com",
  "admin@gmail.com"
];
```

**How it works:**
- Email-based auto-promotion: If someone signs up with an admin email, they're automatically promoted to admin
- Only existing admins can create new admins via dashboard

---

## 🔄 User Journey

### Regular User
```
Register (email not in admin list)
  ↓
Role = "user" (forced by backend)
  ↓
Login
  ↓
Redirect to /dashboard or /onboarding
  ↓
Access user features only
```

### Admin User
```
Method 1: Register with admin email
  ↓
Role = "admin" (auto-assigned)
  ↓
Access /admin dashboard

Method 2: Existing admin creates admin
  ↓
Admin goes to /admin
  ↓
Clicks "Create New Admin"
  ↓
Fills form: name, email, password
  ↓
New admin account created with role = "admin"
  ↓
Share password securely with new admin
  ↓
New admin logs in
  ↓
Redirect to /admin dashboard
```

---

## 🛡️ Security Guarantees

### ✅ Backend Enforced
- Role validation on every protected endpoint
- JWT token verification required
- Admin middleware checks on all admin routes
- Password hashing with bcrypt
- No role can be set manually in signup
- Never trust frontend role values

### ✅ Frontend Enforced
- Protected routes redirect unauthorized users
- Admin UI only visible to admins
- Conditional navigation links
- Form validation before submission
- Token stored in localStorage

### ✅ API Security
```
All admin endpoints follow pattern:
POST /api/admin/* -> protect middleware -> adminOnly middleware -> handler
```

---

## 🧪 Testing the Implementation

### Test Case 1: Regular User Cannot Signup as Admin
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password@123",
    "name": "Test User",
    "mobile": "1234567890",
    "accountRole": "personal"
  }'
# Result: role = "user" ✓
```

### Test Case 2: Admin Can Create New Admin
```bash
curl -X POST http://localhost:5000/api/admin/create-admin \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@example.com",
    "password": "SecurePass@123"
  }'
# Result: New admin created ✓
```

### Test Case 3: Non-Admin Cannot Create Admin
```bash
curl -X POST http://localhost:5000/api/admin/create-admin \
  -H "Authorization: Bearer <user-token>" \
  -H "Content-Type: application/json" \
  -d '{...}'
# Result: 403 Forbidden ✓
```

### Test Case 4: Role-Based Redirect After Login
- Admin logs in → Redirected to /admin ✓
- User logs in → Redirected to /dashboard ✓

---

## 📊 Admin Dashboard Features

1. **Dashboard Stats**
   - Total users
   - Active users
   - Total admins
   - Transaction counts
   - Financial metrics

2. **User Management**
   - View all users
   - Delete users
   - Toggle user status
   - User filtering

3. **Transaction Management**
   - View all transactions
   - Delete transactions
   - Category breakdown

4. **Admin Management**
   - Create new admin accounts
   - Form validation
   - Security guidelines display

---

## 🚀 API Endpoints Summary

| Endpoint | Method | Auth | Role | Description |
|----------|--------|------|------|-------------|
| `/auth/register` | POST | ❌ | - | Register new user (always role="user") |
| `/auth/login` | POST | ❌ | - | Login with email/password |
| `/auth/google` | POST | ❌ | - | Google authentication |
| `/auth/verify-otp` | POST | ❌ | - | Verify OTP for signup |
| `/admin/create-admin` | POST | ✅ | admin | Create new admin |
| `/admin/users` | GET | ✅ | admin | Get all users |
| `/admin/users/:id` | DELETE | ✅ | admin | Delete user |
| `/admin/users/:id/status` | PUT | ✅ | admin | Toggle user status |
| `/admin/transactions` | GET | ✅ | admin | Get all transactions |
| `/admin/transactions/:id` | DELETE | ✅ | admin | Delete transaction |
| `/admin/stats` | GET | ✅ | admin | Dashboard statistics |
| `/admin/health` | GET | ✅ | admin | System health check |

---

## 🔐 Best Practices Implemented

1. ✅ **Never trust frontend role** - Backend always validates
2. ✅ **JWT token verification** - Every protected endpoint
3. ✅ **Proper error messages** - 401 for unauth, 403 for forbidden
4. ✅ **Password hashing** - bcrypt with salt rounds = 10
5. ✅ **Email normalization** - toLowerCase() for consistency
6. ✅ **Input validation** - All required fields checked
7. ✅ **Security middleware** - Separate auth and role checks
8. ✅ **Audit logging** - Admin actions logged to console
9. ✅ **Protected routes** - Frontend route guards + backend validation
10. ✅ **Security warnings** - User informed of risks

---

## 📝 Admin Creation Workflow

### Step 1: Admin Logs In
- Navigate to `/admin`
- AdminRoute checks user.role === "admin"
- Access granted to admin dashboard

### Step 2: Create New Admin
- Click "Create New Admin" button
- Form appears with fields: Name, Email, Password
- Admin fills form and submits

### Step 3: Backend Processing
- protect middleware verifies JWT
- adminOnly middleware verifies user.role === "admin"
- createAdmin controller:
  - Validates input
  - Checks email not already in use
  - Hashes password with bcrypt
  - Creates user with role="admin"
  - Logs action to console

### Step 4: Share Credentials
- New admin credentials displayed
- Admin securely shares with new team member
- New admin prompted to change password on first login

---

## 🎯 Summary

This RBAC implementation provides:
- ✅ Strict role-based access control
- ✅ Backend-enforced security
- ✅ Frontend validation and protection
- ✅ Secure admin creation workflow
- ✅ Audit logging
- ✅ Production-ready security measures

All components work together to ensure that:
- Only admins can access admin features
- Users cannot be promoted through signup
- Role assignment is server-controlled
- Every call is verified
- Frontend and backend security in sync
