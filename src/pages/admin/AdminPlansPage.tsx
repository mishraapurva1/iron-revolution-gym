import React, { useEffect, useState } from 'react';
import { CreditCard, Plus, Edit, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { MembershipPlan } from '../../types';
import { api } from '../../services/api';

export const AdminPlansPage: React.FC = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    durationMonths: 1,
    price: 999,
    benefits: 'Full Gym Access, Locker Room, General Trainer Guidance',
    isActive: true,
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.getPlans();
      if (res.success) setPlans(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const benefitsArray = form.benefits.split(',').map((b) => b.trim());
      const res = await api.createPlan({
        ...form,
        benefits: JSON.stringify(benefitsArray),
      });

      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowAddModal(false);
        setForm({
          name: '',
          description: '',
          durationMonths: 1,
          price: 999,
          benefits: 'Full Gym Access, Locker Room, General Trainer Guidance',
          isActive: true,
        });
        fetchPlans();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Creation failed' });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    try {
      const benefitsArray = form.benefits.split(',').map((b) => b.trim());
      const res = await api.updatePlan(selectedPlan.id, {
        ...form,
        benefits: JSON.stringify(benefitsArray),
      });

      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowEditModal(false);
        fetchPlans();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Update failed' });
    }
  };

  const handleDelete = async (plan: MembershipPlan) => {
    if (!window.confirm(`Are you sure you want to delete ${plan.name}?`)) return;
    try {
      const res = await api.deletePlan(plan.id);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        fetchPlans();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Delete failed' });
    }
  };

  const openEdit = (p: MembershipPlan) => {
    setSelectedPlan(p);
    let parsedBenefits = p.benefits;
    try {
      const bList = JSON.parse(p.benefits);
      if (Array.isArray(bList)) parsedBenefits = bList.join(', ');
    } catch {}

    setForm({
      name: p.name,
      description: p.description,
      durationMonths: p.durationMonths,
      price: p.price,
      benefits: parsedBenefits,
      isActive: p.isActive,
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
            Membership Plan Architecture
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Configure subscription tiers, pricing, duration, and member benefits.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-red-900/30 uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
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

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => {
          let bList: string[] = [];
          try {
            bList = JSON.parse(p.benefits);
          } catch {
            bList = p.benefits.split(',');
          }

          return (
            <div key={p.id} className="gym-card p-6 bg-[#141414] border-[#262626] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-[#E50914] uppercase font-bold">
                    {p.durationMonths} Month{p.durationMonths > 1 ? 's' : ''}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.isActive
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950/60 text-red-400 border border-red-800'
                    }`}
                  >
                    {p.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold text-white">{p.name}</h3>
                <p className="text-xs text-[#888888] mt-1 min-h-[32px]">{p.description}</p>

                <div className="mt-4 pb-4 border-b border-[#242424]">
                  <span className="text-3xl font-extrabold text-white font-heading">
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-[11px] uppercase font-bold text-[#A3A3A3] block mb-2">
                    Benefits:
                  </span>
                  <ul className="space-y-1.5 text-xs text-[#CCCCCC]">
                    {bList.map((b, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-[#E50914]">•</span>
                        <span>{b.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-[#222222] mt-6 flex items-center justify-between">
                <span className="text-xs text-[#777777]">
                  {p._count?.members || 0} active members
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 bg-[#222222] hover:bg-[#333333] text-white rounded"
                    title="Edit Plan"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="p-1.5 bg-[#222222] hover:bg-red-900/40 text-white rounded"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl max-w-md w-full p-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h3 className="font-heading font-bold text-lg uppercase">
                {showAddModal ? 'Create Membership Plan' : 'Edit Membership Plan'}
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
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Plan Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  placeholder="e.g. Quarterly Strength Pack"
                />
              </div>

              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  placeholder="Short marketing intro"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Duration (Months) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.durationMonths}
                    onChange={(e) => setForm({ ...form, durationMonths: Number(e.target.value) })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Price (INR) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">
                  Benefits (Comma-separated) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.benefits}
                  onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white resize-none"
                  placeholder="Locker Room, Diet Consultation, Steam Access"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded text-[#E50914] focus:ring-0"
                />
                <label htmlFor="isActiveCheck" className="text-white">
                  Active (Available for public sign-up)
                </label>
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
                  {showAddModal ? 'Create Plan' : 'Update Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
