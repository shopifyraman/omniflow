'use client';

import React, { useState } from 'react';
import { useStore, Post, WorkflowStage } from '../store/useStore';
import { 
  FileCheck2, Plus, Clock, History, CheckCircle2, ChevronRight, Filter, Search, Sparkles 
} from 'lucide-react';

interface ContentWorkflowViewProps {
  setSelectedPost: (post: Post) => void;
  setCurrentView: (view: string) => void;
  onQuickCreate: () => void;
}

const STAGES: WorkflowStage[] = [
  'Idea', 'Draft', 'Design', 'Internal Review', 'Approved by Admin', 
  'Sent to Client', 'Client Review', 'Needs Changes', 'Resubmitted', 
  'Approved', 'Rejected', 'Scheduled', 'Published', 'Archived'
];

export default function ContentWorkflowView({ setSelectedPost, setCurrentView, onQuickCreate }: ContentWorkflowViewProps) {
  const { posts, updatePostStatus } = useStore();

  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts.filter(p => {
    const matchesStage = selectedStageFilter === 'All' || p.status === selectedStageFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              11-Stage Pipeline
            </span>
            <span className="text-xs text-gray-400 font-semibold">• Audit Logged</span>
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white mt-1">Content Creation Workflow</h1>
          <p className="text-xs text-gray-500">Track posts from initial idea ideation down to publishing & archiving</p>
        </div>

        <button
          onClick={onQuickCreate}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Content Draft</span>
        </button>
      </div>

      {/* Stage Progression Pipeline Bar */}
      <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-2 min-w-[950px]">
          {STAGES.map((stage, idx) => {
            const count = posts.filter(p => p.status === stage).length;
            const isSelected = selectedStageFilter === stage;
            return (
              <React.Fragment key={stage}>
                <button
                  onClick={() => setSelectedStageFilter(isSelected ? 'All' : stage)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 border ${
                    isSelected 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                      : count > 0 
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200' 
                        : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span>{stage}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {count}
                  </span>
                </button>
                {idx < STAGES.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search workflow posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 bg-[var(--card)] text-xs rounded-xl border border-[var(--border)] outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        {selectedStageFilter !== 'All' && (
          <button
            onClick={() => setSelectedStageFilter('All')}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Clear Stage Filter ({selectedStageFilter})
          </button>
        )}
      </div>

      {/* Posts Workflow Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="p-5 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all space-y-4">
            
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/80">
              <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white rounded-lg text-[10px] font-bold">
                {post.platform}
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold shadow-md">
                {post.status}
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">{post.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{post.caption}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-[var(--border)]">
              <span>Client: <strong>{post.clientName}</strong></span>
              <span>Schedule: {post.scheduleDate}</span>
            </div>

            {/* Stage Selector Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Change Stage</label>
              <select
                value={post.status}
                onChange={(e) => updatePostStatus(post.id, e.target.value as WorkflowStage)}
                className="w-full bg-gray-50 dark:bg-gray-800 text-xs font-bold px-3 py-2 rounded-xl border border-[var(--border)] outline-none"
              >
                {STAGES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setSelectedPost(post);
                setCurrentView('approval-center');
              }}
              className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-bold text-xs rounded-xl transition-all"
            >
              Open Approval & Version Center
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}
