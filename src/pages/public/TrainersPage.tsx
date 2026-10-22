import React, { useEffect, useState } from 'react';
import { Award, Dumbbell, Calendar, ShieldCheck, Mail, Phone, Sparkles, CheckCircle } from 'lucide-react';
import { TrainerProfile } from '../../types';
import { api } from '../../services/api';

interface TrainersPageProps {
  onNavigate: (tab: string) => void;
}

export const TrainersPage: React.FC<TrainersPageProps> = ({ onNavigate }) => {
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getTrainers()
      .then((res) => {
        if (res.success) setTrainers(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#050505] text-[#F3F4F6] min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-xs font-mono font-bold tracking-widest text-[#FF1E27] mb-3 uppercase">
            <Award className="w-4 h-4" />
            <span>Certified Fitness Coaches</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-white uppercase tracking-tight">
            OUR GYM MENTORS
          </h1>
          <p className="text-[#A1A1AA] text-sm sm:text-base mt-4 font-sans leading-relaxed">
            Meet the mentors of IRON REVOLUTION 2.0 Naroli: Sachin Patel, Akshay Patel, and Krutika Patel.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-24 text-[#8E8E93] font-mono text-xs">Loading mentors...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* 1. Sachin Patel — With user's uploaded photo! */}
            <div className="glass-card rounded-3xl overflow-hidden border-2 border-[#FF1E27] shadow-glow-red flex flex-col justify-between">
              <div>
                <div className="h-84 overflow-hidden relative group">
                  <img
                    src="/assets/mentor-sachin.jpg"
                    alt="Head Coach Sachin Patel"
                    className="w-full h-80 object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3.5 py-1 rounded-xl text-xs font-mono font-bold text-[#FF1E27] border border-white/10">
                    HEAD MENTOR & OWNER
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="font-heading text-3xl font-bold text-white">Sachin Patel</h3>
                  <div className="text-xs text-[#FF1E27] font-mono font-bold uppercase tracking-wider mt-1">
                    Bodybuilding & Muscle Building Mentor
                  </div>

                  <p className="text-xs text-[#CCCCCC] mt-4 leading-relaxed font-sans">
                    Founder and head trainer of Iron Revolution. Specializes in heavy barbell training, 
                    proper squat and deadlift mechanics, and personalized high-protein Indian diet charts for natural muscle gain.
                  </p>

                  <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs text-[#A1A1AA] font-sans">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#FF1E27] shrink-0" />
                      <span>Muscle Building & Hypertrophy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#FF1E27] shrink-0" />
                      <span>Heavy Barbell & Powerlifting Form</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#FF1E27] shrink-0" />
                      <span>Direct Contact: +91 87349 22441</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-7 pt-0 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
                <span>8+ Years Experience</span>
                <span className="text-emerald-400 font-bold uppercase">● Available On Floor</span>
              </div>
            </div>

            {/* 2. Akshay Patel — Info Card as requested */}
            <div className="glass-card rounded-3xl p-8 border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center font-display text-3xl font-bold text-white mb-6 border border-white/10 shadow-lg">
                  AP
                </div>

                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  CO-FOUNDER & COACH
                </span>
                <h3 className="font-heading text-3xl font-bold text-white">Akshay Patel</h3>
                <div className="text-xs text-[#FF1E27] font-mono font-bold uppercase tracking-wider mt-1">
                  Strength, CrossFit & Fast Fat Burning
                </div>

                <p className="text-xs text-[#CCCCCC] mt-5 leading-relaxed font-sans">
                  Expert in full-body fat loss routines, kettlebell circuits, and stamina training. 
                  Helps beginners build consistency, lose belly fat, and gain athletic strength.
                </p>

                <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-xs text-[#A1A1AA] font-sans">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>CrossFit & Functional Stamina</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Weight Loss & Body Toning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Direct Contact: +91 91042 31111</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
                <span>6+ Years Experience</span>
                <span className="text-amber-400 font-bold uppercase">● Active Mentor</span>
              </div>
            </div>

            {/* 3. Krutika Patel — Info Card as requested */}
            <div className="glass-card rounded-3xl p-8 border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-900 flex items-center justify-center font-display text-3xl font-bold text-white mb-6 border border-white/10 shadow-lg">
                  KP
                </div>

                <span className="text-[11px] font-mono font-bold text-pink-400 uppercase tracking-widest block mb-1">
                  DIET & FITNESS COACH
                </span>
                <h3 className="font-heading text-3xl font-bold text-white">Krutika Patel</h3>
                <div className="text-xs text-[#FF1E27] font-mono font-bold uppercase tracking-wider mt-1">
                  Certified Nutritionist & Women Fitness Mentor
                </div>

                <p className="text-xs text-[#CCCCCC] mt-5 leading-relaxed font-sans">
                  Certified nutritionist specializing in Indian diet planning, women fitness, posture correction, 
                  and sustainable weight loss without extreme starving.
                </p>

                <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5 text-xs text-[#A1A1AA] font-sans">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>Custom Indian Home Diet Charts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>Women's Belly Fat Loss & Toning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>Available For Personal Diet Consultations</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
                <span>5+ Years Experience</span>
                <span className="text-pink-400 font-bold uppercase">● Active Mentor</span>
              </div>
            </div>
          </div>
        )}

        {/* Callout */}
        <div className="glass-panel p-10 rounded-3xl text-center max-w-3xl mx-auto border-white/10">
          <h3 className="font-display text-3xl font-bold text-white mb-2 uppercase">
            START TRAINING WITH OUR MENTORS TODAY!
          </h3>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mb-6 font-sans">
            Visit our gym on Naroli Road, Silvassa or join online to get your personalized workout chart.
          </p>
          <button
            onClick={() => onNavigate('register')}
            className="btn-primary px-9 py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-glow-sm"
          >
            Register For Gym Training
          </button>
        </div>
      </div>
    </div>
  );
};
