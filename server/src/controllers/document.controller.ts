import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

// Middleware to check if the user is authenticated
function getUserIdFromRequest(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error('Unauthorized');
  const token = authHeader.split(' ')[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as any;
  return payload.id;
}

export async function createDocument(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    const { title, content } = req.body;

    const document = await prisma.document.create({
      data: {
        title, content, userId, shareId: randomBytes(8).toString('hex'), // <-- 16 character random hex string
      },
    });

    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized or Error creating document' });
  }
}

export async function getDocuments(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);

    const documents = await prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized or Error fetching documents' });
  }
}

export async function updateDocument(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    const { id } = req.params;
    const { title, content } = req.body;

    const updated = await prisma.document.updateMany({
      where: { id: parseInt(id, 10), userId },
      data: { title, content },
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized or Error updating document' });
  }
}

export async function deleteDocument(req: Request, res: Response) {
  try {
    const userId = getUserIdFromRequest(req);
    const { id } = req.params;

    const deleted = await prisma.document.deleteMany({
      where: { id: parseInt(id, 10), userId },
    });

    res.json(deleted);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized or Error deleting document' });
  }
}