import React, { useEffect, useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Printer,
  Download,
  CreditCard,
  DollarSign,
  CheckCircle2,
  X,
  Eye,
} from 'lucide-react';
import { Payment, MemberProfile, MembershipPlan } from '../../types';
import { api } from '../../services/api';
import { ReceiptModal } from '../../components/ReceiptModal';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [viewingReceipt, setViewingReceipt] = useState<any | null>(null);

  // Record Form
  const [form, setForm] = useState({
    memberProfileId: '',
    membershipPlanId: '',
    amount: 999,
    paymentMethod: 'UPI',
    status: 'PAID',
    notes: 'Gym fee payment',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await api.getPayments({
        search: search || undefined,
        method: methodFilter,
        page,
        limit: 10,
      });
      if (res.success) {
        setPayments(res.data);
        setTotalRevenue(res.totalCollected);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [search, methodFilter, page]);

  useEffect(() => {
    api.getMembers({ limit: 100 }).then((res) => {
      if (res.success) {
        setMembers(res.data);
        if (res.data.length > 0) setForm((prev) => ({ ...prev, memberProfileId: res.data[0].id }));
      }
    });
    api.getPlans().then((res) => {
      if (res.success) {
        setPlans(res.data);
        if (res.data.length > 0) setForm((prev) => ({ ...prev, membershipPlanId: res.data[0].id, amount: res.data[0].price }));
      }
    });
  }, []);

  const handleMemberChange = (memberId: string) => {
    const selected = members.find((m) => m.id === memberId);
    let planId = form.membershipPlanId;
    let amt = form.amount;

    if (selected && selected.membershipPlanId) {
      planId = selected.membershipPlanId;
      const matchedPlan = plans.find((p) => p.id === planId);
      if (matchedPlan) amt = matchedPlan.price;
    }

    setForm({ ...form, memberProfileId: memberId, membershipPlanId: planId, amount: amt });
  };

  const handlePlanChange = (planId: string) => {
    const matchedPlan = plans.find((p) => p.id === planId);
    setForm({
      ...form,
      membershipPlanId: planId,
      amount: matchedPlan ? matchedPlan.price : form.amount,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createPayment(form);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setShowAddModal(false);
        fetchPayments();
        // Prompt for receipt print
        setViewingReceipt(res.data);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Payment recording failed.' });
    }
  };

  const openReceipt = async (p: Payment) => {
    try {
      const res = await api.getReceipt(p.id);
      if (res.success) {
        setViewingReceipt(res.receipt);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
            Fee & Payment Records
          </h2>
          <p className="text-xs text-[#888888] mt-0.5">
            Log administrative member fee payments, generate computerized receipts, and export revenue ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={api.exportPaymentsCsvUrl()}
            download="iron_revolution_payments.csv"
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
            <span>Record Payment</span>
          </button>
        </div>
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

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Total Revenue Collected</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-heading mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-[#666666]">Across all verified payments</span>
        </div>

        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Receipts Issued</span>
          <div className="text-3xl font-extrabold text-white font-heading mt-1">
            {payments.length}
          </div>
          <span className="text-[11px] text-[#666666]">Computerized records</span>
        </div>

        <div className="gym-card p-5 bg-[#141414] border-[#262626]">
          <span className="text-xs uppercase font-bold text-[#888888]">Accepted Modes</span>
          <div className="text-sm font-bold text-[#CCCCCC] mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#202020] rounded text-emerald-400">UPI</span>
            <span className="px-2 py-0.5 bg-[#202020] rounded text-blue-400">Card</span>
            <span className="px-2 py-0.5 bg-[#202020] rounded text-yellow-400">Cash</span>
            <span className="px-2 py-0.5 bg-[#202020] rounded text-purple-400">NEFT</span>
          </div>
          <span className="text-[11px] text-[#666666] block mt-1.5">No physical cash registers required</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="gym-card p-4 bg-[#141414] border-[#262626] flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            placeholder="Search by receipt no (REC-...), member name or ID..."
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
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#1C1C1C] border border-[#2B2B2B] text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#E50914] w-full md:w-auto font-mono"
          >
            <option value="ALL">All Payment Modes</option>
            <option value="UPI">UPI (Google Pay / PhonePe)</option>
            <option value="CARD">Credit / Debit Card</option>
            <option value="CASH">Counter Cash</option>
            <option value="BANK_TRANSFER">Bank Transfer / IMPS</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="gym-card bg-[#141414] border-[#262626] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#181818] text-[#888888] uppercase border-b border-[#242424] font-semibold">
              <tr>
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#777777]">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#777777]">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="py-3 px-4 font-mono text-[#E50914] font-bold">
                      {p.receiptNo}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white block">{p.memberProfile?.fullName}</span>
                      <span className="text-[11px] text-[#777777] font-mono">{p.memberProfile?.memberId}</span>
                    </td>
                    <td className="py-3 px-4 text-[#CCCCCC]">
                      {p.membershipPlan?.name || 'General Access'}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-white font-mono text-sm">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[#A3A3A3] uppercase text-[11px] bg-[#1E1E1E] px-2 py-0.5 rounded">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#888888] font-mono">
                      {new Date(p.paymentDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openReceipt(p)}
                        className="px-2.5 py-1 bg-[#222222] hover:bg-[#333333] text-white rounded text-xs flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#E50914]" />
                        <span>Print Receipt</span>
                      </button>
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
            <span>Page {page} of {totalPages}</span>
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

      {/* RECORD PAYMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2B2B2B] rounded-xl max-w-md w-full p-6 text-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
              <h3 className="font-heading font-bold text-lg uppercase">Record Member Fee Payment</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#888888] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Select Member *</label>
                <select
                  required
                  value={form.memberProfileId}
                  onChange={(e) => handleMemberChange(e.target.value)}
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
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Associated Plan</label>
                <select
                  value={form.membershipPlanId}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ₹{p.price} ({p.durationMonths}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Amount (INR) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Payment Method</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white font-mono uppercase"
                  >
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Notes / Transaction ID</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Google Pay UTR: 41209384920"
                  className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2 text-white"
                />
              </div>

              <div className="p-3 bg-red-950/20 border border-red-900/40 rounded text-[11px] text-[#A3A3A3]">
                💡 Recording payment automatically shifts PENDING or EXPIRED members to ACTIVE status.
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
                  Record & Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {viewingReceipt && (
        <ReceiptModal receipt={viewingReceipt} onClose={() => setViewingReceipt(null)} />
      )}
    </div>
  );
};
