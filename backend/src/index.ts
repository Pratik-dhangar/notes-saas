import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/authRoutes';
import notesRoutes from './routes/notesRoutes';
import tenantRoutes from './routes/tenantRoutes';
import inviteRoutes from './routes/inviteRoutes';

// Utils
import { prisma } from './utils/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'https://notes-saas-frontend-eight.vercel.app' }))
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/tenants', tenantRoutes);
app.use('/api', inviteRoutes);

// Catch-all 404 handler (register without path to avoid path-to-regexp issues)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Only start server if not in Vercel environment
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
      await prisma.$connect();
      console.log('Connected to database');
    } catch (err) {
      console.error('Failed to connect to database', err);
    }
  });
}

export default app;
