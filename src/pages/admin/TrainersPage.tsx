import React, { useEffect, useState } from 'react';
import { UserCheck, Plus, Edit, Trash2, Award, Users, Calendar, X, AlertCircle } from 'lucide-react';
import { TrainerProfile } from '../../types';
import { api } from '../../services/api';

export const TrainersPage: React.FC = () => {
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerProfile | null>(null);

  const [addForm, setAddForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: 'Trainer@123',
    specialization: '',
    experienceYears: 3,
    bio: '',
    photoUrl: '',
    status: 'ACTIVE',
  });

  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    specialization: '',
    experienceYears: 3,
    bio: '',
    photoUrl: '',
    status: 'ACTIVE',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await api.getTrainers();
      if (res.success) setTrainers(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createTrainer(addForm);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowAddModal(false);
        setAddForm({
          fullName: '',
          email: '',
          phone: '',
          password: 'Trainer@123',
          specialization: '',
          experienceYears: 3,
          bio: '',
          photoUrl: '',
          status: 'ACTIVE',
        });
        fetchTrainers();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Creation failed' });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer) return;
    try {
      const res = await api.updateTrainer(selectedTrainer.id, editForm);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowEditModal(false);
        fetchTrainers();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Update failed' });
    }
  };

  const handleDelete = async (t: TrainerProfile) => {
    if (!window.confirm(`Are you sure you want to remove coach ${t.fullName} (${t.trainerId})?`)) {
      return;
    }
    try {
      const res = await api.deleteTrainer(t.id);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        fetchTrainers();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Delete failed' });
    }
  };

  const handleOpenEdit = (t: TrainerProfile) => {
    setSelectedTrainer(t);
    setEditForm({
      fullName: t.fullName,
      phone: t.phone,
      specialization: t.specialization,
      experienceYears: t.experienceYears,
      bio: t.bio || '',
      photoUrl: t.photoUrl || '',
      status: t.status,
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
            Trainer Management ({trainers.length})
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Manage fitness coaches, specializations, and assigned training batches.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-red-900/30 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trainer</span>
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

      {/* Trainers Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((t) => (
          <div key={t.id} className="gym-card bg-[#141414] border-[#262626] overflow-hidden flex flex-col justify-between">
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src={t.photoUrl || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=600&auto=format&fit=crop&q=80'}
                  alt={t.fullName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-[#E50914] font-bold border border-[#333333]">
                  {t.trainerId}
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'ACTIVE'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950/80 text-red-400 border border-red-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold font-heading text-white">{t.fullName}</h3>
                <span className="text-xs text-[#E50914] font-semibold tracking-wide uppercase block mt-0.5">
                  {t.specialization}
                </span>

                <div className="mt-3 text-xs text-[#888888] space-y-1">
                  <div>Email: <span className="text-[#CCCCCC]">{t.user?.email}</span></div>
                  <div>Phone: <span className="text-[#CCCCCC]">{t.phone}</span></div>
                  <div>Experience: <span className="text-[#CCCCCC]">{t.experienceYears} Years</span></div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#222222] flex items-center justify-between text-xs text-[#A3A3A3]">
                  <span>Assigned Trainees:</span>
                  <span className="font-bold text-white bg-[#1F1F1F] px-2 py-0.5 rounded">
                    {t.assignedMembers ? t.assignedMembers.length : 0} Members
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#181818] border-t border-[#222222] flex justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(t)}
                className="px-3 py-1.5 bg-[#242424] hover:bg-[#333333] text-white rounded text-xs flex items-center gap-1 transition-colors"
              >
                <Edit className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(t)}
                className="px-3 py-1.5 bg-[#242424] hover:bg-red-900/40 text-white rounded text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD TRAINER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl max-w-lg w-full p-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h3 className="font-heading font-bold text-lg uppercase">Add New Trainer</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#888888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addForm.fullName}
                  onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  placeholder="e.g. Vikram Singh"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Specialization *</label>
                  <input
                    type="text"
                    required
                    value={addForm.specialization}
                    onChange={(e) => setAddForm({ ...addForm, specialization: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                    placeholder="e.g. Strength & Conditioning"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    value={addForm.experienceYears}
                    onChange={(e) => setAddForm({ ...addForm, experienceYears: Number(e.target.value) })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Bio / Profile Notes</label>
                <textarea
                  rows={2}
                  value={addForm.bio}
                  onChange={(e) => setAddForm({ ...addForm, bio: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white resize-none"
                  placeholder="Key certifications, powerlifting record, etc."
                ></textarea>
              </div>

              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Photo URL (Optional)</label>
                <input
                  type="url"
                  value={addForm.photoUrl}
                  onChange={(e) => setAddForm({ ...addForm, photoUrl: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  placeholder="https://..."
                />
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
                  Create Trainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TRAINER MODAL */}
      {showEditModal && selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl max-w-lg w-full p-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h3 className="font-heading font-bold text-lg uppercase">Edit Trainer Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-[#888888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white font-bold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    value={editForm.specialization}
                    onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.experienceYears}
                    onChange={(e) => setEditForm({ ...editForm, experienceYears: Number(e.target.value) })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#242424] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-[#222222] text-[#888888] hover:text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white font-bold rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
