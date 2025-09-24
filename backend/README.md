# Multi-Tenant SaaS Notes Backend

A secure, multi-tenant SaaS backend built with Node.js, Express, TypeScript, and PostgreSQL, demonstrating enterprise-grade architecture patterns for B2B applications.

## 🏗️ Multi-Tenancy Architecture

### Chosen Approach: Shared Schema with Tenant ID Column

We implemented the **shared schema** approach where:
- All tenants share the same database and tables
- Each record contains a `tenantId` column for isolation
- Application-level filtering ensures strict data separation
- JWT tokens carry tenant context for request scoping

### Why This Approach?

| Benefit | Description |
|---------|-------------|
| **Cost Effective** | Single database reduces infrastructure costs |
| **Simple Management** | Easier backups, migrations, and maintenance |
| **Resource Efficient** | Better resource utilization across tenants |
| **Scalable** | Can handle many tenants without database multiplication |
| **Compliance Ready** | Centralized audit logging and data governance |

### Data Isolation Strategy

- ✅ **Query-level isolation**: Every database query includes `tenantId` filtering
- ✅ **JWT-based scoping**: Tokens contain tenant information
- ✅ **Middleware enforcement**: Authentication middleware enforces tenant-scoped access
- ✅ **Foreign key integrity**: Relationships maintain referential integrity within tenants
- ✅ **Index optimization**: Database indexes on `tenantId` for performance

## 🚀 Features

### Core Features
- **Multi-tenant data isolation** with strict tenant boundaries
- **JWT-based authentication** with role-based access control
- **Subscription-based feature gating** (FREE vs PRO plans)
- **CRUD operations** for notes with tenant scoping
- **Admin user management** with invitation system
- **Automatic tenant provisioning** during registration

### Business Logic
- **FREE Plan**: Limited to 3 notes per tenant
- **PRO Plan**: Unlimited notes
- **Admin privileges**: Can invite users and upgrade subscriptions
- **Member privileges**: Can create, view, edit, and delete notes
- **Invitation system**: Secure token-based user invitations

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/auth/register` | Register new tenant + admin | ❌ |

### Notes (Tenant-scoped)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/notes` | Create note | ✅ |
| GET | `/api/notes` | List tenant notes | ✅ |
| GET | `/api/notes/:id` | Get specific note | ✅ |
| PUT | `/api/notes/:id` | Update note (author only) | ✅ |
| DELETE | `/api/notes/:id` | Delete note (author/admin) | ✅ |

### Tenant Management
| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/tenant/info` | Get tenant info & stats | ✅ | Any |
| GET | `/api/tenant/users` | List tenant users | ✅ | Admin |
| POST | `/tenants/:slug/upgrade` | Upgrade to PRO plan | ✅ | Admin |

### User Invitations
| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/invite` | Send user invitation | ✅ | Admin |
| POST | `/api/accept/:token` | Accept invitation | ❌ | - |
| GET | `/api/invitations` | List sent invitations | ✅ | Admin |

### System
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | ❌ |

## 🔐 Test Accounts

| Email | Password | Role | Tenant | Plan |
|-------|----------|------|--------|------|
| `admin@acme.test` | `password123` | Admin | Acme | FREE |
| `user@acme.test` | `password123` | Member | Acme | FREE |
| `admin@globex.test` | `password123` | Admin | Globex | PRO |
| `user@globex.test` | `password123` | Member | Globex | PRO |

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: JWT
- **Password Hashing**: bcryptjs
- **Validation**: Built-in + Prisma types
- **Development**: nodemon, ts-node

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (we use Neon)
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd notes-saas/backend
npm install
```

### 2. Environment Configuration
Create `.env` file:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
JWT_SECRET="your-super-secure-jwt-secret-key"
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed test data
npx prisma db seed
```

### 4. Development Server
```bash
# Start development server
npm run dev

# Server starts on http://localhost:3000
```

### 5. Production Build
```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 🧪 Testing the API

### Quick Test with cURL

1. **Login as admin**:
```bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@acme.test","password":"password123"}'
```

2. **Create a note** (use token from login):
```bash
curl -X POST http://localhost:3000/api/notes \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -d '{"title":"Test Note","content":"Created via API"}'
```

3. **List notes**:
```bash
curl -X GET http://localhost:3000/api/notes \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

4. **Upgrade tenant**:
```bash
curl -X POST http://localhost:3000/tenants/acme/upgrade \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

5. **Send invitation**:
```bash
curl -X POST http://localhost:3000/api/invite \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \\
  -d '{"email":"newuser@acme.test"}'
