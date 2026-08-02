'use client';

import React, { useState } from 'react';
import { useStore, Task } from '../store/useStore';
import { 
  Layers, Plus, Clock, Play, Pause, CheckSquare, Calendar, User, AlertCircle 
} from 'lucide-react';

export default function TaskBoardView() {
  const { tasks, addTask, updateTaskStatus, toggleTaskChecklist, toggleTaskTimer, employees, clients } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(employees[0]?.name || 'Alex Rivera');
  const [clientName, setClientName] = useState(clients[0]?.companyName || 'Nike Digital');
  const [dueDate, setDueDate] = useState('2026-08-10');
  const [priority, setPriority] = useState<Task['priority']>('High');

  const columns: Task['status'][] = ['Todo', 'In Progress', 'Review', 'Done'];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title,
      assignee,
      clientName,
      dueDate,
      priority,
      status: 'Todo'
    });
    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Task Management & Kanban Board</h1>
          <p className="text-xs text-gray-500">Track agency deliverables, sub-checklists, priority ratings & live time tracking</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Task</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = tasks.filter(t => t.status === column);
          return (
            <div key={column} className="p-4 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm flex flex-col min-h-[500px]">
              
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{column}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {columnTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1">
                {columnTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-2xl border border-[var(--border)] bg-gray-50/50 dark:bg-gray-800/40 space-y-3 shadow-xs">
                    
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2">{task.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-500">Client: <strong>{task.clientName}</strong></div>

                    {/* Checklist Summary */}
                    {task.checklist.length > 0 && (
                      <div className="space-y-1 pt-1">
                        {task.checklist.map(item => (
                          <label key={item.id} className="flex items-center gap-2 text-[11px] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleTaskChecklist(task.id, item.id)}
                              className="rounded text-indigo-600 w-3 h-3"
                            />
                            <span className={item.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}>
                              {item.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${task.progress}%` }} />
                      </div>
                    </div>

                    {/* Time Tracker & Move Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[11px]">
                      <button
                        onClick={() => toggleTaskTimer(task.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          task.isTimerRunning 
                            ? 'bg-amber-100 text-amber-800 animate-pulse' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {task.isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{task.timeTrackedMinutes}m</span>
                      </button>

                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                        className="bg-white dark:bg-gray-800 text-[10px] font-bold px-2 py-1 rounded-lg border border-[var(--border)]"
                      >
                        {columns.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateTask} className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-base font-black text-gray-900 dark:text-white">Create New Deliverable Task</h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Starbucks photoshoot"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Assignee</label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                  >
                    {employees.map(e => (
                      <option key={e.id} value={e.name}>{e.name}</option>
                    ))}
                  </select>
                </div>
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
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 text-xs font-bold rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">
                Add Task to Board
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
