import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { eq } from 'drizzle-orm';
import { db } from '../../databases/db';
import { users } from '../../databases/schema';
import { Activity } from '../../models/activity.model.js';

export const ProfileUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const user = await db
            .select({
                name: users.name,
                email: users.email,
            })
            .from(users)
            .where(eq(users.id, userId));
        
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user[0]);
    } catch (error) {
        next(error);
    }
}


export const updateUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const user = await db.select().from(users).where(eq(users.id, userId));
        
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { name, nim, email, password } = req.body;

        if (!name && !email && !password) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        if (name) {
            user[0].name = name;
        }
        if (nim) {
            user[0].nim = nim;
        }
        if (email) {
            user[0].email = email;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user[0].password = hashedPassword;
        }

        const updatedUser = await db.update(users).set(user[0]).where(eq(users.id, userId));
        return res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const user = await db.select().from(users).where(eq(users.id, userId));
        
        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        await db.delete(users).where(eq(users.id, userId));
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export const getRecentActivity = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const user = await db.select().from(users).where(eq(users.id, userId));

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const activities = await Activity
            .find({ user_id: userId })
            .sort({ created_at: -1 })
            .limit(5)
            .lean();

        return res.status(200).json(activities);
    } catch (error) {
        next(error);
    }
}

