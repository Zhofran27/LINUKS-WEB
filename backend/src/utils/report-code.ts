const REPORT_CODE_PREFIX = '#LNK';
const REPORT_CODE_BASE = 8841;

export const formatReportCode = (id: number) => {
    const codeNumber = id + REPORT_CODE_BASE;
    return `${REPORT_CODE_PREFIX}-${String(codeNumber).padStart(4, '0')}`;
};

export const withReportCode = <T extends { id: number }>(report: T) => ({
    ...report,
    report_code: formatReportCode(report.id),
});
