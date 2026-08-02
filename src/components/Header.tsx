'use client';

import React, { useState } from 'react';
import { useStore, Role } from '../store/useStore';
import ChangePasswordModal from './ChangePasswordModal';
import { 
  Sun, Moon, Bell, Search, Plus, User, Shield, ChevronDown, Check, Lock, 
  KeyRound, Mail, Share2, Globe, Laptop, History, LogOut, X, Edit3, Eye, Sparkles 
} from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onQuickCreate: () => void;
  onOpenAuthModal: () => void;
}

export default function Header({ currentView, setCurrentView, onQuickCreate, onOpenAuthModal }: HeaderProps) {
  const { 
    theme, toggleTheme, activeRole, activeUser, notifications, markNotificationRead, markAllNotificationsRead, logout, settings, toggleGoogleConnection 
  } = useStore();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

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
            className="w-full bg-gray-50 dark:bg-gray-800/80 text-xs px-3.5 py-2 pl-9 rounded-xl border border-[var(--border)] outline-none focus:border-indigo-500 text-gray-800 dark:text-gray-200 transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Right Actions & User Menu */}
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
                {notifications.map((n) => (
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
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Menu (Top Right Corner) */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
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
                {activeRole.replace('_', ' ')}
              </div>
            </div>
          </button>

          {/* Full User Menu Dropdown Panel (13 Items) */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-72 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 max-h-[85vh] overflow-y-auto custom-scrollbar">
              
              {/* Profile Card Summary Header */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-[var(--border)] mb-2">
                <div className="flex items-center gap-2.5">
                  <img src={activeUser.avatar} alt={activeUser.name} className="w-9 h-9 rounded-full object-cover" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{activeUser.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{activeUser.email}</div>
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md inline-block">
                  {activeRole.replace('_', ' ')}
                </div>
              </div>

              {/* 13 Menu Items List */}
              <div className="space-y-0.5 text-xs font-semibold">
                
                <button
                  onClick={() => { setCurrentView('profile'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => { setCurrentView('profile'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => { setShowChangePasswordModal(true); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Change Password</span>
                </button>

                <button
                  onClick={() => { setCurrentView('profile'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Change Email</span>
                </button>

                <button
                  onClick={() => { toggleGoogleConnection(); setShowProfileMenu(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-4 h-4 text-purple-600" />
                    <span>Google Account</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${settings.isGoogleConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                    {settings.isGoogleConnected ? 'Connected' : 'Sync'}
                  </span>
                </button>

                <button
                  onClick={() => { setCurrentView('settings'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Bell className="w-4 h-4 text-pink-600" />
                  <span>Notification Settings</span>
                </button>

                <button
                  onClick={() => { setCurrentView('settings'); setShowProfileMenu(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-sky-600" />
                    <span>Language</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">{settings.language}</span>
                </button>

                <button
                  onClick={() => { toggleTheme(); setShowProfileMenu(false); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2.5">
                    {theme === 'light' ? <Moon className="w-4 h-4 text-indigo-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    <span>Theme</span>
                  </div>
                  <span className="text-[10px] capitalize font-bold text-gray-400">{theme} Mode</span>
                </button>

                <button
                  onClick={() => { onOpenAuthModal(); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Shield className="w-4 h-4 text-teal-600" />
                  <span>Security Settings</span>
                </button>

                <button
                  onClick={() => { onOpenAuthModal(); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <History className="w-4 h-4 text-orange-600" />
                  <span>Login Activity</span>
                </button>

                <button
                  onClick={() => { onOpenAuthModal(); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Laptop className="w-4 h-4 text-indigo-600" />
                  <span>Active Devices</span>
                </button>

                <button
                  onClick={() => { setCurrentView('settings'); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Lock className="w-4 h-4 text-gray-600" />
                  <span>Privacy Settings</span>
                </button>

                <div className="pt-1 border-t border-[var(--border)]">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out / Logout</span>
                  </button>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

    </header>
  );
}
