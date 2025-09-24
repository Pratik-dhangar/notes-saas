import { Router } from 'express';
import { getTenantInfo, upgradeTenant, upgradeTenantBySlug, getTenantUsers } from '../controllers/tenantController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/info', getTenantInfo);
router.post('/upgrade', authorizeRole(['ADMIN']), upgradeTenant);
router.post('/:slug/upgrade', authorizeRole(['ADMIN']), upgradeTenantBySlug);
router.get('/users', authorizeRole(['ADMIN']), getTenantUsers);

export default router;
