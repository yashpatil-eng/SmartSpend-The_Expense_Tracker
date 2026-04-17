# SmartSpend - AI Powered Multi-Tenant Expense Tracker

## 🎯 Overview
SmartSpend is now a **multi-tenant, organization-based expense management system** with strict **Role-Based Access Control (RBAC)**.

- **SUPER_ADMIN**: Manage multiple organizations globally
- **ORG_ADMIN**: Manage organization users, budgets, and exports
- **ORG_USER**: Track personal expenses within organization

For detailed documentation on the multi-tenant system, see [MULTITENANT_GUIDE.md](./MULTITENANT_GUIDE.md)

## Tech Stack
- Frontend: React (Vite), TailwindCSS, Axios, React Router, Recharts
- Backend: Node.js, Express, MongoDB (Mongoose), JWT
- Export: json2csv, ExcelJS
- AI Insights: Rule-based intelligent suggestions from spending behavior

## Project Structure
```
SmartSpend/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express)
├── MULTITENANT_GUIDE.md   # Multi-tenant system documentation
└── README.md
```

## Setup Instructions

### 1) Backend Setup
```bash
cd server
npm install

# Configure .env file (copy from env.example)
cp env.example .env

# Configure your MongoDB and JWT settings
# MONGO_URI=mongodb://localhost:27017/smartspend
# JWT_SECRET=your_secret_key

# Seed SUPER_ADMIN user and test organization
npm run seed-super-admin

# Start development server
npm run dev
```

### 2) Frontend Setup
```bash
cd client
npm install

# Configure .env file if needed (copy from env.example)
cp env.example .env

# Start development server
npm run dev
```

### 3) Access the Application
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### 4) First Login
```
Email: superadmin@smartspend.local
Password: superadmin@123
```

## Core Features

### ✅ Implemented
- JWT authentication with protected routes
- Multi-tenant organization system
- Three-tier role-based access control
- Organization creation and management
- User invitation system (by code or link)
- Per-user monthly budget management
- Organization data export (CSV, Excel)
- Onboarding flow for financial profile
- Expense CRUD with filters
- Smart dashboard with analytics
- Personalized AI insights
- Mini monthly calculator
- Transaction import/export

### 🔒 Security Features
- Server-side role validation
- Data isolation per organization
- Organization membership verification
- JWT token-based authentication
- Middleware-based access control

## Multi-Tenant Architecture

### Organization Flow
```
1. SUPER_ADMIN creates organization
   └─ Generates unique org code (ORG-ABC12)
   └─ Creates invite link (/join/org/ORG-ABC12)

2. Users join organization
   └─ Via code: POST /api/org/join-by-code
   └─ Via link: /join-organization?code=ORG-ABC12

3. ORG_ADMIN manages users
   └─ Add users by email
   └─ Assign roles (ORG_ADMIN, ORG_USER)
   └─ Set per-user budgets

4. ORG_USER tracks expenses
   └─ Add/view own transactions
   └─ Monitor budget
```

### Databases
- **User**: email, role, organization_id, budget
- **Organization**: name, orgCode, admins, users
- **Transaction**: amount, type, category, organization_id, user_id

## API Endpoints

### Organization Management
```
POST   /api/org/create              - Create organization (SUPER_ADMIN)
GET    /api/org/all                 - View all orgs (SUPER_ADMIN)
GET    /api/org/my-organization     - Get user's organization
POST   /api/org/join-by-code        - Join organization
```

### User Management
```
POST   /api/org/add-user            - Add user to org (ORG_ADMIN)
GET    /api/org/users               - List org users (ORG_ADMIN)
POST   /api/org/set-budget          - Set budget (ORG_ADMIN)
POST   /api/org/remove-user         - Remove user (ORG_ADMIN)
```

### Transactions
```
POST   /api/transactions/add        - Create transaction
GET    /api/transactions            - Get user's transactions
DELETE /api/transactions/:id        - Delete transaction
```

### Organization Admin Features
```
GET    /api/org/transactions        - View all org transactions (ORG_ADMIN)
GET    /api/org/analytics           - Get org analytics (ORG_ADMIN)
GET    /api/org/export/csv          - Export as CSV (ORG_ADMIN)
GET    /api/org/export/excel        - Export as Excel (ORG_ADMIN)
```

## Frontend Pages

