'use client';

import React, { useState } from 'react';
import { useStore, Post, Comment } from '../store/useStore';
import { 
  CheckCircle2, XCircle, AlertTriangle, MessageSquare, Clock, History, 
  RotateCcw, Paperclip, Send, Smile, Pin, Check, Download, ExternalLink, ChevronRight, Eye, RefreshCw 
} from 'lucide-react';

interface ApprovalCenterViewProps {
  selectedPost: Post | null;
  setSelectedPost: (post: Post | null) => void;
}

export default function ApprovalCenterView({ selectedPost, setSelectedPost }: ApprovalCenterViewProps) {
  const { 
    posts, activeRole, activeUser, updatePostStatus, addComment, toggleCommentReaction, toggleResolveComment, togglePinComment, createNewVersion, restoreVersion 
  } = useStore();

  // If no post selected, default to first post
  const currentPost = selectedPost || posts[0];

  const [commentInput, setCommentInput] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'compare' | 'timeline'>('preview');
  const [compareVer1, setCompareVer1] = useState(currentPost?.versions[0]?.version || 1);
  const [compareVer2, setCompareVer2] = useState(currentPost?.versions[currentPost?.versions.length - 1]?.version || 1);

  // New Version Edit state
  const [isEditingVersion, setIsEditingVersion] = useState(false);
  const [newVersionCaption, setNewVersionCaption] = useState(currentPost?.caption || '');
  const [newVersionMedia, setNewVersionMedia] = useState(currentPost?.mediaUrl || '');

  if (!currentPost) {
    return <div className="p-12 text-center text-gray-500">No posts available for review.</div>;
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(currentPost.id, { text: commentInput });
    setCommentInput('');
  };

  const handleSaveNewVersion = (e: React.FormEvent) => {
    e.preventDefault();
    createNewVersion(currentPost.id, newVersionMedia, newVersionCaption, 'Updated media asset and copy draft');
    setIsEditingVersion(false);
  };

  const ver1Obj = currentPost.versions.find(v => v.version === Number(compareVer1)) || currentPost.versions[0];
  const ver2Obj = currentPost.versions.find(v => v.version === Number(compareVer2)) || currentPost.versions[currentPost.versions.length - 1];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Header & Post Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {currentPost.platform} Post
            </span>
            <span className="text-xs text-gray-400 font-semibold">• Client: {currentPost.clientName}</span>
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white mt-1">{currentPost.title}</h1>
        </div>

        {/* Post Selection Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 font-medium">Select Post:</label>
          <select
            value={currentPost.id}
            onChange={(e) => {
              const p = posts.find(item => item.id === e.target.value);
              if (p) setSelectedPost(p);
            }}
            className="bg-gray-50 dark:bg-gray-800 text-xs font-bold px-3 py-2 rounded-xl border border-[var(--border)] outline-none"
          >
            {posts.map(p => (
              <option key={p.id} value={p.id}>{p.clientName} - {p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Bar (Approve / Reject / Request Changes) */}
      <div className="p-4 rounded-2xl bg-gray-900 text-white flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-medium">Current Status:</span>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-full text-xs border border-amber-500/30">
            {currentPost.status}
          </span>
          <span className="text-xs text-gray-400">• Version {currentPost.versions.length} Active</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => updatePostStatus(currentPost.id, 'Needs Changes', 'Client requested copy and image revisions.')}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Request Changes</span>
          </button>

          <button
            onClick={() => updatePostStatus(currentPost.id, 'Rejected', 'Post rejected by client.')}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject</span>
          </button>

          <button
            onClick={() => updatePostStatus(currentPost.id, 'Approved', 'Post approved for publishing schedule.')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Approve Post</span>
          </button>
        </div>
      </div>

      {/* View Switcher (Preview vs Side-by-Side Version Compare vs Timeline) */}
      <div className="flex border-b border-[var(--border)]">
        {[
          { id: 'preview', label: 'Media Preview & Copy', icon: Eye },
          { id: 'compare', label: `Version Comparison (${currentPost.versions.length} Versions)`, icon: History },
          { id: 'timeline', label: 'Audit Timeline Log', icon: Clock }
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs transition-all ${
                isActive 
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Media & Version Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* TAB 1: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-5">
              
              {/* Media Preview Box */}
              <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-video flex items-center justify-center group shadow-inner">
                {currentPost.mediaType === 'image' && (
                  <img src={currentPost.mediaUrl} alt={currentPost.title} className="w-full h-full object-contain" />
                )}
                <a 
                  href={currentPost.mediaUrl} 
                  target="_blank" 
                  download 
                  className="absolute top-4 right-4 p-2.5 bg-black/60 hover:bg-black text-white rounded-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 text-xs font-bold"
                >
                  <Download className="w-4 h-4" />
                  <span>Download HD</span>
                </a>
              </div>

              {/* Caption & Hashtags Block */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Post Caption & Copy</span>
                  <button 
                    onClick={() => setIsEditingVersion(!isEditingVersion)}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Upload New Version</span>
                  </button>
                </div>
                <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed font-sans">{currentPost.caption}</p>
                <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{currentPost.hashtags}</div>
                <div className="text-xs font-sans text-gray-500">Mentions: {currentPost.mentions}</div>
              </div>

              {/* Version Creator Form Modal Drawer */}
              {isEditingVersion && (
                <form onSubmit={handleSaveNewVersion} className="p-5 rounded-2xl border-2 border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-3">
                  <h3 className="text-xs font-black text-indigo-900 dark:text-indigo-200">Create New Version (Version {currentPost.versions.length + 1})</h3>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300">Media URL</label>
                    <input
                      type="text"
                      value={newVersionMedia}
                      onChange={(e) => setNewVersionMedia(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-xs rounded-xl border border-[var(--border)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300">Updated Caption</label>
                    <textarea
                      rows={3}
                      value={newVersionCaption}
                      onChange={(e) => setNewVersionCaption(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-xs rounded-xl border border-[var(--border)]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
                      Save Version {currentPost.versions.length + 1}
                    </button>
                    <button type="button" onClick={() => setIsEditingVersion(false)} className="px-4 py-2 bg-gray-200 text-xs font-bold rounded-xl">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB 2: SIDE-BY-SIDE VERSION COMPARISON */}
          {activeTab === 'compare' && (
            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">Side-by-Side Version Diff</h3>
                  <p className="text-xs text-gray-500">Compare asset changes, copy revisions, timestamps & editor details</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span>Compare Version:</span>
                    <select 
                      value={compareVer1} 
                      onChange={(e) => setCompareVer1(Number(e.target.value))}
                      className="bg-gray-50 dark:bg-gray-800 px-2.5 py-1.5 rounded-lg border border-[var(--border)]"
                    >
                      {currentPost.versions.map(v => (
                        <option key={v.version} value={v.version}>Version {v.version}</option>
                      ))}
                    </select>
                  </div>
                  <span>vs</span>
                  <div className="flex items-center gap-1.5">
                    <select 
                      value={compareVer2} 
                      onChange={(e) => setCompareVer2(Number(e.target.value))}
                      className="bg-gray-50 dark:bg-gray-800 px-2.5 py-1.5 rounded-lg border border-[var(--border)]"
                    >
                      {currentPost.versions.map(v => (
                        <option key={v.version} value={v.version}>Version {v.version}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Side by Side Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Version 1 Card */}
                <div className="p-4 rounded-2xl border border-[var(--border)] bg-gray-50/50 dark:bg-gray-800/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs">
                      Version {ver1Obj.version}
                    </span>
                    <span className="text-[11px] text-gray-400">{ver1Obj.timestamp}</span>
                  </div>
                  <img src={ver1Obj.mediaUrl} alt={`V${ver1Obj.version}`} className="w-full h-44 object-cover rounded-xl" />
                  <div className="text-xs text-gray-700 dark:text-gray-300 font-sans p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-[var(--border)]">
                    {ver1Obj.caption}
                  </div>
                  <div className="text-[11px] text-gray-500">Editor: <strong>{ver1Obj.changedBy}</strong></div>
                  <button 
                    onClick={() => restoreVersion(currentPost.id, ver1Obj.version)}
                    className="w-full py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Version {ver1Obj.version}</span>
                  </button>
                </div>

                {/* Version 2 Card */}
                <div className="p-4 rounded-2xl border-2 border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-xs">
                      Version {ver2Obj.version} (Active)
                    </span>
                    <span className="text-[11px] text-gray-400">{ver2Obj.timestamp}</span>
                  </div>
                  <img src={ver2Obj.mediaUrl} alt={`V${ver2Obj.version}`} className="w-full h-44 object-cover rounded-xl" />
                  <div className="text-xs text-gray-700 dark:text-gray-300 font-sans p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-[var(--border)]">
                    {ver2Obj.caption}
                  </div>
                  <div className="text-[11px] text-gray-500">Editor: <strong>{ver2Obj.changedBy}</strong></div>
                  <button 
                    onClick={() => restoreVersion(currentPost.id, ver2Obj.version)}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Version {ver2Obj.version}</span>
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: AUDIT TIMELINE LOG */}
          {activeTab === 'timeline' && (
            <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
              <h3 className="text-sm font-black text-gray-900 dark:text-white">Timestamped Approval Audit Log</h3>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-200 dark:before:bg-indigo-900">
                {currentPost.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex items-start justify-between text-xs">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white dark:ring-gray-900" />
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{step.status}</div>
                      <div className="text-[11px] text-gray-500">By {step.user} {step.notes && `• "${step.notes}"`}</div>
                    </div>
                    <span className="text-[10px] text-gray-400">{step.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Slack/Figma-Style Threaded Comments */}
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4 flex flex-col h-[650px]">
          
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span className="font-black text-sm text-gray-900 dark:text-white">Collaboration & Thread</span>
            </div>
            <span className="text-[11px] text-gray-400 font-bold">{currentPost.comments.length} Comments</span>
          </div>

          {/* Comment Thread List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {currentPost.comments.length === 0 ? (
              <p className="text-xs text-center py-12 text-gray-400">No comments yet. Start the conversation!</p>
            ) : (
              currentPost.comments.map((comment) => (
                <div 
                  key={comment.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    comment.isPinned 
                      ? 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20' 
                      : 'border-[var(--border)] bg-gray-50/50 dark:bg-gray-800/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img src={comment.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop&q=80'} alt={comment.author} className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{comment.author}</span>
                        <span className="text-[10px] text-gray-400 ml-1.5">({comment.role})</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400">{comment.time}</span>
                  </div>

                  <p className="text-xs text-gray-800 dark:text-gray-200 mt-2 leading-relaxed">{comment.text}</p>

                  {/* Emoji Reactions Bar */}
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    {['👍', '❤️', '🚀', '👀'].map((emoji) => {
                      const reaction = comment.reactions.find(r => r.emoji === emoji);
                      const hasReacted = reaction?.users.includes(activeUser.name);
                      return (
                        <button
                          key={emoji}
                          onClick={() => toggleCommentReaction(currentPost.id, comment.id, emoji)}
                          className={`px-2 py-0.5 rounded-full text-[11px] border transition-all flex items-center gap-1 ${
                            hasReacted 
                              ? 'bg-indigo-100 text-indigo-700 border-indigo-300 font-bold' 
                              : 'bg-white dark:bg-gray-800 border-[var(--border)] text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <span>{emoji}</span>
                          {reaction && <span>{reaction.count}</span>}
                        </button>
                      );
                    })}

                    <button 
                      onClick={() => togglePinComment(currentPost.id, comment.id)}
                      className={`p-1 text-gray-400 hover:text-amber-500 ${comment.isPinned ? 'text-amber-500 font-bold' : ''}`}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Comment Post Form */}
          <form onSubmit={handlePostComment} className="pt-3 border-t border-[var(--border)] space-y-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Write a reply or @mention colleague..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-[var(--border)] focus:border-indigo-500 outline-none pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>Supports @mentions & Markdown</span>
              <span>Slack & Email Notified</span>
            </div>
          </form>

        </div>

      </div>

    </div>
  );
}
