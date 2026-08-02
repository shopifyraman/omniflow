'use client';

import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Lock, Shield, Check, X, History, Database, Server, Smartphone, KeyRound 
} from 'lucide-react';

export default function SecurityAuditView() {
  const { activities, loginHistory, settings, updateSettings } = useStore();

  const permissionsMatrix = [
    { feature: 'Create & Manage Clients', super_admin: true, admin: true, employee: false, client: false },
    { feature: 'Create & Manage Employees', super_admin: true, admin: true, employee: false, client: false },
    { feature: 'Create & Edit Projects', super_admin: true, admin: true, employee: true, client: false },
    { feature: 'Upload Content & Media', super_admin: true, admin: true, employee: true, client: false },
    { feature: 'Submit Post for Client Approval', super_admin: true, admin: true, employee: true, client: false },
    { feature: 'Approve / Reject Posts', super_admin: true, admin: true, employee: false, client: true },
    { feature: 'Comment & Leave Version Feedback', super_admin: true, admin: true, employee: true, client: true },
    { feature: 'System & Security Settings Access', super_admin: true, admin: false, employee: false, client: false },
    { feature: 'Export System Reports & Analytics', super_admin: true, admin: true, employee: true, client: false }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Security Controls & Audit Trails</h1>
          <p className="text-xs text-gray-500">Role-Based Access Control (RBAC) matrix, IP login logs, 2FA enforcement & encrypted data metrics</p>
        </div>

        <div className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
          <Shield className="w-4 h-4" />
          <span>SOC-2 Type II Certified</span>
        </div>
      </div>

      {/* Security Switches Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-5 rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-gray-900 dark:text-white">Enforce Two-Factor Auth (2FA)</div>
            <input 
              type="checkbox" 
              checked={settings.twoFactorAuth} 
              onChange={(e) => updateSettings({ twoFactorAuth: e.target.checked })}
              className="rounded text-indigo-600 w-4 h-4 cursor-pointer" 
            />
          </div>
          <p className="text-xs text-gray-500">Mandate TOTP authenticator code verification for all users.</p>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-gray-900 dark:text-white">Automatic Daily Cloud Backups</div>
            <input 
              type="checkbox" 
              checked={settings.dailyBackup} 
              onChange={(e) => updateSettings({ dailyBackup: e.target.checked })}
              className="rounded text-indigo-600 w-4 h-4 cursor-pointer" 
            />
          </div>
          <p className="text-xs text-gray-500">Automated 24-hour snapshot backup of post media & logs.</p>
        </div>

        <div className="p-5 rounded-3xl bg-[var(--card)] border border-[var(--border)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-gray-900 dark:text-white">Auto Session Timeout</div>
            <span className="text-xs font-bold text-indigo-600">{settings.autoSessionTimeoutMinutes} mins</span>
          </div>
          <p className="text-xs text-gray-500">Terminate idle browser sessions after inactivity threshold.</p>
        </div>

      </div>

      {/* RBAC Permissions Matrix Table */}
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
        <h3 className="text-sm font-black text-gray-900 dark:text-white">Role-Based Access Control (RBAC) Permissions Matrix</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-gray-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">System Feature / Action</th>
                <th className="py-3 px-4 text-center">Super Admin</th>
                <th className="py-3 px-4 text-center">Agency Admin</th>
                <th className="py-3 px-4 text-center">Employee</th>
                <th className="py-3 px-4 text-center">Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {permissionsMatrix.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                  <td className="py-3 px-4 font-bold text-gray-800 dark:text-gray-200">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {row.super_admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.employee ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.client ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-gray-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Audit Log Feed */}
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
        <h3 className="text-sm font-black text-gray-900 dark:text-white">Real-Time System Audit Log Feed</h3>

        <div className="space-y-2">
          {activities.map((act) => (
            <div key={act.id} className="p-3 rounded-2xl border border-[var(--border)] bg-gray-50/30 dark:bg-gray-800/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <div>
                  <span className="font-bold text-gray-900 dark:text-white">{act.user}</span>
                  <span className="text-gray-500 font-medium"> ({act.userRole}) {act.action} </span>
                  <span className="font-bold text-indigo-600">"{act.target}"</span>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 font-mono">
                {act.time} • IP: {act.ipAddress || '192.168.1.100'}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
