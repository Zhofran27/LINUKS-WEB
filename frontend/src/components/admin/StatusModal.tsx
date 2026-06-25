'use client';

import { useState } from 'react';
import { AdminReportItem, updateAdminReportStatus } from '@/lib/adminApi';
import { STATUS_OPTIONS } from '@/lib/constants/status';

type StatusModalProps = {
  report: AdminReportItem;
  onClose: () => void;
  onSuccess: () => void;
};

export default function StatusModal({ report, onClose, onSuccess }: StatusModalProps) {
  const [selected, setSelected] = useState(report.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateAdminReportStatus(report.id, selected);
      onSuccess();
      onClose();
    } catch (e) {
      setError((e as Error).message || 'Gagal update status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative glass-card p-8 w-full max-w-md z-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-on-surface-variant hover:bg-primary/10 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>

        <h3 className="font-bold text-on-surface mb-1">Update Status Laporan</h3>
        <p className="text-xs text-on-surface-variant mb-6">
          <span className="font-bold text-primary">{report.report_code}</span> - {report.category}
        </p>

        <div className="space-y-2 mb-6">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setSelected(status)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left text-sm font-medium ${
                selected === status
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-white/20 text-on-surface-variant hover:bg-white/40'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${selected === status ? 'border-primary bg-primary' : 'border-outline'}`}>
                {selected === status && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              {status}
            </button>
          ))}
        </div>

        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || selected === report.status}
          className="w-full py-3 bg-primary text-white font-bold rounded-[2rem] disabled:opacity-50 active:scale-95 transition-all glow-pink"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>
    </div>
  );
}
