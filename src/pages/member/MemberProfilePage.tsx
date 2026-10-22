import React, { useEffect, useState } from 'react';
import { User, Phone, MapPin, Shield, KeyRound, Save, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MemberProfile } from '../../types';
import { api } from '../../services/api';

export const MemberProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.getMe().then((res) => {
      if (res.success && res.user?.memberProfile) {
        const m = res.user.memberProfile;
        setProfile(m);
        setForm({
          fullName: m.fullName,
          phone: m.phone,
          gender: m.gender || 'Male',
          dateOfBirth: m.dateOfBirth || '',
          address: m.address || '',
          emergencyContact: m.emergencyContact || '',
        });
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const res = await api.updateMember(profile.id, form);
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully.' });
        await refreshUser();
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Profile update failed.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
          Personal Profile & Preferences
        </h2>
        <p className="text-xs text-[#888888] mt-0.5">
          View your membership ID and keep your contact details updated for emergency coordination.
        </p>
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

      {/* Profile Card */}
      <div className="gym-card p-6 bg-[#141414] border-[#262626] flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-[#E50914] flex items-center justify-center font-heading font-extrabold text-2xl text-white">
          {form.fullName ? form.fullName[0].toUpperCase() : 'M'}
        </div>
        <div>
          <span className="font-mono text-xs font-bold text-[#E50914] bg-[#221010] border border-red-900/60 px-2 py-0.5 rounded">
            {profile?.memberId || 'IR-MEM-1001'}
          </span>
          <h3 className="text-xl font-heading font-bold text-white mt-1 uppercase">{form.fullName}</h3>
          <span className="text-xs text-[#888888]">{user?.email}</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="gym-card p-6 bg-[#141414] border-[#262626] space-y-4 text-xs">
        <div>
          <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Full Name</label>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Primary Phone</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white"
            />
          </div>
          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Emergency Contact Number</label>
            <input
              type="tel"
              value={form.emergencyContact}
              onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
              placeholder="+91 ..."
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Gender</label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Date of Birth</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Residential Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Street, City, Pin Code"
            className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white"
          />
        </div>

        <div className="pt-3 border-t border-[#242424] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#E50914] hover:bg-red-700 text-white font-bold uppercase rounded-lg transition-colors shadow-lg shadow-red-900/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
