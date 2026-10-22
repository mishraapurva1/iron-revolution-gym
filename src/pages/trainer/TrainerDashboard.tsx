import React, { useEffect, useState } from 'react';
import { Users, Dumbbell, Calendar, CheckCircle2, Clock, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MemberProfile, WorkoutClass, WorkoutPlan } from '../../types';
import { api } from '../../services/api';

interface TrainerDashboardProps {
  onNavigate: (tab: string) => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [assignedMembers, setAssignedMembers] = useState<MemberProfile[]>([]);
  const [classes, setClasses] = useState<WorkoutClass[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch members assigned to this trainer
    api.getMembers().then((res) => {
      if (res.success) setAssignedMembers(res.data);
    }).catch(console.error);

    api.getClasses().then((res) => {
      if (res.success) setClasses(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const trainerProfile = user?.trainerProfile;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Coach Greeting Banner */}
      <div className="gym-card p-6 bg-gradient-to-r from-[#171717] via-[#141414] to-[#1F1111] border-[#2E2424] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#3A3A3A] bg-[#222222] shrink-0">
            <img
              src={trainerProfile?.photoUrl || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&auto=format&fit=crop&q=80'}
              alt="Coach"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold uppercase">
                Coach Portal
              </span>
              <span className="font-mono text-xs text-[#E50914] font-bold">
                {trainerProfile?.trainerId || 'IR-TRN-101'}
              </span>
            </div>
            <h2 className="text-2xl font-heading font-extrabold text-white mt-1 uppercase">
              Welcome, Coach {trainerProfile?.fullName || user?.fullName}
            </h2>
            <p className="text-xs text-[#888888] font-medium">
              Specialization: <strong className="text-[#CCCCCC]">{trainerProfile?.specialization}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin-workouts')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-red-900/30 uppercase tracking-wider"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Manage Trainee Workouts</span>
          </button>
        </div>
      </div>

      {/* Trainer Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Assigned Trainees</span>
          <div className="text-3xl font-extrabold text-white font-heading mt-1">
            {assignedMembers.length}
          </div>
          <span className="text-[11px] text-[#666666]">Active members under supervision</span>
        </div>

        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Experience Tenure</span>
          <div className="text-3xl font-extrabold text-amber-400 font-heading mt-1">
            {trainerProfile?.experienceYears || 5}+ Years
          </div>
          <span className="text-[11px] text-[#666666]">Certified coaching track record</span>
        </div>

        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Today's Classes</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading mt-1">
            {classes.length}
          </div>
          <span className="text-[11px] text-[#666666]">Group & studio sessions</span>
        </div>
      </div>

      {/* Assigned Members Table */}
      <div className="gym-card p-6 bg-[#141414] border-[#262626]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-bold text-white uppercase">
              Assigned Member Roster
            </h3>
            <p className="text-xs text-[#888888]">Athletes training under your personal guidance</p>
          </div>
          <button
            onClick={() => onNavigate('admin-attendance')}
            className="text-xs font-bold text-[#E50914] hover:underline"
          >
            Mark Floor Attendance
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#181818] text-[#888888] uppercase border-b border-[#242424]">
              <tr>
                <th className="py-2.5 px-4">Member ID</th>
                <th className="py-2.5 px-4">Full Name</th>
                <th className="py-2.5 px-4">Phone</th>
                <th className="py-2.5 px-4">Plan</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {assignedMembers.map((m) => (
                <tr key={m.id} className="hover:bg-[#1A1A1A]">
                  <td className="py-2.5 px-4 font-mono text-[#E50914] font-bold">{m.memberId}</td>
                  <td className="py-2.5 px-4 text-white font-medium">{m.fullName}</td>
                  <td className="py-2.5 px-4 text-[#888888] font-mono">{m.phone}</td>
                  <td className="py-2.5 px-4 text-[#CCCCCC]">{m.membershipPlan?.name || 'General'}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                      {m.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <button
                      onClick={() => onNavigate('admin-workouts')}
                      className="px-2.5 py-1 bg-[#222222] hover:bg-[#333333] text-white rounded text-xs transition-colors"
                    >
                      Update Routine
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
