import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { google } from 'googleapis';
import { db } from '../../databases/db';
import { users } from '../../databases/schema';
import { Activity } from '../../models/activity.model.js';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }

  return process.env.JWT_SECRET;
};

const createToken = (user: { id: number; email: string; role: string }) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: '1d' },
  );
};

const toPublicUser = (user: {
  id: number;
  name: string;
  email: string;
  role: string;
}) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const googleRedirectUri =
  process.env.GOOGLE_REDIRECT_URI ??
  'http://localhost:3000/api/auth/google/callback';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  googleRedirectUri,
);

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

export const googleLogin = (req: Request, res: Response) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    include_granted_scopes: true,
  });

  res.redirect(url);
};


export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, nim, email, password } = req.body;

    if (!name || !nim || !email || !password) {
      return res.status(400).json({
        message: 'Name, NIM, email, dan password wajib diisi',
      });
    }

    const existingNim = await db
      .select()
      .from(users)
      .where(eq(users.nim, nim));

    if (existingNim.length > 0) {
      return res.status(400).json({
        message: 'NIM sudah terdaftar',
      });
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: 'Email sudah terdaftar',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        name,
        nim,
        email,
        password: hashedPassword,
        role: 'user',
      })
      .returning();

    return res.status(201).json({
      message: 'Register berhasil',
      user: toPublicUser(newUser[0]),
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
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

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (user.length === 0) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    if (user[0].is_active !== 1) {
      return res.status(403).json({
        message: 'Akun Anda sedang dinonaktifkan',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    const token = createToken(user[0]);

    await Activity.create({
      user_id: user[0].id,
      role: user[0].role,
      activity: 'Welcome aboard!',
      metadata: {
        message: `${user[0].name}, selamat datang di komunitas LINUKS.`,
        type: 'login',
      },
    });

    return res.status(200).json({
      message: 'Login berhasil',
      token,
      user: toPublicUser(user[0]),
    });
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code tidak ada' });
    }

    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const { data } = await oauth2.userinfo.get();

    if (!data.email || !data.name) {
      return res
        .status(400)
        .json({ error: 'Gagal mendapatkan data dari Google' });
    }

    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email));

    if (user.length === 0) {
      const hashedPassword = await bcrypt.hash(`google:${data.id ?? data.email}`, 10);

      user = await db
        .insert(users)
        .values({
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: 'user',
        })
        .returning();
    }

    if (user[0].is_active !== 1) {
      return res.status(403).json({
        error: 'Akun Anda sedang dinonaktifkan',
      });
    }

    const token = createToken(user[0]);

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth?token=${token}&email=${user[0].email}&role=${user[0].role}`,
    );
  } catch (error) {
    next(error);
  }
};
