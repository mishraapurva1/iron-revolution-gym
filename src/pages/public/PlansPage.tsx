import React, { useEffect, useState } from 'react';
import { CheckCircle, ShieldCheck, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { MembershipPlan } from '../../types';
import { api } from '../../services/api';

interface PlansPageProps {
  onNavigate: (tab: string, state?: any) => void;
}

export const PlansPage: React.FC<PlansPageProps> = ({ onNavigate }) => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getPlans()
      .then((res) => {
        if (res.success) setPlans(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#050505] text-[#F3F4F6] min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-xs font-mono font-bold tracking-widest text-[#FF1E27] mb-4 uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Transparent Investment In Your Strength</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-white uppercase tracking-tight">
            MEMBERSHIP PACKAGES
          </h1>
          <p className="text-[#8E8E93] text-sm sm:text-base mt-4 font-sans leading-relaxed">
            Choose the commitment tier suited to your fitness goals. All rates are database-driven demonstration values editable by the administrator.
          </p>
        </div>

        {/* Pricing Cards */}
        {loading ? (
          <div className="text-center py-24 text-[#8E8E93] font-mono text-xs">Loading membership packages...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {plans.map((p) => {
              let benefitsList: string[] = [];
              try {
                benefitsList = JSON.parse(p.benefits);
              } catch {
                benefitsList = p.benefits.split(',');
              }

              const isPopular = p.durationMonths === 3 || p.durationMonths === 12;

              return (
                <div
                  key={p.id}
                  className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#1E1112] via-[#141010] to-[#0A0A0A] border-2 border-[#FF1E27] shadow-glow-red'
                      : 'glass-card border-white/10'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF1E27] text-white text-[10px] font-black uppercase px-4 py-1 rounded-full tracking-widest shadow-lg">
                      MOST POPULAR
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#8E8E93] uppercase tracking-wider block">
                      {p.durationMonths} Month{p.durationMonths > 1 ? 's' : ''} Access
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-white mt-1">{p.name}</h3>
                    <p className="text-xs text-[#8E8E93] mt-2 min-h-[36px] font-sans">{p.description}</p>

                    <div className="mt-6 pb-6 border-b border-white/10">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-5xl font-extrabold text-white">
                          ₹{Number(p.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#8E8E93] font-mono">/ total</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#CCCCCC] block mb-3">
                        Included Privileges:
                      </span>
                      <ul className="space-y-3 text-xs text-[#D1D5DB] font-sans">
                        {benefitsList.map((benefit, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-[#FF1E27] shrink-0 mt-0.5" />
                            <span>{benefit.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <button
                      onClick={() => onNavigate('register', { selectedPlanId: p.id })}
                      className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                        isPopular
                          ? 'btn-primary shadow-glow-sm'
                          : 'btn-secondary text-white hover:border-white'
                      }`}
                    >
                      <span>Join With This Tier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Member Guarantees */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border-white/10">
          <h3 className="font-display text-2xl font-bold text-white mb-6 uppercase">
            MEMBERSHIP ACCREDITATION & POLICIES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-[#8E8E93] leading-relaxed font-sans">
            <div>
              <strong className="text-white block mb-1 font-heading text-sm">Computerized Biometrics</strong>
              Upon enrollment, your unique Member ID (`IR-MEM-XXXX`) is linked to digital check-ins with automated attendance calculation.
            </div>
            <div>
              <strong className="text-white block mb-1 font-heading text-sm">Zero Paper Receipts</strong>
              All dues and payments generate an instantaneous computer-verified tax receipt with receipt number and date tracking.
            </div>
            <div>
              <strong className="text-white block mb-1 font-heading text-sm">Certified Coach Supervisions</strong>
              Each package tier includes daily floor coach safety supervision, posture corrections, and training routine formulation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
