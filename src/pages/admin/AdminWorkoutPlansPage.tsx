import React, { useEffect, useState } from 'react';
import { Dumbbell, Plus, Trash2, Edit, User, Calendar, X, CheckCircle2 } from 'lucide-react';
import { WorkoutPlan, MemberProfile, TrainerProfile, WorkoutExercise } from '../../types';
import { api } from '../../services/api';

export const AdminWorkoutPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Plan Form
  const [title, setTitle] = useState('');
  const [memberProfileId, setMemberProfileId] = useState('');
  const [trainerProfileId, setTrainerProfileId] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<any[]>([
    {
      exerciseName: 'Barbell Flat Bench Press',
      dayOfWeek: 'Monday',
      targetMuscle: 'Chest',
      sets: 4,
      reps: '8-10',
      weight: '60 kg',
      restSeconds: 90,
    },
    {
      exerciseName: 'Incline Dumbbell Flyes',
      dayOfWeek: 'Monday',
      targetMuscle: 'Upper Chest',
      sets: 3,
      reps: '12',
      weight: '16 kg',
      restSeconds: 60,
    },
  ]);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.getWorkoutPlans();
      if (res.success) setPlans(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    api.getMembers({ status: 'ACTIVE', limit: 100 }).then((res) => {
      if (res.success) {
        setMembers(res.data);
        if (res.data.length > 0) setMemberProfileId(res.data[0].id);
      }
    });
    api.getTrainers().then((res) => {
      if (res.success) {
        setTrainers(res.data);
        if (res.data.length > 0) setTrainerProfileId(res.data[0].id);
      }
    });
  }, []);

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        exerciseName: '',
        dayOfWeek: 'Monday',
        targetMuscle: 'General',
        sets: 3,
        reps: '10-12',
        weight: 'Bodyweight',
        restSeconds: 60,
      },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, idx) => idx !== index));
  };

  const handleExerciseChange = (index: number, field: string, val: any) => {
    const updated = [...exercises];
    updated[index][field] = val;
    setExercises(updated);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createWorkoutPlan({
        title,
        memberProfileId,
        trainerProfileId: trainerProfileId || null,
        notes,
        exercises,
      });

      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowAddModal(false);
        setTitle('');
        setNotes('');
        fetchPlans();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Creation failed' });
    }
  };

  const handleDelete = async (planId: string) => {
    if (!window.confirm('Delete this workout routine?')) return;
    try {
      const res = await api.deleteWorkoutPlan(planId);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        fetchPlans();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Delete failed' });
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
            Custom Member Workout Plans
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Prescribe day-by-day lifting routines, sets, reps, and target muscles for individual trainees.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-red-900/30 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Workout Plan</span>
        </button>
      </div>

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

      {/* Plans List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plans.map((p) => (
          <div key={p.id} className="gym-card p-6 bg-[#141414] border-[#262626] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#242424] mb-3">
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">{p.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-[#CCCCCC] mt-0.5">
                    <span className="font-semibold text-[#E50914]">Trainee: {p.memberProfile?.fullName}</span>
                    <span className="text-[#666666]">({p.memberProfile?.memberId})</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 bg-[#222222] hover:bg-red-950/50 text-red-400 rounded transition-colors"
                  title="Delete Routine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {p.notes && (
                <p className="text-xs text-[#888888] italic mb-4 bg-[#181818] p-2.5 rounded border border-[#222222]">
                  "{p.notes}"
                </p>
              )}

              {/* Exercise Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left">
                  <thead className="text-[#777777] uppercase bg-[#181818] border-b border-[#242424]">
                    <tr>
                      <th className="p-2">Day</th>
                      <th className="p-2">Exercise</th>
                      <th className="p-2">Muscle</th>
                      <th className="p-2">Sets × Reps</th>
                      <th className="p-2">Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202020]">
                    {p.exercises && p.exercises.map((ex, idx) => (
                      <tr key={idx} className="hover:bg-[#1A1A1A]">
                        <td className="p-2 font-semibold text-white">{ex.dayOfWeek}</td>
                        <td className="p-2 font-medium text-white">{ex.exerciseName}</td>
                        <td className="p-2 text-[#E50914]">{ex.targetMuscle}</td>
                        <td className="p-2 font-mono text-[#CCCCCC]">{ex.sets} × {ex.reps}</td>
                        <td className="p-2 text-[#888888]">{ex.weight || 'BW'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#222222] text-[11px] text-[#777777] flex justify-between">
              <span>Supervising Coach: <strong className="text-white">{p.trainerProfile?.fullName || 'Assigned Staff'}</strong></span>
              <span>{p.exercises?.length || 0} Exercises</span>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE WORKOUT PLAN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl max-w-2xl w-full p-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h3 className="font-heading font-bold text-lg uppercase">Design Member Workout Routine</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#888888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Routine Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 4-Day Hypertrophy & Strength Split"
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Target Member *</label>
                  <select
                    required
                    value={memberProfileId}
                    onChange={(e) => setMemberProfileId(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.memberId})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Supervising Coach</label>
                  <select
                    value={trainerProfileId}
                    onChange={(e) => setTrainerProfileId(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  >
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Coach Notes & Macro Targets</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Warm up rotator cuffs before bench press. Keep rest under 90s."
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                />
              </div>

              {/* Exercises Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#CCCCCC] uppercase font-bold">Exercise Items:</span>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className="px-2.5 py-1 bg-red-950/60 border border-red-800 text-red-300 rounded font-bold hover:bg-red-900"
                  >
                    + Add Exercise
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto border border-[#262626] p-2 rounded">
                  {exercises.map((ex, idx) => (
                    <div key={idx} className="grid grid-cols-6 gap-2 bg-[#1A1A1A] p-2 rounded items-center">
                      <input
                        type="text"
                        placeholder="Day (e.g. Mon)"
                        value={ex.dayOfWeek}
                        onChange={(e) => handleExerciseChange(idx, 'dayOfWeek', e.target.value)}
                        className="bg-[#242424] p-1.5 rounded text-white"
                      />
                      <input
                        type="text"
                        placeholder="Exercise"
                        value={ex.exerciseName}
                        onChange={(e) => handleExerciseChange(idx, 'exerciseName', e.target.value)}
                        className="bg-[#242424] p-1.5 rounded text-white col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Sets × Reps"
                        value={`${ex.sets} × ${ex.reps}`}
                        onChange={(e) => {
                          const parts = e.target.value.split('×');
                          handleExerciseChange(idx, 'sets', parseInt(parts[0]) || 3);
                          handleExerciseChange(idx, 'reps', parts[1]?.trim() || '10');
                        }}
                        className="bg-[#242424] p-1.5 rounded text-white"
                      />
                      <input
                        type="text"
                        placeholder="Weight"
                        value={ex.weight}
                        onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)}
                        className="bg-[#242424] p-1.5 rounded text-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(idx)}
                        className="text-red-400 hover:text-white text-center"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#242424] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#222222] text-[#888888] hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white font-bold rounded"
                >
                  Save Workout Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
