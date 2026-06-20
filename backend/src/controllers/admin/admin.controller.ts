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