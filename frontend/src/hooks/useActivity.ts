'use client';

import { useState, useEffect, useCallback } from 'react';

interface ActivityMetadata {
  report_id?: number;
  report_code?: string;
  title?: string;
  message?: string;
  type?: string;
}

interface Activity {
  _id: string;
  activity: string;
  metadata: ActivityMetadata;
  created_at: string;
}

export function useActivity(limit: number = 5) {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch(`/api/user/recent-activity?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - please login again');
        }
        throw new Error('Failed to fetch activities');
      }

      const activitiesData = await res.json();
      setData(Array.isArray(activitiesData) ? activitiesData : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return { data, loading, error, refetch: fetchActivities };
}