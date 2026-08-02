'use client';

import React, { useState } from 'react';
import { useStore, Role } from '../store/useStore';
import { 
  Sparkles, Lock, Eye, EyeOff, Shield, Smartphone, KeyRound, CheckCircle2, ArrowRight, Check, AlertCircle, Building, Users, FileCheck2 
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (role: Role) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const { login, settings } = useStore();

  const [emailInput, setEmailInput] = useState('sarah@omniflow.io');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States for sub-flows
  const [viewState, setViewState] = useState<'login' | 'forgot' | '2fa' | 'reset-success'>('login');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [pendingRole, setPendingRole] = useState<Role>('super_admin');
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const detectedRole = login(emailInput);
    
    if (settings.twoFactorAuth) {
      setPendingRole(detectedRole);
      setViewState('2fa');
    } else {
      onLoginSuccess(detectedRole);
    }
  };

  const handleQuickDemoLogin = (email: string) => {
    setEmailInput(email);
    const detectedRole = login(email);
    onLoginSuccess(detectedRole);
  };

  const handle2FAVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length >= 4) {
      onLoginSuccess(pendingRole);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setViewState('reset-success');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[var(--background)] flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Glow & Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-[var(--card)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Left Panel: SaaS Brand Showcase */}
        <div className="p-8 md:p-10 bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 text-white flex flex-col justify-between relative">
          <div className="space-y-6 z-10">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight leading-none">OmniFlow</span>
                <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mt-0.5">Enterprise Social SaaS</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h1 className="text-2xl font-black leading-tight tracking-tight">
                Role-Based Social Media Management Workspace
              </h1>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Streamline multi-tenant client approvals, 11-stage content workflows, side-by-side version control, and Slack-style feedback loops.
              </p>
            </div>

            {/* Platform Highlights */}
            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Super Admin, Agency Admin, Creator & Client Portals</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Side-by-Side Version Diff & Rollback</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>SOC-2 Certified Encryption & 2FA</span>
              </div>
            </div>

          </div>

          <div className="pt-8 text-[11px] text-indigo-300/80 z-10 flex items-center justify-between border-t border-indigo-800/60">
            <span>© 2026 OmniFlow Inc.</span>
            <span>v2.6 Enterprise</span>
          </div>
        </div>

        {/* Right Panel: Authentication Form & Sub-Flows */}
        <div className="p-8 md:p-10 flex flex-col justify-center space-y-6">
          
          {/* VIEW 1: LOGIN FORM */}
          {viewState === 'login' && (
            <div className="space-y-5">
              
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Sign In to Workspace</h2>
                <p className="text-xs text-gray-500 mt-1">Role is automatically detected based on your login credentials.</p>
              </div>

              {/* Google OAuth Login Button */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('sarah@omniflow.io')}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 rounded-2xl text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign in with Google Workspace OAuth</span>
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-[10px] font-bold text-gray-400 uppercase">Or Sign In With Email</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              {/* Login Credentials Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Work Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@omniflow.io"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-[var(--border)] outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setViewState('forgot')}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-[var(--border)] outline-none focus:border-indigo-500 pr-10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <span className="text-gray-600 dark:text-gray-400">Remember session for 30 days</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95 mt-2"
                >
                  <span>Authenticate & Open Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Demo Role Presets Bar */}
              <div className="pt-4 border-t border-[var(--border)] space-y-2">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                  ⚡️ Quick Demo Login Presets
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('sarah@omniflow.io')}
                    className="p-2 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 text-purple-900 dark:text-purple-200 text-left hover:bg-purple-100 transition-all"
                  >
                    <div className="text-xs font-bold">Super Admin</div>
                    <div className="text-[10px] text-purple-600 dark:text-purple-400 truncate">sarah@omniflow.io</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('michael@omniflow.io')}
                    className="p-2 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-200 text-left hover:bg-blue-100 transition-all"
                  >
                    <div className="text-xs font-bold">Agency Admin</div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 truncate">michael@omniflow.io</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('alex@omniflow.io')}
                    className="p-2 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 text-left hover:bg-emerald-100 transition-all"
                  >
                    <div className="text-xs font-bold">Employee</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 truncate">alex@omniflow.io</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('john@nike.com')}
                    className="p-2 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 text-left hover:bg-amber-100 transition-all"
                  >
                    <div className="text-xs font-bold">Client Portal</div>
                    <div className="text-[10px] text-amber-600 dark:text-amber-400 truncate">john@nike.com</div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: TWO-FACTOR AUTH (2FA) */}
          {viewState === '2fa' && (
            <form onSubmit={handle2FAVerify} className="space-y-5 animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto font-bold">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">Two-Factor Authentication</h2>
                <p className="text-xs text-gray-500">Enter the 6-digit TOTP code from your authenticator app.</p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="849 201"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full text-center text-xl font-mono tracking-widest px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[var(--border)] outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Verify Code & Sign In
              </button>

              <button
                type="button"
                onClick={() => setViewState('login')}
                className="w-full text-center text-xs font-bold text-gray-500 hover:underline"
              >
                Cancel & Return to Login
              </button>
            </form>
          )}

          {/* VIEW 3: FORGOT PASSWORD */}
          {viewState === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4 animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto font-bold">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black text-gray-900 dark:text-white">Reset Password</h2>
                <p className="text-xs text-gray-500">Enter your account email to receive a password reset link.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@omniflow.io"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-[var(--border)] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Send Password Reset Email
              </button>

              <button
                type="button"
                onClick={() => setViewState('login')}
                className="w-full text-center text-xs font-bold text-gray-500 hover:underline"
              >
                Return to Login
              </button>
            </form>
          )}

          {/* VIEW 4: RESET SUCCESS */}
          {viewState === 'reset-success' && (
            <div className="space-y-4 text-center animate-in fade-in py-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h2 className="text-lg font-black text-gray-900 dark:text-white">Password Reset Email Sent!</h2>
              <p className="text-xs text-gray-500">
                We sent a password reset link to <strong>{forgotEmail}</strong>. Follow the link to create your new password.
              </p>
              <button
                type="button"
                onClick={() => setViewState('login')}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md mt-2"
              >
                Return to Login
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
