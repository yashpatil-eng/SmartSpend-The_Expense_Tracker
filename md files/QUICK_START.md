# SmartSpend Multi-Tenant - Quick Start Guide

## 🚀 30-Minute Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- Git

### Step 1: Clone & Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Step 2: Configure Environment

**Server** `.env`:
```
MONGO_URI=mongodb://localhost:27017/smartspend
JWT_SECRET=your_super_secret_key_123
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Client** `.env`:
```
VITE_API_URL=http://localhost:5000
```

### Step 3: Initialize Database

```bash
cd server

# Seed SUPER_ADMIN user
npm run seed-super-admin

# Output:
# ✓ SUPER_ADMIN user created successfully!
#   Email: superadmin@smartspend.local
#   Password: superadmin@123
# ✓ Test Organization created successfully!
#   Organization Code: ORG-ABC12
```

### Step 4: Start Servers

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
# Frontend running on http://localhost:5173
```

### Step 5: Login & Test

Open http://localhost:5173

**Login as SUPER_ADMIN**:
- Email: `superadmin@smartspend.local`
- Password: `superadmin@123`

---

## 🎯 Common Tasks

### Task 1: Create New Organization

As SUPER_ADMIN:
1. Go to `/super-admin` dashboard
2. Click "+ Create Organization"
3. Enter organization name
4. Get organization code (e.g., `ORG-XYZ99`)
5. Share code with users

### Task 2: Invite Users

**Method A - By Email (as ORG_ADMIN)**:
1. Go to Organization Dashboard → Users tab
2. Click "+ Add User"
3. Enter user email
4. Select role: ORG_USER or ORG_ADMIN
5. Click "Add User"

**Method B - By Invite Link**:
1. Share link: `http://localhost:5173/join/org/ORG-XYZ99`
2. User opens link
3. Code auto-fills
4. User joins organization

**Method C - By Organization Code**:
1. User navigates to `/join-organization`
2. Enters code: `ORG-XYZ99`
3. Joins organization

### Task 3: Add Expense

As ORG_USER:
1. Click "Dashboard"
2. Click "Add Expense"
3. Fill details:
   - Amount
   - Category
   - Date
   - Notes (optional)
   - Bill image (optional)
4. Click "Save"

### Task 4: Set User Budget

As ORG_ADMIN:
1. Go to "Organization" → "Users" tab
2. Find user
3. Click "Set Budget"
4. Enter budget amount
5. Select period (Weekly/Monthly/Yearly)
6. Click "Save Budget"

### Task 5: Export Data

As ORG_ADMIN:
1. Go to "Organization" → "Export" tab
2. Click "Export as CSV" or "Export as Excel"
3. File downloads to computer

---

## 🔑 Default Credentials

After running `npm run seed-super-admin`:

```
Role: SUPER_ADMIN
Email: superadmin@smartspend.local
Password: superadmin@123

Organization Code: ORG-XXXXX (generated, see console)
```

⚠️ **Change password after first login!**

---

## 📱 Roles & Permissions

### SUPER_ADMIN
```
✓ Create organizations
✓ View all organizations
✓ Manage system
```

### ORG_ADMIN
```
✓ View organization users
✓ Add/remove users
✓ View all org transactions
✓ View org analytics
✓ Set user budgets
✓ Export data (CSV/Excel)
```

### ORG_USER
```
✓ Add expenses
✓ View own expenses
✓ View own budget
✓ View organization name
```

---

## 🛠️ Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Start MongoDB: mongod
2. Or use MongoDB Atlas (cloud)
3. Update MONGO_URI in .env
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000

Solution 1: Change PORT in .env (e.g., PORT=5001)
Solution 2: Kill process using port:
  - Windows: netstat -ano | findstr :5000
  - Mac/Linux: lsof -i :5000
```

### SUPER_ADMIN Not Created
```
Solution: Run seed script again
  npm run seed-super-admin
```

### User Can't Join Organization
```
Check:
1. Organization code exists (ask ORG_ADMIN)
2. Code format is correct (ORG-XXXXX)
3. User not already in organization
```

### Can't See Transactions
```
Check:
1. User belongs to organization
2. Transactions belong to same org
3. User is ORG_ADMIN (to see all)
```

---

## 📊 Example Workflow

### Scenario: Acme Corp Expense Tracking

**Day 1: Setup**
```
1. Admin creates account
2. Seeds SUPER_ADMIN
3. SUPER_ADMIN creates "Acme Corporation" org
4. Gets code: ORG-ACME01
```

**Day 2: Invite Team**
```
1. ORG_ADMIN logs in
2. Goes to Users tab
3. Adds 3 employees:
   - john@acme.com (ORG_USER)
   - jane@acme.com (ORG_USER)
   - bob@acme.com (ORG_ADMIN)
4. Sets monthly budget: 50,000 per person
```

**Day 3: Track Expenses**
```
Employees add expenses:
- John: 5,000 (Food)
- Jane: 3,000 (Travel)
- Bob: 7,000 (Equipment)

Total: 15,000 / 50,000 (30%)
```

**Day 4: Report**
```
1. Bob exports data
2. Gets Excel file with:
   - All transactions
   - Summary stats
   - By-category breakdown
3. Reviews analytics
```

---

## 📚 Documentation

- **[Full Guide](./MULTITENANT_GUIDE.md)** - Complete system documentation
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[README](./README.md)** - Project overview

---

## 🔐 Security Tips

1. ✅ Change SUPER_ADMIN password immediately
2. ✅ Use strong JWT_SECRET
3. ✅ Enable HTTPS in production
4. ✅ Configure CORS properly
5. ✅ Use environment variables for secrets
6. ✅ Set MongoDB authentication
7. ✅ Enable rate limiting
8. ✅ Keep dependencies updated

---

## 🧪 Quick Test

```bash
# Test API is running
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","message":"SmartSpend API is running"}
```

---

## 📞 Need Help?

Check:
1. **Console errors** - Terminal output often shows issues
2. **Network tab** - Browser DevTools for API errors
3. **MongoDB logs** - Connection issues
4. **Seed script output** - Check credentials after seeding

---

## ✨ Next Steps

After setup:
1. ✅ Test all three roles (SUPER_ADMIN, ORG_ADMIN, ORG_USER)
2. ✅ Create test organization
3. ✅ Invite test users
4. ✅ Add test transactions
5. ✅ Test export functionality
6. ✅ Review analytics
7. ✅ Check budget tracking

---

## 🎉 Ready to Go!

Your SmartSpend multi-tenant system is ready to use!

**Questions?** See full docs: [MULTITENANT_GUIDE.md](./MULTITENANT_GUIDE.md)

Happy expense tracking! 🚀

