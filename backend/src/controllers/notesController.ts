import { Response } from 'express';
import { prisma } from '../utils/database';
import { AuthRequest } from '../middleware/auth';

export const createNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const { userId, tenantId } = req.user!;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // Check note limit for FREE plan
    const tenant = await prisma.tenant.findUnique({ 
      where: { id: tenantId },
      include: { _count: { select: { notes: true } } }
    });

    if (tenant?.plan === 'FREE' && tenant._count.notes >= 3) {
      return res.status(403).json({ 
        message: 'Note limit reached. Please upgrade to Pro for unlimited notes.' 
      });
    }

    const note = await prisma.note.create({
      data: { 
        title, 
        content, 
        tenantId, 
        authorId: userId 
      },
      include: {
        author: {
          select: { id: true, email: true }
        }
      }
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Error creating note' });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.user!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where: { tenantId },
        include: {
          author: {
            select: { id: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.note.count({ where: { tenantId } })
    ]);

    res.json({
      notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Error fetching notes' });
  }
};

export const getNoteById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Note id is required' });
    }
    const { tenantId } = req.user!;

    const note = await prisma.note.findFirst({
      where: { id, tenantId },
      include: {
        author: {
          select: { id: true, email: true }
        }
      }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Error fetching note' });
  }
};

export const updateNote = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Note id is required' });
    }
    const { title, content } = req.body;
    const { userId, tenantId } = req.user!;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = await prisma.note.findFirst({
      where: { id, tenantId }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Only allow the author to update their note
    if (note.authorId !== userId) {
      return res.status(403).json({ message: 'You can only update your own notes' });
    }

    const updatedNote = await prisma.note.update({
      where: { id: id },
      data: { title, content },
      include: {
        author: {
          select: { id: true, email: true }
        }
      }
    });

    res.json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Error updating note' });
  }
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: 'Note id is required' });
    }
    const { userId, tenantId, role } = req.user!;

    const note = await prisma.note.findFirst({
      where: { id, tenantId }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Allow deletion if user is the author or an admin
    if (note.authorId !== userId && role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'You can only delete your own notes' 
      });
    }

  await prisma.note.delete({ where: { id: id } });
    res.status(204).send();
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Error deleting note' });
  }
};