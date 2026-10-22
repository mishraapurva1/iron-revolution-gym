import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Flame,
  Award,
  Users,
  Dumbbell,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle,
  Star,
  ChevronRight,
  Activity,
  Calculator,
  Play,
  X,
  Phone,
  Instagram,
  UserCheck,
} from 'lucide-react';
import { MembershipPlan, TrainerProfile, WorkoutClass } from '../../types';
import { api } from '../../services/api';

interface HomePageProps {
  onNavigate: (tab: string, state?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [classes, setClasses] = useState<WorkoutClass[]>([]);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  // Easy BMI calculator for Indian users (in simple kg and cm)
  const [height, setHeight] = useState<string>('172');
  const [weight, setWeight] = useState<string>('68');
  const [bmiResult, setBmiResult] = useState<{ bmi: number; category: string; planRecommend: string } | null>(null);

  useEffect(() => {
    api.getPlans().then((res) => {
      if (res.success) setPlans(res.data.slice(0, 4));
    }).catch(console.error);

    api.getTrainers().then((res) => {
      if (res.success) setTrainers(res.data);
    }).catch(console.error);

    api.getClasses().then((res) => {
      if (res.success) setClasses(res.data.slice(0, 4));
    }).catch(console.error);

    calculateBmi(172, 68);
  }, []);

  const calculateBmi = (h: number, w: number) => {
    if (h > 0 && w > 0) {
      const hM = h / 100;
      const val = parseFloat((w / (hM * hM)).toFixed(1));
      let cat = 'Healthy Weight';
      let rec = '3 Months Transformation Plan';
      if (val < 18.5) {
        cat = 'Underweight (Need Weight Gain & Muscle)';
        rec = '6 Months Muscle Building Plan';
      } else if (val >= 25 && val < 30) {
        cat = 'Overweight (Need Fat Loss & Cardio)';
        rec = '3 Months Weight Loss Package';
      } else if (val >= 30) {
        cat = 'High Body Fat (Need Full Body Transformation)';
        rec = '1 Year VIP Package with Diet Chart';
      }
      setBmiResult({ bmi: val, category: cat, planRecommend: rec });
    }
  };

  const handleBmiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateBmi(Number(height), Number(weight));
  };

  const stats = [
    { label: 'Happy Members', value: '500+', sub: 'Active in Naroli & Silvassa', icon: Users },
    { label: 'Gym Equipment', value: '75+', sub: 'Dumbbells, Barbells & Machines', icon: Dumbbell },
    { label: 'Expert Mentors', value: '3', sub: 'Sachin, Akshay & Krutika Patel', icon: Award },
    { label: 'Member Results', value: '98%', sub: 'Real fitness transformation', icon: ShieldCheck },
  ];

