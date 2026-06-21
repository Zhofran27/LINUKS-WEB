import {  Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../databases/db';
import { users } from '../../databases/schema';
import { Activity } from '../../models/activity.model.js';


export const profileAdmin = async (
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
        return res.status(200).json(user[0]);
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