import React, { useState, useEffect } from 'react';
import { Menu, X, LayoutDashboard, LogIn, ArrowRight, ShieldCheck, Dumbbell } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, role, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Overview' },
    { id: 'about', label: 'About Us' },
    { id: 'plans', label: 'Memberships' },
    { id: 'trainers', label: 'Coaches' },
    { id: 'timetable', label: 'Timetable' },
    { id: 'contact', label: 'Facility' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  const getDashboardTarget = () => {
    if (role === 'ADMIN') return 'admin-dashboard';
    if (role === 'TRAINER') return 'trainer-dashboard';
    return 'member-dashboard';
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 transition-all duration-300">
      <nav
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          isScrolled
            ? 'glass-panel shadow-2xl shadow-black/80 border-white/10 px-5 py-3'
            : 'bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 px-6 py-4'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="cursor-pointer" onClick={() => handleLinkClick('home')}>
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 bg-black/40 p-1.5 rounded-xl border border-white/5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  currentTab === link.id
                    ? 'bg-[#FF1E27] text-white shadow-lg shadow-red-950/60'
                    : 'text-[#8E8E93] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleLinkClick(getDashboardTarget())}
                  className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Portal: {role}</span>
                </button>
                <button
                  onClick={logout}
                  className="btn-secondary px-3.5 py-2.5 rounded-xl text-xs text-[#8E8E93] hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => handleLinkClick('login')}
                  className="btn-secondary flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#FF1E27]" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => handleLinkClick('register')}
                  className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs shadow-glow-sm"
                >
                  <span>Join The Tribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#8E8E93] hover:text-white bg-white/5 border border-white/10"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-white/10 space-y-2 animate-fadeIn">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider ${
                  currentTab === link.id
                    ? 'bg-[#FF1E27] text-white'
                    : 'text-[#8E8E93] hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-white/10 space-y-2.5">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => handleLinkClick(getDashboardTarget())}
                    className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 text-xs"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Open {role} Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 text-center text-xs text-[#8E8E93] hover:text-white"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleLinkClick('login')}
                    className="btn-secondary py-3 text-center rounded-xl text-xs font-bold uppercase"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleLinkClick('register')}
                    className="btn-primary py-3 text-center rounded-xl text-xs font-bold uppercase"
                  >
                    Join Now
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
