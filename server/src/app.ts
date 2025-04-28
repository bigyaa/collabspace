// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';

const app = express();
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const documents = await prisma.document.findMany();

  for (const doc of documents) {
    if (!doc?.shareId) {
      await prisma.document.update({
        where: { id: doc.id },
        data: { shareId: randomBytes(8).toString('hex') },
      });
    }
  }

  console.log("Backfilled shareId for all documents");
}

main().catch(console.error).finally(() => prisma.$disconnect());
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', (_req, res) => {
  res.send('OK');
});

// Mount auth routes
app.use('/api/auth', authRoutes);

// Mount document routes
app.use('/api/documents', documentRoutes);

export default app;