import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, User, ExternalLink, Zap } from 'lucide-react';

interface TopbarProps {
  title: string;
  subtitle?: string;
  collapsed: boolean;
  onNavigate?: (tab: string) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ title, subtitle, collapsed, onNavigate }) => {
  const { user, role } = useAuth();

  return (
    <header
      className={`fixed top-0 right-0 h-20 bg-[#080808]/85 backdrop-blur-xl border-b border-white/5 z-30 transition-all duration-300 flex items-center justify-between px-6 sm:px-8 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div>
        <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-wide flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-[11px] text-[#8E8E93] font-sans mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Role Pill Badge with Glowing Crimson Accent */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181818] border border-white/10 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-sm">
          <Zap className="w-3.5 h-3.5 text-[#FF1E27]" />
          <span>{role} SYSTEM</span>
        </div>

        {/* User Card */}
        <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/10">
          <div className="text-right">
            <span className="text-xs font-bold text-white block leading-tight font-sans">
              {user?.fullName || user?.email}
            </span>
            <span className="text-[10px] text-[#FF1E27] font-mono tracking-wider">
              {user?.memberProfile?.memberId || user?.trainerProfile?.trainerId || 'HEAD-ADMIN'}
            </span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-bold">
            <User className="w-4 h-4 text-[#FF1E27]" />
          </div>
        </div>
      </div>
    </header>
  );
};
