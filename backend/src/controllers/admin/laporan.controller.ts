import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../../middlewares/auth.middleware';
import { and, count, eq, gte, lt, notInArray, sql } from 'drizzle-orm';
import { db } from '../../databases/db';
import { reports, categories, statuses, report_files, users } from '../../databases/schema';
import { withReportCode } from '../../utils/report-code';
import { Activity } from '../../models/activity.model.js';
import { sendStatusUpdateEmail } from '../../utils/mailer';

const getCountValue = (result: { total: number }[]) => result[0]?.total ?? 0;

const getGrowthPercent = (current: number, previous: number) => previous === 0
    ? current > 0 ? 100 : 0
    : Math.round(((current - previous) / previous) * 100);

export const getLaporan = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const report = await db
            .select({
                id: reports.id,
                name: sql<string>`case when ${reports.is_anonymous} = 1 then 'Anonymous' else ${users.name} end`,
                category: categories.name,
                status: statuses.name,
                incident_date: reports.incident_date,
                created_at: reports.created_at,
                is_anonymous: reports.is_anonymous,
                file_path: report_files.file_path
            })
            .from(reports)
            .leftJoin(report_files, eq(reports.id, report_files.report_id))
            .innerJoin(users, eq(users.id, reports.user_id))
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

        const activeStatusCondition = notInArray(statuses.name, ['Selesai', 'Ditolak']);
        const resolvedStatusCondition = eq(statuses.name, 'Selesai');
        const currentPeriodCondition = gte(reports.created_at, currentPeriodStart);
        const previousPeriodCondition = and(
            gte(reports.created_at, previousPeriodStart),
            lt(reports.created_at, currentPeriodStart)
        );

        const countReports = (periodCondition?: ReturnType<typeof and>) => db
            .select({ total: count(reports.id) })
            .from(reports)
            .where(periodCondition);

        const countReportsByStatus = (
            statusCondition: typeof activeStatusCondition | typeof resolvedStatusCondition,
            periodCondition?: ReturnType<typeof and>
        ) => db
            .select({ total: count(reports.id) })
            .from(reports)
            .innerJoin(statuses, eq(statuses.id, reports.status_id))
            .where(periodCondition ? and(statusCondition, periodCondition) : statusCondition);

        const [
            totalReport,
            currentPeriodReport,
            previousPeriodReport,
            activeReport,
            currentActiveReport,
            previousActiveReport,
            resolvedReport,
            currentResolvedReport,
            previousResolvedReport,
        ] = await Promise.all([
            countReports(),
            countReports(currentPeriodCondition),
            countReports(previousPeriodCondition),
            countReportsByStatus(activeStatusCondition),
            countReportsByStatus(activeStatusCondition, currentPeriodCondition),
            countReportsByStatus(activeStatusCondition, previousPeriodCondition),
            countReportsByStatus(resolvedStatusCondition),
            countReportsByStatus(resolvedStatusCondition, currentPeriodCondition),
            countReportsByStatus(resolvedStatusCondition, previousPeriodCondition),
        ]);

        const totalReports = getCountValue(totalReport);
        const activeCases = getCountValue(activeReport);
        const resolvedCases = getCountValue(resolvedReport);
        const totalGrowthPercent = getGrowthPercent(
            getCountValue(currentPeriodReport),
            getCountValue(previousPeriodReport)
        );
        const activeGrowthPercent = getGrowthPercent(
            getCountValue(currentActiveReport),
            getCountValue(previousActiveReport)
        );
        const resolvedGrowthPercent = getGrowthPercent(
            getCountValue(currentResolvedReport),
            getCountValue(previousResolvedReport)
        );

        return res.status(200).json({
            total_reports: totalReports,
            total_reports_label: totalReports.toLocaleString('en-US'),
            growth_percent: totalGrowthPercent,
            active_cases: activeCases,
            active_cases_label: activeCases.toLocaleString('en-US'),
            active_growth_percent: activeGrowthPercent,
            resolved_cases: resolvedCases,
            resolved_cases_label: resolvedCases.toLocaleString('en-US'),
            resolved_growth_percent: resolvedGrowthPercent,
        });
    } catch (error) {
        next(error);
    }
}

export const getLaporanPerMonth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const currentYear = new Date().getFullYear();
        const year = req.query.year === undefined ? currentYear : Number(req.query.year);

        if (!Number.isInteger(year) || year < 2000 || year > 9999) {
            return res.status(400).json({
                error: 'Invalid year. Use a four-digit year, for example 2024',
            });
        }

        const periodStart = new Date(Date.UTC(year, 0, 1));
        const periodEnd = new Date(Date.UTC(year + 1, 0, 1));

        const reportCounts = await db
            .select({
                month: sql<number>`extract(month from ${reports.created_at})::int`,
                total: count(reports.id),
            })
            .from(reports)
            .where(
                and(
                    gte(reports.created_at, periodStart),
                    lt(reports.created_at, periodEnd)
                )
            )
            .groupBy(sql`extract(month from ${reports.created_at})`)
            .orderBy(sql`extract(month from ${reports.created_at})`);

        const totalsByMonth = new Map(
            reportCounts.map(({ month, total }) => [Number(month), Number(total)])
        );
        const monthLabels = [
            'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
            'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
        ];
        const reportsPerMonth = monthLabels.map((label, index) => ({
            month: index + 1,
            label,
            total_reports: totalsByMonth.get(index + 1) ?? 0,
        }));

        return res.status(200).json({
            year,
            total_reports: reportsPerMonth.reduce(
                (total, month) => total + month.total_reports,
                0
            ),
            reports_per_month: reportsPerMonth,
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
                name: sql<string>`case when ${reports.is_anonymous} = 1 then 'Anonymous' else ${users.name} end`,
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
            .innerJoin(users, eq(users.id, reports.user_id))
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

export const updateStatusLaporan = async (
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
            
        }

        const reportId = Number(req.params.id);
        if (Number.isNaN(reportId)) {
            return res.status(400).json({ error: 'Invalid report id' });
        }

        const statusName = String(req.body.status);
        const status = await db
        .select()
        .from(statuses)
        .where(eq(statuses.name, statusName));

        if (status.length === 0) {
            return res.status(404).json({ error: 'Status not found' });
        }

        const statusId = status[0].id;

        if (Number.isNaN(statusId)) {
            return res.status(400).json({ error: 'Invalid status id' });
        }

        const reportOwner = await db
        .select({
            email: users.email,
            title: reports.title,
        })
        .from(reports)
        .innerJoin(users, eq(reports.user_id, users.id))
        .where(eq(reports.id, reportId));

        if (reportOwner.length === 0) {
            return res.status(404).json({ error: 'Report not found' });
        }

        await db
        .update(reports)
        .set({ status_id: statusId })
        .where(eq(reports.id, reportId));

        try{
            await sendStatusUpdateEmail ({
                recipient: reportOwner[0].email,
                reportTitle: reportOwner[0].title,
                status: statusName,
            })
        } catch (emailError) {
            console.error("Gagal mengirim email:", emailError);
        }

        await Activity.create({
            user_id: userId,
            role: user[0].role,
            activity: `Status updated to ${statusName}`,
            metadata: {
                report_id: reportId,
                status: statusName,
            },
        });

        return res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        next(error);
    }
}
