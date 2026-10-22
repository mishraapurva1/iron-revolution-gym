import React, { useEffect, useState } from 'react';
import {
  User,
  CalendarCheck,
  Dumbbell,
  Receipt,
  AlertCircle,
  Clock,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MemberProfile, WorkoutPlan, Attendance, Payment } from '../../types';
import { api } from '../../services/api';
import { ReceiptModal } from '../../components/ReceiptModal';

interface MemberDashboardProps {
  onNavigate: (tab: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getMe().then((res) => {
      if (res.success && res.user?.memberProfile) {
        const m = res.user.memberProfile;
        setProfile(m);

        if (m.id) {
          api.getMemberAttendanceHistory(m.id).then((attRes) => {
            if (attRes.success) setAttendance(attRes.data);
          });
          api.getWorkoutPlans(m.id).then((wpRes) => {
            if (wpRes.success) setPlans(wpRes.data);
          });
          api.getPayments().then((payRes) => {
            if (payRes.success) setPayments(payRes.data);
          });
        }
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const mem = profile || user?.memberProfile;

  // Calculate days remaining in membership
  let daysRemaining = 0;
  if (mem?.membershipExpiryDate) {
    const diff = new Date(mem.membershipExpiryDate).getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  // Attendance stats
  const totalPresent = attendance.filter((a) => a.status === 'PRESENT').length;
  const attendancePercentage = attendance.length > 0 ? Math.round((totalPresent / attendance.length) * 100) : 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* 1. Member Status Header Card */}
      <div className="gym-card p-6 bg-gradient-to-r from-[#171717] via-[#141414] to-[#1F1111] border-[#2E2424] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-[#E50914] flex items-center justify-center font-heading font-extrabold text-2xl text-white shrink-0">
            {mem?.fullName ? mem.fullName[0].toUpperCase() : 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#E50914] bg-[#221010] border border-red-900/60 px-2 py-0.5 rounded">
                {mem?.memberId || 'IR-MEM-1001'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                {mem?.status || 'ACTIVE'}
              </span>
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-white mt-1 uppercase">
              Welcome Back, {mem?.fullName}
            </h2>
            <p className="text-xs text-[#888888]">
              Current Plan: <strong className="text-white">{mem?.membershipPlan?.name || 'Annual VIP Package'}</strong>
            </p>
          </div>
        </div>

        {/* Expiry Pill */}
        <div className="bg-[#181818] border border-[#2B2B2B] p-4 rounded-xl text-right shrink-0">
          <span className="text-[11px] uppercase font-bold text-[#888888] block">Membership Status</span>
          <div className="text-xl font-bold font-heading text-emerald-400 mt-0.5">
            {daysRemaining} Days Remaining
          </div>
          <span className="text-[11px] text-[#777777] font-mono">
            Expires: {mem?.membershipExpiryDate ? new Date(mem.membershipExpiryDate).toLocaleDateString('en-IN') : 'N/A'}
          </span>
        </div>
      </div>

      {/* 2. Quick Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Check-In Attendance</span>
          <div className="text-3xl font-extrabold text-white font-heading mt-1">
            {attendancePercentage}%
          </div>
          <span className="text-[11px] text-[#666666]">
            {totalPresent} sessions completed out of {attendance.length} recorded
          </span>
        </div>

        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Assigned Personal Coach</span>
          <div className="text-lg font-bold text-white font-heading mt-1">
            {mem?.assignedTrainer?.fullName || 'Coach Vikram Singh'}
          </div>
          <span className="text-[11px] text-[#E50914] font-semibold">
            {mem?.assignedTrainer?.specialization || 'Strength & Hypertrophy'}
          </span>
        </div>

        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Registered Receipts</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading mt-1">
            {payments.length}
          </div>
          <span className="text-[11px] text-[#666666]">Official computerized tax invoices</span>
        </div>
      </div>

      {/* 3. Assigned Workout Plan Preview */}
      <div className="gym-card p-6 bg-[#141414] border-[#262626]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-bold text-white uppercase flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#E50914]" />
              <span>My Prescribed Workout Routine</span>
            </h3>
            <p className="text-xs text-[#888888]">
              {plans.length > 0 ? plans[0].title : 'Progressive Strength & Hypertrophy Protocol'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('member-workouts')}
            className="text-xs font-bold text-[#E50914] hover:underline flex items-center gap-1"
          >
            <span>View Full Protocol</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {plans.length > 0 && plans[0].exercises ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181818] text-[#888888] uppercase border-b border-[#242424]">
                <tr>
                  <th className="p-2.5">Training Day</th>
                  <th className="p-2.5">Exercise Movement</th>
                  <th className="p-2.5">Target Muscle</th>
                  <th className="p-2.5">Sets × Reps</th>
                  <th className="p-2.5">Prescribed Weight</th>
                  <th className="p-2.5">Rest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {plans[0].exercises.slice(0, 4).map((ex, i) => (
                  <tr key={i} className="hover:bg-[#1A1A1A]">
                    <td className="p-2.5 font-bold text-white">{ex.dayOfWeek}</td>
                    <td className="p-2.5 font-medium text-white">{ex.exerciseName}</td>
                    <td className="p-2.5 text-[#E50914]">{ex.targetMuscle}</td>
                    <td className="p-2.5 font-mono text-[#CCCCCC]">{ex.sets} × {ex.reps}</td>
                    <td className="p-2.5 text-[#888888]">{ex.weight || 'Bodyweight'}</td>
                    <td className="p-2.5 font-mono text-[#777777]">{ex.restSeconds}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-[#777777]">
            No workout plan assigned yet. Ask Coach Vikram or administration to prescribe your split.
          </div>
        )}
      </div>

      {/* 4. Payment Receipts & Recent Attendance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment History & Receipt Download */}
        <div className="gym-card p-6 bg-[#141414] border-[#262626]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-heading font-bold text-white uppercase flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" />
                <span>My Payment Receipts</span>
              </h3>
              <p className="text-xs text-[#888888]">Official membership fee invoices</p>
            </div>
            <button
              onClick={() => onNavigate('member-payments')}
              className="text-xs font-bold text-[#E50914] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {payments.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="bg-[#1A1A1A] border border-[#242424] p-3.5 rounded-lg flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-bold text-[#E50914] text-xs">{p.receiptNo}</span>
                  <div className="text-white font-medium text-xs mt-0.5">
                    {p.membershipPlan?.name || 'Membership Renewal'}
                  </div>
                  <span className="text-[11px] text-[#777777] font-mono">
                    {new Date(p.paymentDate).toLocaleDateString('en-IN')} via {p.paymentMethod}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">
                    ₹{Number(p.amount).toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => setSelectedReceipt(p)}
                    className="px-2 py-1 bg-[#242424] hover:bg-[#333333] text-white rounded text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attendance Log */}
        <div className="gym-card p-6 bg-[#141414] border-[#262626]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-heading font-bold text-white uppercase flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-blue-400" />
                <span>Recent Gym Check-Ins</span>
              </h3>
              <p className="text-xs text-[#888888]">Your entrance log recorded at the front desk</p>
            </div>
            <button
              onClick={() => onNavigate('member-attendance')}
              className="text-xs font-bold text-[#E50914] hover:underline"
            >
              Full Calendar
            </button>
          </div>

          <div className="space-y-2.5">
            {attendance.slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="bg-[#1A1A1A] border border-[#242424] p-3 rounded-lg flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <div>
                    <span className="font-mono text-white font-bold">{a.date}</span>
                    <span className="text-[#777777] block text-[11px]">{a.checkInTime || 'Regular Session'}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
};
