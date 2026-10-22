import React, { useEffect, useState } from 'react';
import { Receipt, Printer, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { Payment } from '../../types';
import { api } from '../../services/api';
import { ReceiptModal } from '../../components/ReceiptModal';

export const MemberPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);

  useEffect(() => {
    api.getPayments().then((res) => {
      if (res.success) setPayments(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
          My Membership Fees & Invoices
        </h2>
        <p className="text-xs text-[#888888] mt-0.5">
          View all verified fee payments and download or print official computer-generated receipts.
        </p>
      </div>

      <div className="gym-card bg-[#141414] border-[#262626] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#181818] text-[#888888] uppercase border-b border-[#242424] font-semibold">
              <tr>
                <th className="py-3 px-4">Receipt Number</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#202020]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777777]">
                    Loading invoices...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777777]">
                    No fee payments recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1A1A1A]">
                    <td className="py-3 px-4 font-mono text-[#E50914] font-bold">
                      {p.receiptNo}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {p.membershipPlan?.name || 'Gym Subscription'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                      ₹{Number(p.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-mono uppercase text-[#A3A3A3]">
                      {p.paymentMethod}
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
                        onClick={() => setSelectedReceipt(p)}
                        className="px-2.5 py-1 bg-[#222222] hover:bg-[#333333] text-white rounded text-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#E50914]" />
                        <span>Print Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReceipt && (
        <ReceiptModal receipt={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
      )}
    </div>
  );
};
