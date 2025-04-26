// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', (_req, res) => {
  res.send('OK');
});

export default app;