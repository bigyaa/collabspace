import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

// Create plain HTTP server (socket.io needs raw http, not express instance)
const httpServer = createServer(app);

// Attach WebSocket server to HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow frontend
    methods: ['GET', 'POST']
  }
});

// WebSocket event handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // When user joins a document
  socket.on('join-document', (documentId: string) => {
    socket.join(documentId);
    console.log(`Socket ${socket.id} joined document ${documentId}`);
  });

  // When user sends text change
  socket.on('text-change', ({ documentId, content }: { documentId: string, content: string }) => {
    socket.to(documentId).emit('receive-changes', content);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = parseInt(process.env.PORT || "5500", 10);

async function startServer() {
  try {
    app.listen(PORT, '0.0.0.0', (error?: Error) => {  // <-- Fix here
      if (error) {
        console.error('Error starting server:', error);
        process.exit(1);
      }
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();