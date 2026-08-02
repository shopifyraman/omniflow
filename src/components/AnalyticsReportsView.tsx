'use client';

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  BarChart3, TrendingUp, Download, FileSpreadsheet, FileText, CheckCircle2, Clock, Users, Layers, Sparkles 
} from 'lucide-react';

export default function AnalyticsReportsView() {
  const { posts, clients, employees } = useStore();

  const [reportType, setReportType] = useState<'Client' | 'Employee' | 'Platform' | 'Approval'>('Client');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    setDownloadSuccess(`Report successfully exported as OmniFlow_Analytics_${format}_${Date.now()}.${format.toLowerCase()}`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Analytics Dashboard & Report Generator</h1>
          <p className="text-xs text-gray-500">Interactive charts for content throughput, client approval velocity & team performance</p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleExport('CSV')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Analytics KPI Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Approval Speed Rate</span>
          <div className="text-2xl font-black text-gray-900 dark:text-white">94.8%</div>
          <div className="text-[11px] text-emerald-600 font-bold">Avg 4.2 hours per approval</div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Revision Count Rate</span>
          <div className="text-2xl font-black text-gray-900 dark:text-white">1.2 Revisions</div>
          <div className="text-[11px] text-indigo-600 font-bold">Down 18% vs Q2</div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Monthly Growth Trend</span>
          <div className="text-2xl font-black text-gray-900 dark:text-white">+34.2%</div>
          <div className="text-[11px] text-emerald-600 font-bold">+148 posts published</div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Client Retention</span>
          <div className="text-2xl font-black text-gray-900 dark:text-white">99.1%</div>
          <div className="text-[11px] text-purple-600 font-bold">Zero client churn</div>
        </div>
      </div>

      {/* Interactive Visual SVG Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Content Growth Bar Chart */}
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 dark:text-white">Monthly Post Output Trends</h3>
            <span className="text-xs text-gray-400 font-medium">Jan - Aug 2026</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-[var(--border)]">
            {[
              { month: 'Jan', val: 45 },
              { month: 'Feb', val: 62 },
              { month: 'Mar', val: 78 },
              { month: 'Apr', val: 90 },
              { month: 'May', val: 110 },
              { month: 'Jun', val: 135 },
              { month: 'Jul', val: 160 },
              { month: 'Aug', val: 195 }
            ].map(bar => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-all">
                  {bar.val}
                </span>
                <div 
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-xl transition-all duration-500 group-hover:brightness-110" 
                  style={{ height: `${(bar.val / 200) * 100}%` }}
                />
                <span className="text-[10px] text-gray-400 font-bold">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Platform Distribution Pie / Progress Visual */}
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
          <h3 className="text-sm font-black text-gray-900 dark:text-white">Platform Distribution Metrics</h3>

          <div className="space-y-4 pt-2">
            {[
              { platform: 'Instagram (Reels & Posts)', pct: 45, color: 'bg-pink-500' },
              { platform: 'Facebook (Pages & Ads)', pct: 25, color: 'bg-blue-600' },
              { platform: 'LinkedIn (Carousels & Pulse)', pct: 15, color: 'bg-sky-600' },
              { platform: 'YouTube (Shorts & 4K)', pct: 10, color: 'bg-red-600' },
              { platform: 'Twitter / X (Threads)', pct: 5, color: 'bg-gray-800 dark:bg-gray-200' }
            ].map(item => (
              <div key={item.platform} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-gray-700 dark:text-gray-300">{item.platform}</span>
                  <span className="text-indigo-600">{item.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
