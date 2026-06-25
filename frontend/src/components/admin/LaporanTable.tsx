'use client';

import Link from 'next/link';
import { AdminReportItem } from '@/lib/adminApi';
import { PRIORITY_MAP, STATUS_OPTIONS, STATUS_STYLE } from '@/lib/constants/status';
import { formatDate } from '@/lib/utils/format';

type LaporanTableProps = {
  reports: AdminReportItem[];
  filteredCount: number;
  page: number;
  totalPages: number;
  perPage: number;
  categories: string[];
  statusFilter: string;
  categoryFilter: string;
  onStatusFilterChange: (value: string) => void;
  onCategoryFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSelectReport: (report: AdminReportItem) => void;
};

export default function LaporanTable({
  reports,
  filteredCount,
  page,
  totalPages,
  perPage,
  categories,
  statusFilter,
  categoryFilter,
  onStatusFilterChange,
  onCategoryFilterChange,
  onPageChange,
  onSelectReport,
}: LaporanTableProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-bold text-on-surface">Kasus Aktif</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Tinjau dan moderasi laporan yang masuk dari komunitas.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <div className="flex items-center gap-1 px-3 py-1.5 glass-card bg-white/30 rounded-[2rem] text-xs font-semibold text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            Status:
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="bg-transparent outline-none text-xs font-bold text-primary cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 glass-card bg-white/30 rounded-[2rem] text-xs font-semibold text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">category</span>
            Kategori:
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              className="bg-transparent outline-none text-xs font-bold text-primary cursor-pointer"
            >
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-on-surface-variant mb-4">
        Menampilkan {Math.min((page - 1) * perPage + 1, filteredCount)}-{Math.min(page * perPage, filteredCount)} dari {filteredCount} laporan
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant border-b border-white/20">
              <th className="text-left pb-3 pr-4 font-semibold">Case ID</th>
              <th className="text-left pb-3 pr-4 font-semibold">Kategori</th>
              <th className="text-left pb-3 pr-4 font-semibold hidden md:table-cell">Pelapor</th>
              <th className="text-left pb-3 pr-4 font-semibold hidden md:table-cell">Tanggal</th>
              <th className="text-left pb-3 pr-4 font-semibold">Status</th>
              <th className="text-left pb-3 pr-4 font-semibold">Prioritas</th>
              <th className="text-left pb-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {reports.map((report) => {
              const priority = PRIORITY_MAP[report.status] ?? { label: 'Rendah', style: 'text-green-600 bg-green-50' };
              const statusStyle = STATUS_STYLE[report.status] ?? 'bg-gray-100 text-gray-600 border-gray-200';
              return (
                <tr key={report.id} className="hover:bg-white/10 transition-colors group">
                  <td className="py-4 pr-4">
                    <span className="font-bold text-primary text-xs">{report.report_code}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/5 text-primary">
                      {report.category}
                    </span>
                  </td>
                  <td className="py-4 pr-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-outline-variant/30 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-sm text-on-surface-variant">
                          {report.is_anonymous ? 'visibility_off' : 'person'}
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant">{report.name}</span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 hidden md:table-cell">
                    <span className="text-xs text-on-surface-variant">{formatDate(report.incident_date)}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusStyle}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${priority.style}`}>
                      {priority.label}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/laporan/${report.id}`}
                        className="px-3 py-1.5 rounded-full bg-primary/5 text-primary text-[11px] font-bold hover:bg-primary/15 transition-colors"
                      >
                        Tinjau
                      </Link>
                      <button
                        onClick={() => onSelectReport(report)}
                        className="p-1.5 rounded-xl bg-white/20 text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors"
                        title="Update status"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredCount === 0 && (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 block">inbox</span>
            <p className="text-sm font-medium">Tidak ada laporan ditemukan</p>
            <p className="text-xs mt-1">Coba ubah filter atau kata kunci pencarian</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-on-surface-variant">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-on-surface-variant hover:bg-primary/10 disabled:opacity-30 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page + i - 2;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                    page === pageNum
                      ? 'bg-primary text-white'
                      : 'bg-white/30 text-on-surface-variant hover:bg-primary/10'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-on-surface-variant hover:bg-primary/10 disabled:opacity-30 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
