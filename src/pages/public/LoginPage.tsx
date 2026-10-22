import React, { useState } from 'react';
import { LogIn, KeyRound, Mail, AlertCircle, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login, demoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleDemoClick = async (role: UserRole) => {
    setError(null);
    try {
      await demoLogin(role);
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[130px] pointer-events-none rounded-full"></div>

      <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border-white/10 shadow-2xl relative z-10 space-y-7">
        {/* Brand Header */}
        <div className="text-center">
          <Logo size="lg" className="justify-center mb-4" />
          <h2 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-tight">
            SYSTEM AUTHENTICATION
          </h2>
          <p className="text-xs text-[#8E8E93] mt-1 font-sans">
            Enter your credentials to enter the computerized gym management hub.
          </p>
        </div>

        {/* 1-Click Viva Demo Role Fillers */}
        <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#A3A3A3] mb-3">
            <span className="flex items-center gap-1.5 text-[#FF1E27]">
              <Zap className="w-4 h-4" />
              1-Click Viva Examiner Logins:
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoClick('ADMIN')}
              className="py-2.5 px-2 bg-gradient-to-r from-red-950 to-red-900 border border-red-700/80 hover:border-[#FF1E27] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              ADMIN HQ
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('TRAINER')}
              className="py-2.5 px-2 bg-gradient-to-r from-amber-950 to-amber-900 border border-amber-700/80 hover:border-amber-400 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              COACH ROSTER
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('MEMBER')}
              className="py-2.5 px-2 bg-gradient-to-r from-blue-950 to-blue-900 border border-blue-700/80 hover:border-blue-400 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              MEMBER PORTAL
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FF1E27]" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#CCCCCC] uppercase tracking-wider mb-2 font-mono">
              Account Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@ironrevolution.com"
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CCCCCC] uppercase tracking-wider mb-2 font-mono">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#71717A]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow-sm disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Authenticating Profile...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In To System</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-white/10">
          <p className="text-xs text-[#8E8E93]">
            New member in Naroli?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-[#FF1E27] font-bold hover:underline"
            >
              Enroll Online
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
