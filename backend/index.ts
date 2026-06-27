import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { connectMongoDB } from './src/databases/mongodb.js';
import cors from 'cors';
import appRoutes from './src/routes/index.js';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use('/api', appRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error tertangkap di Global Handler:', err);
  const statusCode = err.status || 500;
  const message = err.message || 'Terjadi kesalahan pada server';
  res.status(statusCode).json({
    error: message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Koneksi MongoDB
connectMongoDB();

// Hanya listen di lokal, Vercel handle sendiri di production
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;