'use client';

import React, { useState } from 'react';
import { useStore, Post } from '../store/useStore';
import { 
  CalendarRange, ChevronLeft, ChevronRight, Filter, Plus, Clock, CheckCircle2 
} from 'lucide-react';

interface CalendarViewProps {
  setSelectedPost: (post: Post) => void;
  setCurrentView: (view: string) => void;
  onQuickCreate: () => void;
}

export default function CalendarView({ setSelectedPost, setCurrentView, onQuickCreate }: CalendarViewProps) {
  const { posts } = useStore();

  const [calendarMode, setCalendarMode] = useState<'Monthly' | 'Weekly' | 'Daily'>('Monthly');
  const [calendarType, setCalendarType] = useState<'Publishing' | 'Approval'>('Publishing');
  const [platformFilter, setPlatformFilter] = useState<string>('All');

  const filteredPosts = posts.filter(p => platformFilter === 'All' || p.platform === platformFilter);

  // Generate calendar days for August 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Content Calendar & Schedule</h1>
          <p className="text-xs text-gray-500">Visual schedule overview with Approval and Publishing calendar modes</p>
        </div>

        <button
          onClick={onQuickCreate}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Post</span>
        </button>
      </div>

      {/* Control Toggles Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        
        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-gray-100">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="text-sm font-black text-gray-900 dark:text-white px-2">August 2026</span>
            <button className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-gray-100">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden text-xs font-bold bg-gray-50 dark:bg-gray-800">
            {(['Monthly', 'Weekly', 'Daily'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setCalendarMode(mode)}
                className={`px-3 py-1.5 transition-all ${
                  calendarMode === mode ? 'bg-indigo-600 text-white' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Filters (Approval vs Publishing & Platform) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden text-xs font-bold bg-gray-50 dark:bg-gray-800">
            <button
              onClick={() => setCalendarType('Publishing')}
              className={`px-3 py-1.5 transition-all ${
                calendarType === 'Publishing' ? 'bg-emerald-600 text-white' : 'text-gray-600'
              }`}
            >
              Publishing Schedule
            </button>
            <button
              onClick={() => setCalendarType('Approval')}
              className={`px-3 py-1.5 transition-all ${
                calendarType === 'Approval' ? 'bg-amber-600 text-white' : 'text-gray-600'
              }`}
            >
              Approval Timeline
            </button>
          </div>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-[var(--card)] text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--border)]"
          >
            <option value="All">All Networks</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Twitter">Twitter / X</option>
            <option value="YouTube">YouTube</option>
          </select>
        </div>

      </div>

      {/* Calendar Grid */}
      <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider pb-2 border-b border-[var(--border)]">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        {/* Calendar Month Grid */}
        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day) => {
            const dateStr = `2026-08-${day < 10 ? '0' + day : day}`;
            const postsForDay = filteredPosts.filter(p => p.scheduleDate === dateStr || day % 5 === 1);

            return (
              <div 
                key={day} 
                className={`min-h-[110px] p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  day === 5 
                    ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20' 
                    : 'border-[var(--border)] bg-gray-50/30 dark:bg-gray-800/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className={day === 5 ? 'text-indigo-600 dark:text-indigo-400 font-extrabold' : 'text-gray-700 dark:text-gray-300'}>
                    {day}
                  </span>
                  {postsForDay.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  )}
                </div>

                <div className="space-y-1 my-1">
                  {postsForDay.slice(0, 2).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPost(p);
                        setCurrentView('approval-center');
                      }}
                      className="p-1.5 rounded-lg bg-white dark:bg-gray-800 border border-[var(--border)] hover:border-indigo-400 cursor-pointer transition-all text-[10px] space-y-0.5"
                    >
                      <div className="font-bold text-indigo-600 truncate">{p.title}</div>
                      <div className="text-gray-400 text-[9px] flex items-center justify-between">
                        <span>{p.platform}</span>
                        <span className="px-1 bg-amber-100 text-amber-800 rounded">{p.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[9px] text-gray-400 text-right font-mono">Aug '26</div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
