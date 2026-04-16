# SmartSpend Authentication System - Testing Guide

## 🧪 Pre-Testing Setup

### **1. Database Cleanup**

Before testing, clean up any existing admin records:

```bash
# Connect to MongoDB and run:
# If using MongoDB compass or CLI:
db.users.deleteMany({ role: "admin" })

# Verify no admins exist:
db.users.find({ role: "admin" })
# Should return empty
```

### **2. Verify Environment Variables**

Check `.env` file has:
```env
MONGO_URI=mongodb://...
PORT=5000
JWT_SECRET=your-secret
```

### **3. Start Backend**

```bash
cd server
npm install
npm start
# Should see: "Server running on port 5000"
```

### **4. Start Frontend**

```bash
cd client
npm install
npm start
# Should see Vite dev server running
```

---

## ✅ Test Case 1: Admin Login

**Objective**: Verify hardcoded admin can login

### **Steps**:
1. Go to login page: `http://localhost:5173/login`
2. Enter email: `admin@gmail.com`
3. Enter password: `Admin@123`
4. Click "Login" or "Admin Login"
5. Submit form

### **Expected Results**:
- ✅ Request sent to `POST /api/auth/login`
- ✅ Backend checks isHardcodedAdmin() → returns true
- ✅ Response includes token with `role: "admin"`
- ✅ Response includes user object: `{ id: "admin", role: "admin", email: "admin@gmail.com" }`
- ✅ Frontend redirects to `/admin`
- ✅ Admin dashboard loads
- ✅ Can access user management, transactions, analytics

### **Validation**:
```javascript
// In browser console, after login:
console.log(localStorage.getItem("token"))
// Should contain: {"id":"admin","role":"admin"...}

console.log(localStorage.getItem("user"))
// Should contain: {"role":"admin"...}
```

### **Expected Token Payload**:
```json
{
  "id": "admin",
  "role": "admin",
  "iat": 1713312000,
  "exp": 1713916800
}
```

---

## ✅ Test Case 2: Regular User Login

**Objective**: Verify regular users can still login

### **Steps**:
1. Create test user via signup (or use seed user)
   - Email: `testuser@smartspend.local`
   - Password: `testuser@123`
2. Go to login page
3. Enter regular user credentials
4. Submit form

### **Expected Results**:
- ✅ Request sent to `POST /api/auth/login`
- ✅ Backend checks isHardcodedAdmin() → returns false
- ✅ Looks up user in database
- ✅ Password validated
- ✅ Response includes token with `role: "user"`
- ✅ Response includes user object with MongoDB _id
- ✅ Frontend redirects to `/dashboard`
- ✅ Dashboard loads (but NOT admin dashboard)

### **Validation**:
```javascript
// In browser console:
console.log(localStorage.getItem("user"))
// Should contain: {"_id":"...", "role":"user"...}
// NOT role:"admin"
```

### **Expected Token Payload**:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "role": "user",
  "iat": 1713312000,
  "exp": 1713916800
}
```

---

## ✅ Test Case 3: Admin Route Protection

**Objective**: Verify non-admin users cannot access admin endpoints

### **Steps**:
1. Login as regular user
2. Try to access `/admin` directly
   - Browser: `http://localhost:5173/admin`
   - Should redirect to /dashboard
3. Try to access admin API endpoint directly:
   ```bash
   curl -H "Authorization: Bearer {user-token}" http://localhost:5000/api/admin/users
   ```

### **Expected Results**:
- ✅ Frontend: Redirected away from `/admin`
- ✅ Backend: Returns `403 Forbidden`
- ✅ Error message: "Access denied. Admin access required."

### **Frontend Code Check**:
```javascript
// AdminRoute.jsx should check:
if (user?.role !== "admin") {
  return <Navigate to="/dashboard" replace />;
}
```

---

## ✅ Test Case 4: User Cannot Register as Admin