```

### Postman Collection
Import the provided Postman collection for comprehensive API testing with automated token management and test assertions.

## 🔒 Security Features

### Authentication & Authorization
- **JWT tokens** with expiration (24h default)
- **Role-based access control** (Admin/Member)
- **Tenant-scoped operations** preventing cross-tenant access
- **Password hashing** with bcryptjs (10 rounds)

### Data Protection
- **SQL injection prevention** via Prisma parameterized queries
- **CORS protection** for cross-origin requests
- **Input validation** at controller level
- **Error handling** without sensitive data exposure

### Multi-Tenancy Security
- **Automatic tenant filtering** in all queries
- **JWT tenant binding** prevents token reuse across tenants
- **Admin isolation** - admins can only manage their own tenant
- **Resource scoping** - all operations scoped to user's tenant

## 📊 Database Schema

```mermaid
erDiagram
    Tenant ||--o{ User : has
    Tenant ||--o{ Note : contains
    Tenant ||--o{ Invitation : sends
    User ||--o{ Note : authors
    User ||--o{ Invitation : creates

    Tenant {
        string id PK
        string name
        string slug UK
        enum plan
        datetime createdAt
        datetime updatedAt
    }

    User {
        string id PK
        string email UK
        string password
        enum role
        string tenantId FK
        datetime createdAt
        datetime updatedAt
    }

    Note {
        string id PK
        string title
        string content
        string tenantId FK
        string authorId FK
        datetime createdAt
        datetime updatedAt
    }

    Invitation {
        string id PK
        string email
        string token UK
        string tenantId FK
        string createdBy FK
        datetime expiresAt
        boolean used
        datetime createdAt
    }
```

## 🚦 Business Rules

### Subscription Limits
- **FREE Plan**: Maximum 3 notes per tenant
- **PRO Plan**: Unlimited notes
- **Upgrade**: Only admins can upgrade their tenant
- **Immediate effect**: Upgrades take effect immediately

### User Management
- **Admin privileges**: Invite users, upgrade plans, view tenant users
- **Member privileges**: CRUD operations on notes only
- **Self-service**: Users can only edit/delete their own notes
- **Admin override**: Admins can delete any note in their tenant

### Invitation System
- **24-hour expiry**: Invitation tokens expire after 24 hours
- **Single use**: Tokens can only be used once
- **Email uniqueness**: Cannot invite existing users
- **Tenant binding**: Invited users join the inviting admin's tenant

## 🚀 Deployment

### Vercel Deployment
1. **Push to GitHub**:
```bash
git add .
git commit -m "Complete backend implementation"
git push origin main
```

2. **Deploy to Vercel**:
- Import GitHub repository in Vercel dashboard
- Add environment variables (`DATABASE_URL`, `JWT_SECRET`)
- Deploy automatically

3. **Environment Variables** (Vercel):
```
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=production
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Performance Considerations

### Database Optimization
- **Indexed tenant queries**: All `tenantId` columns are indexed
- **Compound indexes**: Multi-column indexes for complex queries
- **Connection pooling**: Prisma handles connection management
- **Query optimization**: Efficient joins and selective field loading

### Caching Strategy
- **Prisma query caching**: Built-in query result caching
- **JWT stateless**: No server-side session storage required
- **Static asset caching**: Frontend assets cached at CDN level

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start with nodemon
npm run build        # TypeScript compilation
npm start           # Production server

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed test data
npm run db:reset     # Reset database

# Prisma
npx prisma studio    # Database GUI
npx prisma generate  # Generate client
npx prisma migrate dev --name <name>  # Create migration
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify `DATABASE_URL` in `.env`
   - Check Neon database is running
   - Ensure network connectivity

2. **JWT Token Errors**:
   - Verify `JWT_SECRET` is set
   - Check token expiration (24h default)
   - Ensure Bearer format: `Authorization: Bearer <token>`

3. **TypeScript Compilation Errors**:
   - Run `npx prisma generate` after schema changes
   - Check `tsconfig.json` configuration
   - Ensure all dependencies are installed

4. **CORS Issues**:
   - Configure CORS origins in production
   - Use proper Content-Type headers
   - Check preflight request handling

## 📝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Run type checking: `npx tsc --noEmit`
5. Commit with clear message: `git commit -m "feat: add new feature"`
6. Push and create pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For questions or issues:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the API documentation

---

**Built with ❤️ for modern SaaS applications**