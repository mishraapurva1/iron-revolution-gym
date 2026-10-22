import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, User, X } from 'lucide-react';
import { WorkoutClass, TrainerProfile } from '../../types';
import { api } from '../../services/api';

export const TimetablePage: React.FC = () => {
  const [classes, setClasses] = useState<WorkoutClass[]>([]);
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedClass, setSelectedClass] = useState<WorkoutClass | null>(null);

  const [form, setForm] = useState({
    title: '',
    trainerProfileId: '',
    dayOfWeek: 'Monday',
    startTime: '06:00 AM',
    endTime: '07:15 AM',
    maxSlots: 20,
    roomOrArea: 'Main Fitness Floor',
    description: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await api.getClasses();
      if (res.success) setClasses(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    api.getTrainers().then((res) => res.success && setTrainers(res.data));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createClass(form);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowAddModal(false);
        setForm({
          title: '',
          trainerProfileId: '',
          dayOfWeek: 'Monday',
          startTime: '06:00 AM',
          endTime: '07:15 AM',
          maxSlots: 20,
          roomOrArea: 'Main Fitness Floor',
          description: '',
        });
        fetchClasses();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Creation failed' });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;
    try {
      const res = await api.updateClass(selectedClass.id, form);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowEditModal(false);
        fetchClasses();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Update failed' });
    }
  };

  const handleDelete = async (c: WorkoutClass) => {
    if (!window.confirm(`Delete ${c.title} on ${c.dayOfWeek}?`)) return;
    try {
      const res = await api.deleteClass(c.id);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        fetchClasses();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Delete failed' });
    }
  };

  const openEdit = (c: WorkoutClass) => {
    setSelectedClass(c);
    setForm({
      title: c.title,
      trainerProfileId: c.trainerProfileId || '',
      dayOfWeek: c.dayOfWeek,
      startTime: c.startTime,
      endTime: c.endTime,
      maxSlots: c.maxSlots,
      roomOrArea: c.roomOrArea,
      description: c.description || '',
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
            Workout Timetable Management
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Schedule recurring weekly classes, assign coaches, and manage slot limits.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-red-900/30 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Class</span>
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

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls.id} className="gym-card p-6 bg-[#141414] border-[#262626] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="px-2.5 py-1 rounded bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 font-bold uppercase">
                  {cls.dayOfWeek}
                </span>
                <div className="flex items-center gap-1 text-white font-mono font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#E50914]" />
                  <span>{cls.startTime} - {cls.endTime}</span>
                </div>
              </div>

              <h3 className="text-xl font-heading font-bold text-white mb-2">{cls.title}</h3>
              <p className="text-xs text-[#888888] leading-relaxed mb-4">{cls.description || 'Coached workout session.'}</p>
            </div>

            <div className="pt-4 border-t border-[#222222] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#888888]">Coach</span>
                <span className="text-white font-medium">{cls.trainerProfile?.fullName || 'Staff'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#888888]">Location</span>
                <span className="text-[#CCCCCC]">{cls.roomOrArea}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#888888]">Slots</span>
                <span className="text-emerald-400 font-semibold">{cls.maxSlots} Members</span>
              </div>

              <div className="pt-3 border-t border-[#222222] flex justify-end gap-2">
                <button
                  onClick={() => openEdit(cls)}
                  className="px-3 py-1 bg-[#222222] hover:bg-[#333333] text-white rounded text-xs flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(cls)}
                  className="px-3 py-1 bg-[#222222] hover:bg-red-900/40 text-white rounded text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl max-w-md w-full p-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h3 className="font-heading font-bold text-lg uppercase">
                {showAddModal ? 'Schedule Class' : 'Edit Class Schedule'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="text-[#888888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={showAddModal ? handleCreate : handleEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Class Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  placeholder="e.g. Olympic Barbell Lifting"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Day of Week *</label>
                  <select
                    value={form.dayOfWeek}
                    onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white font-semibold"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Assigned Coach</label>
                  <select
                    value={form.trainerProfileId}
                    onChange={(e) => setForm({ ...form, trainerProfileId: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  >
                    <option value="">-- Unassigned Staff --</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Start Time *</label>
                  <input
                    type="text"
                    required
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white font-mono"
                    placeholder="06:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">End Time *</label>
                  <input
                    type="text"
                    required
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white font-mono"
                    placeholder="07:15 AM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Max Slots</label>
                  <input
                    type="number"
                    min="5"
                    value={form.maxSlots}
                    onChange={(e) => setForm({ ...form, maxSlots: Number(e.target.value) })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Studio / Room</label>
                  <input
                    type="text"
                    value={form.roomOrArea}
                    onChange={(e) => setForm({ ...form, roomOrArea: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white resize-none"
                  placeholder="Goals, target muscles, equipment used."
                ></textarea>
              </div>

              <div className="pt-3 border-t border-[#242424] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 bg-[#222222] text-[#888888] hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white font-bold rounded"
                >
                  {showAddModal ? 'Add to Timetable' : 'Update Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
