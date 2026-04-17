# SmartSpend - Multi-Tenant Organization-Based System

## Overview

SmartSpend has been upgraded to a **multi-tenant, organization-based expense management system** with strict **Role-Based Access Control (RBAC)**. This document explains the architecture, features, and usage.

---

## System Architecture

### Three Tier Role System

```
SUPER_ADMIN (System Administrator)
    ↓
ORG_ADMIN (Organization Administrator)
    ↓
ORG_USER (Organization Member)
```

---

## Role Definitions

### 1. SUPER_ADMIN
- **Count**: Only ONE user (hardcoded/seeded)
- **Permissions**:
  - Create new organizations
  - View all organizations globally
  - View all organization data
  - Manage organization structure

**Routes**:
```
POST /api/org/create                      - Create organization
GET /api/org/all                           - View all organizations
POST /api/org/add-user                     - Add users to org
POST /api/org/set-budget                   - Set user budgets
GET /api/org/transactions                  - View all org transactions
GET /api/org/analytics                     - Get org analytics
```

### 2. ORG_ADMIN
- **Count**: One or more per organization
- **Permissions**:
  - View all users in organization
  - View all expenses in organization
  - Export data (CSV/Excel)
  - Set per-user budget
  - Invite users
  - Manage user roles
  - View organization analytics

**Routes**:
```
GET /api/org/my-organization               - Get org details
GET /api/org/users                         - List org users
POST /api/org/add-user                     - Add user to org
POST /api/org/set-budget                   - Set user budget
GET /api/org/transactions                  - View all org transactions
GET /api/org/analytics                     - Get analytics
POST /api/org/remove-user                  - Remove user from org
GET /api/org/export/csv                    - Export transactions as CSV
GET /api/org/export/excel                  - Export transactions as Excel
```

### 3. ORG_USER
- **Count**: Multiple per organization
- **Permissions**:
  - Add expenses
  - View only their own expenses
  - View their budget status

**Routes**:
```
POST /api/transactions/add                 - Add transaction
GET /api/transactions                      - Get their transactions
DELETE /api/transactions/:id                - Delete their transaction
GET /api/org/my-organization               - View org info
```

---

## Database Schema

### Organization Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  orgCode: String (unique, auto-generated, uppercase),
  inviteLink: String (generated from orgCode),
  createdBy: ObjectId (SUPER_ADMIN),
  admins: [ObjectId],
  users: [ObjectId],
  description: String,
  logo: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### User Model (Updated)
