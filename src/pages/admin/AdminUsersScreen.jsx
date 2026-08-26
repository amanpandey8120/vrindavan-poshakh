import React, { useState, useEffect, useCallback } from 'react';
import { SCREENS } from '../../context/NavigationContext';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import { supabase } from '../../lib/supabase';

export default function AdminUsersScreen() {
  const { isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modals
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    activeUsers: 0,
    suspendedUsers: 0,
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch from auth.users (using admin API would require service role)
      // Instead, we'll use the profiles table which has the user data
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      // Apply filters
      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`);
      }
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply sorting
      query = query.order(sortConfig.key, { ascending: sortConfig.direction === 'asc' });

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error: fetchError, count } = await query;

      if (fetchError) throw fetchError;

      setUsers(data || []);
      setTotalUsers(count || 0);

      // Calculate stats from all profiles (without pagination)
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('role, status');

      if (allProfiles) {
        setStats({
          totalUsers: allProfiles.length,
          totalAdmins: allProfiles.filter(p => p.role === 'admin').length,
          activeUsers: allProfiles.filter(p => p.status === 'active').length,
          suspendedUsers: allProfiles.filter(p => p.status === 'suspended').length,
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter, sortConfig, currentPage, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      setShowRoleModal(false);
      fetchUsers(); // Refresh stats
    } catch (err) {
      setError(err.message || 'Failed to update role');
    }
  };

  const handleStatusChange = async (user, newStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      setShowStatusModal(false);
      fetchUsers(); // Refresh stats
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const openStatusModal = (user) => {
    setSelectedUser(user);
    setShowStatusModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const totalPages = Math.ceil(totalUsers / pageSize);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] text-[#ba1a1a]">block</span>
          <h2 className="text-xl font-serif font-bold text-[#00151b] mt-4">Access Denied</h2>
          <p className="text-[#41484b] mt-2">Admin privileges required to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f4] flex text-[#00151b]">
      <AdminSidebar activeAdminTab={SCREENS.ADMIN_USERS} />

      <main className="flex-1 md:ml-80 flex flex-col min-h-screen">
        <div className="pt-24 pb-16 px-4 md:px-16 max-w-[1280px] w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">Users & Access</h2>
              <p className="text-sm text-[#41484b]">Manage user roles, status, and permissions.</p>
            </div>
          </div>

          {/* Error Toast */}
          {error && (
            <div className="mb-6 p-4 bg-[#fee2e2] border border-[#ef4444]/30 text-[#991b1b] rounded-xl flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-[#991b1b] hover:underline">Dismiss</button>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Total Users</h3>
                <div className="bg-[#f0eee9] p-2 rounded-full text-[#00151b]">
                  <span className="material-symbols-outlined text-[20px]">group</span>
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">{stats.totalUsers}</div>
                <div className="flex items-center text-xs font-bold text-[#41484b]">
                  <span className="material-symbols-outlined text-[16px] mr-1">people</span>
                  <span>All registered users</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Total Admins</h3>
                <div className="bg-[#fef3c7] p-2 rounded-full text-[#92400e]">
                  <span className="material-symbols-outlined text-[20px]">shield_person</span>
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">{stats.totalAdmins}</div>
                <div className="flex items-center text-xs font-bold text-[#41484b]">
                  <span className="material-symbols-outlined text-[16px] mr-1">admin_panel_settings</span>
                  <span>Admin panel access</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Active Users</h3>
                <div className="bg-[#dcfce7] p-2 rounded-full text-[#166534]">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">{stats.activeUsers}</div>
                <div className="flex items-center text-xs font-bold text-[#166534]">
                  <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
                  <span>Can access platform</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#c1c7cb]/20 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xs font-bold text-[#41484b] uppercase tracking-wider">Suspended Users</h3>
                <div className="bg-[#fee2e2] p-2 rounded-full text-[#991b1b]">
                  <span className="material-symbols-outlined text-[20px]">block</span>
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-[#00151b] mb-1">{stats.suspendedUsers}</div>
                <div className="flex items-center text-xs font-bold text-[#ba1a1a]">
                  <span className="material-symbols-outlined text-[16px] mr-1">trending_down</span>
                  <span>Access restricted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table Section */}
          <div className="bg-white rounded-xl shadow-sm border border-[#c1c7cb]/20 overflow-hidden">
            {/* Filters & Search Bar */}
            <div className="p-6 border-b border-[#c1c7cb]/20 flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#41484b]">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </span>
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#fbf9f4] border border-[#c1c7cb] rounded-full text-sm text-[#00151b] focus:outline-none focus:border-[#735c00] focus:ring-1 focus:ring-[#735c00]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-[#c1c7cb] rounded-full px-4 py-2.5 text-xs font-bold text-[#00151b] outline-none min-w-[160px]"
                >
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-[#c1c7cb] rounded-full px-4 py-2.5 text-xs font-bold text-[#00151b] outline-none min-w-[160px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>

                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-[#c1c7cb] rounded-full px-4 py-2.5 text-xs font-bold text-[#00151b] outline-none min-w-[140px]"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#fbf9f4] border-b border-[#c1c7cb]/20">
                  <tr>
                    {[
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'phone', label: 'Phone' },
                      { key: 'role', label: 'Role' },
                      { key: 'status', label: 'Status' },
                      { key: 'created_at', label: 'Created' },
                      { key: 'last_login', label: 'Last Login' },
                      { key: 'actions', label: '' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className={`px-6 py-4 text-left text-xs font-bold text-[#41484b] uppercase tracking-wider cursor-pointer hover:text-[#00151b] transition-colors ${
                          sortConfig.key === col.key ? 'text-[#00151b]' : ''
                        }`}
                        onClick={() => col.key !== 'actions' && handleSort(col.key)}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{col.label}</span>
                          {sortConfig.key === col.key && col.key !== 'actions' && (
                            <span className="material-symbols-outlined text-[16px]">
                              {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c1c7cb]/20">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="material-symbols-outlined text-[32px] text-[#735c00] animate-spin">sync</div>
                        <p className="text-[#41484b] mt-2">Loading users...</p>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <span className="material-symbols-outlined text-[32px] text-[#41484b]">group_off</span>
                        <p className="text-[#41484b] mt-2">No users found</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id} className="hover:bg-[#fbf9f4] transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#fed65b]/40 border-2 border-[#735c00] flex items-center justify-center text-[#735c00] text-sm font-bold">
                              {getInitials(user.full_name)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#00151b]">{user.full_name || '—'}</p>
                              <p className="text-xs text-[#41484b]">ID: {user.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#00151b]">{user.email || '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-[#41484b]">{user.phone || '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === 'admin'
                              ? 'bg-[#fef3c7] text-[#924000] border border-[#fed65b]/50'
                              : 'bg-[#f0eee9] text-[#41484b]'
                          }`}>
                            {user.role === 'admin' ? (
                              <>
                                <span className="material-symbols-outlined text-[14px] mr-1">shield_person</span>
                                Admin
                              </>
                            ) : (
                              'User'
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            user.status === 'active'
                              ? 'bg-[#dcfce7] text-[#166534] border border-[#22c55e]/30'
                              : 'bg-[#fee2e2] text-[#991b1b] border border-[#ef4444]/30'
                          }`}>
                            {user.status === 'active' ? (
                              <>
                                <span className="material-symbols-outlined text-[14px] mr-1">check_circle</span>
                                Active
                              </>
                            ) : (
                              <>
                                <span className="material-symbols-outlined text-[14px] mr-1">block</span>
                                Suspended
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-[#41484b]">
                          {formatDate(user.created_at)}
                        </td>
                        <td className="px-6 py-4 text-sm text-[#41484b]">
                          {formatDateTime(user.last_login || user.updated_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openRoleModal(user)}
                              className="p-2 text-[#41484b] hover:text-[#735c00] hover:bg-[#f0eee9] rounded-full transition-colors"
                              title="Change Role"
                            >
                              <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                            </button>
                            <button
                              onClick={() => openStatusModal(user)}
                              className={`p-2 rounded-full transition-colors ${
                                user.status === 'active'
                                  ? 'text-[#166534] hover:bg-[#dcfce7]'
                                  : 'text-[#991b1b] hover:bg-[#fee2e2]'
                              }`}
                              title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                {user.status === 'active' ? 'block' : 'check_circle'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-[#c1c7cb]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-[#41484b]">
                  Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-semibold text-[#00151b] bg-white border border-[#c1c7cb] rounded-full hover:bg-[#f0eee9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-8 h-8 rounded-full text-sm font-bold transition-colors ${
                            currentPage === pageNum
                              ? 'bg-[#fed65b] text-[#745c00]'
                              : 'text-[#41484b] hover:bg-[#f0eee9]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-semibold text-[#00151b] bg-white border border-[#c1c7cb] rounded-full hover:bg-[#f0eee9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-[#00151b]">Change Role</h3>
              <button onClick={() => setShowRoleModal(false)} className="text-[#41484b] hover:text-[#00151b] p-1">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            <p className="text-sm text-[#41484b] mb-6">Update role for <strong className="text-[#00151b]">{selectedUser.full_name || selectedUser.email}</strong></p>
            <div className="space-y-3">
              {['user', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(selectedUser, role)}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                    selectedUser.role === role
                      ? 'bg-[#fed65b] text-[#745c00] border-[#fed65b]'
                      : 'bg-white text-[#41484b] border-[#c1c7cb] hover:border-[#735c00] hover:text-[#00151b]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {role === 'admin' && <span className="material-symbols-outlined text-[20px]">shield_person</span>}
                    {role === 'user' && <span className="material-symbols-outlined text-[20px]">person</span>}
                    <span className="capitalize">{role}</span>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowRoleModal(false)}
              className="mt-4 w-full py-2.5 text-sm font-bold text-[#41484b] hover:text-[#00151b] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-serif font-bold text-[#00151b]">
                {selectedUser.status === 'active' ? 'Suspend User' : 'Activate User'}
              </h3>
              <button onClick={() => setShowStatusModal(false)} className="text-[#41484b] hover:text-[#00151b] p-1">
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>
            <p className="text-sm text-[#41484b] mb-6">
              {selectedUser.status === 'active'
                ? 'This will prevent the user from accessing their account.'
                : 'This will restore the user\'s access to their account.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleStatusChange(selectedUser, selectedUser.status === 'active' ? 'suspended' : 'active')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  selectedUser.status === 'active'
                    ? 'bg-[#ef4444] text-white hover:bg-[#dc2626]'
                    : 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
                }`}
              >
                {selectedUser.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-[#41484b] bg-white border border-[#c1c7cb] hover:border-[#735c00] hover:text-[#00151b] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
