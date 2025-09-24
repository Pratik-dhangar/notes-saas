export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  tenant: {
    id: string;
    name: string;
    slug: string;
    plan: 'FREE' | 'PRO';
  };
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    email: string;
  };
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'FREE' | 'PRO';
  createdAt: string;
  stats: {
    totalUsers: number;
    totalNotes: number;
    noteLimit: number | null;
  };
}

export interface Invitation {
  id: string;
  email: string;
  used: boolean;
  expiresAt: string;
  createdAt: string;
  creator: {
    email: string;
  };
}

export interface JWTPayload {
  userId: string;
  tenantId: string;
  tenantSlug: string;
  role: string;
  exp: number;
}

// API Response Types
export interface LoginResponse {
  token: string;
  user: User;
}

export interface NotesResponse {
  notes: Note[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  tenantName: string;
}

export interface NoteForm {
  title: string;
  content: string;
}

export interface InviteForm {
  email: string;
}