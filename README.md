# Notes SaaS  🚀 [Live Demo](https://notes-saas-frontend-eight.vercel.app/)

> **Multi-tenant SaaS platform for collaborative note-taking with enterprise-grade security and role-based access control.**

## 📡Documentation
**API DOC** - https://documenter.getpostman.com/view/37009033/2sB3QCRskU
**Repo Doc** - 

## ⚡ Key Features

- **🏢 Multi-Tenant Architecture** - Complete data isolation between organizations
- **👥 Team Collaboration** - Invite team members with role-based permissions
- **📝 Rich Notes Management** - Create, edit, and organize notes with markdown support
- **🔐 Enterprise Security** - JWT authentication with bcrypt password hashing
- **💼 Subscription Plans** - FREE (3 notes) and PRO (unlimited) tiers
- **🌙 Dark Mode Support** - Beautiful UI that adapts to user preferences
- **📱 Responsive Design** - Works seamlessly across all devices

## 💻 Implementation Overview

### 1. **Frontend (React) + Backend (Node.js) Architecture**
**Frontend**
- React 19 + TypeScript + Vite
- Tailwind CSS + Lucide Icons
- React Hook Form + Zod validation
- Axios + TanStack Query
**Backend**
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT + bcryptjs
- Multi-tenant data architecture
**Deployment**
- Vercel (Frontend & Backend)
- Neon PostgreSQL Database

### 2. **Functional Authentication System**
// Security features implemented:
✅ bcrypt password hashing (10 rounds)
✅ JWT tokens with 24h expiration
✅ Automatic token refresh handling
✅ Protected route middleware
✅ Role-based access control (Admin/Member)

### 3. **Dashboard with CRUD Operations**
**Primary Entity: Notes Management**
- **Create**: Rich text editor with title/content validation
- **Read**: Paginated notes list with search and filtering
- **Update**: Inline editing with optimistic updates
- **Delete**: Soft delete with confirmation dialogs
**Secondary CRUD: Team Management (Admin only)**
- User invitation system with email tokens
- Member role management and statistics
- Tenant subscription plan upgrades

### 5. **Production Scaling Strategy**  
**Current Architecture (Suitable for 1-10K users):**

**Phase 1: Performance Optimization (10K-100K users)**
// Implementation strategies:
- API Response Caching (Redis)
- Database Query Optimization (Indexes, Connection Pooling)
- CDN Integration (Static Assets, API Caching)
- Rate Limiting & Request Throttling
**Phase 2: Microservices Architecture (100K+ users)**
- Frontend → API Gateway → [Auth Service, Notes Service, Tenant Service] → Database Cluster
**Phase 3: Advanced Scaling (Enterprise)**
// Advanced scaling implementations:
- Horizontal Database Sharding by tenant_id
- Event-driven architecture with message queues
- Container orchestration (Docker + Kubernetes)
- Multi-region deployment with data replication
- Real-time features with WebSocket clusters

## 🏗️ Architecture Highlights

- **Shared Schema Multi-Tenancy** - Cost-effective with strict tenant isolation
- **Role-Based Access Control** - Admin and Member roles with appropriate permissions
- **Subscription-Based Feature Gating** - Plan limits enforced at API level
- **Secure Invitation System** - Token-based user onboarding with expiration
- **RESTful API Design** - Clean endpoints with comprehensive validation


### Core Endpoints
```
POST   /api/auth/login          # User authentication
POST   /api/auth/register       # Tenant registration
GET    /api/notes               # List tenant notes
POST   /api/notes               # Create new note
POST   /api/invite              # Send team invitation
GET    /api/tenant/info         # Tenant details & stats
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Quick Setup
```bash
# Clone repository
git clone <repo-url>
cd notes-saas

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure your database
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend setup (new terminal)
cd ../frontend
npm install
npm run dev
```

Visit `http://localhost:5173` and sign in with test credentials above.

## 📊 Project Structure

```
notes-saas/
├── frontend/           # React + TypeScript SPA
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application pages
│   │   ├── services/   # API layer
│   │   └── types/      # TypeScript definitions
├── backend/            # Express.js API server
│   ├── src/
│   │   ├── controllers/# Request handlers
│   │   ├── middleware/ # Auth & validation
│   │   ├── routes/     # API endpoints
│   │   └── utils/      # Database & JWT utilities
│   └── prisma/         # Database schema & migrations
```

## 🔐 Security Features

- JWT-based stateless authentication
- Bcrypt password hashing (10 rounds)
- SQL injection prevention via Prisma
- CORS protection for API endpoints
- Tenant-scoped data access controls
- Input validation with TypeScript + Zod

## 🎯 Business Logic

**FREE Plan Limits:**
- 3 notes maximum
- Basic team features
- Standard support

**PRO Plan Benefits:**
- Unlimited notes
- Advanced collaboration
- Priority support

**Roles & Permissions:**
- **Admin**: Full tenant management, user invitations, plan upgrades
- **Member**: Note CRUD operations, profile management

## 📈 Deployment

Both frontend and backend are deployed on **Vercel** with:
- Automatic deployments from Git
- Environment variable management
- Serverless functions for backend
- Global CDN for frontend assets

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
