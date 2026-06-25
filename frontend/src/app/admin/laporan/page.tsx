'use client';

import { useMemo, useState } from 'react';
import LaporanTable from '@/components/admin/LaporanTable';
import StatCard from '@/components/admin/StatCard';
import StatusModal from '@/components/admin/StatusModal';
import { useAdminLaporan } from '@/hooks/useAdminLaporan';
import { AdminReportItem } from '@/lib/adminApi';

export default function AdminLaporanPage() {
  const { reports, overview, loading, refetch } = useAdminLaporan();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [selectedReport, setSelectedReport] = useState<AdminReportItem | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const categories = useMemo(
    () => ['Semua', ...Array.from(new Set(reports.map((report) => report.category)))],
    [reports],
  );

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return reports.filter((report) => {
      const matchStatus = statusFilter === 'Semua' || report.status === statusFilter;
      const matchCategory = categoryFilter === 'Semua' || report.category === categoryFilter;
      const matchSearch =
        !query ||
        report.report_code.toLowerCase().includes(query) ||
        report.category.toLowerCase().includes(query) ||
        report.name.toLowerCase().includes(query);

      return matchStatus && matchCategory && matchSearch;
    });
  }, [categoryFilter, reports, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const criticalCount = reports.filter(
    (report) => report.status === 'Menunggu Verifikasi' || report.status === 'Perlu Klarifikasi',
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-on-surface-variant text-sm">Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 lg:pb-0">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-in fade-in slide-in-from-left duration-700">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Admin Console
          </span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight">
            Manajemen Laporan
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Tinjau dan kelola laporan yang masuk dari komunitas.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {criticalCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-600">{criticalCount} butuh tindakan</span>
            </div>
          )}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input
              className="pl-10 pr-4 py-3 glass-card bg-white/30 text-sm outline-none focus:ring-2 focus:ring-primary/20 w-44 rounded-[2rem]"
              placeholder="Cari ID, kategori, nama..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending"
          value={reports.filter((report) => report.status === 'Menunggu Verifikasi').length}
          icon="schedule"
          color="text-amber-600 bg-amber-50"
        />
        <StatCard
          label="Dalam Tinjauan"
          value={reports.filter((report) => report.status === 'Diproses').length}
          icon="manage_search"
          color="text-blue-600 bg-blue-50"
        />
        <StatCard
          label="Selesai"
          value={overview?.resolved_cases ?? 0}
          icon="task_alt"
          color="text-green-600 bg-green-50"
        />
        <StatCard
          label="Butuh Tindakan"
          value={criticalCount}
          icon="warning"
          color="text-red-500 bg-red-50"
        />
      </div>

      <LaporanTable
        reports={paginated}
        filteredCount={filtered.length}
        page={page}
        totalPages={totalPages}
        perPage={perPage}
        categories={categories}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        onStatusFilterChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        onCategoryFilterChange={(value) => {
          setCategoryFilter(value);
          setPage(1);
        }}
        onPageChange={setPage}
        onSelectReport={setSelectedReport}
      />

      {selectedReport && (
        <StatusModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
