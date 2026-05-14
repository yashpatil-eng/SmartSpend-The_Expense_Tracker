# 🧪 Organization System - Setup & Testing Guide

## ✅ Installation & Setup

### **Step 1: Backend Setup**

1. **Verify all files are in place:**
   - ✅ `server/src/controllers/orgController.js` (updated)
   - ✅ `server/src/routes/orgRoutes.js` (updated)

2. **No new dependencies needed** - All existing packages support this feature

3. **Start the server:**
   ```bash
   cd server
   npm start
   ```

### **Step 2: Frontend Setup**

1. **Verify all files are in place:**
   - ✅ `client/src/context/OrganizationContext.jsx` (new)
   - ✅ `client/src/hooks/useOrganization.js` (new)
   - ✅ `client/src/components/auth/OrganizationSetup.jsx` (new)
   - ✅ `client/src/components/dashboard/OrganizationPanel.jsx` (new)
   - ✅ `client/src/pages/OnboardingPage.jsx` (updated)
   - ✅ `client/src/pages/Dashboard.jsx` (updated)
   - ✅ `client/src/main.jsx` (updated)

2. **No new dependencies needed** - Uses existing lucide-react icons

3. **Start the dev server:**
   ```bash
   cd client
   npm run dev
   ```

---

## 🧪 Testing Scenarios

### **Test 1: User Creates Organization**

**Prerequisites**: None (new user)

**Steps**:
1. Navigate to registration page
2. Register with email and password
3. Click "Register"
4. Should be redirected to Onboarding (Step 1)
5. See "Join Organization?" screen
6. Click "Create Organization" button
7. Enter organization name (e.g., "Sales Team")
8. Click "Create Organization"
9. Wait for success (loading spinner should appear)
10. Should see success screen with organization code

**Expected Results**:
- ✅ Organization code displayed (format: `ORG-XXXXX`)
- ✅ Copy button visible and functional
- ✅ "Redirecting to dashboard" message shown
- ✅ After 2 seconds, redirected to Onboarding Step 2

**Verify**:
- [ ] Organization code can be copied to clipboard
- [ ] Code format is correct
- [ ] Step 2 (Profile Setup) shows org name in success banner

---

### **Test 2: User Joins Organization**

**Prerequisites**: 
- Organization code from Test 1
- Second user account

**Steps**:
1. Register as second user
2. Go to Onboarding Step 1
3. Click "Join Organization"
4. Enter organization code from Test 1
5. Click "Join Organization"
6. Wait for success

**Expected Results**:
- ✅ No error messages
- ✅ Redirected to Step 2
- ✅ Both users now in same organization

**Verify**:
- [ ] Check if error shown for invalid code
- [ ] Try code in different cases (lowercase, uppercase, mixed)

---

### **Test 3: Dashboard Organization Panel**

**Prerequisites**: User in organization (from Test 1 or 2)

**Steps**:
1. Complete onboarding (Steps 1 & 2)
2. Navigate to Dashboard
3. Look for OrganizationPanel (blue box with organization info)
4. Verify organization name shows correctly

**Expected Results**:
- ✅ OrganizationPanel visible
- ✅ Organization name displayed
- ✅ Organization code displayed
- ✅ Copy button visible
- ✅ Member count shown
- ✅ Admin count shown
- ✅ Members list visible

**Interactions**:
- [ ] Click copy button - should show "Copied!" feedback
- [ ] Click refresh button - should reload members
- [ ] Verify member names and roles display correctly

---

### **Test 4: Join Organization Later**

**Prerequisites**: 
- User account without organization
- Organization code from previous user

**Steps**:
1. Register new user
2. Go to onboarding and click "Skip for Now"
3. Go to Dashboard
4. Should see "Join Organization" section (blue box)
5. Enter organization code
6. Click "Join" button

**Expected Results**:
- ✅ Section visible on dashboard
- ✅ Code input field works
- ✅ Successfully joins organization
- ✅ OrganizationPanel appears after joining
- ✅ Dashboard auto-refreshes

---

### **Test 5: Error Handling**

**Prerequisites**: User not in organization

**Test Invalid Code**:
1. In "Join Organization" section
2. Enter random code (e.g., `INVALID-12345`)
3. Click "Join"

**Expected Results**:
- ✅ Error message: "Invalid organization code"
- [ ] Error clears when user enters new code

**Test Already in Organization**:
1. User 1 in organization
2. Try to join same organization again (if allowed in UI)

**Expected Results**:
- ✅ Error message: "User already belongs to this organization"
- [ ] User stays in same organization

**Test Network Error**:
1. Stop backend server
2. Try to create/join organization
3. Should show error

**Expected Results**:
- ✅ Error message displayed
- ✅ Loading state ends
- ✅ Can retry after server is back

---

### **Test 6: Multi-Organization Scenario**

**Prerequisites**: Multiple users

