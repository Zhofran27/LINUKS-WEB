import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../databases/db';
import { users } from '../../databases/schema';

const getJWTSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  return process.env.JWT_SECRET;
};

const createAdminToken = (admin: { id: number; email: string; role: string }) => {
  return jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    getJWTSecret(),
    { expiresIn: '1d' },
  );
};

export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email dan password wajib diisi',
      });
    }

    const admin = await db.select().from(users).where(eq(users.email, email));

    if (admin.length === 0) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    if (admin[0].role !== 'admin') {
      return res.status(403).json({
        message: 'Akun ini bukan admin',
      });
    }

    if (admin[0].is_active !== 1) {
      return res.status(403).json({
        message: 'Akun admin sedang dinonaktifkan',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    const token = createAdminToken(admin[0]);

    return res.status(200).json({
      message: 'Login admin berhasil',
      token,
      admin: {
        id: admin[0].id,
        name: admin[0].name,
        email: admin[0].email,
        role: admin[0].role,
      },
    });
  } catch (error) {
    next(error);
  }
};
