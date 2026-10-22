import React, { useEffect, useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Users,
  CreditCard,
  CalendarCheck,
  Award,
} from 'lucide-react';
import { DashboardStats } from '../../types';
import { api } from '../../services/api';

export const ReportsPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeReportTab, setActiveReportTab] = useState<'attendance' | 'revenue' | 'members'>('attendance');

  useEffect(() => {
    api.getDashboardStats()
      .then((res) => {
        if (res.success) setStats(res);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
            Gym Management Reports & Audits
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Real-time analytics on member enrollment, fee collections, attendance frequency, and package distributions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] hover:bg-[#282828] border border-[#333333] text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4 text-[#E50914]" />
            <span>Print Report Document</span>
          </button>
          <a
            href={api.exportMembersCsvUrl()}
            download="members_report.csv"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-red-900/30"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Printable Report Header */}
      <div className="gym-card p-6 bg-[#141414] border-[#262626]">
        <div className="flex justify-between items-start border-b border-[#222222] pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-white uppercase">
              IRON REVOLUTION GYM — AUDIT & PERFORMANCE SUMMARY
            </h1>
            <p className="text-xs text-[#888888]">
              Naroli, Silvassa, Dadra and Nagar Haveli — 396235 | Owner: Sachin Patel | Dev: Apurva Mishra
            </p>
          </div>
          <div className="text-right text-xs text-[#888888]">
            <span>Report Generated: </span>
            <span className="font-mono text-white font-bold">{new Date().toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* High-level metrics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
            <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#2B2B2B]">
              <span className="text-[11px] text-[#888888] uppercase font-bold block">Total Members</span>
              <span className="text-2xl font-bold font-heading text-white">{stats.summary.totalMembers}</span>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#2B2B2B]">
              <span className="text-[11px] text-[#888888] uppercase font-bold block">Active Roster</span>
              <span className="text-2xl font-bold font-heading text-emerald-400">{stats.summary.activeMembers}</span>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#2B2B2B]">
              <span className="text-[11px] text-[#888888] uppercase font-bold block">Coaching Staff</span>
              <span className="text-2xl font-bold font-heading text-blue-400">{stats.summary.totalTrainers}</span>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-lg border border-[#2B2B2B]">
              <span className="text-[11px] text-[#888888] uppercase font-bold block">Total Revenue</span>
              <span className="text-2xl font-bold font-heading text-[#E50914]">
                ₹{stats.summary.totalRevenue.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Tab selection for detailed tables */}
        <div className="flex gap-2 border-b border-[#222222] pb-3 mb-6 no-print">
          <button
            onClick={() => setActiveReportTab('attendance')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${
              activeReportTab === 'attendance'
                ? 'bg-[#E50914] text-white'
                : 'bg-[#1C1C1C] text-[#888888] hover:text-white'
            }`}
          >
            Weekly Attendance Analysis
          </button>
          <button
            onClick={() => setActiveReportTab('revenue')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${
              activeReportTab === 'revenue'
                ? 'bg-[#E50914] text-white'
                : 'bg-[#1C1C1C] text-[#888888] hover:text-white'
            }`}
          >
            Monthly Revenue Ledger
          </button>
          <button
            onClick={() => setActiveReportTab('members')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-colors ${
              activeReportTab === 'members'
                ? 'bg-[#E50914] text-white'
                : 'bg-[#1C1C1C] text-[#888888] hover:text-white'
            }`}
          >
            Package Breakdown
          </button>
        </div>

        {/* Tab Contents */}
        {stats && activeReportTab === 'attendance' && (
          <div className="overflow-x-auto">
            <h4 className="text-sm font-bold font-heading text-white uppercase mb-3">
              Daily Attendance Check-In Counts (Past 7 Days)
            </h4>
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181818] text-[#888888] uppercase border-b border-[#242424]">
                <tr>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Day of Week</th>
                  <th className="py-2.5 px-4">Present Members</th>
                  <th className="py-2.5 px-4">Facility Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {stats.charts.attendanceTrends.map((t, idx) => (
                  <tr key={idx} className="hover:bg-[#1A1A1A]">
                    <td className="py-2.5 px-4 font-mono text-white">{t.date}</td>
                    <td className="py-2.5 px-4 font-semibold text-[#CCCCCC]">{t.day}</td>
                    <td className="py-2.5 px-4 font-bold text-emerald-400 font-mono text-sm">{t.count} Trainees</td>
                    <td className="py-2.5 px-4 text-[#888888]">Normal Operating Hours</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {stats && activeReportTab === 'revenue' && (
          <div className="overflow-x-auto">
            <h4 className="text-sm font-bold font-heading text-white uppercase mb-3">
              Monthly Revenue & Intake Summary (Past 6 Months)
            </h4>
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181818] text-[#888888] uppercase border-b border-[#242424]">
                <tr>
                  <th className="py-2.5 px-4">Month</th>
                  <th className="py-2.5 px-4">New Registrations</th>
                  <th className="py-2.5 px-4">Revenue Collected (INR)</th>
                  <th className="py-2.5 px-4">Ledger Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {stats.charts.monthlyStats.map((m, idx) => (
                  <tr key={idx} className="hover:bg-[#1A1A1A]">
                    <td className="py-2.5 px-4 font-bold text-white uppercase">{m.month}</td>
                    <td className="py-2.5 px-4 text-[#CCCCCC]">{m.members} Enrolled</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                      ₹{m.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-emerald-500 font-semibold">● Verified & Reconciled</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {stats && activeReportTab === 'members' && (
          <div className="overflow-x-auto">
            <h4 className="text-sm font-bold font-heading text-white uppercase mb-3">
              Plan Distribution & Active Share
            </h4>
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181818] text-[#888888] uppercase border-b border-[#242424]">
                <tr>
                  <th className="py-2.5 px-4">Membership Package</th>
                  <th className="py-2.5 px-4">Price (INR)</th>
                  <th className="py-2.5 px-4">Subscribed Members</th>
                  <th className="py-2.5 px-4">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {stats.charts.planDistribution.map((p, idx) => (
                  <tr key={idx} className="hover:bg-[#1A1A1A]">
                    <td className="py-2.5 px-4 font-bold text-white">{p.name}</td>
                    <td className="py-2.5 px-4 font-mono text-[#CCCCCC]">₹{p.price}</td>
                    <td className="py-2.5 px-4 font-bold text-[#E50914]">{p.value} Members</td>
                    <td className="py-2.5 px-4 font-mono font-bold text-emerald-400">
                      ₹{(p.price * p.value).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
