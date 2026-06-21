import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
});

interface StatusEmailParams {
    recipient: string;
    reportTitle: string;
    status: string;
}

export const sendStatusUpdateEmail = async ({
    recipient,
    reportTitle,
    status,
}: StatusEmailParams) => {
    await transporter.sendMail({
        from: `"LINUKS" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: 'Status laporan Anda diperbarui',
        html: `
            <h2>Status Laporan Diperbarui</h2>
            <p>Laporan: <strong>${reportTitle}</strong></p>
            <p>Status terbaru: <strong>${status}</strong></p>
            <p>Silakan buka website LINUKS untuk melihat detail laporan.</p>
        `,
    });
};