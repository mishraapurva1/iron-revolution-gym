import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

interface ReceiptModalProps {
  receipt: any;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#121212] border border-[#2B2B2B] text-white rounded-xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl my-8">
        {/* Action Header (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#222222] no-print">
          <span className="text-xs uppercase tracking-wider text-[#A3A3A3] font-semibold">
            Official Payment Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E50914] hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#A3A3A3] hover:text-white rounded-lg hover:bg-[#222222] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="mt-6 border border-[#2A2A2A] bg-[#181818] p-6 rounded-lg text-sm text-[#CCCCCC]">
          {/* Gym Header */}
          <div className="text-center pb-4 border-b border-[#2B2B2B]">
            <Logo size="md" className="justify-center mb-1" />
            <p className="text-xs text-[#888888] mt-1">
              Near Primary School, Naroli Road, Naroli, Silvassa — 396235
            </p>
            <p className="text-xs text-[#888888]">
              Founder: <strong className="text-white">Sachin Patel</strong> | Helpline: +91 87349 22441 / +91 91042 31111
            </p>
            <p className="text-[11px] text-[#E50914] font-medium">
              Instagram: @ironrevolution_2.0
            </p>
          </div>

          {/* Receipt Info Badges */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-[#2B2B2B] text-xs">
            <div>
              <span className="text-[#777777] block uppercase">Receipt Number</span>
              <span className="font-mono font-bold text-white text-sm">{receipt.receiptNo}</span>
            </div>
            <div className="text-right">
              <span className="text-[#777777] block uppercase">Date & Time</span>
              <span className="font-mono text-white">
                {new Date(receipt.paymentDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Member Details */}
          <div className="py-4 border-b border-[#2B2B2B] text-xs space-y-1">
            <span className="text-[#777777] block uppercase mb-1">Billed To (Member):</span>
            <div className="flex justify-between">
              <span className="text-white font-bold text-sm">{receipt.memberProfile?.fullName}</span>
              <span className="font-mono text-[#E50914] font-bold">
                {receipt.memberProfile?.memberId}
              </span>
            </div>
            <div className="text-[#888888]">Phone: {receipt.memberProfile?.phone}</div>
          </div>

          {/* Itemized Breakdown */}
          <div className="py-4 border-b border-[#2B2B2B]">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#777777] border-b border-[#262626]">
                  <th className="text-left pb-2">Description / Package</th>
                  <th className="text-right pb-2">Payment Mode</th>
                  <th className="text-right pb-2">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                <tr>
                  <td className="py-3 font-medium text-white">
                    {receipt.membershipPlan?.name || 'Gym Membership Fee'}
                  </td>
                  <td className="py-3 text-right font-mono uppercase text-[#A3A3A3]">
                    {receipt.paymentMethod}
                  </td>
                  <td className="py-3 text-right font-bold text-white text-sm">
                    ₹{Number(receipt.amount).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total & Status */}
          <div className="pt-4 flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Status: {receipt.status}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#777777] block uppercase">Total Paid</span>
              <span className="text-2xl font-extrabold text-[#E50914] font-heading">
                ₹{Number(receipt.amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Signoff / Verification Note */}
          <div className="mt-6 pt-4 border-t border-[#2B2B2B] flex justify-between items-end text-[10px] text-[#666666]">
            <div>
              <p>Generated by: {receipt.recordedBy || 'System Administrator'}</p>
              <p>Project Developer: Apurva Mishra</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-emerald-500 font-semibold mb-1 justify-end">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified by IRON REVOLUTION Gym</span>
              </div>
              <p className="text-[#444444]">This is a computer-generated demonstration receipt.</p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-4 text-center no-print">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#222222] hover:bg-[#333333] text-sm text-[#CCCCCC] hover:text-white rounded-lg transition-colors"
          >
            Close Receipt View
          </button>
        </div>
      </div>
    </div>
  );
};
