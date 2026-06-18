import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware';
import { and, count, eq, gte, lt } from 'drizzle-orm';
import { db } from '../../databases/db';
import { reports, categories, statuses, report_files } from '../../databases/schema';
import { withReportCode } from '../../utils/report-code';

const getCountValue = (result: { total: number }[]) => result[0]?.total ?? 0;

export const getLaporan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const report = await db
            .select({
                id: reports.id,
                category: categories.name,
                status: statuses.name,
                incident_date: reports.incident_date,
                created_at: reports.created_at,
                is_anonymous: reports.is_anonymous,
                file_path: report_files.file_path
            })
            .from(reports)
            .leftJoin(report_files, eq(reports.id, report_files.report_id))
            .innerJoin(categories, eq(categories.id, reports.category_id))
            .innerJoin(statuses, eq(statuses.id, reports.status_id))

        return res.status(200).json(report.map(withReportCode));
    } catch (error) {
        next(error);
    }
}

export const getLaporanOverview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const now = new Date();
        const currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(now.getDate() - 30);

        const previousPeriodStart = new Date(now);
        previousPeriodStart.setDate(now.getDate() - 60);

        const totalReport = await db
            .select({ total: count(reports.id) })
            .from(reports);

        const currentPeriodReport = await db
            .select({ total: count(reports.id) })
            .from(reports)
            .where(gte(reports.created_at, currentPeriodStart));

        const previousPeriodReport = await db
            .select({ total: count(reports.id) })
            .from(reports)
            .where(
                and(
                    gte(reports.created_at, previousPeriodStart),
                    lt(reports.created_at, currentPeriodStart)
                )
            );

        const totalReports = getCountValue(totalReport);
        const currentReports = getCountValue(currentPeriodReport);
        const previousReports = getCountValue(previousPeriodReport);
        const growthPercent = previousReports === 0
            ? currentReports > 0 ? 100 : 0
            : Math.round(((currentReports - previousReports) / previousReports) * 100);

        return res.status(200).json({
            total_reports: totalReports,
            total_reports_label: totalReports.toLocaleString('en-US'),
            growth_percent: growthPercent,
        });
    } catch (error) {
        next(error);
    }
}

export const getLaporanById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const reportId = Number(req.params.id);
        if (Number.isNaN(reportId)) {
            return res.status(400).json({ error: 'Invalid report id' });
        }

        const report = await db
            .select({
                id: reports.id,
                title: reports.title,
                description: reports.description,
                chronology: reports.chronology,
                location: reports.location,
                category: categories.name,
                category_id: reports.category_id,
                status: statuses.name,
                status_id: reports.status_id,
                incident_date: reports.incident_date,
                is_anonymous: reports.is_anonymous,
                user_id: reports.user_id,
                created_at: reports.created_at,
                file_path: report_files.file_path
            })
            .from(reports)
            .leftJoin(report_files, eq(reports.id, report_files.report_id))
            .innerJoin(categories, eq(categories.id, reports.category_id))
            .innerJoin(statuses, eq(statuses.id, reports.status_id))
            .where(eq(reports.id, reportId));

        if (report.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        return res.status(200).json(report.map(withReportCode));
    } catch (error) {
        next(error);
    }
}

export const getLaporanDetail = async (
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
            .select({
                id: reports.id,
                title: reports.title,
                description: reports.description,
                chronology: reports.chronology,
                location: reports.location,
                category: categories.name,
                status: statuses.name,
                incident_date: reports.incident_date,
                is_anonymous: reports.is_anonymous,
                user_id: reports.user_id,
                created_at: reports.created_at,
                file_path: report_files.file_path
            })
            .from(reports)
            .leftJoin(report_files, eq(reports.id, report_files.report_id))
            .innerJoin(categories, eq(categories.id, reports.category_id))
            .innerJoin(statuses, eq(statuses.id, reports.status_id))
            .where(eq(reports.id, reportId));

        if (report.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        return res.status(200).json(report.map(withReportCode));
    } catch (error) {
        next(error);
    }
}
