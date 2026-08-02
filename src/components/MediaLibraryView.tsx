'use client';

import React, { useState } from 'react';
import { useStore, MediaItem } from '../store/useStore';
import { 
  Image, Folder, Upload, Search, Download, Trash2, Tag, FileText, Video, Sparkles, Filter, Grid, List 
} from 'lucide-react';

export default function MediaLibraryView() {
  const { mediaItems, addMediaItem, deleteMediaItem, clients } = useStore();

  const [activeFolder, setActiveFolder] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // New Media Upload Form state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&fit=crop&q=80');
  const [uploadType, setUploadType] = useState<MediaItem['type']>('image');
  const [uploadFolder, setUploadFolder] = useState<MediaItem['folder']>('Campaign Assets');
  const [uploadClient, setUploadClient] = useState(clients[0]?.companyName || 'Nike Digital');

  const folders: MediaItem['folder'][] = ['General', 'Logos & Branding', 'Campaign Assets', 'Templates', 'Documents'];

  const filteredItems = mediaItems.filter(item => {
    const matchesFolder = activeFolder === 'All' || item.folder === activeFolder;
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesType && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMediaItem({
      name: uploadName || 'New_Asset_Media.png',
      type: uploadType,
      url: uploadUrl,
      size: '3.5 MB',
      folder: uploadFolder,
      tags: ['New', 'Social', uploadType],
      clientName: uploadClient
    });
    setUploadName('');
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Media Library & Brand Assets</h1>
          <p className="text-xs text-gray-500">Organize images, reels/videos, PDFs, brand logos, fonts & design templates</p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Asset</span>
        </button>
      </div>

      {/* Folders Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        <button
          onClick={() => setActiveFolder('All')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            activeFolder === 'All'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-[var(--card)] border-[var(--border)] text-gray-600 dark:text-gray-400 hover:bg-gray-100'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>All Folders ({mediaItems.length})</span>
        </button>

        {folders.map(folder => {
          const count = mediaItems.filter(m => m.folder === folder).length;
          const isSelected = activeFolder === folder;
          return (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border flex-shrink-0 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-[var(--card)] border-[var(--border)] text-gray-600 dark:text-gray-400 hover:bg-gray-100'
              }`}
            >
              <Folder className="w-4 h-4 text-amber-500" />
              <span>{folder} ({count})</span>
            </button>
          );
        })}
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search media assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 pl-9 bg-[var(--card)] text-xs rounded-xl border border-[var(--border)] outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-500">Asset Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[var(--card)] text-xs font-bold px-3 py-1.5 rounded-xl border border-[var(--border)]"
            >
              <option value="All">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos / Reels</option>
              <option value="pdf">PDF Documents</option>
              <option value="logo">Brand Logos</option>
            </select>
          </div>

          <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--card)]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone Simulator */}
      <div className="p-8 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-3xl bg-indigo-50/20 dark:bg-indigo-950/20 text-center space-y-2">
        <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
        <h3 className="text-xs font-bold text-gray-900 dark:text-white">Drag & drop files here to upload instantly</h3>
        <p className="text-[11px] text-gray-400">Supports PNG, JPG, MP4, MOV, PDF up to 500 MB</p>
      </div>

      {/* Media Items Grid / List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.id} className="p-4 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all space-y-3 group">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/80 flex items-center justify-center">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md text-white rounded-md text-[10px] font-bold uppercase">
                  {item.type}
                </div>
                <button
                  onClick={() => deleteMediaItem(item.id)}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{item.name}</h4>
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                  <span>{item.clientName}</span>
                  <span>{item.size}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                  {item.folder}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  download
                  className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-2">
          {filteredItems.map(item => (
            <div key={item.id} className="p-3 rounded-2xl border border-[var(--border)] flex items-center justify-between text-xs bg-gray-50/30 dark:bg-gray-800/20">
              <div className="flex items-center gap-3">
                <img src={item.url} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">{item.name}</div>
                  <div className="text-[10px] text-gray-400">{item.clientName} • {item.folder} • {item.size}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a href={item.url} target="_blank" download className="text-indigo-600 font-bold flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button onClick={() => deleteMediaItem(item.id)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Asset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUploadSubmit} className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-base font-black text-gray-900 dark:text-white">Upload Asset to Media Library</h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nike_Banner_4K.jpg"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Asset URL</label>
                <input
                  type="text"
                  required
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Target Folder</label>
                  <select
                    value={uploadFolder}
                    onChange={(e) => setUploadFolder(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                  >
                    {folders.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Client Tag</label>
                  <select
                    value={uploadClient}
                    onChange={(e) => setUploadClient(e.target.value)}
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
              <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 bg-gray-200 text-xs font-bold rounded-xl">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">
                Upload & Sync Assets
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
