import React, { useEffect, useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  AlertCircle,
  X,
  User,
} from 'lucide-react';
import { Attendance, MemberProfile } from '../../types';
import { api } from '../../services/api';

export const AttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [activeMembers, setActiveMembers] = useState<MemberProfile[]>([]);
  const [summary, setSummary] = useState({
    presentCount: 0,
    absentCount: 0,
    totalActiveMembers: 0,
    attendanceRate: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  // Single Record Modal
  const [showModal, setShowModal] = useState<boolean>(false);
  const [memberToRecord, setMemberToRecord] = useState<string>('');
  const [statusToRecord, setStatusToRecord] = useState<'PRESENT' | 'ABSENT'>('PRESENT');
  const [timeToRecord, setTimeToRecord] = useState<string>('06:30 AM');
  const [notesToRecord, setNotesToRecord] = useState<string>('');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.getAttendance({
        date: selectedDate,
        search: search || undefined,
      });
      if (res.success) {
        setAttendanceList(res.data);
        if (res.summary) setSummary(res.summary);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, search]);

  useEffect(() => {
    api.getMembers({ status: 'ACTIVE', limit: 100 }).then((res) => {
      if (res.success) {
        setActiveMembers(res.data);
        if (res.data.length > 0 && !memberToRecord) {
          setMemberToRecord(res.data[0].id);
        }
      }
    });
  }, []);

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.recordAttendance({
        memberProfileId: memberToRecord,
        date: selectedDate,
        checkInTime: statusToRecord === 'PRESENT' ? timeToRecord : null,
        status: statusToRecord,
        notes: notesToRecord || null,
      });

      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowModal(false);
        setNotesToRecord('');
        fetchAttendance();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Duplicate attendance entry.' });
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
            Daily Attendance Management
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Log check-in timings, prevent duplicates, and monitor member visit consistency.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-red-900/30 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Mark Attendance</span>
        </button>
      </div>

      {/* Message alert */}
      {message && (
        <div
          className={`p-3.5 rounded-lg text-xs flex items-center justify-between border ${
            message.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300'
              : 'bg-red-950/70 border-red-800 text-red-300'
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Date Picker & Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="gym-card p-4 bg-[#141414] border-[#262626] flex flex-col justify-center">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#888888] block mb-1">
            Selected Attendance Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] focus:border-[#E50914] rounded-lg p-2 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="gym-card p-4 bg-[#141414] border-[#262626]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#888888] block">
            Members Present
          </span>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading mt-1">
            {summary.presentCount}
          </div>
          <span className="text-[11px] text-[#666666]">Checked into facility</span>
        </div>

        <div className="gym-card p-4 bg-[#141414] border-[#262626]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#888888] block">
            Members Absent / Rest
          </span>
          <div className="text-3xl font-extrabold text-red-400 font-heading mt-1">
            {summary.absentCount}
          </div>
          <span className="text-[11px] text-[#666666]">Informed or marked absent</span>
        </div>

        <div className="gym-card p-4 bg-[#141414] border-[#262626]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#888888] block">
            Floor Attendance Rate
          </span>
          <div className="text-3xl font-extrabold text-[#E50914] font-heading mt-1">
            {summary.attendanceRate}%
          </div>
          <span className="text-[11px] text-[#666666]">Based on {summary.totalActiveMembers} active members</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="gym-card p-3 bg-[#141414] border-[#262626] flex items-center">
        <Search className="w-4 h-4 text-[#666666] ml-2 mr-3" />
        <input
          type="text"
          placeholder="Filter attendance by member name or ID for this date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder-[#666666] focus:outline-none"
        />
      </div>

      {/* Attendance Table */}
      <div className="gym-card bg-[#141414] border-[#262626] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#181818] text-[#888888] uppercase border-b border-[#242424] font-semibold">
              <tr>
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Check-In Time</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#777777]">
                    Loading attendance records...
                  </td>
                </tr>
              ) : attendanceList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#777777]">
                    No attendance recorded for {selectedDate}. Click "Mark Attendance" above to record members.
                  </td>
                </tr>
              ) : (
                attendanceList.map((a) => (
                  <tr key={a.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#E50914] font-bold">
                      {a.memberProfile?.memberId}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      {a.memberProfile?.fullName}
                    </td>
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
                    <td className="py-3 px-4 text-[#A3A3A3]">
                      {a.memberProfile?.membershipPlan?.name || 'General'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
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
                    <td className="py-3 px-4 text-[#888888]">{a.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MARK ATTENDANCE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl max-w-md w-full p-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h3 className="font-heading font-bold text-lg uppercase">Log Member Attendance</h3>
              <button onClick={() => setShowModal(false)} className="text-[#888888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecord} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">
                  Select Gym Member *
                </label>
                <select
                  required
                  value={memberToRecord}
                  onChange={(e) => setMemberToRecord(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                >
                  {activeMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.memberId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Status</label>
                  <select
                    value={statusToRecord}
                    onChange={(e) => setStatusToRecord(e.target.value as any)}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white font-bold"
                  >
                    <option value="PRESENT">PRESENT</option>
                    <option value="ABSENT">ABSENT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Check-In Time</label>
                  <input
                    type="text"
                    disabled={statusToRecord === 'ABSENT'}
                    value={timeToRecord}
                    onChange={(e) => setTimeToRecord(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white disabled:opacity-30"
                    placeholder="e.g. 06:45 AM"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Session / Notes</label>
                <input
                  type="text"
                  value={notesToRecord}
                  onChange={(e) => setNotesToRecord(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  placeholder="e.g. Legs & Cardio / Shoulder press workout"
                />
              </div>

              <div className="p-3 bg-red-950/20 border border-red-900/40 rounded text-[11px] text-[#A3A3A3]">
                💡 The system automatically enforces uniqueness: duplicate entries for the same member on the same date are rejected by the database.
              </div>

              <div className="pt-3 border-t border-[#242424] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#222222] text-[#888888] hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white font-bold rounded"
                >
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
