'use client';

import React from 'react';
import { useStore, UserAccount } from '../store/useStore';
import { 
  History, Laptop, Globe, Shield, X, CheckCircle2 
} from 'lucide-react';

interface UserHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount | null;
}

export default function UserHistoryModal({ isOpen, onClose, user }: UserHistoryModalProps) {
  const { loginHistory } = useStore();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl w-full max-w-xl p-6 space-y-4">
        
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
            <div>
              <h2 className="text-sm font-black text-gray-900 dark:text-white">Login Audit Trail: {user.name}</h2>
              <p className="text-[11px] text-gray-500">{user.email} • Role: {user.role.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {loginHistory.map((item) => (
            <div key={item.id} className="p-3.5 rounded-2xl border border-[var(--border)] bg-gray-50/40 dark:bg-gray-800/30 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{item.device}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {item.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>Date: {item.date}</span>
                <span>IP: {item.ip}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-[var(--border)]">
                <span>Method: <strong>{item.method || 'Google OAuth 2.0'}</strong></span>
                <span>Location: {item.location || 'San Francisco, CA'}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-[var(--border)]">
          <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">
            Close Audit Trail
          </button>
        </div>

      </div>
    </div>
  );
}