**Objective**: Verify admin@gmail.com cannot be used for signup

### **Steps**:
1. Go to signup page: `/register`
2. Enter form details:
   - Name: "Test Admin"
   - Email: `admin@gmail.com`
   - Password: `Test@123`
3. Click "Sign Up"

### **Expected Results**:
- ✅ `POST /api/auth/register` responds with 400 error
- ✅ Error message: "admin@gmail.com is reserved for hardcoded admin"
- ✅ User NOT created in database
- ✅ Cannot proceed with signup

### **Backend Code**:
```javascript
// authController.js should have:
if (normalizedEmail === "admin@gmail.com") {
  return res.status(400).json({ message: "..." });
}
```

---

## ✅ Test Case 5: Google Auth Creates User Role

**Objective**: Verify Google auth always creates "user" role

### **Steps**:
1. (If Google OAuth configured)
2. Go to login/signup
3. Click "Login with Google"
4. Complete Google auth flow
5. New user created

### **Expected Results**:
- ✅ User created in database
- ✅ User has `role: "user"` (NOT "admin")
- ✅ Token has `role: "user"`
- ✅ Cannot access admin routes

### **Database Verification**:
```bash
db.users.findOne({ email: "user@gmail.com" })
# Should show: role: "user"
```

---

## ✅ Test Case 6: OTP Auth Creates User Role

**Objective**: Verify OTP signup always creates "user" role

### **Steps**:
1. Go to signup page
2. Enter phone number: `+919876543210`
3. Request OTP
4. Enter OTP received
5. Set password

### **Expected Results**:
- ✅ User created with `role: "user"`
- ✅ Token has `role: "user"`
- ✅ Redirects to `/dashboard` (not `/admin`)

---

## ✅ Test Case 7: Admin Endpoints Protected

**Objective**: Verify all admin endpoints require admin role

### **Steps**:
1. Login as regular user
2. Try each endpoint:
   ```bash
   # Get users
   GET http://localhost:5000/api/admin/users
   
   # Get transactions
   GET http://localhost:5000/api/admin/transactions
   
   # Get stats
   GET http://localhost:5000/api/admin/stats
   ```

### **Expected Results**:
- ✅ All return `403 Forbidden`
- ✅ Message: "Access denied. Admin access required."

### **Steps**:
1. Login as admin (admin@gmail.com / Admin@123)
2. Try same endpoints

### **Expected Results**:
- ✅ All return `200 OK`
- ✅ Data returned successfully

---

## ✅ Test Case 8: Admin Creation Endpoint Disabled

**Objective**: Verify createAdmin endpoint returns error

### **Steps**:
1. As admin, try to call:
   ```bash
   POST http://localhost:5000/api/admin/create-admin
   body: { email: "newemail@gmail.com", password: "Pass@123" }
   ```

### **Expected Results**:
- ✅ Returns `403 Forbidden`
- ✅ Message: "Admin creation is disabled. There is only one hardcoded admin in the system."
- ✅ No new admin created

---

## ✅ Test Case 9: Token Expiration

**Objective**: Verify expired tokens are rejected

### **Steps**:
1. Get a valid token from login
2. Wait for token to expire (7 days, or modify JWT_EXPIRES in code)
3. Try to access protected route:
   ```bash
   GET http://localhost:5000/api/admin/users
   ```

### **Expected Results**:
- ✅ Returns `401 Unauthorized`
- ✅ Error message: "Token expired" or "Invalid token"
- ✅ Frontend redirects to login

---

## ✅ Test Case 10: Invalid Credentials

**Objective**: Verify invalid credentials rejected

### **Steps**:
1. Try admin login with wrong password:
   - Email: `admin@gmail.com`
   - Password: `WrongPassword`
2. Try regular user with wrong password

### **Expected Results**:
- ✅ Returns `401 Unauthorized`
- ✅ Error message: "Invalid email or password"
- ✅ No token returned

---

