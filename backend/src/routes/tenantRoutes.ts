import { Router } from 'express';
import { getTenantInfo, upgradeTenant, getTenantUsers } from '../controllers/tenantController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/info', getTenantInfo);
router.post('/upgrade', authorizeRole(['ADMIN']), upgradeTenant);
router.get('/users', authorizeRole(['ADMIN']), getTenantUsers);

export default router;
