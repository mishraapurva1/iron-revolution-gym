import React, { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  CalendarCheck,
  CreditCard,
  AlertTriangle,
  Receipt,
  TrendingUp,
  UserPlus,
  PlusCircle,
  FileSpreadsheet,
  ArrowRight,
  Clock,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { StatCard } from '../../components/StatCard';
import { DashboardStats } from '../../types';
import { api } from '../../services/api';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
}

const COLORS = ['#FF1E27', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getDashboardStats()
      .then((res) => {
        if (res.success) setStats(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8 text-center text-[#8E8E93] flex items-center justify-center min-h-[50vh]">
        <div className="space-y-3">
          <div className="w-10 h-10 border-2 border-[#FF1E27] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs uppercase tracking-widest font-mono font-semibold">Aggregating Live Gym Telemetry...</p>
        </div>
      </div>
    );
  }

  const { summary, charts, recentMembers, recentPayments, expiringMemberships } = stats;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Quick Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            Command Center Telemetry: All Systems Operational
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('admin-members')}
            className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-glow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Member</span>
          </button>
          <button
            onClick={() => onNavigate('admin-attendance')}
            className="btn-secondary flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#FF1E27]" />
            <span>Audit Attendance</span>
          </button>
          <button
            onClick={() => onNavigate('admin-payments')}
            className="btn-secondary flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
            <span>Issue Receipt</span>
          </button>
          <button
            onClick={() => onNavigate('admin-reports')}
            className="btn-secondary flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
            <span>Generate CSV</span>
          </button>
        </div>
      </div>

      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Athletes"
          value={summary.totalMembers}
          icon={Users}
          color="red"
          onClick={() => onNavigate('admin-members')}
          subtitle="All enrolled profiles"
        />
        <StatCard
          title="Active Subscriptions"
          value={summary.activeMembers}
          icon={UserCheck}
          color="emerald"
          onClick={() => onNavigate('admin-members')}
          subtitle="Valid gym passes"
        />
        <StatCard
          title="Expiring (<= 7 Days)"
          value={summary.expiringCount}
          icon={AlertTriangle}
          color="amber"
          onClick={() => onNavigate('admin-members')}
          subtitle="Action required"
        />
        <StatCard
          title="Coaching Staff"
          value={summary.totalTrainers}
          icon={Users}
          color="blue"
          onClick={() => onNavigate('admin-trainers')}
          subtitle="Certified mentors"
        />
        <StatCard
          title="Today's Check-Ins"
          value={summary.todayAttendance}
          icon={CalendarCheck}
          color="red"
          onClick={() => onNavigate('admin-attendance')}
          subtitle="Verified visits"
        />
        <StatCard
          title="Gross Revenue"
          value={`₹${summary.totalRevenue.toLocaleString('en-IN')}`}
          icon={CreditCard}
          color="emerald"
          onClick={() => onNavigate('admin-payments')}
          subtitle="Computerized ledger"
        />
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue & Registrations */}
        <div className="glass-card p-6 rounded-2xl border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-display font-bold text-white uppercase tracking-wide">
                Member Intake Trend (Past 6 Months)
              </h3>
              <p className="text-[11px] text-[#8E8E93] font-sans">New member enrollments per month</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#FF1E27]" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#666666" tick={{ fill: '#888888', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }} />
                <YAxis stroke="#666666" tick={{ fill: '#888888', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }}
                />
                <Bar dataKey="members" name="Enrolled Members" fill="#FF1E27" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Attendance Flow (Smooth Area Curve) */}
        <div className="glass-card p-6 rounded-2xl border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-display font-bold text-white uppercase tracking-wide">
                Floor Attendance Curve (Past 7 Days)
              </h3>
              <p className="text-[11px] text-[#8E8E93] font-sans">Daily biometric attendance frequency</p>
            </div>
            <CalendarCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.attendanceTrends}>
                <defs>
                  <linearGradient id="attendanceGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#666666" tick={{ fill: '#888888', fontSize: 11 }} />
                <YAxis stroke="#666666" tick={{ fill: '#888888', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Present Members"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#attendanceGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Plan Distribution & Expiring Memberships */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership Distribution Donut Chart */}
        <div className="glass-card p-6 rounded-2xl border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-display font-bold text-white uppercase tracking-wide mb-1">
              Package Allocation
            </h3>
            <p className="text-[11px] text-[#8E8E93] mb-4">Proportion of members by package</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.planDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {charts.planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px' }}
                />
                <Legend
                  formatter={(val) => <span className="text-xs text-[#D1D5DB] font-sans">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expiring Memberships Alert Widget */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-display font-bold text-white uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Expiring Memberships (Immediate Attention)</span>
              </h3>
              <p className="text-[11px] text-[#8E8E93]">Accounts approaching end of tenure within 7 days</p>
            </div>
            <button
              onClick={() => onNavigate('admin-members')}
              className="text-xs font-bold text-[#FF1E27] hover:underline"
            >
              Manage All
            </button>
          </div>

          {expiringMemberships.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#666666]">
              All member accounts currently have healthy membership tenure.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-[#8E8E93] uppercase font-mono border-b border-white/10">
                  <tr>
                    <th className="pb-3">Member ID</th>
                    <th className="pb-3">Athlete</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Expiry Date</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {expiringMemberships.map((m: any) => (
                    <tr key={m.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-mono text-[#FF1E27] font-bold">{m.memberId}</td>
                      <td className="py-3 font-bold text-white font-sans">{m.fullName}</td>
                      <td className="py-3 text-[#A3A3A3]">{m.membershipPlan?.name || 'General Tier'}</td>
                      <td className="py-3 text-amber-400 font-mono font-semibold">
                        {m.membershipExpiryDate
                          ? new Date(m.membershipExpiryDate).toLocaleDateString('en-IN')
                          : 'Not Set'}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => onNavigate('admin-members')}
                          className="px-3 py-1 bg-red-950/60 border border-red-800 text-red-300 rounded-lg text-[11px] font-bold hover:bg-[#FF1E27] hover:text-white transition-colors"
                        >
                          Renew Pass
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 3. Recent Registrations & Payments Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Members */}
        <div className="glass-card p-6 rounded-2xl border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-display font-bold text-white uppercase">
                Recent Athlete Sign-Ups
              </h3>
              <p className="text-[11px] text-[#8E8E93]">Latest additions to the facility</p>
            </div>
            <button
              onClick={() => onNavigate('admin-members')}
              className="text-xs font-bold text-[#FF1E27] hover:underline"
            >
              Full Roster
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[#8E8E93] font-mono uppercase border-b border-white/10">
                <tr>
                  <th className="pb-2.5">ID</th>
                  <th className="pb-2.5">Name</th>
                  <th className="pb-2.5">Package</th>
                  <th className="pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentMembers.map((m: any) => (
                  <tr key={m.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-mono text-[#FF1E27] font-bold">{m.memberId}</td>
                    <td className="py-3 text-white font-bold">{m.fullName}</td>
                    <td className="py-3 text-[#A3A3A3]">{m.membershipPlan?.name || 'General Access'}</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          m.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : m.status === 'PENDING'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payment Records */}
        <div className="glass-card p-6 rounded-2xl border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-display font-bold text-white uppercase">
                Latest Tax Invoices Issued
              </h3>
              <p className="text-[11px] text-[#8E8E93]">Computerized receipts generated</p>
            </div>
            <button
              onClick={() => onNavigate('admin-payments')}
              className="text-xs font-bold text-[#FF1E27] hover:underline"
            >
              All Invoices
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[#8E8E93] font-mono uppercase border-b border-white/10">
                <tr>
                  <th className="pb-2.5">Receipt #</th>
                  <th className="pb-2.5">Member</th>
                  <th className="pb-2.5">Method</th>
                  <th className="pb-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentPayments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-mono text-white font-semibold">{p.receiptNo}</td>
                    <td className="py-3 text-[#E4E4E7] font-medium">{p.memberProfile?.fullName}</td>
                    <td className="py-3 text-[#A1A1AA] font-mono uppercase text-[11px]">{p.paymentMethod}</td>
                    <td className="py-3 text-right font-display text-base font-extrabold text-emerald-400">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
