'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  nim: string | null;
  role: string;
  is_active: number;
  created_at: string;
}

type UserRole = 'all' | 'user' | 'admin';
type UserStatus = 'all' | 'active' | 'deactivated';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function UserManagementPage() {
  const [activeRoleFilter, setActiveRoleFilter] = useState<UserRole>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<UserStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Fetch users from backend
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_BASE}/admin/users/data`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => {
    if (activeRoleFilter !== 'all' && user.role !== activeRoleFilter) return false;
    if (activeStatusFilter === 'active' && user.is_active !== 1) return false;
    if (activeStatusFilter === 'deactivated' && user.is_active !== 0) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active === 1).length,
    deactivatedUsers: users.filter(u => u.is_active === 0).length,
  };

  const handleDeactivate = useCallback(async (id: number) => {
    try {
      setActionLoading(id);
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_BASE}/admin/users/deactivate/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to deactivate user');
      }

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate user');
    } finally {
      setActionLoading(null);
    }
  }, [fetchUsers]);

  const handleReactivate = useCallback(async (id: number) => {
    try {
      setActionLoading(id);
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_BASE}/admin/users/reactivate/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to reactivate user');
      }

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reactivate user');
    } finally {
      setActionLoading(null);
    }
  }, [fetchUsers]);

  const handleUpdateRole = useCallback(async (id: number, newRole: string) => {
    try {
      setActionLoading(id);
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_BASE}/admin/users/role/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        throw new Error('Failed to update role');
      }

      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setActionLoading(null);
    }
  }, [fetchUsers]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-md text-xs">Admin</span>;
      case 'user':
        return <span className="px-3 py-1 rounded-full bg-secondary-container text-secondary font-label-md text-xs">User</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-md text-xs">{role}</span>;
    }
  };

  const getStatusIndicator = (isActive: number) => {
    if (isActive === 1) {
      return (
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span className="font-body-md text-body-md text-on-surface">Active</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-error"></span>
        <span className="font-body-md text-body-md text-error font-semibold">Deactivated</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-headline-md text-headline-md text-primary tracking-tight">User Management</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Manage roles and permissions for all users.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-card p-4 rounded-lg bg-error/10 border-error/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-error">error</span>
          <p className="font-body-md text-body-md text-error">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Stats Bento */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <span className="material-symbols-outlined text-primary">group</span>
            </div>
            <span className="text-xs font-label-md text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+4.2%</span>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant">Total Users</p>
          <h3 className="font-headline-md text-headline-md">{stats.totalUsers.toLocaleString()}</h3>
        </div>
        <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container/30 rounded-lg">
              <span className="material-symbols-outlined text-secondary">check_circle</span>
            </div>
            <span className="text-xs font-label-md text-on-surface-variant/50 bg-white/30 px-2 py-0.5 rounded-full">Static</span>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant">Active Users</p>
          <h3 className="font-headline-md text-headline-md">{stats.activeUsers}</h3>
        </div>
        <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-tertiary-container/30 rounded-lg">
              <span className="material-symbols-outlined text-tertiary">block</span>
            </div>
            <span className="text-xs font-label-md text-primary bg-primary/10 px-2 py-0.5 rounded-full">High</span>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant">Deactivated</p>
          <h3 className="font-headline-md text-headline-md">{stats.deactivatedUsers}</h3>
        </div>
      </div>

      {/* User Directory Table */}
      <section className="glass-card rounded-lg overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/30 flex justify-between items-center">
          <div>
            <h4 className="font-headline-sm text-headline-sm text-on-surface">User Directory</h4>
            <p className="font-body-md text-body-md text-on-surface-variant">Manage roles and permissions for all users.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full border border-outline-variant font-label-md text-label-md text-on-surface-variant hover:bg-white/30 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
            <button className="px-4 py-2 rounded-full border border-outline-variant font-label-md text-label-md text-on-surface-variant hover:bg-white/30 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-white/20 flex items-center gap-4 flex-wrap">
          <span className="font-label-md text-label-md text-on-surface-variant">Role:</span>
          {(['all', 'user', 'admin'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => setActiveRoleFilter(role)}
              className={`px-4 py-1.5 rounded-full font-label-md text-xs transition-all ${
                activeRoleFilter === role 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'glass-card text-on-surface-variant hover:text-primary'
              }`}
            >
              {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="font-label-md text-label-md text-on-surface-variant">Status:</span>
            <select
              value={activeStatusFilter}
              onChange={(e) => setActiveStatusFilter(e.target.value as UserStatus)}
              className="bg-transparent border-none font-label-md text-label-md text-primary focus:ring-0 cursor-pointer"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="font-body-md text-body-md text-on-surface-variant">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/10 font-label-md text-label-md text-on-surface-variant/70 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">NIM</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-white/30 transition-colors ${user.is_active === 0 ? 'bg-error/5' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full overflow-hidden border-2 border-white ${user.is_active === 0 ? 'grayscale opacity-60' : ''}`}>
                          <img src={getAvatarUrl(user.name)} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div className={user.is_active === 0 ? 'opacity-60' : ''}>
                          <p className="font-label-md text-label-md text-on-surface">{user.name}</p>
                          <p className="font-caption text-caption text-on-surface-variant/60">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 font-body-md text-body-md text-on-surface-variant ${user.is_active === 0 ? 'opacity-60' : ''}`}>
                      {user.nim || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className={user.is_active === 0 ? 'opacity-60' : ''}>
                        {getRoleBadge(user.role)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusIndicator(user.is_active)}
                    </td>
                    <td className={`px-6 py-4 font-body-md text-body-md text-on-surface-variant ${user.is_active === 0 ? 'opacity-60' : ''}`}>
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.is_active === 0 ? (
                          <button 
                            onClick={() => handleReactivate(user.id)}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1 bg-primary/10 text-primary font-label-md text-xs rounded-full hover:bg-primary/20 transition-all disabled:opacity-50"
                          >
                            {actionLoading === user.id ? '...' : 'Reactivate'}
                          </button>
                        ) : (
                          <>
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                              disabled={actionLoading === user.id}
                              className="bg-transparent border border-outline-variant/30 rounded-full px-3 py-1 text-xs font-label-md text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button 
                              onClick={() => handleDeactivate(user.id)}
                              disabled={actionLoading === user.id}
                              className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-full transition-all disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[20px]">block</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredUsers.length === 0 && (
          <div className="glass-card p-12 rounded-lg flex flex-col items-center justify-center gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] opacity-40">search_off</span>
            <p className="font-body-md text-body-md">No users found</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredUsers.length > 0 && (
          <div className="p-4 border-t border-white/30 flex justify-between items-center bg-white/5">
            <span className="font-caption text-caption text-on-surface-variant">
              Showing 1-{filteredUsers.length} of {filteredUsers.length} users
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-white/30 disabled:opacity-30" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-label-md text-xs">1</button>
              <button className="p-2 rounded-lg hover:bg-white/30">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Bottom Info Cards */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8 glass-card rounded-lg p-6 flex items-center gap-8 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-primary mb-2">
              <span className="material-symbols-outlined">auto_awesome</span>
              <h5 className="font-headline-sm text-headline-sm">Smart Role Recommendation</h5>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Based on account activity, {stats.activeUsers} users are currently active. Monitor inactive accounts to maintain platform security.
            </p>
            <button className="bg-primary/10 text-primary font-label-md text-label-md px-6 py-2.5 rounded-full hover:bg-primary/20 transition-all">
              View Activity Log
            </button>
          </div>
          <div className="w-32 h-32 relative hidden md:block">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute inset-4 bg-primary/10 rounded-full blur-lg"></div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 glass-card rounded-lg p-6 bg-secondary/5 border-secondary/20">
          <h5 className="font-label-md text-label-md text-secondary mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">policy</span>
            System Audit
          </h5>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
              <span className="font-body-md text-sm text-on-surface-variant">Total admins: {users.filter(u => u.role === 'admin').length}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
              <span className="font-body-md text-sm text-on-surface-variant">Active users: {stats.activeUsers}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
              <span className="font-body-md text-sm text-on-surface-variant">Deactivated: {stats.deactivatedUsers}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}