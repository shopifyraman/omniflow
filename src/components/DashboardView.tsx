'use client';

import React from 'react';
import { useStore, Role, Post } from '../store/useStore';
import { 
  Building, Users, FileCheck2, Clock, CheckCircle2, XCircle, AlertCircle, 
  Sparkles, ArrowUpRight, TrendingUp, Calendar, Layers, Image, MessageSquare, Plus, ChevronRight, Shield 
} from 'lucide-react';

interface DashboardViewProps {
  setCurrentView: (view: string) => void;
  setSelectedPost: (post: Post) => void;
  onQuickCreate: () => void;
}

export default function DashboardView({ setCurrentView, setSelectedPost, onQuickCreate }: DashboardViewProps) {
  const { activeRole, activeUser, clients, employees, posts, tasks, projects, updatePostStatus } = useStore();

  const totalClients = clients.length;
  const pendingApprovals = posts.filter(p => p.status === 'Client Review' || p.status === 'Sent to Client').length;
  const approvedPosts = posts.filter(p => p.status === 'Approved' || p.status === 'Scheduled' || p.status === 'Published').length;
  const totalPosts = posts.length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-[10px] uppercase font-extrabold tracking-wider">
              {activeRole.replace('_', ' ')} Dashboard
            </span>
            <span className="text-xs text-indigo-200">• OmniFlow SaaS v2.6</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Welcome back, {activeUser.name}!</h1>
          <p className="text-xs text-indigo-100 max-w-xl">
            {activeRole === 'super_admin' && 'Enterprise tenant overview: Manage all agency operations, clients, employees, billing & platform settings.'}
            {activeRole === 'admin' && 'Agency Manager workspace: Oversee team performance, client project milestones and approval pipelines.'}
            {activeRole === 'employee' && 'Creator Workspace: Manage assigned clients, draft posts, upload media assets and track daily tasks.'}
            {activeRole === 'client' && 'Client Portal: Review pending social media posts, inspect versions, leave comments and approve content.'}
          </p>
        </div>

        <div className="z-10 flex items-center gap-3">
          <button
            onClick={onQuickCreate}
            className="px-4 py-2.5 bg-white hover:bg-indigo-50 text-indigo-900 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Create New Post</span>
          </button>
          <button
            onClick={() => setCurrentView('approval-center')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl transition-all"
          >
            Approval Center
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Clients</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">{totalClients}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% vs last month</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Approvals</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">{pendingApprovals}</div>
          <div className="text-[11px] text-amber-600 font-bold mt-1">Requires Action</div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Approved / Scheduled</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">{approvedPosts}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Ready for Publishing</div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Campaigns</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white">{projects.length}</div>
          <div className="text-[11px] text-purple-600 font-bold mt-1">Across 5 Networks</div>
        </div>

      </div>

      {/* Main Grid: Pending Approvals & Workflow Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Priority Posts for Review */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-indigo-600" />
                  <span>Posts Requiring Attention</span>
                </h2>
                <p className="text-xs text-gray-500">Review content drafts, approve versions or request changes</p>
              </div>
              <button 
                onClick={() => setCurrentView('content')}
                className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>View All Posts</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {posts.map((post) => (
                <div 
                  key={post.id}
                  className="p-4 rounded-2xl border border-[var(--border)] hover:border-indigo-300 dark:hover:border-indigo-800 bg-gray-50/50 dark:bg-gray-800/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <img 
                      src={post.mediaUrl} 
                      alt={post.title} 
                      className="w-16 h-16 rounded-xl object-cover ring-1 ring-[var(--border)] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{post.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {post.platform}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {post.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">{post.caption}</p>
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        <span>Client: <strong>{post.clientName}</strong></span>
                        <span>•</span>
                        <span>Creator: {post.employeeName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setCurrentView('approval-center');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Inspect & Review
                    </button>
                    {activeRole === 'client' && post.status === 'Client Review' && (
                      <button
                        onClick={() => updatePostStatus(post.id, 'Approved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                      >
                        Quick Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Client Roster Summary */}
          {(activeRole === 'super_admin' || activeRole === 'admin') && (
            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span>Managed Client Accounts</span>
                </h2>
                <button 
                  onClick={() => setCurrentView('clients')}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  Manage Clients
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {clients.map(client => (
                  <div key={client.id} className="p-3.5 rounded-2xl border border-[var(--border)] bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <img src={client.logo} alt={client.companyName} className="w-8 h-8 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{client.companyName}</div>
                        <div className="text-[10px] text-gray-400">{client.assignedEmployee}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-[var(--border)]">
                      <span>Projects: {client.projectsCount}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">{client.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Tasks & Quick Actions */}
        <div className="space-y-6">
          
          {/* Active Tasks Widget */}
          <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>My Active Tasks</span>
              </h2>
              <button onClick={() => setCurrentView('tasks')} className="text-xs font-bold text-indigo-600 hover:underline">
                Task Board
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="p-3 border border-[var(--border)] rounded-2xl space-y-2 bg-gray-50/30 dark:bg-gray-800/20">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-900 dark:text-white truncate">{task.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {task.priority}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${task.progress}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Due: {task.dueDate}</span>
                    <span>{task.progress}% done</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agency Team Performance Summary */}
          <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-3">
            <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Team Productivity</span>
            </h2>

            <div className="space-y-3">
              {employees.map(emp => (
                <div key={emp.id} className="flex items-center gap-3">
                  <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-gray-900 dark:text-white truncate">{emp.name}</div>
                    <div className="text-[10px] text-gray-400">{emp.role}</div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-bold text-indigo-600">{emp.performance}%</div>
                    <div className="text-[10px] text-gray-400">{emp.completedPosts} posts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
