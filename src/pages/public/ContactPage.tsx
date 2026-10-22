import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck, Instagram } from 'lucide-react';
import { GymSetting } from '../../types';
import { api } from '../../services/api';

export const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState<GymSetting | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    api.getSettings().then((res) => {
      if (res.success) setSettings(res.data);
    }).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="bg-[#050505] text-[#F3F4F6] min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold tracking-widest text-[#FF1E27] mb-3 uppercase">
            <MapPin className="w-4 h-4" />
            <span>Gym Location & Phone Numbers</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-white uppercase tracking-tight">
            CONTACT IRON REVOLUTION 2.0
          </h1>
          <p className="text-[#A1A1AA] text-sm sm:text-base mt-4 font-sans leading-relaxed">
            Visit our gym in Naroli or contact mentors Sachin Patel, Akshay Patel, or Krutika Patel directly on call or WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Gym Address & Direct Contacts */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl border-white/10 space-y-6">
              <h3 className="font-display text-2xl font-bold text-white uppercase border-l-4 border-[#FF1E27] pl-3">
                GYM CONTACT DETAILS
              </h3>

              <div className="space-y-5 text-xs font-sans">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#FF1E27]/10 text-[#FF1E27] shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm font-heading">Gym Address</strong>
                    <span className="text-[#CCCCCC] leading-relaxed block mt-0.5">
                      Near Primary School, Naroli Road, Naroli, Silvassa, Dadra and Nagar Haveli — 396235
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#FF1E27]/10 text-[#FF1E27] shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm font-heading">Direct Phone / WhatsApp</strong>
                    <div className="mt-0.5 space-y-1">
                      <a href="tel:8734922441" className="text-white font-mono font-bold hover:text-[#FF1E27] block text-sm">
                        +91 87349 22441 (Sachin Patel)
                      </a>
                      <a href="tel:9104231111" className="text-white font-mono font-bold hover:text-[#FF1E27] block text-sm">
                        +91 91042 31111 (Akshay Patel)
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 shrink-0 mt-0.5">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm font-heading">Official Instagram Page</strong>
                    <a
                      href="https://www.instagram.com/ironrevolution_2.0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 font-mono font-bold block mt-0.5"
                    >
                      @ironrevolution_2.0 (Click to view workout reels)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#FF1E27]/10 text-[#FF1E27] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block text-sm font-heading">Morning & Evening Batches</strong>
                    <span className="text-[#CCCCCC] block mt-0.5">
                      Monday to Saturday: 5:00 AM – 10:00 AM & 5:00 PM – 10:00 PM
                    </span>
                    <span className="text-amber-400 block mt-0.5 font-medium">
                      Sunday: 5:00 PM – 9:00 PM (Form correction & workout session)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#888888] uppercase block text-[10px]">Gym Mentors</span>
                  <span className="text-white font-bold font-sans text-sm">Sachin, Akshay & Krutika</span>
                </div>
                <div>
                  <span className="text-[#888888] uppercase block text-[10px]">Project Developer</span>
                  <span className="text-[#FF1E27] font-bold font-sans text-sm">Apurva Mishra</span>
                </div>
              </div>
            </div>

            {/* Google Map verified embed */}
            <div className="glass-card overflow-hidden h-72 rounded-3xl border-white/10 shadow-2xl">
              <iframe
                title="IRON REVOLUTION 2.0 Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3741.077263595712!2d72.99611297598739!3d20.33924371113063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0cf11dbba2c13%3A0xe21f4c75954e3d9f!2sNaroli%2C%20Dadra%20and%20Nagar%20Haveli%20and%20Daman%20and%20Diu%20396235!5e0!3m2!1sen!2sin!4v1716382000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Quick Inquiry Form in Easy Indian English */}
          <div className="glass-card p-8 sm:p-10 rounded-3xl border-white/10">
            <h3 className="font-display text-2xl font-bold text-white uppercase mb-2">
              SEND US A QUICK MESSAGE
            </h3>
            <p className="text-xs text-[#A1A1AA] mb-8 font-sans">
              Want to join gym or have questions about workout batches? Send your details and we will call you back.
            </p>

            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Thank you! Your message has been sent. We will call you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-mono font-bold text-[#CCCCCC] uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apurva Mishra"
                  className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono font-bold text-[#CCCCCC] uppercase tracking-wider mb-1.5">
                    Your Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 98980 12345"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-[#CCCCCC] uppercase tracking-wider mb-1.5">
                    Your Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@gmail.com"
                    className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold text-[#CCCCCC] uppercase tracking-wider mb-1.5">
                  What is your main fitness goal?
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                >
                  <option value="Muscle Building">Muscle Building & Weight Gain</option>
                  <option value="Weight Loss">Weight Loss & Belly Fat Reduction</option>
                  <option value="General Fitness">General Daily Fitness & Stamina</option>
                  <option value="Personal Training">Personal Training with Sachin Patel</option>
                </select>
              </div>

              <div>
                <label className="block font-mono font-bold text-[#CCCCCC] uppercase tracking-wider mb-1.5">
                  Any questions or message?
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="e.g. What is the fee for 3 months? What time is the evening batch?"
                  className="w-full bg-white/5 border border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-white placeholder-[#555555] focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to Gym</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
