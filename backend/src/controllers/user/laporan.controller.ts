import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware.js';
import { and, eq, ne } from 'drizzle-orm';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '../../databases/db.js';
import { categories, reports, statuses, users, report_files } from '../../databases/schema.js';
import { formatReportCode, withReportCode } from '../../utils/report-code.js';
import { Activity } from '../../models/activity.model.js';

const getCloudinaryPublicId = (filePath: string) => {
    const urlParts = filePath.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    const publicIdParts = uploadIndex >= 0
        ? urlParts.slice(uploadIndex + 1)
        : urlParts;

    if (publicIdParts[0]?.startsWith('v')) {
        publicIdParts.shift();
    }

    const publicIdWithExt = publicIdParts.join('/');
    return publicIdWithExt.replace(/\.[^/.]+$/, '');
};

export const CreateLaporan = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const { 
            title,
            category_id,
            chronology,
            description,
            location,
            incident_date,
            is_anonymous
        } = req.body;

        if (!title || !category_id || !chronology || !description || !location || !incident_date || is_anonymous === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const category = await db
        .select()
        .from(categories)
        .where(eq(categories.id, category_id));

        if (category.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const status = await db
        .select()
        .from(statuses)
        .where(eq(statuses.name, 'Menunggu Verifikasi'));

        if (status.length === 0) {
            return res.status(404).json({ error: 'Status not found' });
        }

        const uploadedFiles = Array.isArray(req.files)
            ? req.files
            : req.file
                ? [req.file]
                : [];

        const newReport = await db
        .insert(reports)
        .values({
            title,
            category_id,
            chronology,
            description,
            location,
            incident_date: new Date(incident_date),
            is_anonymous,
            user_id: userId,
            status_id: status[0].id
        })
        .returning({ id: reports.id });

        if (uploadedFiles.length > 0) {
            await db
            .insert(report_files)
            .values(
                uploadedFiles.map((file) => ({
                    report_id: newReport[0].id,
                    file_path: file.path
                }))
            );
        }

        await Activity.create({
            user_id: userId,
            role: user[0].role,
            activity: 'Laporan baru telah dibuat',
            metadata: {
                report_id: newReport[0].id,
                report_code: formatReportCode(newReport[0].id),
                title,
            }
        });

        return res.status(201).json({
            message: 'Report created successfully',
            reportId: newReport[0].id,
            report_code: formatReportCode(newReport[0].id),
        });

    } catch (error) {
        next(error);

    }
}

export const getLaporanByUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const report = await db
        .select()
        .from(reports)
        .where(eq(reports.user_id, userId));

        return res.status(200).json(report.map(withReportCode));
    } catch (error) {
        next(error);
    }
}

export const getLaporanById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const reportId =  Number(req.params.id);
        if (Number.isNaN(reportId)) {
            return res.status(400).json({ error: 'Invalid report id' });
        }

        const report = await db
        .select()
        .from(reports)
        .where(eq(reports.id, reportId));

        return res.status(200).json(report.map(withReportCode));
    } catch (error) {
        next(error);
    }
}

export const getLaporanByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoryId = Number(req.params.category_id);
        if (Number.isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category id' });
        }

        const report = await db
        .select()
        .from(reports)
        .where(eq(reports.category_id, categoryId));

        if (report.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        return res.status(200).json(report.map(withReportCode));
    } catch (error) {
        next(error);
    }
}

export const getLaporanByNama = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const name = String(req.params.name);
        const report = await db
        .select()
        .from(reports)
        .where(eq(reports.title, name));

        if (report.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        return res.status(200).json(report.map(withReportCode));
    } catch (error) {
        next(error);
    }
}

export const deleteLaporan = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const reportId = Number(req.params.id);
        if (Number.isNaN(reportId)) {
            return res.status(400).json({ error: 'Invalid report id' });
        }

        const report = await db
        .select()
        .from(reports)
        .where(eq(reports.id, reportId));

        if (report.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        const reportFiles = await db
        .select()
        .from(report_files)
        .where(eq(report_files.report_id, reportId));

        await Promise.all(
            reportFiles.map((file) =>
                cloudinary.uploader.destroy(getCloudinaryPublicId(file.file_path))
            )
        );

        await db
        .delete(report_files)
        .where(eq(report_files.report_id, reportId));

        await db
        .delete(reports)
        .where(eq(reports.id, reportId));

        return res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        next(error);
    }
}

export const getLaporanActive = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const finishedStatus = await db
        .select()
        .from(statuses)
        .where(eq(statuses.name, 'Selesai'));

        if (finishedStatus.length === 0) {
            return res.status(404).json({ error: 'Status not found' });
        }

        const report = await db
        .select()
        .from(reports)
        .where(
            and(
                eq(reports.user_id, userId),
                ne(reports.status_id, finishedStatus[0].id)
            )
        );

        return res.status(200).json(report.map(withReportCode));
    } catch (error) {
        next(error);
    }
}
