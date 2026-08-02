'use client';

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  User, Settings, Mail, Phone, Globe, Shield, Sparkles, Bell, Save, CheckCircle2 
} from 'lucide-react';

export default function SettingsProfileView() {
  const { activeUser, activeRole, settings, updateSettings, theme, toggleTheme } = useStore();

  const [agencyName, setAgencyName] = useState(settings.agencyName);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [aiBrandTone, setAiBrandTone] = useState(settings.aiBrandTone);
  const [emailTemplates, setEmailTemplates] = useState(settings.emailTemplates);
  const [slackNotify, setSlackNotify] = useState(settings.slackNotifications);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      agencyName,
      timezone,
      aiBrandTone,
      emailTemplates,
      slackNotifications: slackNotify
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">Profile & Agency Settings</h1>
          <p className="text-xs text-gray-500">Configure personal account details, AI brand voice tones, email templates & workspace preferences</p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: User Profile Card */}
        <div className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-4">
          <div className="text-center space-y-2">
            <img 
              src={activeUser.avatar} 
              alt={activeUser.name} 
              className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-indigo-500/20" 
            />
            <h2 className="text-base font-black text-gray-900 dark:text-white">{activeUser.name}</h2>
            <div className="text-xs text-indigo-600 font-bold capitalize">{activeRole.replace('_', ' ')} Role</div>
            <div className="text-[11px] text-gray-400">{activeUser.department}</div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[var(--border)] text-xs">
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Email</span>
              <span className="font-bold text-gray-900 dark:text-white">{activeUser.email}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Timezone</span>
              <span className="font-bold text-gray-900 dark:text-white">{timezone}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-2"><Shield className="w-3.5 h-3.5" /> Google OAuth</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">Connected</span>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Agency Settings Form */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-sm space-y-5">
          <h2 className="text-sm font-black text-gray-900 dark:text-white">Workspace Configuration</h2>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            
            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Agency Name</label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">AI Brand Tone Preset</label>
                <select
                  value={aiBrandTone}
                  onChange={(e) => setAiBrandTone(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] font-bold"
                >
                  <option value="Creative">Creative & Dynamic</option>
                  <option value="Professional">Professional & Corporate</option>
                  <option value="Casual">Casual & Friendly</option>
                  <option value="Bold">Bold & Punchy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">Automated Client Welcome Email Template</label>
              <textarea
                rows={3}
                value={emailTemplates}
                onChange={(e) => setEmailTemplates(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] font-mono text-[11px]"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 border border-[var(--border)] rounded-2xl">
              <div>
                <div className="font-bold text-gray-900 dark:text-white">Slack Workspace Channel Notifications</div>
                <div className="text-[11px] text-gray-500">Post review alerts to #social-media-approvals</div>
              </div>
              <input
                type="checkbox"
                checked={slackNotify}
                onChange={(e) => setSlackNotify(e.target.checked)}
                className="rounded text-indigo-600 w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
