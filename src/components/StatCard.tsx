import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendPositive?: boolean;
  color?: 'red' | 'emerald' | 'amber' | 'blue';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  color = 'red',
  onClick,
}) => {
  const colorMap = {
    red: {
      border: 'border-white/5 hover:border-[#FF1E27]/40',
      iconBg: 'bg-[#FF1E27]/15 text-[#FF1E27]',
      valColor: 'text-white',
    },
    emerald: {
      border: 'border-white/5 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      valColor: 'text-emerald-400',
    },
    amber: {
      border: 'border-white/5 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/15 text-amber-400',
      valColor: 'text-amber-400',
    },
    blue: {
      border: 'border-white/5 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/15 text-blue-400',
      valColor: 'text-blue-400',
    },
  };

  const theme = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl border ${theme.border} ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${theme.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className={`font-display text-4xl font-extrabold tracking-tight ${theme.valColor}`}>
        {value}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
          {subtitle && <span className="text-[#71717A] truncate font-sans">{subtitle}</span>}
          {trend && (
            <span className={`font-bold font-mono ${trendPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
