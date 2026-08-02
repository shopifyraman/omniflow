'use client';

import React from 'react';
import { useStore, Integration } from '../store/useStore';
import { 
  Share2, CheckCircle2, XCircle, RefreshCw, Lock, Sparkles, ExternalLink 
} from 'lucide-react';

export default function IntegrationsView() {
  const { integrations, toggleIntegration } = useStore();

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Enterprise API & Third-Party Integrations</h1>
          <p className="text-xs text-gray-500">Connect cloud storage, OAuth sign-ins, team communication hubs, and social networks</p>
        </div>

        <div className="px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800">
          12 Integrations Active
        </div>
      </div>

      {/* Grid of 12 Integration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => {
          const isConnected = item.status === 'Connected';
          return (
            <div 
              key={item.id} 
              className={`p-6 rounded-3xl border transition-all space-y-4 ${
                isConnected 
                  ? 'bg-[var(--card)] border-indigo-200 dark:border-indigo-900/60 shadow-sm' 
                  : 'bg-gray-50/50 dark:bg-gray-800/20 border-[var(--border)] opacity-80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white">{item.name}</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{item.category}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                }`}>
                  {item.status}
                </span>
              </div>

              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>

              {isConnected && item.connectedBy && (
                <div className="text-[11px] text-gray-400 border-t border-[var(--border)] pt-2 flex items-center justify-between">
                  <span>Connected by: <strong>{item.connectedBy}</strong></span>
                  <span>Sync: {item.lastSync}</span>
                </div>
              )}

              <button
                onClick={() => toggleIntegration(item.id)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  isConnected
                    ? 'bg-red-50 dark:bg-red-950/30 text-red-600 hover:bg-red-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20'
                }`}
              >
                {isConnected ? 'Disconnect API Key' : 'Authorize & Connect'}
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
}
