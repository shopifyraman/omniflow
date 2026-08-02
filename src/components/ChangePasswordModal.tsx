'use client';

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  KeyRound, Eye, EyeOff, CheckCircle2, Shield, X 
} from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const { changePassword } = useStore();

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Compute password strength
  const getStrength = (pass: string) => {
    if (!pass) return { label: '', color: '', pct: 0 };
    if (pass.length < 6) return { label: 'Weak', color: 'bg-red-500 text-red-500', pct: 33 };
    if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
      return { label: 'Medium', color: 'bg-amber-500 text-amber-500', pct: 66 };
    }
    return { label: 'Strong (Secure)', color: 'bg-emerald-500 text-emerald-500', pct: 100 };
  };

  const strength = getStrength(newPass);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPass !== confirmPass) {
      setErrorMsg('New passwords do not match!');
      return;
    }
    if (newPass.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    changePassword(currentPass, newPass);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-bold">
              <KeyRound className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-black text-gray-900 dark:text-white">Change Account Password</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {successMsg ? (
          <div className="p-6 text-center space-y-2 text-emerald-600 animate-in fade-in">
            <CheckCircle2 className="w-10 h-10 mx-auto" />
            <div className="text-sm font-bold">Password Updated Successfully!</div>
            <p className="text-xs text-gray-500">Your account security settings have been saved.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            
            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold border border-red-200">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] outline-none pr-10"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-3 text-gray-400">
                  {showCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] outline-none pr-10"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-3 text-gray-400">
                  {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Password Strength Bar */}
              {newPass && (
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>Strength:</span>
                    <span className={strength.color}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color.split(' ')[0]} transition-all`} style={{ width: `${strength.pct}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] outline-none pr-10"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 text-gray-400">
                  {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-xs font-bold rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">
                Update Password
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
