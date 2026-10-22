import React, { useState, useEffect } from 'react';
import { UserPlus, CheckCircle2, AlertCircle, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { Logo } from '../../components/Logo';
import { MembershipPlan } from '../../types';
import { api } from '../../services/api';

interface RegisterPageProps {
  onNavigate: (tab: string) => void;
  selectedPlanId?: string;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate, selectedPlanId }) => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: 'Male',
    membershipPlanId: selectedPlanId || '',
  });

  useEffect(() => {
    api.getPlans().then((res) => {
      if (res.success) {
        setPlans(res.data);
        if (!formData.membershipPlanId && res.data.length > 0) {
          setFormData((prev) => ({ ...prev, membershipPlanId: selectedPlanId || res.data[0].id }));
        }
      }
    }).catch(console.error);
  }, [selectedPlanId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register(formData);
      if (res.success) {
        setSuccessMsg(
          `Registration successful! Assigned ID: ${res.user.memberProfile.memberId}. Status is PENDING verification by gym administration.`
        );
        setTimeout(() => {
          onNavigate('login');
        }, 3500);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-xl w-full glass-panel p-8 sm:p-10 rounded-3xl border-white/10 shadow-2xl relative z-10 space-y-6">
        <div className="text-center">
          <Logo size="lg" className="justify-center mb-3" />
          <h2 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-tight">
            MEMBER ONBOARDING
          </h2>
          <p className="text-xs text-[#8E8E93] mt-1 font-sans">
            Enter your athletic details below to register your digital membership profile.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#FF1E27]" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-emerald-300">Registration Complete!</p>
              <p className="mt-1">{successMsg}</p>
              <p className="mt-2 text-[#A3A3A3]">Redirecting to portal login...</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#CCCCCC] uppercase font-mono font-bold mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Apurva Mishra"
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#CCCCCC] uppercase font-mono font-bold mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="apurva@example.com"
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#CCCCCC] uppercase font-mono font-bold mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98980 00000"
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#CCCCCC] uppercase font-mono font-bold mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#CCCCCC] uppercase font-mono font-bold mb-1.5">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full bg-[#181818] border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[#CCCCCC] uppercase font-mono font-bold mb-1.5">
                Selected Plan *
              </label>
              <select
                required
                value={formData.membershipPlanId}
                onChange={(e) => setFormData({ ...formData, membershipPlanId: e.target.value })}
                className="w-full bg-[#181818] border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-bold text-[#FF1E27]"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{p.price} ({p.durationMonths}m)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#CCCCCC] uppercase font-mono font-bold mb-1.5">
                Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#CCCCCC] uppercase font-mono font-bold mb-1.5">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow-sm disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span>Processing Enrollment...</span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Submit Membership Application</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-white/10">
          <p className="text-xs text-[#8E8E93]">
            Already an enrolled athlete?{' '}
            <button onClick={() => onNavigate('login')} className="text-[#FF1E27] font-bold hover:underline">
              Access Member Portal
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
