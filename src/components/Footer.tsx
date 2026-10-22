import React from 'react';
import { MapPin, Phone, Mail, Clock, Award, Shield, Heart, ArrowUpRight } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 text-[#8E8E93] pt-20 pb-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <Logo size="md" className="mb-4" />
            <p className="text-xs leading-relaxed mb-6 text-[#A1A1AA] font-sans">
              Dadra & Nagar Haveli's premier strength, hypertrophy, and functional training powerhouse. 
              Equipped with calibrated Olympic barbells, assault conditioning turf, and computerized member management.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#FF1E27] font-mono font-bold tracking-wider uppercase">
              <Award className="w-4 h-4" />
              <span>Certified Training Center</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-display text-xl font-bold tracking-wider mb-5 border-l-2 border-[#FF1E27] pl-3 uppercase">
              Quick Navigation
            </h4>
            <ul className="space-y-3 text-xs font-semibold">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Home Overview</span>
                  <ArrowUpRight className="w-3 h-3 text-[#FF1E27]" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>About Our Mission</span>
                  <ArrowUpRight className="w-3 h-3 text-[#FF1E27]" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plans')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Membership Tiers</span>
                  <ArrowUpRight className="w-3 h-3 text-[#FF1E27]" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('trainers')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Certified Coaching Staff</span>
                  <ArrowUpRight className="w-3 h-3 text-[#FF1E27]" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('timetable')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Weekly Timetable Matrix</span>
                  <ArrowUpRight className="w-3 h-3 text-[#FF1E27]" />
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Facility Location & Desk</span>
                  <ArrowUpRight className="w-3 h-3 text-[#FF1E27]" />
                </button>
              </li>
            </ul>
          </div>

          {/* Facility Location Details */}
          <div>
            <h4 className="text-white font-display text-xl font-bold tracking-wider mb-5 border-l-2 border-[#FF1E27] pl-3 uppercase">
              Compound Address
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF1E27] shrink-0 mt-0.5" />
                <span className="text-[#CCCCCC]">Naroli, Silvassa, Dadra and Nagar Haveli, India — 396235</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF1E27] shrink-0" />
                <span className="font-mono text-[#CCCCCC]">+91 98765 43210 (Demo Desk)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF1E27] shrink-0" />
                <span className="text-[#CCCCCC]">info@ironrevolution.demo</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#FF1E27] shrink-0 mt-0.5" />
                <span className="text-[#A1A1AA]">Mon – Sat: 5:30 AM – 10:00 PM<br />Sunday: 6:00 AM – 1:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Project Credentials */}
          <div>
            <h4 className="text-white font-display text-xl font-bold tracking-wider mb-5 border-l-2 border-[#FF1E27] pl-3 uppercase">
              Project Stakeholders
            </h4>
            <div className="glass-card p-5 rounded-2xl border-white/10 space-y-3 text-xs font-mono">
              <div>
                <span className="text-[#71717A] block uppercase text-[10px]">Gym Owner</span>
                <span className="text-white font-bold text-sm font-sans">Sachin Patel</span>
              </div>
              <div className="border-t border-white/5 pt-2">
                <span className="text-[#71717A] block uppercase text-[10px]">Project Developer</span>
                <span className="text-[#FF1E27] font-bold text-sm font-sans">Apurva Mishra</span>
              </div>
              <div className="border-t border-white/5 pt-2 text-[#8E8E93] font-sans leading-relaxed text-[11px]">
                Software Engineering College Capstone Project — Web-Based Gym Management System.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#71717A] gap-4">
          <p>© {new Date().getFullYear()} IRON REVOLUTION. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-[#A1A1AA]">
            <span>Developed by</span>
            <strong className="text-white">Apurva Mishra</strong>
            <span>for Software Engineering Live Viva</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