  const gymPhotos = [
    {
      title: 'Heavy Dumbbells & Free Weights Deck',
      desc: 'Dumbbells up to 50kg, Olympic weight plates, and flat, incline, and decline bench presses.',
      img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Cardio & Treadmill Zone',
      desc: 'Commercial treadmills, cross trainers, spin bikes, and warm-up machines for fat burning.',
      img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Lat Pulldown & Cable Machines',
      desc: 'Multi-station cable crossover, seated rows, chest flyes, and leg extension machines.',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Clean Lockers & Steam Room',
      desc: 'Clean changing rooms, private lockers, drinking water dispenser, and recovery area.',
      img: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="bg-[#050505] text-[#F3F4F6] relative overflow-hidden">
      {/* 1. CINEMATIC HERO SECTION WITH MOVING WORKOUT VIDEO */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/5 overflow-hidden">
        {/* Background Moving Video with Dark Contrast Filter */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/mentor-sachin.jpg"
            className="w-full h-full object-cover opacity-35 scale-105"
          >
            {/* Free fitness workout video stream */}
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
              type="video/mp4"
            />
          </video>
          {/* Dark luxury overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/85 to-black/75"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full pt-10">
          <div className="max-w-3xl space-y-6">
            {/* Location & Instagram Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold text-white backdrop-blur-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E27] animate-pulse"></span>
                <span>Naroli Road, Silvassa — Near Primary School</span>
              </div>
              <a
                href="https://www.instagram.com/ironrevolution_2.0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-900/60 to-pink-900/60 border border-pink-500/30 text-xs text-pink-300 font-bold hover:text-white transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400" />
                <span>@ironrevolution_2.0</span>
              </a>
            </div>

            {/* Clear, Punchy Main Headline */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-white uppercase drop-shadow-2xl">
              BUILD YOUR BODY. <br />
              <span className="text-[#FF1E27] drop-shadow-[0_0_25px_rgba(255,30,39,0.5)]">
                GET STRONGER
              </span>{' '}
              EVERY DAY.
            </h1>

            {/* Easy Indian English Description */}
            <p className="text-base sm:text-lg text-[#CCCCCC] font-normal leading-relaxed font-sans">
              Welcome to <strong className="text-white font-bold">IRON REVOLUTION 2.0</strong>, the most popular gym in Naroli, Silvassa. 
              Get personal workout training from mentors <span className="text-[#FF1E27] font-semibold">Sachin Patel</span>,{' '}
              <span className="text-white font-semibold">Akshay Patel</span>, and{' '}
              <span className="text-white font-semibold">Krutika Patel</span>.
              Enjoy modern gym equipment, clean facilities, morning and evening batches, and easy online membership management developed by{' '}
              <strong className="text-white">Apurva Mishra</strong>.
            </p>

            {/* Main Action Buttons & Moving Video Trigger */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <button
                onClick={() => onNavigate('register')}
                className="btn-primary px-8 py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-glow-sm"
              >
                <span>Join Gym Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowVideoModal(true)}
                className="btn-secondary px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 group"
              >
                <div className="w-6 h-6 rounded-full bg-[#FF1E27] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                <span>Watch Gym Video Preview</span>
              </button>

              <button
                onClick={() => onNavigate('plans')}
                className="btn-secondary px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-[#A1A1AA] hover:text-white"
              >
                <span>Check Monthly Fees</span>
              </button>
            </div>

            {/* Contact quick strip */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#A1A1AA] font-mono">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF1E27]" />
                <a href="tel:8734922441" className="hover:text-white">Call: +91 87349 22441</a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#FF1E27]" />
                <span>5:00 AM – 10:00 AM & 5:00 PM – 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEO PREVIEW MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#121212] border border-white/20 rounded-3xl max-w-4xl w-full p-6 text-white relative shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF1E27] animate-pulse"></span>
                <h3 className="font-display text-2xl font-bold uppercase">
                  IRON REVOLUTION 2.0 — LIVE TRAINING PREVIEW
                </h3>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
              <video
                controls
                autoPlay
                playsInline
                poster="/assets/mentor-sachin.jpg"
                className="w-full h-full object-cover"
              >
                <source
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
                  type="video/mp4"
                />
                Your browser does not support video playback.
              </video>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A1A1AA]">
              <span>Visit our gym at Naroli Road, Silvassa to experience the workout energy in person!</span>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  onNavigate('register');
                }}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATS RIBBON */}
      <section className="relative z-20 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl glass-panel shadow-2xl border-white/10">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#FF1E27]/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#A1A1AA]">
                    {s.label}
                  </span>
                  <div className="p-2 rounded-lg bg-[#FF1E27]/10 text-[#FF1E27] group-hover:bg-[#FF1E27] group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-display text-4xl sm:text-5xl text-white font-extrabold tracking-tight">
                  {s.value}
                </div>
                <div className="text-[11px] text-[#888888] mt-1 font-sans">{s.sub}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. MENTORS SHOWCASE: Sachin Patel (With Photo), Akshay Patel, Krutika Patel */}
      <section className="py-24 bg-[#0A0A0A] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-xs font-mono font-bold tracking-widest text-[#FF1E27] mb-3 uppercase">
              <Award className="w-4 h-4" />
              <span>Certified Gym Mentors</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight">
              MEET YOUR GYM MENTORS
            </h2>
            <p className="text-sm text-[#A1A1AA] mt-3 font-sans leading-relaxed">
              Learn proper exercise form, diet tips, and workout routines under experienced fitness leaders in Silvassa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Sachin Patel — With User's Uploaded Photo! */}
            <div className="glass-card rounded-3xl overflow-hidden border-2 border-[#FF1E27] shadow-glow-red flex flex-col justify-between">
              <div>
                <div className="h-80 overflow-hidden relative group">
                  <img
                    src="/assets/mentor-sachin.jpg"
                    alt="Mentor Sachin Patel"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-mono font-bold text-[#FF1E27] border border-white/10">
                    HEAD MENTOR & FOUNDER
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="font-heading text-3xl font-bold text-white">Sachin Patel</h3>
                  <div className="text-xs text-[#FF1E27] font-mono font-bold uppercase tracking-wider mt-1">
                    Bodybuilding & Strength Specialist
                  </div>
                  <p className="text-xs text-[#CCCCCC] mt-4 leading-relaxed font-sans">
                    Founder of Iron Revolution. Expert in muscle building, heavy barbell lifting, and full body transformations. 
                    Guides you on correct form, lifting posture, and high-protein diet.
                  </p>
                </div>
              </div>

              <div className="p-7 pt-0 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
                <span>8+ Years Gym Experience</span>
                <span className="text-emerald-400 font-bold uppercase">● Available On Floor</span>
              </div>
            </div>

            {/* 2. Akshay Patel — Clean Info Card as requested */}
            <div className="glass-card rounded-3xl p-8 border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center font-display text-3xl font-bold text-white mb-6 border border-white/10 shadow-lg">
                  AP
                </div>

                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  CO-FOUNDER & SENIOR COACH
                </span>
                <h3 className="font-heading text-3xl font-bold text-white">Akshay Patel</h3>
                <div className="text-xs text-[#FF1E27] font-mono font-bold uppercase tracking-wider mt-1">
                  Strength Training, CrossFit & Fat Loss
                </div>

                <p className="text-xs text-[#CCCCCC] mt-5 leading-relaxed font-sans">
                  Co-founder and senior fitness trainer. Specializes in functional workout circuits, stamina building, 
                  and high-intensity fat burning routines for fast results.
                </p>

                <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-xs text-[#A1A1AA] font-sans">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>CrossFit & Functional Training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Weight Loss & Body Toning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Form Check & Injury Prevention</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
                <span>6+ Years Experience</span>
                <span className="text-amber-400 font-bold uppercase">● Active Mentor</span>
              </div>
            </div>

            {/* 3. Krutika Patel — Clean Info Card as requested */}
            <div className="glass-card rounded-3xl p-8 border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-900 flex items-center justify-center font-display text-3xl font-bold text-white mb-6 border border-white/10 shadow-lg">
                  KP
                </div>

                <span className="text-[11px] font-mono font-bold text-pink-400 uppercase tracking-widest block mb-1">
                  FITNESS & DIET COACH
                </span>
                <h3 className="font-heading text-3xl font-bold text-white">Krutika Patel</h3>
                <div className="text-xs text-[#FF1E27] font-mono font-bold uppercase tracking-wider mt-1">
                  Nutritionist, HIIT & Women Fitness
                </div>

                <p className="text-xs text-[#CCCCCC] mt-5 leading-relaxed font-sans">
                  Certified nutrition and lifestyle coach. Designs healthy Indian home diet plans, 
                  cardio routines, and special workout schedules for female members and beginners.
                </p>

                <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-xs text-[#A1A1AA] font-sans">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>Simple Indian Home Diet Charts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>Women's Fitness & Belly Fat Loss</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>Flexibility, Core & Cardio Workouts</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
                <span>5+ Years Experience</span>
                <span className="text-pink-400 font-bold uppercase">● Active Mentor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REAL GYM PHOTOS SHOWCASE */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-bold tracking-widest text-[#FF1E27] mb-3 uppercase">
            <Dumbbell className="w-4 h-4" />
            <span>Modern Gym Facilities</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight">
            INSIDE IRON REVOLUTION 2.0
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-3 font-sans leading-relaxed">
            Take a look at our gym machines, weight area, and workout floor in Naroli, Silvassa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gymPhotos.map((photo, i) => (
            <div key={i} className="glass-card rounded-2xl overflow-hidden group">
              <div className="h-52 overflow-hidden relative">
                <img
                  src={photo.img}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
              <div className="p-5">
                <h4 className="font-heading text-lg font-bold text-white mb-1.5">{photo.title}</h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">{photo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MEMBERSHIP PACKAGES (EASY INDIAN ENGLISH) */}
      <section className="py-24 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-[#FF1E27] mb-2 font-mono">
                Affordable Gym Fees
              </div>
              <h2 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight">
                MEMBERSHIP PLANS
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mt-4 md:mt-0 font-sans">
              Choose the package that fits your schedule. No hidden charges. Easy online admission with instant computerized receipt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                    isPopular
                      ? 'bg-gradient-to-b from-[#1C1213] via-[#141010] to-[#0A0A0A] border-2 border-[#FF1E27] shadow-glow-red'
                      : 'glass-card border-white/10'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FF1E27] text-white text-[10px] font-black uppercase px-4 py-1 rounded-full tracking-widest shadow-lg">
                      BEST VALUE
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] font-mono font-bold text-[#A1A1AA] uppercase tracking-wider block">
                      {p.durationMonths} Month{p.durationMonths > 1 ? 's' : ''} Validity
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-white mt-1">{p.name}</h3>
                    <p className="text-xs text-[#A1A1AA] mt-1.5 min-h-[34px] font-sans">{p.description}</p>

                    <div className="mt-6 pb-6 border-b border-white/10">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-5xl font-extrabold text-white">
                          ₹{Number(p.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#A1A1AA] font-mono">only</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#CCCCCC] block mb-3">
                        What you get:
                      </span>
                      <ul className="space-y-3 text-xs text-[#CCCCCC] font-sans">
                        {benefitsList.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5">
                            <CheckCircle className="w-4 h-4 text-[#FF1E27] shrink-0 mt-0.5" />
                            <span>{b.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 pt-4">
                    <button
                      onClick={() => onNavigate('register', { selectedPlanId: p.id })}
                      className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                        isPopular
                          ? 'btn-primary shadow-glow-sm'
                          : 'btn-secondary text-white hover:border-white'
                      }`}
                    >
                      Join Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. EASY BMI & BODYWEIGHT CALCULATOR */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#FF1E27] mb-2 font-mono">
                <Calculator className="w-4 h-4" />
                <span>Body Fitness Calculator</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl text-white uppercase tracking-tight">
                CHECK YOUR BMI & FITNESS TARGET
              </h2>
              <p className="text-xs sm:text-sm text-[#A1A1AA] mt-3 font-sans leading-relaxed">
                Enter your height in centimeters and weight in kilograms to see your body mass index and find out whether you need weight loss or muscle building.
              </p>

              <form onSubmit={handleBmiSubmit} className="mt-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#CCCCCC] uppercase tracking-wider mb-1.5 font-mono">
                      Height (in cm)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 172"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-[#FF1E27] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#CCCCCC] uppercase tracking-wider mb-1.5 font-mono">
                      Weight (in kg)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 68"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-[#FF1E27] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Calculate My Fitness Level</span>
                </button>
              </form>
            </div>

            {/* Results Display */}
            <div className="bg-black/70 border border-white/10 p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#A1A1AA] block">
                  Your BMI Score
                </span>
                <div className="font-display text-6xl text-white mt-1">
                  {bmiResult?.bmi || '23.0'}
                </div>

                <div className="mt-5 pt-5 border-t border-white/10 space-y-3 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Current Condition:</span>
                    <span className="font-bold text-emerald-400 uppercase">{bmiResult?.category || 'Normal'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Recommended Plan:</span>
                    <span className="font-bold text-white">{bmiResult?.planRecommend || '3 Months Transformation'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Recommended Mentors:</span>
                    <span className="font-bold text-[#FF1E27]">Sachin Patel & Akshay Patel</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10">
                <button
                  onClick={() => onNavigate('register')}
                  className="btn-secondary w-full py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2"
                >
                  <span>Register With This Goal</span>
                  <ArrowRight className="w-4 h-4 text-[#FF1E27]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CONTACT & LOCATION STRIP */}
      <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-800 text-xs font-mono font-bold text-[#FF1E27] uppercase">
            <MapPin className="w-4 h-4" />
            <span>Near Primary School, Naroli, Silvassa — 396235</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight">
            START YOUR WORKOUT AT IRON REVOLUTION TODAY!
          </h2>
          <p className="text-sm text-[#CCCCCC] max-w-xl mx-auto font-sans">
            Have any doubts or want to see the gym first? Call or WhatsApp our mentors directly or visit the gym in Naroli.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href="tel:8734922441"
              className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call: +91 87349 22441</span>
            </a>
            <a
              href="https://www.instagram.com/ironrevolution_2.0"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Instagram: @ironrevolution_2.0</span>
            </a>
            <button
              onClick={() => onNavigate('contact')}
              className="btn-secondary w-full sm:w-auto px-8 py-3.5 rounded-xl text-xs font-bold uppercase"
            >
              <span>View Gym Map</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
