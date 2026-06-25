import { ADMIN_TIMELINE_STEPS, USER_TIMELINE_STEPS } from '@/lib/constants/status';

type LaporanTimelineProps = {
  statusId?: number;
  status?: string;
  rejectedText?: string;
};

export default function LaporanTimeline({ statusId, status, rejectedText = 'Ditandai oleh admin' }: LaporanTimelineProps) {
  const isAdminTimeline = Boolean(status);
  const steps = isAdminTimeline ? ADMIN_TIMELINE_STEPS : USER_TIMELINE_STEPS;
  const currentStepIndex = isAdminTimeline
    ? ADMIN_TIMELINE_STEPS.findIndex((step) => step.status === status)
    : USER_TIMELINE_STEPS.findIndex((step) => step.status_id === statusId);
  const isRejected = status === 'Ditolak' || statusId === 6;

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, index) => {
        const key = 'status' in step ? step.status : step.status_id;
        const isDone = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isLast = index === steps.length - 1;

        let dotClass = 'bg-white/30 text-on-surface-variant border border-white/40';
        if (isRejected && isCurrent) {
          dotClass = 'bg-red-100 text-red-600 border border-red-200';
        } else if (isCurrent) {
          dotClass = 'bg-primary text-white shadow-lg glow-pink';
        } else if (isDone) {
          dotClass = 'bg-primary-container text-primary border border-primary/20';
        }

        return (
          <div key={key} className="flex gap-3 relative">
            {!isLast && (
              <div className={`absolute left-[15px] top-9 bottom-0 w-0.5 ${isDone ? 'bg-primary/30' : 'bg-white/20'}`} />
            )}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${dotClass}`}>
              <span className="material-symbols-outlined text-sm">{step.icon}</span>
            </div>
            <div className="pb-6">
              <p className={`font-label-md text-label-md leading-tight ${isCurrent ? 'text-primary font-bold' : isDone ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                {step.label}
              </p>
              {isCurrent && <p className="font-caption text-xs text-on-surface-variant mt-0.5">Sedang berlangsung</p>}
              {isDone && <p className="font-caption text-xs text-outline mt-0.5">Selesai</p>}
            </div>
          </div>
        );
      })}

      {isRejected && (
        <div className="flex gap-3 mt-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100 text-red-600 border border-red-200">
            <span className="material-symbols-outlined text-sm">cancel</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-red-700 font-bold">Laporan Ditolak</p>
            <p className="font-caption text-xs text-on-surface-variant mt-0.5">{rejectedText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
