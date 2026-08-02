'use client';

import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  Lock, Shield, KeyRound, Smartphone, Mail, CheckCircle2, History, AlertCircle, Laptop, X, Sparkles, RefreshCw, ArrowRight 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { 
    isAuthenticated, userEmail, login, logout, loginHistory, activeSessions, settings, updateSettings 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'login' | '2fa' | 'history' | 'sessions'>('login');
  const [emailInput, setEmailInput] = useState(userEmail || 'sarah@omniflow.io');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(emailInput);
    if (settings.twoFactorAuth) {
      setActiveTab('2fa');
    } else {
      onClose();
    }
  };

  const handleGoogleLogin = () => {
    login('sarah.google@omniflow.io');
    onClose();
  };

  const handleVerify2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length >= 4) {
      onClose();
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSentSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900 dark:text-white">Security & Authentication</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">OAuth 2.0, 2FA, Session Control & IP Logs</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-[var(--border)] bg-gray-50/50 dark:bg-gray-900/30 px-6 pt-2">
          {[
            { id: 'login', label: 'Auth & Login', icon: Lock },
            { id: '2fa', label: 'Two-Factor (2FA)', icon: Smartphone },
            { id: 'sessions', label: 'Sessions', icon: Laptop },
            { id: 'history', label: 'Login History', icon: History }
          ].map(tab => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold transition-all ${
                  isTabActive 
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: AUTH & LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              
              {isForgotPassword ? (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="text-center py-2">
                    <KeyRound className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Reset Password</h3>
                    <p className="text-xs text-gray-500 mt-1">Enter your registered email address to receive reset link.</p>
                  </div>

                  {emailSentSuccess ? (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs text-center space-y-2">
                      <CheckCircle2 className="w-6 h-6 mx-auto" />
                      <p className="font-bold">Password reset email sent!</p>
                      <p className="text-[11px]">Check your inbox at <strong>{emailInput}</strong>.</p>
                      <button 
                        type="button"
                        onClick={() => setIsForgotPassword(false)}
                        className="mt-2 text-indigo-600 font-bold underline text-xs"
                      >
                        Back to Login
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Work Email</label>
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-[var(--border)] focus:border-indigo-500 outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20"
                      >
                        Send Reset Link
                      </button>

                      <div className="text-center">
                        <button 
                          type="button" 
                          onClick={() => setIsForgotPassword(false)}
                          className="text-xs font-medium text-gray-500 hover:underline"
                        >
                          Cancel & Return to Login
                        </button>
                      </div>
                    </>
                  )}
                </form>
              ) : (
                <>
                  {/* Google OAuth Login Button */}
                  <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 rounded-2xl text-xs font-bold shadow-sm transition-all"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Sign in with Google Workspace OAuth</span>
                  </button>

                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-[var(--border)]" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Or Continue With Email</span>
                    <div className="flex-1 h-px bg-[var(--border)]" />
                  </div>

                  <form onSubmit={handleEmailLogin} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-[var(--border)] focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</label>
                        <button 
                          type="button" 
                          onClick={() => setIsForgotPassword(true)}
                          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-3.5 py-2 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-[var(--border)] focus:border-indigo-500 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        <span className="text-xs text-gray-600 dark:text-gray-400">Remember session for 30 days</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all mt-2"
                    >
                      Authenticate Session
                    </button>
                  </form>
                </>
              )}

              {/* Status Verification Badge */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Email Verified</div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400">{userEmail}</div>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-bold px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>

            </div>
          )}

          {/* TAB 2: TWO-FACTOR AUTH (2FA) */}
          {activeTab === '2fa' && (
            <div className="space-y-5">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-start gap-3">
                <Smartphone className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-indigo-900 dark:text-indigo-200">Two-Factor Authentication (TOTP)</h3>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-0.5 leading-relaxed">
                    Protect your enterprise account using Google Authenticator, Authy, or Duo Security.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-[var(--border)] rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Require 2FA for All Logins</div>
                  <div className="text-[11px] text-gray-500">Enforce 6-digit verification code prompt</div>
                </div>
                <button
                  onClick={() => updateSettings({ twoFactorAuth: !settings.twoFactorAuth })}
                  className={`w-11 h-6 rounded-full transition-all relative ${settings.twoFactorAuth ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.twoFactorAuth ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              <form onSubmit={handleVerify2FA} className="space-y-3">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Enter 6-Digit Authenticator Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="849 201"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full text-center text-lg font-mono tracking-widest px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] focus:border-indigo-500 outline-none"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Verify & Finish Login
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: ACTIVE SESSIONS */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 dark:text-white">Active Device Sessions</span>
                <span className="text-[11px] text-indigo-600 font-semibold">{activeSessions.length} Devices</span>
              </div>

              <div className="space-y-2">
                {activeSessions.map((session) => (
                  <div key={session.id} className="p-3 border border-[var(--border)] rounded-2xl flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/40">
                    <div className="flex items-center gap-3">
                      <Laptop className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>{session.device}</span>
                          {session.current && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-[10px]">
                              Current Device
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-500">{session.location} • Last active {session.lastActive}</div>
                      </div>
                    </div>
                    {!session.current && (
                      <button className="text-[11px] text-red-600 font-bold hover:underline">Revoke</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LOGIN HISTORY LOGS */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-900 dark:text-white">Recent IP & Authentication Logs</span>
              <div className="space-y-2">
                {loginHistory.map((item) => (
                  <div key={item.id} className="p-3 border border-[var(--border)] rounded-2xl text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{item.device}</div>
                      <div className="text-[11px] text-gray-500">{item.date} • IP: {item.ip}</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full text-[10px] font-bold">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[var(--border)] bg-gray-50 dark:bg-gray-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 text-xs font-bold rounded-xl transition-all"
          >
            Close Security Window
          </button>
        </div>

      </div>
    </div>
  );
}