**Scenario**:
1. User A creates "Marketing" organization
2. User B creates "Sales" organization
3. User C joins "Marketing" (User A's org)
4. User A's dashboard shows C in members
5. User C's dashboard shows A in members

**Expected Results**:
- ✅ Each organization is separate
- ✅ Members only see their organization
- ✅ Codes are unique
- ✅ No cross-organization data visibility

---

## 🔍 Manual Testing Checklist

### **Frontend UI**
- [ ] OrganizationSetup component renders correctly
- [ ] All buttons are clickable and functional
- [ ] Forms validate input (require org name for create)
- [ ] Error messages display properly
- [ ] Loading states show during async operations
- [ ] Buttons are disabled during loading
- [ ] Copy button provides visual feedback
- [ ] OrganizationPanel shows when user is in org
- [ ] OrganizationPanel hides when user not in org
- [ ] Members list updates when refreshed
- [ ] Responsive design works on mobile

### **Backend API**
- [ ] POST /api/org/create-personal creates organization
- [ ] Generated code is unique (check multiple creates)
- [ ] User must be authenticated (401 without token)
- [ ] User can't create multiple orgs
- [ ] User can join organization with valid code
- [ ] User can't rejoin same organization
- [ ] GET /api/org/my-organization returns current org
- [ ] GET /api/org/users returns members list
- [ ] Error messages are descriptive

### **Data Flow**
- [ ] Organization data persists in database
- [ ] User organizationId updates correctly
- [ ] Members array includes all users
- [ ] Org code is immutable after creation
- [ ] Code is case-insensitive on join but case-preserved in DB

---

## 🐛 Known Limitations & Future Work

### **Current Limitations**:
1. Users can create multiple organizations (if they leave previous ones)
2. No "Leave Organization" functionality yet
3. Members join as regular users (admins managed separately)
4. No organization settings/admin panel yet
5. Can't invite members directly by email (must share code)

### **Future Enhancements**:
- [ ] Leave organization feature
- [ ] Organization management dashboard
- [ ] Direct member invitations by email
- [ ] Organization settings (name, description, logo)
- [ ] Custom member roles and permissions
- [ ] Organization activity log
- [ ] Bulk member management
- [ ] Department/team subdivisions

---

## 📊 Database Queries for Testing

### **Check Organization was Created**:
```javascript
db.organizations.findOne({ name: "Sales Team" })
```

### **Check User was Updated**:
```javascript
db.users.findOne({ email: "user@example.com" }).organizationId
```

### **List All Members of Organization**:
```javascript
db.organizations.findOne({ _id: ObjectId("...") }).users
```

### **Verify Code Uniqueness**:
```javascript
db.organizations.find({ orgCode: { $regex: "ORG-" } }).count()
```

---

## 🚨 Troubleshooting

### **Issue: OrganizationPanel doesn't show on Dashboard**
- [ ] Check if user has organizationId in database
- [ ] Verify fetchMyOrganization() is called in useEffect
- [ ] Check browser console for errors
- [ ] Verify OrganizationProvider is in main.jsx

### **Issue: Copy button doesn't work**
- [ ] Check if browser supports Clipboard API
- [ ] Verify user has permission to clipboard
- [ ] Check browser console for errors
- [ ] Try in different browser

### **Issue: Join fails with error**
- [ ] Verify organization code is correct (case-insensitive)
- [ ] Check if user already in organization
- [ ] Verify organization isActive = true
- [ ] Check if user is authenticated

### **Issue: Organization not showing after create**
- [ ] Refresh page to sync context
- [ ] Check if API returned organization object
- [ ] Verify response has orgCode property
- [ ] Check network tab for API response

---

## 📱 Mobile Testing

**Devices to Test**:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] iPad (Safari)
- [ ] Desktop (Chrome, Firefox, Edge)

**Responsive Tests**:
- [ ] Forms stack vertically on small screens
- [ ] Copy button is touch-friendly (minimum 44x44px)
- [ ] OrganizationPanel card is readable on small screens
- [ ] Member list scrolls if too long

---

## 🔐 Security Testing

**Authentication**:
- [ ] Unauthenticated requests return 401
- [ ] Invalid token returns 401
- [ ] Expired token returns 401

**Authorization**:
- [ ] User A can't see User B's org (if separate)
- [ ] User not in org can't see member list
- [ ] Only admins can manage members (future)

**Input Validation**:
- [ ] XSS injection attempts blocked
- [ ] SQL injection attempts blocked
- [ ] Empty strings rejected
- [ ] Very long strings handled

---

## 📈 Performance Testing

**Load Testing**:
- [ ] Create 100 organizations (should be instant)
- [ ] Load organization with 1000 members (should be <2s)
- [ ] Refresh members list multiple times (no lag)

**Memory**:
- [ ] No memory leaks on repeated joins/leaves
- [ ] Context cleans up properly
- [ ] Network tab shows expected requests

---

## ✅ Final Verification

Before considering this complete:

```
Backend:
  ✅ POST /api/org/create-personal works
  ✅ No SQL injection vulnerabilities
  ✅ Proper error handling

Frontend:
  ✅ All components render without errors
  ✅ All interactions work smoothly
  ✅ Responsive design works
  ✅ Copy functionality works

Integration:
  ✅ Create org → appears on dashboard
  ✅ Join org → members list updates
  ✅ Skip org → can join later
  ✅ State persists after refresh
```

---

**Test Status**: Ready for QA  
**Expected Issues**: None  
**Rollback Plan**: Revert changes to 2 backend files and 7 frontend files
