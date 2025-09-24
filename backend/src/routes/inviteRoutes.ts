import { Router } from 'express';
import { inviteUser, acceptInvite, getInvitations } from '../controllers/inviteController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/invite', authenticateToken, authorizeRole(['ADMIN']), inviteUser);
router.post('/accept/:token', acceptInvite);
router.get('/invitations', authenticateToken, authorizeRole(['ADMIN']), getInvitations);

export default router;