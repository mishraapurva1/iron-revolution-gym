import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User, Dumbbell, Sparkles } from 'lucide-react';
import { WorkoutClass } from '../../types';
import { api } from '../../services/api';

export const TimetablePublicPage: React.FC = () => {
  const [classes, setClasses] = useState<WorkoutClass[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(true);

  const days = ['ALL', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    setLoading(true);
    api.getClasses(selectedDay === 'ALL' ? undefined : selectedDay)
      .then((res) => {
        if (res.success) setClasses(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedDay]);

  return (
    <div className="bg-[#050505] text-[#F3F4F6] min-h-screen py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF1E27]/10 border border-[#FF1E27]/30 text-xs font-mono font-bold tracking-widest text-[#FF1E27] mb-4 uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Weekly Operational Matrix</span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl text-white uppercase tracking-tight">
            WORKOUT CLASS TIMETABLE
          </h1>
          <p className="text-[#8E8E93] text-sm sm:text-base mt-4 font-sans leading-relaxed">
            Structured barbell lifting, functional athletic conditioning, and HIIT masterclasses at IRON REVOLUTION.
          </p>
        </div>

        {/* Day Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                selectedDay === day
                  ? 'btn-primary shadow-glow-sm'
                  : 'btn-secondary text-[#8E8E93] hover:text-white'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Classes Table / Grid */}
        {loading ? (
          <div className="text-center py-24 text-[#8E8E93] font-mono text-xs">Loading timetable matrix...</div>
        ) : classes.length === 0 ? (
          <div className="glass-card p-16 text-center rounded-3xl border-white/10 max-w-xl mx-auto">
            <Calendar className="w-12 h-12 text-[#444444] mx-auto mb-4" />
            <h4 className="font-heading text-xl font-bold text-white mb-2">No Classes Scheduled For This Day</h4>
            <p className="text-xs text-[#8E8E93] font-sans">Please select another weekday or check back with the desk.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => (
              <div key={cls.id} className="glass-card p-7 rounded-3xl border-white/10 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between text-xs mb-4">
                    <span className="px-3 py-1 rounded-lg bg-[#FF1E27]/10 text-[#FF1E27] border border-[#FF1E27]/30 font-mono font-bold uppercase">
                      {cls.dayOfWeek}
                    </span>
                    <div className="flex items-center gap-1.5 text-white font-mono font-bold text-xs bg-white/5 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-[#FF1E27]" />
                      <span>{cls.startTime} – {cls.endTime}</span>
                    </div>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-white mb-2">{cls.title}</h3>
                  <p className="text-xs text-[#8E8E93] leading-relaxed mb-6 font-sans line-clamp-2">
                    {cls.description || 'Intensive workout coaching session with certified sports mentors.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs font-sans">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#8E8E93]">
                      <User className="w-3.5 h-3.5 text-[#FF1E27]" />
                      <span>Head Coach</span>
                    </span>
                    <span className="font-bold text-white">
                      {cls.trainerProfile?.fullName || 'Assigned Staff'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[#8E8E93]">
                      <MapPin className="w-3.5 h-3.5 text-[#FF1E27]" />
                      <span>Zone</span>
                    </span>
                    <span className="text-[#CCCCCC]">{cls.roomOrArea}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#8E8E93]">Capacity</span>
                    <span className="text-emerald-400 font-mono font-bold">{cls.maxSlots} Slots Available</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
