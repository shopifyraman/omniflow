'use client';

import React, { useState } from 'react';
import { useStore, Role } from '../store/useStore';
import { 
  Sun, Moon, Bell, Search, Plus, User, Shield, ChevronDown, Check, Lock, Sparkles, ExternalLink, X 
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onQuickCreate: () => void;
  onOpenAuthModal: () => void;
}

export default function Header({ currentView, onQuickCreate, onOpenAuthModal }: HeaderProps) {
  const { 
    theme, toggleTheme, activeRole, setRole, activeUser, notifications, markNotificationRead, markAllNotificationsRead 
  } = useStore();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: { id: Role; label: string; desc: string; badgeBg: string }[] = [
    { id: 'super_admin', label: 'Super Admin', desc: 'Full System & Tenant Control', badgeBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' },
    { id: 'admin', label: 'Agency Manager (Admin)', desc: 'Agency Team, Clients & Projects', badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' },
    { id: 'employee', label: 'Employee / Creator', desc: 'Content, Tasks & Schedule', badgeBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' },
    { id: 'client', label: 'Client (Nike Digital)', desc: 'Approvals, Comments & Calendar', badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' }
  ];

  const currentRoleObj = roles.find(r => r.id === activeRole);

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--card)] px-6 flex items-center justify-between z-20 sticky top-0 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
      
      {/* Left: View Breadcrumb & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
          <span className="text-gray-400">OmniFlow</span>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 capitalize font-bold text-sm">{currentView.replace('-', ' ')}</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-64 hidden md:block">
          <input
            type="text"
            placeholder="Search clients, posts, tasks, media..."
            className="w-full bg-gray-50 dark:bg-gray-800/80 text-xs px-3.5 py-2 pl-9 rounded-xl border border-[var(--border)] outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-800 dark:text-gray-200 transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Right Actions & Role Switcher */}
      <div className="flex items-center gap-3">
        
        {/* Quick Post Create */}
        <button 
          onClick={onQuickCreate}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm shadow-indigo-600/30 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          className="p-2 rounded-xl border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notifications Drawer Toggle */}
        <div className="relative">
          <button 
            onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
            className="p-2 rounded-xl border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotificationDrawer && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-gray-900 dark:text-gray-100">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-full text-xs font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={markAllNotificationsRead} 
                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Mark all read
                  </button>
                  <button onClick={() => setShowNotificationDrawer(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="py-2 max-h-80 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-center py-6 text-gray-400">No notifications yet.</p>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        n.read 
                          ? 'border-[var(--border)] bg-gray-50/50 dark:bg-gray-900/20 text-gray-500' 
                          : 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 text-gray-900 dark:text-gray-100 font-medium'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{n.title}</span>
                        <span className="text-[10px] text-gray-400">{n.time}</span>
                      </div>
                      <p className="text-xs mt-1 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Security / Auth Status Trigger */}
        <button
          onClick={onOpenAuthModal}
          title="Security & Auth Settings"
          className="p-2 rounded-xl border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800 text-emerald-600 dark:text-emerald-400 transition-all flex items-center gap-1 text-xs font-semibold"
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden lg:inline text-[11px]">Auth & 2FA</span>
        </button>

        {/* Interactive Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-left"
          >
            <img 
              src={activeUser.avatar} 
              alt={activeUser.name} 
              className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30" 
            />
            <div className="hidden sm:block">
              <div className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1">
                <span>{activeUser.name}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>
              <div className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
                {currentRoleObj?.label.split(' ')[0]} Role
              </div>
            </div>
          </button>

          {/* Role Selection Menu Modal */}
          {showRoleDropdown && (
            <div className="absolute right-0 mt-3 w-72 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-[var(--border)] mb-2">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Switch Active Role</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400">Select role to test UI views & permissions</div>
              </div>

              <div className="space-y-1.5">
                {roles.map((r) => {
                  const isSelected = activeRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        setRole(r.id);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full flex items-start p-2.5 rounded-xl text-left transition-all ${
                        isSelected 
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800' 
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{r.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
