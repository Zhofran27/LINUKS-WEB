import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { connectMongoDB } from './src/databases/mongodb.js';
import { drizzle } from 'drizzle-orm/node-postgres'; 
import  cors  from 'cors';
import { eq } from 'drizzle-orm';
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
    // (Opsional) Tampilkan stack trace hanya saat development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
