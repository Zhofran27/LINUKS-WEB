'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AdminOverview,
  AdminReportItem,
  fetchAdminOverview,
  fetchAdminReports,
} from '@/lib/adminApi';

export function useAdminLaporan() {
  const router = useRouter();
  const [reports, setReports] = useState<AdminReportItem[]>([]);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [reportData, overviewData] = await Promise.all([
        fetchAdminReports(),
        fetchAdminOverview(),
      ]);
      setReports(reportData);
      setOverview(overviewData);
    } catch (e) {
      if ((e as Error).message.includes('401') || (e as Error).message.includes('403')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return {
    reports,
    overview,
    loading,
    refetch: fetchAll,
  };
}
