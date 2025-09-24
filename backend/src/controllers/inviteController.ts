import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../utils/database';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

export const inviteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;
    const { userId, tenantId, role } = req.user!;

    if (role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'Only admins can invite users' 
      });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Check if invitation already exists
    const existingInvite = await prisma.invitation.findFirst({
      where: { 
        email, 
        tenantId,
        used: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (existingInvite) {
      return res.status(409).json({ 
        message: 'Invitation already sent to this email' 
      });
    }

    // Create invitation
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        tenantId,
        createdBy: userId,
        expiresAt
      },
      include: {
        tenant: {
          select: { name: true, slug: true }
        }
      }
    });

    // In production, send email here
    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/invite/accept/${token}`;

    res.status(201).json({
      message: 'Invitation sent successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        expiresAt: invitation.expiresAt,
        inviteLink // Remove this in production, send via email instead
      }
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ message: 'Error sending invitation' });
  }
};

export const acceptInvite = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Invalid invitation token' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { token: token },
      include: { tenant: true }
    });

    if (!invitation || invitation.used || invitation.expiresAt < new Date()) {
      return res.status(400).json({ 
        message: 'Invalid or expired invitation' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and mark invitation as used
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: invitation.email,
          password: hashedPassword,
          role: 'MEMBER',
          tenantId: invitation.tenantId,
        },
        include: { tenant: true }
      });

      await tx.invitation.update({
        where: { id: invitation.id },
        data: { used: true }
      });

      return user;
    });

    const jwtToken = generateToken({
      userId: result.id,
      tenantId: result.tenantId,
      tenantSlug: result.tenant.slug,
      role: result.role,
    });

    res.status(201).json({
      token: jwtToken,
      user: {
        id: result.id,
        email: result.email,
        role: result.role,
        tenant: {
          id: result.tenant.id,
          name: result.tenant.name,
          slug: result.tenant.slug,
          plan: result.tenant.plan,
        },
      },
    });
  } catch (error) {
    console.error('Accept invite error:', error);
    res.status(500).json({ message: 'Error accepting invitation' });
  }
};

export const getInvitations = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId, role } = req.user!;

    if (role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'Only admins can view invitations' 
      });
    }

    const invitations = await prisma.invitation.findMany({
      where: { tenantId },
      select: {
        id: true,
        email: true,
        used: true,
        expiresAt: true,
        createdAt: true,
        creator: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(invitations);
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({ message: 'Error fetching invitations' });
  }
};