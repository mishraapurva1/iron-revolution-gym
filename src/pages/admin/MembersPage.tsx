import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  X,
  AlertTriangle,
} from 'lucide-react';
import { MemberProfile, MembershipPlan, TrainerProfile } from '../../types';
import { api } from '../../services/api';

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);

  // Form states
  const [addForm, setAddForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: 'Password@123',
    gender: 'Male',
    dateOfBirth: '',
    address: '',
    status: 'ACTIVE',
    membershipPlanId: '',
    assignedTrainerId: '',
  });

  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    status: 'ACTIVE',
    membershipPlanId: '',
    assignedTrainerId: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.getMembers({
        search: search || undefined,
        status: statusFilter,
        page,
        limit: 10,
      });
      if (res.success) {
        setMembers(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalCount(res.pagination.total);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [search, statusFilter, page]);

  useEffect(() => {
    api.getPlans().then((res) => res.success && setPlans(res.data));
    api.getTrainers().then((res) => res.success && setTrainers(res.data));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createMember(addForm);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowAddModal(false);
        setAddForm({
          fullName: '',
          email: '',
          phone: '',
          password: 'Password@123',
          gender: 'Male',
          dateOfBirth: '',
          address: '',
          status: 'ACTIVE',
          membershipPlanId: '',
          assignedTrainerId: '',
        });
        fetchMembers();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Creation failed' });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    try {
      const res = await api.updateMember(selectedMember.id, editForm);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowEditModal(false);
        fetchMembers();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Update failed' });
    }
  };

  const handleDelete = async (member: MemberProfile) => {
    if (!window.confirm(`Are you sure you want to permanently delete member ${member.fullName} (${member.memberId})?`)) {
      return;
    }
    try {
      const res = await api.deleteMember(member.id);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        fetchMembers();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Delete failed' });
    }
  };

  const handleOpenEdit = (m: MemberProfile) => {
    setSelectedMember(m);
    setEditForm({
      fullName: m.fullName,
      phone: m.phone,
      gender: m.gender || 'Male',
      dateOfBirth: m.dateOfBirth || '',
      address: m.address || '',
      status: m.status,
      membershipPlanId: m.membershipPlanId || '',
      assignedTrainerId: m.assignedTrainerId || '',
    });
    setShowEditModal(true);
  };

  const handleOpenDetails = async (m: MemberProfile) => {
    try {
      const res = await api.getMemberById(m.id);
      if (res.success) {
        setSelectedMember(res.data);
        setShowDetailsModal(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
            Member Management ({totalCount})
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Add, update, search, filter, and export gym member accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={api.exportMembersCsvUrl()}
            download="iron_revolution_members.csv"
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1C1C1C] hover:bg-[#282828] border border-[#333333] text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </a>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-red-900/30 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Alert banner */}
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

      {/* Filter & Search Bar */}
      <div className="gym-card p-4 bg-[#141414] border-[#262626] flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            placeholder="Search by name, Member ID (IR-MEM-...), email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#1C1C1C] border border-[#2B2B2B] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-[#666666] focus:border-[#E50914] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-[#777777] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#1C1C1C] border border-[#2B2B2B] text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#E50914] w-full md:w-auto"
          >
            <option value="ALL">All Account Statuses</option>
            <option value="ACTIVE">Active Members</option>
            <option value="PENDING">Pending Approval</option>
            <option value="EXPIRED">Expired Memberships</option>
            <option value="INACTIVE">Deactivated</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="gym-card bg-[#141414] border-[#262626] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#181818] text-[#888888] uppercase border-b border-[#242424] font-semibold">
              <tr>
                <th className="py-3 px-4">Member ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Plan & Expiry</th>
                <th className="py-3 px-4">Trainer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777777]">
                    Loading records...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777777]">
                    No member records matching criteria.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#E50914] font-bold">
                      {m.memberId}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{m.fullName}</span>
                      <span className="text-[11px] text-[#777777]">{m.gender || 'Not specified'}</span>
                    </td>
                    <td className="py-3 px-4 text-[#CCCCCC]">
                      <div>{m.user?.email}</div>
                      <div className="text-[11px] text-[#888888]">{m.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-medium block">
                        {m.membershipPlan?.name || 'No Active Plan'}
                      </span>
                      <span className="text-[11px] text-[#888888] font-mono">
                        Exp: {m.membershipExpiryDate ? new Date(m.membershipExpiryDate).toLocaleDateString('en-IN') : 'None'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#CCCCCC]">
                      {m.assignedTrainer?.fullName || <span className="text-[#666666]">Unassigned</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          m.status === 'ACTIVE'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : m.status === 'PENDING'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                            : m.status === 'EXPIRED'
                            ? 'bg-orange-950/60 text-orange-400 border border-orange-800'
                            : 'bg-red-950/60 text-red-400 border border-red-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetails(m)}
                          title="View Complete Profile & History"
                          className="p-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(m)}
                          title="Edit Details & Status"
                          className="p-1.5 bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white rounded transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(m)}
                          title="Delete Account"
                          className="p-1.5 bg-[#1F1F1F] hover:bg-red-900/40 text-white rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#242424] flex items-center justify-between text-xs text-[#888888]">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 bg-[#1C1C1C] rounded border border-[#2B2B2B] text-white disabled:opacity-30"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 bg-[#1C1C1C] rounded border border-[#2B2B2B] text-white disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl max-w-lg w-full p-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h3 className="font-heading font-bold text-lg uppercase">Add New Gym Member</h3>
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
                  placeholder="e.g. Apurva Mishra"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                    placeholder="email@example.com"
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
                    placeholder="+91 98980 12345"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Membership Plan</label>
                  <select
                    value={addForm.membershipPlanId}
                    onChange={(e) => setAddForm({ ...addForm, membershipPlanId: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  >
                    <option value="">-- No Plan / Pending --</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Assign Trainer</label>
                  <select
                    value={addForm.assignedTrainerId}
                    onChange={(e) => setAddForm({ ...addForm, assignedTrainerId: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  >
                    <option value="">-- No Trainer Assigned --</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.trainerId})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Status</label>
                  <select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PENDING">PENDING</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Gender</label>
                  <select
                    value={addForm.gender}
                    onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
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
                  Create Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl max-w-lg w-full p-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <div>
                <h3 className="font-heading font-bold text-lg uppercase">Edit Member Details</h3>
                <span className="text-xs text-[#E50914] font-mono">{selectedMember.memberId}</span>
              </div>
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
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Account Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white font-bold"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PENDING">PENDING</option>
                    <option value="EXPIRED">EXPIRED</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Membership Plan</label>
                  <select
                    value={editForm.membershipPlanId}
                    onChange={(e) => setEditForm({ ...editForm, membershipPlanId: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  >
                    <option value="">-- No Plan Assigned --</option>
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.durationMonths}m - ₹{p.price})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Assigned Coach</label>
                  <select
                    value={editForm.assignedTrainerId}
                    onChange={(e) => setEditForm({ ...editForm, assignedTrainerId: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                  >
                    <option value="">-- None --</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
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

      {/* MEMBER DETAILS MODAL */}
      {showDetailsModal && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl max-w-2xl w-full p-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <div>
                <h3 className="font-heading font-bold text-xl uppercase">{selectedMember.fullName}</h3>
                <span className="text-xs text-[#E50914] font-mono">{selectedMember.memberId}</span>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="text-[#888888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-[#1A1A1A] p-4 rounded-lg">
              <div>
                <span className="text-[#777777] block uppercase">Email</span>
                <span className="text-white font-medium">{selectedMember.user?.email}</span>
              </div>
              <div>
                <span className="text-[#777777] block uppercase">Phone</span>
                <span className="text-white font-medium">{selectedMember.phone}</span>
              </div>
              <div>
                <span className="text-[#777777] block uppercase">Account Status</span>
                <span className="font-bold text-emerald-400">{selectedMember.status}</span>
              </div>
              <div>
                <span className="text-[#777777] block uppercase">Plan</span>
                <span className="text-white font-medium">{selectedMember.membershipPlan?.name || 'None'}</span>
              </div>
              <div>
                <span className="text-[#777777] block uppercase">Coach</span>
                <span className="text-white font-medium">{selectedMember.assignedTrainer?.fullName || 'None'}</span>
              </div>
              <div>
                <span className="text-[#777777] block uppercase">Expiry Date</span>
                <span className="text-white font-mono">
                  {selectedMember.membershipExpiryDate
                    ? new Date(selectedMember.membershipExpiryDate).toLocaleDateString('en-IN')
                    : 'N/A'}
                </span>
              </div>
            </div>

            {/* Recent attendance records in profile */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#A3A3A3] mb-2">
                Recent Attendance Check-Ins
              </h4>
              {selectedMember.attendances && selectedMember.attendances.length > 0 ? (
                <div className="max-h-36 overflow-y-auto border border-[#242424] rounded-lg">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-[#1E1E1E] text-[#888888]">
                      <tr>
                        <th className="p-2">Date</th>
                        <th className="p-2">Time</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#242424]">
                      {selectedMember.attendances.map((a) => (
                        <tr key={a.id}>
                          <td className="p-2 font-mono">{a.date}</td>
                          <td className="p-2 text-[#888888]">{a.checkInTime || '-'}</td>
                          <td className="p-2 font-bold text-emerald-400">{a.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-[#666666]">No attendance recorded yet.</p>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#242424] text-right">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-[#222222] hover:bg-[#333333] text-white rounded text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