| Page | Role | Description |
|------|------|-------------|
| `/super-admin` | SUPER_ADMIN | Global organization management |
| `/org-admin` | ORG_ADMIN | Organization dashboard with analytics |
| `/dashboard` | ORG_USER | Personal expense tracking |
| `/join-organization` | Any | Join organization via code |
| `/analytics` | ORG_USER | Personal analytics |
| `/settings` | All | User settings |

## Database Models

### Organization
```javascript
{
  name: String,
  orgCode: String (unique),
  inviteLink: String,
  createdBy: ObjectId,
  admins: [ObjectId],
  users: [ObjectId],
  description: String,
  isActive: Boolean
}
```

### User (Updated)
```javascript
{
  name: String,
  email: String,
  password: String,
  orgRole: "SUPER_ADMIN" | "ORG_ADMIN" | "ORG_USER",
  organizationId: ObjectId,
  budget: Number,
  budgetPeriod: "weekly" | "monthly" | "yearly"
}
```

### Transaction (Updated)
```javascript
{
  userId: ObjectId,
  organizationId: ObjectId,
  amount: Number,
  type: "income" | "expense",
  category: String,
  notes: String,
  date: Date
}
```

## Middleware

### Role Middleware
```javascript
authorize(["SUPER_ADMIN"])           // Verify role
requireOrganization()                // Verify org membership
verifyOrgAccess()                    // Prevent cross-org access
isSuperAdmin()                       // SUPER_ADMIN only
isOrgAdmin()                         // ORG_ADMIN only
```

## Export Features

### CSV Export
- All transaction fields
- User information
- Timestamp and date range filtering

### Excel Export
- Transactions sheet with detailed data
- Summary sheet with totals
- Professional formatting

## Testing

### Create Test Organization
```bash
curl -X POST http://localhost:5000/api/org/create \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Org", "description": "For testing"}'
```

### Join Organization
```bash
curl -X POST http://localhost:5000/api/org/join-by-code \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"orgCode": "ORG-ABC12"}'
```

### Add Transaction
```bash
curl -X POST http://localhost:5000/api/transactions/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "type": "expense",
    "category": "Food",
    "notes": "Lunch",
    "date": "2024-01-15"
  }'
```

## File Structure

### Backend
```
server/
├── models/
│   ├── User.js
│   ├── Transaction.js
│   ├── Organization.js
│   └── Profile.js
├── controllers/
│   ├── authController.js
│   ├── orgController.js
│   ├── exportController.js
│   ├── transactionController.js
│   └── ...
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── ...
├── routes/
│   ├── authRoutes.js
│   ├── orgRoutes.js
│   ├── transactionRoutes.js
│   └── ...
└── seed-super-admin.js
```

### Frontend
```
client/
├── src/
│   ├── pages/
│   │   ├── SuperAdminDashboard.jsx
│   │   ├── OrgAdminDashboard.jsx
│   │   ├── JoinOrganization.jsx
│   │   ├── Dashboard.jsx
│   │   └── ...
│   ├── components/
│   │   ├── OrganizationRoute.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ...
│   └── App.jsx
```

## Environment Variables

### .env (Server)
```
MONGO_URI=mongodb://localhost:27017/smartspend
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

### .env (Client)
```
VITE_API_URL=http://localhost:5000
```

## NPM Scripts

### Backend
```bash
npm run dev            # Start development server
npm start              # Start production server
npm run seed-admin     # Seed legacy admin
npm run seed-super-admin  # Seed SUPER_ADMIN
```

### Frontend
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
```

## Troubleshooting

### Can't join organization
- Verify organization code exists and is active
- Ensure user is not already in organization
- Check organization code format (ORG-XXXXX)

### Budget not working
- Verify budget is set for user
- Check that transactions are in same organization
- Ensure transaction dates are in budget period

### Export not working
- Verify user is ORG_ADMIN
- Check that organization has transactions
- Ensure sufficient disk space

### Can't login as SUPER_ADMIN
- Run: `npm run seed-super-admin`
- Check MongoDB connection
- Verify env variables

## Security Best Practices

1. ✅ Never trust frontend role - always validate server-side
2. ✅ All queries filtered by organizationId
3. ✅ Middleware checks for role and organization
4. ✅ JWT token verified on every request
5. ✅ Users cannot access other organization data
6. ✅ Role changes only by admins

## Future Enhancements

- [ ] Audit logging
- [ ] Advanced permissions
- [ ] Team management
- [ ] Custom branding per org
- [ ] API keys for integrations
- [ ] Webhooks
- [ ] Two-factor authentication
- [ ] Bulk user import
- [ ] Advanced reporting

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT



