import React, { useEffect, useState } from 'react';
import { Dumbbell, Clock, Flame, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { WorkoutPlan } from '../../types';
import { api } from '../../services/api';

export const MemberWorkoutsPage: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const memId = user?.memberProfile?.id;
    api.getWorkoutPlans(memId).then((res) => {
      if (res.success) setPlans(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
          My Assigned Workout Protocols
        </h2>
        <p className="text-xs text-[#888888] mt-0.5">
          Customized strength, hypertrophy, and conditioning split assigned by your coach.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-[#888888]">Loading workout schedule...</div>
      ) : plans.length === 0 ? (
        <div className="gym-card p-12 bg-[#141414] border-[#262626] text-center">
          <Dumbbell className="w-12 h-12 text-[#444444] mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white mb-1">No Workout Split Assigned Yet</h4>
          <p className="text-xs text-[#777777]">
            Please consult your assigned coach or gym administration to formulate your personalized split.
          </p>
        </div>
      ) : (
        plans.map((p) => (
          <div key={p.id} className="gym-card p-6 bg-[#141414] border-[#262626] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-2">
              <div>
                <h3 className="text-2xl font-heading font-extrabold text-white uppercase">{p.title}</h3>
                <span className="text-xs text-[#A3A3A3]">
                  Supervising Coach: <strong className="text-white">{p.trainerProfile?.fullName || 'Head Coach'}</strong>
                </span>
              </div>
              <div className="text-xs text-[#777777] font-mono">
                Assigned: {new Date(p.createdAt).toLocaleDateString('en-IN')}
              </div>
            </div>

            {p.notes && (
              <div className="p-4 rounded-lg bg-[#181818] border border-[#262626] text-xs text-[#CCCCCC] leading-relaxed">
                <strong className="text-[#E50914] block uppercase font-bold mb-1">Coach Notes & Strategy:</strong>
                "{p.notes}"
              </div>
            )}

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {p.exercises && p.exercises.map((ex, idx) => (
                <div key={idx} className="bg-[#181818] border border-[#2B2B2B] p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-red-950/60 text-[#E50914] font-bold uppercase">
                      {ex.dayOfWeek}
                    </span>
                    <span className="text-[11px] text-[#777777] font-mono">#{ex.order}</span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white font-heading">{ex.exerciseName}</h4>
                    <span className="text-xs text-[#888888] font-medium block mt-0.5">
                      Target: <strong className="text-[#CCCCCC]">{ex.targetMuscle}</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#242424] text-center text-xs">
                    <div>
                      <span className="text-[#777777] block text-[10px] uppercase">Sets × Reps</span>
                      <span className="font-mono font-bold text-white">{ex.sets} × {ex.reps}</span>
                    </div>
                    <div>
                      <span className="text-[#777777] block text-[10px] uppercase">Weight</span>
                      <span className="font-mono font-bold text-emerald-400">{ex.weight || 'BW'}</span>
                    </div>
                    <div>
                      <span className="text-[#777777] block text-[10px] uppercase">Rest</span>
                      <span className="font-mono text-[#CCCCCC]">{ex.restSeconds}s</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
