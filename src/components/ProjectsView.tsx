'use client';

import React, { useState } from 'react';
import { useStore, Project } from '../store/useStore';
import { 
  FolderKanban, Plus, Calendar, Layers, Users, CheckCircle2, Clock, Sparkles 
} from 'lucide-react';

export default function ProjectsView() {
  const { projects, addProject, clients } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState(clients[0]?.companyName || 'Nike Digital');
  const [campaignType, setCampaignType] = useState<Project['campaignType']>('Product Launch');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-09-15');
  const [priority, setPriority] = useState<Project['priority']>('High');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({
      name,
      description,
      clientName,
      teamMembers: ['Alex Rivera', 'Jessica Chen'],
      campaignType,
      startDate,
      endDate,
      status: 'In Progress',
      priority
    });
    setName('');
    setDescription('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Project & Campaign Management</h1>
          <p className="text-xs text-gray-500">Track client social campaigns, milestones, team assignments & approval progress</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Campaign</span>
        </button>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all space-y-4">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {proj.campaignType}
                </span>
                <h3 className="text-sm font-black text-gray-900 dark:text-white mt-1">{proj.name}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                proj.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {proj.priority}
              </span>
            </div>

            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{proj.description}</p>

            {/* Approval Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-gray-500">Approval Completion</span>
                <span className="text-indigo-600">{proj.approvalProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${proj.approvalProgress}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-[var(--border)] grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{proj.filesCount}</div>
                <div className="text-[10px] text-gray-400">Assets</div>
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">{proj.completedTasks}/{proj.tasksCount}</div>
                <div className="text-[10px] text-gray-400">Tasks</div>
              </div>
              <div>
                <div className="font-bold font-mono text-indigo-600">{proj.status}</div>
                <div className="text-[10px] text-gray-400">State</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-[var(--border)]">
              <span>Client: <strong>{proj.clientName}</strong></span>
              <span>Ends: {proj.endDate}</span>
            </div>

          </div>
        ))}
      </div>

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-base font-black text-gray-900 dark:text-white">Create New Campaign Project</h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Air Max 2026 Launch"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Client</label>
                  <select
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.companyName}>{c.companyName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Campaign Type</label>
                  <select
                    value={campaignType}
                    onChange={(e) => setCampaignType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                  >
                    <option value="Product Launch">Product Launch</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Seasonal Promotion">Seasonal Promotion</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 text-xs font-bold rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
