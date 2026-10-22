import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  CalendarCheck,
  Calendar,
  Dumbbell,
  Receipt,
  Bell,
  FileBarChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Shield,
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  collapsed,
  onToggleCollapse,
}) => {
  const { role, logout, user } = useAuth();

  const adminLinks = [
    { id: 'admin-dashboard', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'admin-members', label: 'Member Directory', icon: Users },
    { id: 'admin-trainers', label: 'Coaching Roster', icon: UserCheck },
    { id: 'admin-plans', label: 'Membership Tiers', icon: CreditCard },
    { id: 'admin-attendance', label: 'Attendance Audit', icon: CalendarCheck },
    { id: 'admin-timetable', label: 'Timetable Matrix', icon: Calendar },
    { id: 'admin-workouts', label: 'Workout Protocols', icon: Dumbbell },
    { id: 'admin-payments', label: 'Fee Invoices', icon: Receipt },
    { id: 'admin-notices', label: 'Gym Broadcasts', icon: Bell },
    { id: 'admin-reports', label: 'Analytics & Export', icon: FileBarChart },
    { id: 'admin-settings', label: 'Facility Config', icon: Settings },
  ];

  const trainerLinks = [
    { id: 'trainer-dashboard', label: 'Coach Overview', icon: LayoutDashboard },
    { id: 'trainer-members', label: 'Assigned Athletes', icon: Users },
    { id: 'trainer-workouts', label: 'Workout Splits', icon: Dumbbell },
    { id: 'trainer-attendance', label: 'Floor Attendance', icon: CalendarCheck },
    { id: 'trainer-timetable', label: 'Class Schedules', icon: Calendar },
    { id: 'trainer-notices', label: 'Notices Board', icon: Bell },
  ];

  const memberLinks = [
    { id: 'member-dashboard', label: 'Member Hub', icon: LayoutDashboard },
    { id: 'member-profile', label: 'Profile & Security', icon: User },
    { id: 'member-workouts', label: 'My Workout Matrix', icon: Dumbbell },
    { id: 'member-attendance', label: 'Attendance Log', icon: CalendarCheck },
    { id: 'member-timetable', label: 'Classes Matrix', icon: Calendar },
    { id: 'member-payments', label: 'Tax Invoices', icon: Receipt },
    { id: 'member-notices', label: 'Announcements', icon: Bell },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'TRAINER' ? trainerLinks : memberLinks;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#0A0A0A]/95 backdrop-blur-xl border-r border-white/5 transition-all duration-300 z-40 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="h-20 flex items-center justify-between px-4 border-b border-white/5">
          {!collapsed ? (
            <div className="cursor-pointer" onClick={() => onNavigate('home')}>
              <Logo size="sm" />
            </div>
          ) : (
            <div className="w-full flex justify-center cursor-pointer" onClick={() => onNavigate('home')}>
              <Dumbbell className="w-6 h-6 text-[#FF1E27]" />
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-[#8E8E93] hover:text-white hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Card */}
        <div className={`p-4 border-b border-white/5 ${collapsed ? 'text-center' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-[#FF1E27] flex items-center justify-center font-heading font-extrabold text-white text-base shadow-glow-sm shrink-0">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.fullName || 'User'}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] font-mono font-bold text-[#FF1E27] uppercase tracking-wider">
                    {role} ROLE
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Nav list */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;

            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                title={collapsed ? link.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#FF1E27] text-white shadow-glow-sm shadow-red-950/80 font-extrabold'
                    : 'text-[#8E8E93] hover:bg-white/5 hover:text-white'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#71717A]'}`} />
                {!collapsed && <span className="truncate">{link.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <button
          onClick={() => onNavigate('home')}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-[#8E8E93] hover:text-white hover:bg-white/5 rounded-xl transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Back to Landing Page"
        >
          <Home className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Public Website</span>}
        </button>

        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-400 hover:text-white hover:bg-red-950/40 rounded-xl transition-colors ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
