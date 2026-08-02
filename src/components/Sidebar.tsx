'use client';

import React from 'react';
import { useStore, Role } from '../store/useStore';
import { 
  LayoutDashboard, Users, UserCheck, FolderKanban, FileCheck2, Image, 
  CalendarRange, CheckSquare, MessageSquare, BarChart3, Bell, Lock, 
  Settings, User, HelpCircle, LogOut, LucideIcon, Sparkles, ChevronLeft, ChevronRight, Share2, Layers
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  allowedRoles: Role[];
}

const MENU_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, allowedRoles: ['super_admin', 'admin', 'employee', 'client'] },
  { id: 'user-management', label: 'User Management', icon: UserCheck, badge: 'RBAC', allowedRoles: ['super_admin', 'admin'] },
  { id: 'clients', label: 'Clients', icon: Users, allowedRoles: ['super_admin', 'admin'] },
  { id: 'projects', label: 'Projects', icon: FolderKanban, allowedRoles: ['super_admin', 'admin', 'employee'] },
  { id: 'content', label: 'Content Workflow', icon: FileCheck2, badge: '11 Stages', allowedRoles: ['super_admin', 'admin', 'employee', 'client'] },
  { id: 'approval-center', label: 'Approval Center', icon: CheckSquare, badge: 'V2 Compare', allowedRoles: ['super_admin', 'admin', 'employee', 'client'] },
  { id: 'media-library', label: 'Media Library', icon: Image, allowedRoles: ['super_admin', 'admin', 'employee', 'client'] },
  { id: 'calendar', label: 'Calendar', icon: CalendarRange, allowedRoles: ['super_admin', 'admin', 'employee', 'client'] },
  { id: 'tasks', label: 'Tasks', icon: Layers, allowedRoles: ['super_admin', 'admin', 'employee'] },
  { id: 'comments', label: 'Comments Hub', icon: MessageSquare, allowedRoles: ['super_admin', 'admin', 'employee', 'client'] },
  { id: 'employees', label: 'Employees', icon: Users, allowedRoles: ['super_admin', 'admin'] },
  { id: 'reports', label: 'Analytics & Reports', icon: BarChart3, allowedRoles: ['super_admin', 'admin', 'employee'] },
  { id: 'integrations', label: 'Integrations', icon: Share2, badge: '12 APIs', allowedRoles: ['super_admin', 'admin'] },
  { id: 'security', label: 'Security & Audit', icon: Lock, allowedRoles: ['super_admin'] },
  { id: 'settings', label: 'Settings', icon: Settings, allowedRoles: ['super_admin', 'admin', 'employee', 'client'] },
  { id: 'profile', label: 'Profile', icon: User, allowedRoles: ['super_admin', 'admin', 'employee', 'client'] },
];

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ currentView, setCurrentView, isCollapsed, setIsCollapsed }: SidebarProps) {
  const { activeRole, activeUser, logout } = useStore();

  const filteredMenuItems = MENU_ITEMS.filter(item => item.allowedRoles.includes(activeRole));

  return (
    <aside 
      className={`border-r border-[var(--border)] bg-[var(--card)] flex flex-col h-full z-30 transition-all duration-300 relative ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-black text-lg text-gray-900 dark:text-white tracking-tight leading-none">OmniFlow</span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">Enterprise SaaS</span>
            </div>
          )}
        </div>

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-all hidden sm:flex"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Badge Indicator */}
      {!isCollapsed && (
        <div className="mx-4 mt-4 p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-indigo-900 dark:text-indigo-200 capitalize">
              Role: {activeRole.replace('_', ' ')}
            </span>
          </div>
          <span className="text-[10px] font-medium text-gray-400">Scoped</span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-[var(--border)] bg-gray-50/50 dark:bg-gray-900/30">
        <div className="flex items-center gap-3">
          <img 
            src={activeUser.avatar} 
            alt={activeUser.name} 
            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20 flex-shrink-0" 
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{activeUser.name}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{activeUser.email}</div>
            </div>
          )}
          {!isCollapsed && (
            <button 
              onClick={logout}
              title="Logout" 
              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
