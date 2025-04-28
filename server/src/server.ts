import app from './app';
import dotenv from 'dotenv';

dotenv.config();

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