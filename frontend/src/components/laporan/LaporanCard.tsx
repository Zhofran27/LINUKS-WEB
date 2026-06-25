import Link from 'next/link';
import { Laporan } from '@/lib/api';
import { CATEGORY_MAP } from '@/lib/constants/category';
import { STATUS_MAP } from '@/lib/constants/status';
import { formatDate } from '@/lib/utils/format';

type LaporanCardProps = {
  item: Laporan;
};

export default function LaporanCard({ item }: LaporanCardProps) {
  const status = STATUS_MAP[item.status_id] || STATUS_MAP[1];
  const category = CATEGORY_MAP[item.category_id] || 'Lainnya';

  return (
    <div className="glass-card p-6 flex flex-col gap-3 group hover:shadow-lg transition-all">
      <div className="flex items-start justify-between gap-2">
        <span className="font-caption text-outline text-xs font-bold tracking-widest">
          {item.report_code}
        </span>
        <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>

      <h3 className="font-headline-sm text-headline-sm text-on-surface leading-snug">
        {item.title}
      </h3>

      <div className="flex flex-wrap gap-3 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">category</span>
          {category}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">calendar_today</span>
          {formatDate(item.incident_date)}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">location_on</span>
          {item.location}
        </span>
        {item.is_anonymous === 1 && (
          <span className="flex items-center gap-1 text-secondary font-bold">
            <span className="material-symbols-outlined text-sm">visibility_off</span>
            Anonim
          </span>
        )}
      </div>

      <p className="font-caption text-on-surface-variant line-clamp-2 text-xs leading-relaxed">
        {item.description}
      </p>

      <div className="mt-auto pt-3 border-t border-white/30 flex items-center justify-between">
        <span className="text-[10px] text-outline uppercase font-bold">
          {formatDate(item.created_at)}
        </span>
        <Link
          href={`/user/laporan/${item.id}`}
          className="flex items-center gap-1 text-primary font-bold text-xs hover:underline group-hover:translate-x-0.5 transition-transform"
        >
          Lihat Detail
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
