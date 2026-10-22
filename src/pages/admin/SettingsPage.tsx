import React, { useEffect, useState } from 'react';
import { Settings, Save, CheckCircle2, Shield, MapPin, Phone, Mail, Clock, User, X } from 'lucide-react';
import { GymSetting } from '../../types';
import { api } from '../../services/api';

export const SettingsPage: React.FC = () => {
  const [form, setForm] = useState<GymSetting>({
    id: 'default-gym-settings',
    gymName: 'IRON REVOLUTION 2.0',
    ownerName: 'Sachin Patel',
    developerName: 'Apurva Mishra',
    locationAddress: 'Near Primary School, Naroli Road, Naroli, Silvassa, Dadra and Nagar Haveli — 396235',
    phone: '+91 87349 22441 / +91 91042 31111',
    email: 'ironrevolution2.0@gmail.com',
    openingHours: 'Morning: 5:00 AM - 10:00 AM | Evening: 5:00 PM - 10:00 PM (Sunday Evening Off)',
    announcement: 'Welcome to IRON REVOLUTION 2.0! Heavy weight training, crossfit & diet planning under certified mentors Sachin Patel, Akshay Patel & Krutika Patel.',
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    api.getSettings()
      .then((res) => {
        if (res.success && res.data) setForm(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateSettings(form);
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Saving failed' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-heading font-extrabold text-white uppercase tracking-wider">
          Gym System Configuration
        </h2>
        <p className="text-xs text-[#888888] mt-0.5">
          Update official facility metadata, owner and developer credentials, operating hours, and contact info.
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

      <form onSubmit={handleSave} className="gym-card p-6 bg-[#141414] border-[#262626] space-y-6">
        <div className="border-b border-[#222222] pb-4">
          <h3 className="text-lg font-heading font-bold text-white uppercase flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#E50914]" />
            <span>Organization & Project Stakeholders</span>
          </h3>
          <p className="text-xs text-[#888888] mt-0.5">Accreditation as specified for Software Engineering presentation</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Gym Name</label>
            <input
              type="text"
              required
              value={form.gymName}
              onChange={(e) => setForm({ ...form, gymName: e.target.value })}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Gym Owner Name</label>
            <input
              type="text"
              required
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Project Developer</label>
            <input
              type="text"
              required
              value={form.developerName}
              onChange={(e) => setForm({ ...form, developerName: e.target.value })}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white font-bold text-[#E50914]"
            />
          </div>

          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Location Address</label>
            <input
              type="text"
              required
              value={form.locationAddress}
              onChange={(e) => setForm({ ...form, locationAddress: e.target.value })}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white"
            />
          </div>
        </div>

        <div className="border-t border-[#222222] pt-4">
          <h3 className="text-lg font-heading font-bold text-white uppercase flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>Operating Hours & Front Desk Communication</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Operational Hours</label>
            <input
              type="text"
              required
              value={form.openingHours}
              onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Front Desk Phone</label>
            <input
              type="text"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Official Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-[#CCCCCC] uppercase font-semibold mb-1">Global Headline / Banner</label>
            <input
              type="text"
              value={form.announcement || ''}
              onChange={(e) => setForm({ ...form, announcement: e.target.value })}
              className="w-full bg-[#1C1C1C] border border-[#2E2E2E] rounded p-2.5 text-white"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#222222] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#E50914] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-lg shadow-red-900/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
