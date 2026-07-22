'use client';

import React from 'react';
import { useStore, Role } from '../store/useStore';
import { 
  LayoutDashboard, Users, FileCheck2, Image, 
  CalendarRange, CheckSquare, Settings, LogOut, LucideIcon 
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const MENU_MAP: Record<Role, SidebarItem[]> = {
  super_admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  employee: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'posts', label: 'Posts & Workflow', icon: FileCheck2 },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'tasks', label: 'Tasks Board', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: CalendarRange },
  ],
  client: [
    { id: 'dashboard', label: 'Client Portal', icon: LayoutDashboard },
    { id: 'posts', label: 'Approvals Center', icon: FileCheck2 },
    { id: 'media', label: 'Media Downloads', icon: Image },
  ]
};

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const { activeRole, activeUser, setRole } = useStore();
  const menuItems = MENU_MAP[activeRole] || [];

  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] flex flex-col h-full z-10">
      <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          <span>OmniFlow</span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border)] bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center font-semibold text-sm">
            {activeUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">{activeUser.name}</div>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{activeRole.replace('_', ' ')}</div>
          </div>
          <button 
            onClick={() => setRole('super_admin')}
            title="Log Out" 
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
