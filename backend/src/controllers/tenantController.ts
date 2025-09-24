import { Response } from 'express';
import { prisma } from '../utils/database';
import { AuthRequest } from '../middleware/auth';

export const getTenantInfo = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.user!;

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        _count: {
          select: {
            users: true,
            notes: true
          }
        }
      }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    res.json({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      plan: tenant.plan,
      createdAt: tenant.createdAt,
      stats: {
        totalUsers: tenant._count.users,
        totalNotes: tenant._count.notes,
        noteLimit: tenant.plan === 'FREE' ? 3 : null
      }
    });
  } catch (error) {
    console.error('Get tenant info error:', error);
    res.status(500).json({ message: 'Error fetching tenant information' });
  }
};

export const upgradeTenant = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId, role } = req.user!;

    if (role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'Only admins can upgrade the tenant plan' 
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (tenant.plan === 'PRO') {
      return res.status(400).json({ 
        message: 'Tenant is already on the Pro plan' 
      });
    }

    const updatedTenant = await prisma.tenant.update({
      where: { id: tenantId },
      data: { plan: 'PRO' },
    });

    res.json({
      message: 'Upgrade successful! You now have unlimited notes.',
      tenant: {
        id: updatedTenant.id,
        name: updatedTenant.name,
        plan: updatedTenant.plan
      }
    });
  } catch (error) {
    console.error('Upgrade tenant error:', error);
    res.status(500).json({ message: 'Error upgrading tenant' });
  }
};

export const upgradeTenantBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const { tenantSlug, role } = req.user!;

    if (role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'Only admins can upgrade the tenant plan' 
      });
    }

    // Ensure admin can only upgrade their own tenant
    if (slug !== tenantSlug) {
      return res.status(403).json({ 
        message: 'You can only upgrade your own organization' 
      });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug }
    });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    if (tenant.plan === 'PRO') {
      return res.status(400).json({ 
        message: 'Tenant is already on the Pro plan' 
      });
    }

    const updatedTenant = await prisma.tenant.update({
      where: { slug },
      data: { plan: 'PRO' },
    });

    res.json({
      message: 'Upgrade successful! You now have unlimited notes.',
      tenant: {
        id: updatedTenant.id,
        name: updatedTenant.name,
        plan: updatedTenant.plan
      }
    });
  } catch (error) {
    console.error('Upgrade tenant error:', error);
    res.status(500).json({ message: 'Error upgrading tenant' });
  }
};

export const getTenantUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId, role } = req.user!;

    if (role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'Only admins can view tenant users' 
      });
    }

    const users = await prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { notes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Get tenant users error:', error);
    res.status(500).json({ message: 'Error fetching tenant users' });
  }
};