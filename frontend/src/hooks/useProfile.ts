'use client';

import { useState, useEffect, useCallback } from 'react';

interface ProfileData {
  name: string;
  email: string;
  nim?: string | null;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  nim?: string;
}

export function useProfile() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Unauthorized - please login again');
        }
        throw new Error('Failed to fetch profile');
      }

      const profileData = await res.json();
      setData(profileData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updateData: UpdateProfileData) => {
    try {
      setUpdating(true);
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await res.json();
      setData(prev => prev ? { ...prev, ...updateData } : null);
      return updatedData;
    } catch (err) {
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { data, loading, error, updating, refetch: fetchProfile, updateProfile };
}