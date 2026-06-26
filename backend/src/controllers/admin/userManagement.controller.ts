import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { eq } from 'drizzle-orm';
import { db } from '../../databases/db.js';
import { users } from '../../databases/schema.js';

export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const allUsers = await db
        .select({
            id: users.id,
            name: users.name,
            nim: users.nim,
            email: users.email,
            role: users.role,
            is_active: users.is_active,
            created_at: users.created_at,
        })
        .from(users)
        .where(eq(users.role, 'user'));

        return res.status(200).json(allUsers);
    } catch (error) {
        next(error);
    }
};

export const updateRoleUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = Number(req.params.id);
        const { role } = req.body;

        if (Number.isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user id' });
        }

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ error: 'Role harus user atau admin' });
        }

        if (req.user?.id === userId && role !== 'admin') {
            return res.status(400).json({ error: 'Admin tidak bisa menurunkan role akun sendiri' });
        }

        const targetUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId));

        if (targetUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = await db
        .update(users)
        .set({ role })
        .where(eq(users.id, userId))
        .returning({
            id: users.id,
            name: users.name,
            nim: users.nim,
            email: users.email,
            role: users.role,
            is_active: users.is_active,
            created_at: users.created_at,
        });

        return res.status(200).json({
            message: 'Role user berhasil diperbarui',
            user: updatedUser[0],
        });
    } catch (error) {
        next(error);
    }
};

const updateUserActiveStatus = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
    isActive: 0 | 1
) => {
    try {
        const userId = Number(req.params.id);

        if (Number.isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user id' });
        }

        if (req.user?.id === userId && isActive === 0) {
            return res.status(400).json({ error: 'Admin tidak bisa menonaktifkan akun sendiri' });
        }

        const targetUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId));

        if (targetUser.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedUser = await db
        .update(users)
        .set({ is_active: isActive })
        .where(eq(users.id, userId))
        .returning({
            id: users.id,
            name: users.name,
            nim: users.nim,
            email: users.email,
            role: users.role,
            is_active: users.is_active,
            created_at: users.created_at,
        });

        return res.status(200).json({
            message: isActive === 1 ? 'User berhasil diaktifkan kembali' : 'User berhasil dinonaktifkan',
            user: updatedUser[0],
        });
    } catch (error) {
        next(error);
    }
};

export const deactivateUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => updateUserActiveStatus(req, res, next, 0);

export const reactivateUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => updateUserActiveStatus(req, res, next, 1);
