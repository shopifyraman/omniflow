'use client';

import React from 'react';
import { useStore } from '../store/useStore';
import { Sun, Moon, Bell, Search, Plus } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onQuickCreate: () => void;
}

export default function Header({ currentView, onQuickCreate }: HeaderProps) {
  const { theme, toggleTheme, notifications } = useStore();

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--card)] px-6 flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 text-sm font-medium">Workspace</span>
        <span className="text-gray-400 text-sm">/</span>
        <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 capitalize">{currentView}</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-48">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-50 dark:bg-gray-800 text-xs px-3 py-1.5 pl-8 rounded-lg border border-[var(--border)] outline-none focus:border-indigo-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>

        {/* Quick Create Post */}
        <button 
          onClick={onQuickCreate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create</span>
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-600 rounded-full border-2 border-white dark:border-gray-900" />
          </button>
        </div>
      </div>
    </header>
  );
}
