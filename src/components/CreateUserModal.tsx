'use client';

import React, { useState } from 'react';
import { useStore, Role, UserAccount } from '../store/useStore';
import { 
  UserPlus, Mail, Shield, CheckCircle2, Copy, Eye, Lock, Sparkles, X, Send, AlertTriangle, KeyRound 
} from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser?: UserAccount | null;
}

export default function CreateUserModal({ isOpen, onClose, editingUser }: CreateUserModalProps) {
  const { addUserAccount, inviteUserAccount, activeRole, employees, clients } = useStore();

  const [activeTab, setActiveTab] = useState<'create' | 'invite'>('create');
  
  // Form fields
  const [fullName, setFullName] = useState(editingUser?.name || '');
  const [email, setEmail] = useState(editingUser?.email || '');
  const [phone, setPhone] = useState(editingUser?.phone || '+1 (555) 0199');
  const [selectedRole, setSelectedRole] = useState<Role>(editingUser?.role || 'employee');
  const [company, setCompany] = useState(editingUser?.company || 'OmniFlow Global Media');
  const [department, setDepartment] = useState(editingUser?.department || 'Content & Social');
  const [designation, setDesignation] = useState(editingUser?.designation || 'Social Media Specialist');
  const [assignedManager, setAssignedManager] = useState('Michael Ross');
  const [avatar, setAvatar] = useState(editingUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&fit=crop&q=80');
  const [timeZone, setTimeZone] = useState('America/Los_Angeles (PST)');
  const [language, setLanguage] = useState('English (US)');

  // Checkboxes
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [generateTempPassword, setGenerateTempPassword] = useState(true);
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [enableGoogleLogin, setEnableGoogleLogin] = useState(true);
  const [enable2FA, setEnable2FA] = useState(false);

  // Email Preview Modal State
  const [createdUser, setCreatedUser] = useState<UserAccount | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [adminPermissionError, setAdminPermissionError] = useState('');

  if (!isOpen) return null;

  // Check permission restriction: Admin cannot create Super Admin
  const handleRoleChange = (r: Role) => {
    if (activeRole === 'admin' && r === 'super_admin') {
      setAdminPermissionError('Agency Admins do not have permission to create Super Admin accounts.');
      return;
    }
    setAdminPermissionError('');
    setSelectedRole(r);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPermissionError) return;

    const newAcc = addUserAccount({
      name: fullName,
      email,
      phone,
      role: selectedRole,
      company,
      department,
      designation,
      assignedManager,
      assignedClients: [company],
      status: 'Active',
      avatar,
      timeZone,
      language,
      isGoogleEnabled: enableGoogleLogin,
      is2FAEnabled: enable2FA,
      forcePasswordChange
    });

    if (sendWelcomeEmail) {
      setCreatedUser(newAcc);
      setShowEmailPreview(true);
    } else {
      onClose();
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const invitedAcc = inviteUserAccount(email, selectedRole, company);
    setCreatedUser(invitedAcc);
    setShowEmailPreview(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white">
                {editingUser ? 'Edit User Account' : 'User Account Provisioning'}
              </h2>
              <p className="text-xs text-gray-500">Create new user, assign RBAC permissions & send welcome credentials</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-xl p-1.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        {!editingUser && (
          <div className="flex border-b border-[var(--border)] bg-gray-50/50 dark:bg-gray-900/30 px-6 pt-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-3 border-b-2 transition-all ${
                activeTab === 'create' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500'
              }`}
            >
              Direct Account Creation
            </button>
            <button
              onClick={() => setActiveTab('invite')}
              className={`px-4 py-3 border-b-2 transition-all ${
                activeTab === 'invite' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500'
              }`}
            >
              Send Secure Invitation Link
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* Welcome Email Modal Preview Overlay */}
          {showEmailPreview && createdUser ? (
            <div className="space-y-4 p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 animate-in fade-in">
              <div className="flex items-center justify-between text-indigo-900 dark:text-indigo-200">
                <div className="flex items-center gap-2 font-bold">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  <span>Automated Welcome Email Preview</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Email Dispatched
                </span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-[var(--border)] font-mono text-[11px] space-y-2 text-gray-800 dark:text-gray-200">
                <div><strong>To:</strong> {createdUser.email}</div>
                <div><strong>Subject:</strong> Welcome to OmniFlow Enterprise - Your Account Credentials</div>
                <hr className="border-[var(--border)] my-2" />
                <p>Hello {createdUser.name},</p>
                <p>Your enterprise social media management account has been created.</p>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-1 my-2 border border-[var(--border)]">
                  <div><strong>Login URL:</strong> https://omniflow.io/login</div>
                  <div><strong>Username / Email:</strong> {createdUser.email}</div>
                  <div><strong>Role Assigned:</strong> {createdUser.role.toUpperCase()}</div>
                  {createdUser.tempPassword && (
                    <div><strong>Temporary Password:</strong> <span className="text-indigo-600 font-bold">{createdUser.tempPassword}</span></div>
                  )}
                </div>
                <p className="text-amber-600 font-bold">⚠️ You will be prompted to change your password on first login.</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md"
                >
                  Done & Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={activeTab === 'create' ? handleCreateSubmit : handleInviteSubmit} className="space-y-4">
              
              {adminPermissionError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 rounded-xl text-red-700 dark:text-red-300 font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{adminPermissionError}</span>
                </div>
              )}

              {/* Role Selection Dropdown */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Assigned Platform Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'super_admin', label: 'Super Admin', desc: 'Full System' },
                    { id: 'admin', label: 'Agency Admin', desc: 'Agency Manager' },
                    { id: 'employee', label: 'Employee', desc: 'Creator / Team' },
                    { id: 'client', label: 'Client', desc: 'Client Portal' }
                  ].map(r => {
                    const isSelected = selectedRole === r.id;
                    const isDisabled = activeRole === 'admin' && r.id === 'super_admin';
                    return (
                      <button
                        key={r.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => handleRoleChange(r.id as Role)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isDisabled 
                            ? 'opacity-40 cursor-not-allowed bg-gray-100 border-gray-200' 
                            : isSelected 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                              : 'bg-gray-50 dark:bg-gray-800/40 border-[var(--border)] hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-bold text-xs">{r.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>{r.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Work Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@omniflow.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                  />
                </div>
              </div>

              {activeTab === 'create' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Company</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Department</label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Designation / Title</label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Assign Manager</label>
                      <select
                        value={assignedManager}
                        onChange={(e) => setAssignedManager(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] font-bold"
                      >
                        <option value="Michael Ross">Michael Ross (Senior Agency Director)</option>
                        <option value="Sarah Jenkins">Sarah Jenkins (VP Architecture)</option>
                      </select>
                    </div>
                  </div>

                  {/* Provisioning Checkboxes */}
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-[var(--border)] space-y-2.5">
                    <div className="font-bold text-gray-900 dark:text-white mb-1">Security & Provisioning Settings</div>
                    
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={sendWelcomeEmail} onChange={(e) => setSendWelcomeEmail(e.target.checked)} className="rounded text-indigo-600" />
                      <span>Send welcome email with login link & credentials</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={generateTempPassword} onChange={(e) => setGenerateTempPassword(e.target.checked)} className="rounded text-indigo-600" />
                      <span>Auto-generate temporary initial password</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={forcePasswordChange} onChange={(e) => setForcePasswordChange(e.target.checked)} className="rounded text-indigo-600" />
                      <span>Force password change on first login</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={enableGoogleLogin} onChange={(e) => setEnableGoogleLogin(e.target.checked)} className="rounded text-indigo-600" />
                      <span>Enable Google Workspace OAuth single sign-on</span>
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-xs font-bold rounded-xl">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md">
                  {activeTab === 'create' ? 'Save & Provision Account' : 'Send Secure Invitation'}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
