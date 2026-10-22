import React, { useEffect, useState } from 'react';
import { CalendarCheck, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Attendance } from '../../types';
import { api } from '../../services/api';

export const MemberAttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [summary, setSummary] = useState({
    totalRecorded: 0,
    totalPresent: 0,
    totalAbsent: 0,
    attendancePercentage: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const memId = user?.memberProfile?.id;
    if (memId) {
      api.getMemberAttendanceHistory(memId).then((res) => {
        if (res.success) {
          setAttendance(res.data);
          if (res.summary) setSummary(res.summary);
        }
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
          My Gym Attendance History
        </h2>
        <p className="text-xs text-[#888888] mt-0.5">
          Verified digital check-in records for all your sessions at IRON REVOLUTION.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Attendance Consistency</span>
          <div className="text-3xl font-extrabold text-[#E50914] font-heading mt-1">
            {summary.attendancePercentage}%
          </div>
          <span className="text-[11px] text-[#666666]">Monthly commitment score</span>
        </div>

        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Present Days</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading mt-1">
            {summary.totalPresent}
          </div>
          <span className="text-[11px] text-[#666666]">Workouts logged</span>
        </div>

        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Rest Days</span>
          <div className="text-3xl font-extrabold text-white font-heading mt-1">
            {summary.totalAbsent}
          </div>
          <span className="text-[11px] text-[#666666]">Recovery periods</span>
        </div>

        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Total Tracked</span>
          <div className="text-3xl font-extrabold text-white font-heading mt-1">
            {summary.totalRecorded}
          </div>
          <span className="text-[11px] text-[#666666]">Total calendar marks</span>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="gym-card bg-[#141414] border-[#262626] overflow-hidden">
        <div className="p-4 border-b border-[#242424]">
          <h3 className="font-heading font-bold text-lg text-white uppercase">Check-In Ledger</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#181818] text-[#888888] uppercase border-b border-[#242424]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Workout Log / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#777777]">
                    Loading check-ins...
                  </td>
                </tr>
              ) : attendance.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[#777777]">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendance.map((a) => (
                  <tr key={a.id} className="hover:bg-[#1A1A1A]">
                    <td className="py-3 px-4 font-mono font-bold text-white">{a.date}</td>
                    <td className="py-3 px-4 text-[#CCCCCC] font-mono">
                      {a.checkInTime ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{a.checkInTime}</span>
                        </div>
                      ) : (
                        <span className="text-[#666666]">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          a.status === 'PRESENT'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950/60 text-red-400 border border-red-800'
                        }`}
                      >
                        {a.status === 'PRESENT' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{a.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#888888]">{a.notes || 'General Fitness Routine'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
