'use client';

import React, { useState, useEffect } from 'react';
import { useStore, Post, Role } from '../store/useStore';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import AuthModal from '../components/AuthModal';

import DashboardView from '../components/DashboardView';
import ContentWorkflowView from '../components/ContentWorkflowView';
import ApprovalCenterView from '../components/ApprovalCenterView';
import ClientsView from '../components/ClientsView';
import ProjectsView from '../components/ProjectsView';
import MediaLibraryView from '../components/MediaLibraryView';
import CalendarView from '../components/CalendarView';
import TaskBoardView from '../components/TaskBoardView';
import AnalyticsReportsView from '../components/AnalyticsReportsView';
import IntegrationsView from '../components/IntegrationsView';
import SecurityAuditView from '../components/SecurityAuditView';
import SettingsProfileView from '../components/SettingsProfileView';

import { Sparkles, Plus, X, Image, Wand2 } from 'lucide-react';

export default function Home() {
  const { theme, posts, clients, addPost } = useStore();

  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Quick Post Modal State
  const [showQuickCreateModal, setShowQuickCreateModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postClient, setPostClient] = useState(clients[0]?.companyName || 'Nike Digital');
  const [postPlatform, setPostPlatform] = useState<'Instagram' | 'Facebook' | 'LinkedIn' | 'Twitter' | 'YouTube'>('Instagram');
  const [postCaption, setPostCaption] = useState('');
  const [postMediaUrl, setPostMediaUrl] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop&q=80');

  // Handle Theme switching
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // AI Caption Assistant Generator
  const handleAICaption = () => {
    if (postClient.includes('Nike')) {
      setPostCaption("Push beyond your limits. ⚡️ Experience responsive cushioning engineered to fuel every mile. Engineered from 40% recycled materials. Just do it. #NikeAirMax #RunningGoals #Sneakerhead");
    } else if (postClient.includes('Starbucks')) {
      setPostCaption("Unwind and refresh. 🧊☕️ Sip on cold brew perfection, cold foam-topped, and ready to brighten your summer afternoon. #CoffeeChill #StarbucksColdBrew #SummerChillers");
    } else {
      setPostCaption("Accelerate into clean energy. ⚡️ Solar Roof and Powerwall autonomy designed for complete zero-emission home independence. #TeslaEnergy #Powerwall #CleanTech");
    }
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle || !postCaption) return;

    addPost({
      title: postTitle,
      caption: postCaption,
      platform: postPlatform,
      mediaUrl: postMediaUrl,
      mediaType: 'image',
      hashtags: '#BrandGoals #EnterpriseSaaS #Marketing',
      mentions: '@omniflow',
      scheduleDate: '2026-08-15',
      priority: 'High',
      status: 'Internal Review',
      clientName: postClient,
      employeeName: 'Alex Rivera'
    });

    setPostTitle('');
    setPostCaption('');
    setShowQuickCreateModal(false);
    setCurrentView('content');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] font-sans antialiased">
      
      {/* Responsive Collapsible Sidebar */}
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Sticky Header with Role Switcher & Search */}
        <Header 
          currentView={currentView} 
          onQuickCreate={() => setShowQuickCreateModal(true)}
          onOpenAuthModal={() => setShowAuthModal(true)}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          {currentView === 'dashboard' && (
            <DashboardView 
              setCurrentView={setCurrentView} 
              setSelectedPost={setSelectedPost}
              onQuickCreate={() => setShowQuickCreateModal(true)}
            />
          )}

          {currentView === 'clients' && <ClientsView />}

          {currentView === 'projects' && <ProjectsView />}

          {currentView === 'content' && (
            <ContentWorkflowView 
              setSelectedPost={setSelectedPost} 
              setCurrentView={setCurrentView}
              onQuickCreate={() => setShowQuickCreateModal(true)}
            />
          )}

          {(currentView === 'approval-center' || currentView === 'comments') && (
            <ApprovalCenterView 
              selectedPost={selectedPost} 
              setSelectedPost={setSelectedPost} 
            />
          )}

          {currentView === 'media-library' && <MediaLibraryView />}

          {currentView === 'calendar' && (
            <CalendarView 
              setSelectedPost={setSelectedPost} 
              setCurrentView={setCurrentView}
              onQuickCreate={() => setShowQuickCreateModal(true)}
            />
          )}

          {currentView === 'tasks' && <TaskBoardView />}

          {currentView === 'employees' && <ClientsView />}

          {currentView === 'reports' && <AnalyticsReportsView />}

          {currentView === 'integrations' && <IntegrationsView />}

          {currentView === 'security' && <SecurityAuditView />}

          {(currentView === 'settings' || currentView === 'profile') && <SettingsProfileView />}
        </main>

      </div>

      {/* Security & Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Quick Create Post Modal */}
      {showQuickCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <form onSubmit={handleCreatePostSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h2 className="text-base font-black text-gray-900 dark:text-white">Create & Draft Social Media Post</h2>
              </div>
              <button 
                type="button" 
                onClick={() => setShowQuickCreateModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nike Air Max 2026 Launch Teaser"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Target Client Account</label>
                  <select
                    value={postClient}
                    onChange={(e) => setPostClient(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] font-bold"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.companyName}>{c.companyName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Social Platform</label>
                  <select
                    value={postPlatform}
                    onChange={(e) => setPostPlatform(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] font-bold"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Media Asset Image URL</label>
                <input
                  type="text"
                  required
                  value={postMediaUrl}
                  onChange={(e) => setPostMediaUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] outline-none font-mono"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Caption & Copywriter Text</label>
                  <button
                    type="button"
                    onClick={handleAICaption}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-purple-500" />
                    <span>Auto-Generate AI Copy</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Draft caption, body text, hashtags and mentions..."
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
              <button 
                type="button" 
                onClick={() => setShowQuickCreateModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30"
              >
                Save Draft & Start Workflow
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