```javascript
{
  // Existing fields
  name: String,
  email: String,
  password: String,
  mobile: String,
  role: String ("user" | "admin"), // Legacy
  accountRole: String ("personal" | "organization"), // Legacy
  
  // New multi-tenant fields
  orgRole: String ("SUPER_ADMIN" | "ORG_ADMIN" | "ORG_USER", default: "ORG_USER"),
  organizationId: ObjectId (ref: Organization),
  budget: Number (monthly budget limit),
  budgetPeriod: String ("weekly" | "monthly" | "yearly"),
  
  // Other fields...
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model (Updated)
```javascript
{
  userId: ObjectId (required),
  organizationId: ObjectId (required, new field),
  amount: Number,
  type: String ("income" | "expense"),
  category: String,
  notes: String,
  items: [{name: String, price: Number}],
  billImage: String,
  date: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## User Flow

### 1. SUPER_ADMIN Initialization
```bash
npm run seed-super-admin
```

Creates:
- SUPER_ADMIN user: `superadmin@smartspend.local`
- Password: `superadmin@123`
- Default test organization with code (e.g., `ORG-ABC12`)

### 2. Organization Creation
SUPER_ADMIN creates organization:
```
POST /api/org/create
{
  name: "Acme Corporation",
  description: "Main company"
}
```

Response:
```json
{
  organization: {
    _id: "...",
    name: "Acme Corporation",
    orgCode: "ORG-7X92A",
    inviteLink: "/join/org/ORG-7X92A"
  }
}
```

### 3. Users Join Organization

#### Option A: Via Organization Code
```
POST /api/org/join-by-code
{
  orgCode: "ORG-7X92A"
}
```

#### Option B: Via Invite Link
User visits: `https://smartspend.com/join-organization?code=ORG-7X92A`

### 4. OrgAdmin Invites Users
```
POST /api/org/add-user
{
  email: "john@example.com",
  assignRole: "ORG_ADMIN" | "ORG_USER"
}
```

### 5. Budget Monitoring
```
POST /api/org/set-budget
{
  userId: "...",
  budget: 50000,
  budgetPeriod: "monthly"
}
```

---

## Frontend Pages

### 1. SuperAdminDashboard
- Path: `/super-admin`
- Features:
  - View all organizations
  - Create new organizations
  - Monitor global system health

### 2. OrgAdminDashboard
- Path: `/org-admin`
- Features:
  - Overview with analytics
  - User management
  - Transaction monitoring
  - Data export (CSV/Excel)
  - Budget management

### 3. OrgUserDashboard
- Path: `/dashboard` (existing)
- Features:
  - Add expenses
  - View own expenses
  - Monitor budget

### 4. JoinOrganization
- Path: `/join-organization`
- Features:
  - Enter organization code
  - Auto-fill from invite link

---

## Access Control Implementation

### Backend Middleware
```javascript
// Verify user role
authorize(["SUPER_ADMIN"])         // Only SUPER_ADMIN
authorize(["ORG_ADMIN"])           // Only ORG_ADMIN
authorize(["ORG_ADMIN", "ORG_USER"]) // Either ORG_ADMIN or ORG_USER

// Verify organization membership
requireOrganization()              // User must have organizationId

// Verify same organization
verifyOrgAccess()                  // Cannot access other org's data
```

### Data Isolation

**ORG_USER**:
- Can only view/edit their own transactions
- Can only see their own budget

**ORG_ADMIN**:
- Can view all transactions in their organization
- Cannot access other organizations

**SUPER_ADMIN**:
- Can see all data globally

---

## Export Functionality

### CSV Export
```
GET /api/org/export/csv?startDate=2024-01-01&endDate=2024-12-31&category=Food
```

Includes columns:
- User Name
- Email
- Amount
- Type (Income/Expense)
- Category
- Date
- Notes

### Excel Export
```
GET /api/org/export/excel
```

Creates workbook with:
- **Transactions Sheet**: Detailed transaction data
- **Summary Sheet**: Total expenses, income, net balance

---

## Budget System

### Features
- Set monthly/weekly/yearly budgets per user
- Track spending against budget
- Display budget progress (% used)
- Alert when budget exceeded

### Implementation
```javascript
// Check if user exceeded budget
const totalExpenses = await Transaction.aggregate([
  { $match: { userId, organizationId, type: "expense", date: { $gte: startDate, $lte: endDate } } },
  { $group: { _id: null, total: { $sum: "$amount" } } }
]);

if (totalExpenses[0]?.total > user.budget) {
  // Send alert/notification
  // Highlight in UI
}
```

---

## Security Rules

### 1. Server-Side Enforcement
- Always validate `organizationId` in requests
- Never trust frontend role
- Verify user belongs to claimed organization
- Use middleware for role checks

### 2. Token Management
- JWT token contains user ID and role
- Token verified on every request
- Role checked in middleware

### 3. Data Isolation
- All queries filtered by `organizationId`
- Users cannot access other org data
- Admin operations verify org membership

### 4. Audit Trail
- All critical actions logged
- Consider adding: who, what, when, where

---

## Invite System

### Generate Invite Link
```javascript
const orgCode = "ORG-ABC12";
const inviteLink = `/join/org/${orgCode}`;
// Full URL: https://smartspend.com/join/org/ORG-ABC12
```

### Share Invitation
```
You're invited to join: Acme Corporation
Code: ORG-ABC12
Link: https://smartspend.com/join/org/ORG-ABC12
```

### User joins via link
```
1. User clicks link
2. Org code auto-filled: ORG-ABC12
3. User submits form
4. User assigned as ORG_USER
5. Redirected to dashboard
```

---

## API Endpoints Summary

### Organization Management
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/org/create` | SUPER_ADMIN | Create organization |
| GET | `/api/org/all` | SUPER_ADMIN | Get all organizations |
| GET | `/api/org/my-organization` | Any | Get user's organization |
| POST | `/api/org/join-by-code` | Any | Join org by code |

### User Management
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/org/add-user` | ORG_ADMIN | Add user to org |
| GET | `/api/org/users` | ORG_ADMIN | List org users |
| POST | `/api/org/set-budget` | ORG_ADMIN | Set user budget |
| POST | `/api/org/remove-user` | ORG_ADMIN | Remove user |

### Transaction Management
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/transactions/add` | ORG_USER+ | Add transaction |
| GET | `/api/transactions` | ORG_USER+ | Get transactions |
| DELETE | `/api/transactions/:id` | ORG_USER+ | Delete transaction |
| GET | `/api/org/transactions` | ORG_ADMIN | Get all org transactions |

### Analytics & Export
| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| GET | `/api/org/analytics` | ORG_ADMIN | Get org analytics |
| GET | `/api/org/export/csv` | ORG_ADMIN | Export as CSV |
| GET | `/api/org/export/excel` | ORG_ADMIN | Export as Excel |

---

## Setup Instructions

### Backend Setup
```bash
cd server
npm install

# Add these to .env
MONGO_URI=mongodb://localhost:27017/smartspend
JWT_SECRET=your_secret_key

# Seed SUPER_ADMIN
npm run seed-super-admin

# Start server
npm run dev
```

### Frontend Setup
```bash
cd client
npm install

# Update API base URL in .env if needed
VITE_API_URL=http://localhost:5000

npm run dev
```

### Access System
1. **SUPER_ADMIN**: Login with `superadmin@smartspend.local`
2. **ORG_ADMIN**: Create organization and add users as admins
3. **ORG_USER**: Join organization or be invited

---

## Testing Checklist

- [ ] SUPER_ADMIN can create organizations
- [ ] SUPER_ADMIN can view all organizations
- [ ] ORG_ADMIN can view org users and transactions
- [ ] ORG_ADMIN can set user budgets
- [ ] ORG_ADMIN can export CSV/Excel
- [ ] ORG_USER can only see own transactions
- [ ] ORG_USER cannot access other org data
- [ ] Users can join by code
- [ ] Users can join by invite link
- [ ] Budget alerts trigger correctly
- [ ] Data export includes correct data
- [ ] Role middleware enforces permissions

---

## Future Enhancements

1. **Audit Logging**: Track all organization activities
2. **Bulk User Import**: CSV upload for user management
3. **Advanced Reporting**: Custom date ranges, filters
4. **Notifications**: Email alerts for budget overspend
5. **Teams**: Sub-groups within organization
6. **Approval Workflow**: For high-value transactions
7. **Two-Factor Authentication**: Enhanced security
8. **API Keys**: For third-party integrations
9. **Webhooks**: Real-time event notifications
10. **Custom Branding**: Logo, colors, domain per org

---

## Support & Troubleshooting

### User can't login
- Verify email in database
- Check if organizationId is NULL
- Run seed script if needed

### Can't join organization
- Verify organization code exists
- Check if organization is active
- Ensure user not already in org

### Export fails
- Check if user is ORG_ADMIN
- Verify organization has transactions
- Check disk space for file generation

### Budget not updating
- Verify budget is set for user
- Check transaction dates are correct
- Ensure transactions are in same organization

---

## File Structure

```
Backend:
├── models/
│   ├── User.js (updated)
│   ├── Transaction.js (updated)
│   └── Organization.js (new)
├── controllers/
│   ├── orgController.js (new)
│   ├── exportController.js (new)
│   └── transactionController.js (updated)
├── middleware/
│   └── roleMiddleware.js (new)
├── routes/
│   ├── orgRoutes.js (new)
│   └── transactionRoutes.js (updated)
└── seed-super-admin.js (new)

Frontend:
├── pages/
│   ├── SuperAdminDashboard.jsx (new)
│   ├── OrgAdminDashboard.jsx (new)
│   └── JoinOrganization.jsx (new)
├── components/
│   ├── OrganizationRoute.jsx (new)
│   ├── Navbar.jsx (updated)
│   └── App.jsx (updated)
└── context/
    └── AuthContext.jsx (updated)
```

---

## Version History

- **v2.0.0**: Multi-tenant organization system with RBAC
- **v1.0.0**: Original expense tracker

---

## License

MIT

