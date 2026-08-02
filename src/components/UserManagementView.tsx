'use client';

import React, { useState } from 'react';
import { useStore, UserAccount, UserStatus, Role } from '../store/useStore';
import CreateUserModal from './CreateUserModal';
import UserHistoryModal from './UserHistoryModal';
import { 
  Users, UserPlus, Search, Filter, Download, Upload, MoreVertical, 
  CheckCircle2, Ban, Trash2, KeyRound, Mail, History, Shield, AlertTriangle, FileSpreadsheet, Sparkles 
} from 'lucide-react';

export default function UserManagementView() {
  const { 
    users, activeRole, updateUserStatus, deleteUserAccount, resetUserPassword 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [historyUser, setHistoryUser] = useState<UserAccount | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Status Alerts
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
      case 'Inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-300';
      case 'Invited': return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300';
      case 'Suspended': return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';
      case 'Blocked': return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300';
      case 'Pending Verification': return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleResetPass = (user: UserAccount) => {
    const tempPass = resetUserPassword(user.id);
    setNotificationBanner(`Password reset for ${user.name}. Temporary credentials: ${tempPass}`);
    setActionMenuOpen(null);
    setTimeout(() => setNotificationBanner(null), 5000);
  };

  const handleExport = (format: 'CSV' | 'Excel') => {
    setNotificationBanner(`Exported ${filteredUsers.length} user records to OmniFlow_Users_Export.${format.toLowerCase()}`);
    setTimeout(() => setNotificationBanner(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              Administration Module
            </span>
            <span className="text-xs text-gray-400 font-semibold">• {users.length} Registered Accounts</span>
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white mt-1">User Management & Account Provisioning</h1>
          <p className="text-xs text-gray-500">Manage user accounts, invitations, RBAC permissions, status badges & login history</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('CSV')}
            className="px-3.5 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export List</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New User</span>
          </button>
        </div>
      </div>

      {notificationBanner && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{notificationBanner}</span>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search users by name, email, company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-[var(--border)] outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 font-medium">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--border)]"
            >
              <option value="All">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Agency Admin</option>
              <option value="employee">Employee</option>
              <option value="client">Client</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 dark:bg-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--border)]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Invited">Invited</option>
              <option value="Suspended">Suspended</option>
              <option value="Blocked">Blocked</option>
              <option value="Pending Verification">Pending Verification</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main User Data Table */}
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-gray-400 font-bold uppercase text-[10px]">
              <th className="py-3 px-3">User Profile</th>
              <th className="py-3 px-3">Role</th>
              <th className="py-3 px-3">Company & Dept</th>
              <th className="py-3 px-3">Assigned Clients</th>
              <th className="py-3 px-3">Status Badge</th>
              <th className="py-3 px-3">Last Login</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all">
                
                {/* Profile Info */}
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20" />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {u.is2FAEnabled && <span title="2FA Protected"><Shield className="w-3 h-3 text-emerald-500" /></span>}
                      </div>
                      <div className="text-[11px] text-gray-400">{u.email}</div>
                    </div>
                  </div>
                </td>

                {/* Role Badge */}
                <td className="py-3.5 px-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {u.role.replace('_', ' ')}
                  </span>
                </td>

                {/* Company & Department */}
                <td className="py-3.5 px-3">
                  <div className="font-bold text-gray-800 dark:text-gray-200">{u.company}</div>
                  <div className="text-[10px] text-gray-400">{u.designation}</div>
                </td>

                {/* Assigned Clients */}
                <td className="py-3.5 px-3 text-gray-600 dark:text-gray-400">
                  {u.assignedClients.join(', ') || 'Global'}
                </td>

                {/* Color-Coded Status Badge */}
                <td className="py-3.5 px-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(u.status)}`}>
                    {u.status}
                  </span>
                </td>

                {/* Last Login */}
                <td className="py-3.5 px-3 text-gray-500 text-[11px]">
                  {u.lastLogin}
                </td>

                {/* Actions Dropdown */}
                <td className="py-3.5 px-3 text-right relative">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setHistoryUser(u)}
                      title="View Login History Audit Log"
                      className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                    >
                      <History className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActionMenuOpen(actionMenuOpen === u.id ? null : u.id)}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Context Action Menu */}
                  {actionMenuOpen === u.id && (
                    <div className="absolute right-3 mt-1 w-48 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl p-1.5 z-30 text-left text-xs font-semibold animate-in fade-in">
                      
                      <button
                        onClick={() => {
                          setEditingUser(u);
                          setShowCreateModal(true);
                          setActionMenuOpen(null);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                      >
                        Edit User Account
                      </button>

                      {u.status === 'Active' ? (
                        <button
                          onClick={() => {
                            updateUserStatus(u.id, 'Suspended');
                            setActionMenuOpen(null);
                          }}
                          className="w-full text-left px-3 py-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl"
                        >
                          Suspend User
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            updateUserStatus(u.id, 'Active');
                            setActionMenuOpen(null);
                          }}
                          className="w-full text-left px-3 py-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl"
                        >
                          Activate Account
                        </button>
                      )}

                      <button
                        onClick={() => handleResetPass(u)}
                        className="w-full text-left px-3 py-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl"
                      >
                        Reset Password
                      </button>

                      <button
                        onClick={() => {
                          deleteUserAccount(u.id);
                          setActionMenuOpen(null);
                        }}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl font-bold"
                      >
                        Delete User
                      </button>

                    </div>
                  )}

                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingUser(null);
        }}
        editingUser={editingUser}
      />

      <UserHistoryModal
        isOpen={!!historyUser}
        onClose={() => setHistoryUser(null)}
        user={historyUser}
      />

    </div>
  );
}
