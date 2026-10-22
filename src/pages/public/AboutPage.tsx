import React from 'react';
import { Target, Eye, Flame, Shield, CheckCircle2, Award, HeartHandshake, ArrowRight, Instagram, Phone } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#050505] text-[#F3F4F6] min-h-screen py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-xs font-mono font-bold tracking-widest text-[#FF1E27] mb-4 uppercase">
            <Flame className="w-4 h-4" />
            <span>Welcome To IRON REVOLUTION 2.0</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight">
            ABOUT OUR GYM & TEAM
          </h1>
          <p className="text-[#8E8E93] text-sm sm:text-base mt-4 font-sans leading-relaxed">
            The biggest and most trusted fitness center in Naroli, Silvassa. Simple training, genuine guidance, and 100% digital management.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-5 text-sm text-[#CCCCCC] leading-relaxed font-sans">
            <h2 className="font-display text-2xl sm:text-3xl text-white uppercase border-l-4 border-[#FF1E27] pl-4">
              Real Fitness For Naroli & Silvassa
            </h2>
            <p>
              <strong className="text-white font-bold">IRON REVOLUTION 2.0</strong> was started by founder <strong className="text-white font-bold">Sachin Patel</strong> with a clear goal: to give local youth and families a modern, clean, and motivating gym environment right here in Naroli without having to travel far.
            </p>
            <p>
              Along with mentors <strong className="text-white font-bold">Akshay Patel</strong> and <strong className="text-white font-bold">Krutika Patel</strong>, the gym focuses on proper exercise form, injury prevention, and easy home-cooked Indian diet plans that you can realistically follow.
            </p>
            <p>
              Earlier, maintaining paper registers, tracking monthly fee cards, and marking attendance in diaries caused delays and missing records. To make the entire gym paperless and convenient for every trainee, software engineering developer <strong className="text-[#FF1E27] font-bold">Apurva Mishra</strong> designed and built this centralized web portal.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
              <a 
                href="https://www.instagram.com/ironrevolution_2.0" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white rounded-lg transition"
              >
                <Instagram className="w-4 h-4" /> Follow @ironrevolution_2.0
              </a>
              <a 
                href="tel:8734922441"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#1C1C1E] border border-white/10 hover:border-[#FF1E27] text-white rounded-lg transition"
              >
                <Phone className="w-4 h-4 text-[#FF1E27]" /> Call: +91 87349 22441
              </a>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden glass-panel border-white/10 shadow-2xl relative group">
            <img
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&auto=format&fit=crop&q=80"
              alt="Iron Revolution Gym Interior"
              className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border-white/10">
              <span className="text-[10px] font-mono font-bold text-[#FF1E27] uppercase tracking-widest block">
                MAIN FACILITY LOCATION
              </span>
              <p className="text-white font-heading text-lg font-bold">Near Primary School, Naroli Road, Silvassa — 396235</p>
            </div>
          </div>
        </div>

        {/* Meet Our 3 Mentors Section */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="font-display text-3xl sm:text-4xl text-white uppercase">
              MEET OUR GYM MENTORS
            </h3>
            <p className="text-xs sm:text-sm text-[#8E8E93] mt-2">
              Our 3 mentors are present on the gym floor to help you with workouts and diet plans daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sachin Patel (With Photo) */}
            <div className="glass-card rounded-2xl border-white/10 overflow-hidden flex flex-col">
              <div className="h-64 overflow-hidden relative bg-[#18181A]">
                <img 
                  src="/assets/mentor-sachin.jpg" 
                  alt="Sachin Patel"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-[#FF1E27]/40 text-[10px] font-mono font-bold text-[#FF1E27] uppercase">
                  Founder & Head Mentor
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-heading font-extrabold text-white">Sachin Patel</h4>
                  <p className="text-xs text-[#FF1E27] font-semibold mt-0.5">Heavy Weight & Strength Coach</p>
                  <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
                    Founder of IRON REVOLUTION 2.0 with 8+ years coaching athletes. Expert in bench press, deadlift, squat techniques, and personalized strength progress.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#8E8E93]">
                  Available: Morning 5-10 AM & Evening 5-10 PM
                </div>
              </div>
            </div>

            {/* Akshay Patel (Clean Info Card without photo) */}
            <div className="glass-card rounded-2xl border-white/10 p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FF1E27]/10 border border-[#FF1E27]/30 flex items-center justify-center text-[#FF1E27] font-bold text-lg mb-4">
                  AP
                </div>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-[#CCCCCC] uppercase">
                  Co-Founder & Coach
                </span>
                <h4 className="text-xl font-heading font-extrabold text-white mt-2">Akshay Patel</h4>
                <p className="text-xs text-[#FF1E27] font-semibold mt-0.5">CrossFit & Fat Loss Specialist</p>
                <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
                  Focuses on high-intensity fat burn workouts, stamina building, and functional mobility. Specializes in transforming beginners step-by-step without extreme diets.
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#CCCCCC]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> High-Intensity Cardio & HIIT</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Beginner Weight Training</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Core & Stamina Building</li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-[11px] text-[#8E8E93]">
                Batches: Daily Naroli Branch Sessions
              </div>
            </div>

            {/* Krutika Patel (Clean Info Card without photo) */}
            <div className="glass-card rounded-2xl border-white/10 p-6 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-lg mb-4">
                  KP
                </div>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-[#CCCCCC] uppercase">
                  Diet & Fitness Mentor
                </span>
                <h4 className="text-xl font-heading font-extrabold text-white mt-2">Krutika Patel</h4>
                <p className="text-xs text-purple-400 font-semibold mt-0.5">Female Fitness & Nutrition Guide</p>
                <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
                  Specialized in female fitness, toning, flexibility, and practical Indian diet planning (vegetarian and high-protein home meal plans).
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-[#CCCCCC]">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Customized Diet Charts (Desi Food)</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Dedicated Female Fitness Batches</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Posture & Yoga Flexibility</li>
                </ul>
              </div>
              <div className="mt-6 pt-3 border-t border-white/10 text-[11px] text-[#8E8E93]">
                Batches: Morning & Evening Special Slots
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="glass-card p-8 rounded-3xl border-white/10">
            <div className="p-3 bg-[#FF1E27]/10 text-[#FF1E27] w-fit rounded-2xl mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">OUR SIMPLE MISSION</h3>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed font-sans">
              To make high quality gym training affordable and accessible to every boy, girl, and working professional in Naroli and Silvassa, with genuine personal attention and safe techniques.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border-white/10">
            <div className="p-3 bg-[#FF1E27]/10 text-[#FF1E27] w-fit rounded-2xl mb-5">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">OUR DIGITAL VISION</h3>
            <p className="text-xs sm:text-sm text-[#8E8E93] leading-relaxed font-sans">
              To replace paper notebooks and missing receipts with this complete web software so members can track their membership, check plans, and see attendance directly from their mobile phones.
            </p>
          </div>
        </div>

        {/* Stakeholder Accreditation */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono font-bold text-[#FF1E27] uppercase tracking-widest">
              COLLEGE PROJECT SPECIFICATION
            </span>
            <h4 className="font-display text-xl sm:text-2xl font-bold text-white mt-1">
              Web-Based Gym Management & Member Information System
            </h4>
            <p className="text-xs text-[#8E8E93] mt-1 font-sans">
              Designed & Developed by <strong className="text-white">Apurva Mishra</strong> for Software Engineering college viva presentation. Client: <strong className="text-white">Sachin Patel</strong> (IRON REVOLUTION 2.0).
            </p>
          </div>
          <button
            onClick={() => onNavigate('plans')}
            className="btn-primary px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest shrink-0"
          >
            Check Membership Plans
          </button>
        </div>
      </div>
    </div>
  );
};
