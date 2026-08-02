'use client';

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import ChangePasswordModal from './ChangePasswordModal';
import { 
  User, Settings, Mail, Phone, Globe, Shield, Sparkles, Bell, Save, CheckCircle2, KeyRound, Share2, Laptop, History 
} from 'lucide-react';

export default function SettingsProfileView() {
  const { 
    activeUser, activeRole, settings, updateSettings, theme, toggleTheme, changeEmail, toggleGoogleConnection, loginHistory, activeSessions, revokeSession 
  } = useStore();

  const [agencyName, setAgencyName] = useState(settings.agencyName);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [language, setLanguage] = useState(settings.language);
  const [aiBrandTone, setAiBrandTone] = useState(settings.aiBrandTone);
  const [emailTemplates, setEmailTemplates] = useState(settings.emailTemplates);
  const [slackNotify, setSlackNotify] = useState(settings.slackNotifications);
  
  const [newEmailInput, setNewEmailInput] = useState(activeUser.email);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      agencyName,
      timezone,
      language,
      aiBrandTone,
      emailTemplates,
      slackNotifications: slackNotify
    });
    if (newEmailInput !== activeUser.email) {
      changeEmail(newEmailInput);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Profile & Security Settings</h1>
          <p className="text-xs text-gray-500">Manage user profile, email credentials, connected Google accounts & security preferences</p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile & Settings Saved!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: User Profile Details Card */}
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
          <div className="text-center space-y-2">
            <img 
              src={activeUser.avatar} 
              alt={activeUser.name} 
              className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-indigo-500/20" 
            />
            <h2 className="text-lg font-black text-gray-900 dark:text-white">{activeUser.name}</h2>
            <div className="text-xs text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full inline-block">
              {activeRole.replace('_', ' ')}
            </div>
            <div className="text-xs text-gray-500 font-semibold">{activeUser.company}</div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[var(--border)] text-xs">
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email Address</span>
              <span className="font-bold text-gray-900 dark:text-white">{activeUser.email}</span>
            </div>

            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> Phone</span>
              <span className="font-bold text-gray-900 dark:text-white">{activeUser.phone}</span>
            </div>

            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Timezone</span>
              <span className="font-bold text-gray-900 dark:text-white">{timezone}</span>
            </div>

            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2"><Share2 className="w-3.5 h-3.5" /> Google OAuth</span>
              <button 
                type="button"
                onClick={toggleGoogleConnection}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  settings.isGoogleConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {settings.isGoogleConnected ? 'Connected' : 'Connect Account'}
              </button>
            </div>
          </div>

          <div className="pt-3 space-y-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-4 h-4" />
              <span>Change Account Password</span>
            </button>
          </div>
        </div>

        {/* Right 2 Cols: Edit Profile & Security Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Workspace Settings Form */}
          <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-5">
            <h2 className="text-sm font-black text-gray-900 dark:text-white">Profile & Preferences</h2>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Work Email</label>
                  <input
                    type="email"
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Preferred Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] font-bold"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="Spanish (ES)">Spanish (ES)</option>
                    <option value="French (FR)">French (FR)</option>
                    <option value="German (DE)">German (DE)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] font-bold"
                  >
                    <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                    <option value="America/New_York (EST)">America/New_York (EST)</option>
                    <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          </div>

          {/* Login Activity & Device Management Table */}
          <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              <span>Login History & Active Sessions</span>
            </h3>

            <div className="space-y-2">
              {loginHistory.map((lh) => (
                <div key={lh.id} className="p-3 rounded-2xl border border-[var(--border)] bg-gray-50/40 dark:bg-gray-800/30 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{lh.device}</div>
                    <div className="text-[11px] text-gray-400">{lh.date} • IP: {lh.ip}</div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                    {lh.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <ChangePasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />

    </div>
  );
}