## 🔍 Backend Debugging

### **Check Token Generation**

```bash
# Add to authController.js login function:
console.log("Generated token payload:", {
  id: id || "admin",
  role: role || "admin"
});
```

### **Check Middleware**

```bash
# Add to authMiddleware.js:
console.log("Decoded token:", decoded);
console.log("User from database:", user);
console.log("Attached req.user:", req.user);
```

### **Check Admin Validation**

```bash
# Add to adminMiddleware.js:
console.log("User role:", req.user?.role);
console.log("Is admin?", req.user?.role === "admin");
```

---

## 🔍 Frontend Debugging

### **Check LocalStorage**

```javascript
// In browser console after login:
console.log("Stored token:", localStorage.getItem("token"));
console.log("Stored user:", localStorage.getItem("user"));

// Decode token to verify role:
const token = localStorage.getItem("token");
const payload = JSON.parse(atob(token.split(".")[1]));
console.log("Token payload:", payload);
```

### **Check Navigation**

```javascript
// In LoginPage.jsx, add console log:
axios.post("/api/auth/login", ...)
  .then(res => {
    console.log("Login response:", res.data);
    console.log("User role:", res.data.user.role);
    if (res.data.user.role === "admin") {
      console.log("Navigating to /admin");
      navigate("/admin");
    } else {
      console.log("Navigating to /dashboard");
      navigate("/dashboard");
    }
  })
```

---

## 📊 Test Results Summary

Use this table to track test results:

| Test Case | Description | Status | Notes |
|-----------|-------------|--------|-------|
| 1 | Admin login | ⏳ | pending |
| 2 | User login | ⏳ | pending |
| 3 | Admin route protection | ⏳ | pending |
| 4 | Admin signup blocked | ⏳ | pending |
| 5 | Google auth → user role | ⏳ | pending |
| 6 | OTP auth → user role | ⏳ | pending |
| 7 | Admin endpoints protected | ⏳ | pending |
| 8 | Admin creation disabled | ⏳ | pending |
| 9 | Token expiration | ⏳ | pending |
| 10 | Invalid credentials | ⏳ | pending |

---

## 🚨 Troubleshooting

### **Admin login not working**

```bash
# 1. Check admins.js
grep -n "isHardcodedAdmin" server/src/config/admins.js

# 2. Check token.js has role parameter
grep -n "role" server/src/utils/token.js

# 3. Test hardcoded credentials manually
node -e "
import {isHardcodedAdmin} from './server/src/config/admins.js';
console.log(isHardcodedAdmin('admin@gmail.com', 'Admin@123'));
// Should print: true
"

# 4. Check auth middleware
grep -A 5 "id.*admin" server/src/middleware/authMiddleware.js
```

### **User getting 403 on admin endpoints**

```bash
# 1. Check user was created with role="user"
db.users.findOne({email: "testuser@..."})
# Should show: role: "user"

# 2. Check token has correct role
# Run test case 2 and check token payload

# 3. Check adminOnly middleware
grep -n "adminOnly" server/src/middleware/adminMiddleware.js
```

### **Cannot signup regular user**

```bash
# Check registration endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"Test@123"}'

# Should return 201 with user and token
```

---

## ✅ All Tests Passing Checklist

- [ ] Admin login works
- [ ] Regular user login works
- [ ] Admin routes only accessible to admin
- [ ] Regular users redirected from /admin
- [ ] Cannot signup with admin@gmail.com
- [ ] Google auth creates "user" role
- [ ] OTP auth creates "user" role
- [ ] Admin endpoints return 403 for users
- [ ] Admin endpoints work for admin
- [ ] Token includes role
- [ ] Expired tokens rejected
- [ ] Invalid credentials rejected
- [ ] createAdmin endpoint disabled
- [ ] No admin users in database (except test if needed)
- [ ] All middleware working correctly

---

**System is production-ready when all tests pass! ✅**
