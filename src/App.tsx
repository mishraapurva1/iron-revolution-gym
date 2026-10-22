import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { PlansPage } from './pages/public/PlansPage';
import { TrainersPage } from './pages/public/TrainersPage';
import { ContactPage } from './pages/public/ContactPage';
import { TimetablePublicPage } from './pages/public/TimetablePublicPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MembersPage } from './pages/admin/MembersPage';
import { TrainersPage as AdminTrainersPage } from './pages/admin/TrainersPage';
import { AdminPlansPage } from './pages/admin/AdminPlansPage';
import { AttendancePage } from './pages/admin/AttendancePage';
import { TimetablePage } from './pages/admin/TimetablePage';
import { AdminWorkoutPlansPage } from './pages/admin/AdminWorkoutPlansPage';
import { PaymentsPage } from './pages/admin/PaymentsPage';
import { NoticesPage } from './pages/admin/NoticesPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { SettingsPage } from './pages/admin/SettingsPage';

// Trainer Pages
import { TrainerDashboard } from './pages/trainer/TrainerDashboard';

// Member Pages
import { MemberDashboard } from './pages/member/MemberDashboard';
import { MemberWorkoutsPage } from './pages/member/MemberWorkoutsPage';
import { MemberAttendancePage } from './pages/member/MemberAttendancePage';
import { MemberPaymentsPage } from './pages/member/MemberPaymentsPage';
import { MemberProfilePage } from './pages/member/MemberProfilePage';

export const App: React.FC = () => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [navigationState, setNavigationState] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Auto redirect on login
  useEffect(() => {
    if (isAuthenticated && (currentTab === 'login' || currentTab === 'register')) {
      if (role === 'ADMIN') setCurrentTab('admin-dashboard');
      else if (role === 'TRAINER') setCurrentTab('trainer-dashboard');
      else setCurrentTab('member-dashboard');
    }
  }, [isAuthenticated, role, currentTab]);

  const handleNavigate = (tab: string, state?: any) => {
    setCurrentTab(tab);
    if (state) setNavigationState(state);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isDashboardView = currentTab.startsWith('admin-') ||
    currentTab.startsWith('trainer-') ||
    currentTab.startsWith('member-');

  // Page Title Resolver for Dashboard Topbar
  const getDashboardTitle = (): { title: string; subtitle: string } => {
    switch (currentTab) {
      case 'admin-dashboard':
        return { title: 'Executive Overview', subtitle: 'Live Key Performance Indicators & Gym Operations' };
      case 'admin-members':
        return { title: 'Member Information System', subtitle: 'Centralized Member Accounts & Subscription Status' };
      case 'admin-trainers':
        return { title: 'Trainer Management', subtitle: 'Fitness Coaches & Trainee Allocations' };
      case 'admin-plans':
        return { title: 'Membership Packages', subtitle: 'Configurable Duration, Pricing & Tier Privileges' };
      case 'admin-attendance':
        return { title: 'Floor Attendance Ledger', subtitle: 'Daily Biometric / Check-In Audit & Duplicate Prevention' };
      case 'admin-timetable':
        return { title: 'Workout Class Timetable', subtitle: 'Weekly Studio Sessions & Slot Bookings' };
      case 'admin-workouts':
        return { title: 'Custom Workout Routines', subtitle: 'Individual Exercise Splits, Sets & Target Muscles' };
      case 'admin-payments':
        return { title: 'Fees & Payment Ledger', subtitle: 'Computerized Receipts, Revenue Audits & Methods' };
      case 'admin-notices':
        return { title: 'Gym Notices & Announcements', subtitle: 'Broadcast Messages for Trainees & Coaching Staff' };
      case 'admin-reports':
        return { title: 'Reports & Export Center', subtitle: 'Print-Ready Summaries & CSV Analytical Exports' };
      case 'admin-settings':
        return { title: 'System Configuration', subtitle: 'Facility Details, Ownership & Developer Info' };
      case 'trainer-dashboard':
        return { title: 'Trainer Dashboard', subtitle: 'Assigned Trainees, Schedules & Program Reviews' };
      case 'member-dashboard':
        return { title: 'Member Portal', subtitle: 'My Active Membership, Coaching & Attendance Records' };
      case 'member-profile':
        return { title: 'My Profile & Details', subtitle: 'Contact Information & Security' };
      case 'member-workouts':
        return { title: 'My Workout Protocol', subtitle: 'Coach-Prescribed Progressive Routine' };
      case 'member-attendance':
        return { title: 'My Attendance Calendar', subtitle: 'Consistency Metric & Session Log' };
      case 'member-payments':
        return { title: 'My Fee Receipts', subtitle: 'Verified Computerized Invoices' };
      default:
        return { title: 'IRON REVOLUTION', subtitle: 'Gym Information System' };
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      // Public Views
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'plans':
        return <PlansPage onNavigate={handleNavigate} />;
      case 'trainers':
        return <TrainersPage onNavigate={handleNavigate} />;
      case 'timetable':
        return <TimetablePublicPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} selectedPlanId={navigationState?.selectedPlanId} />;

      // Admin Views
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'admin-members':
        return <MembersPage />;
      case 'admin-trainers':
        return <AdminTrainersPage />;
      case 'admin-plans':
        return <AdminPlansPage />;
      case 'admin-attendance':
        return <AttendancePage />;
      case 'admin-timetable':
        return <TimetablePage />;
      case 'admin-workouts':
        return <AdminWorkoutPlansPage />;
      case 'admin-payments':
        return <PaymentsPage />;
      case 'admin-notices':
        return <NoticesPage />;
      case 'admin-reports':
        return <ReportsPage />;
      case 'admin-settings':
        return <SettingsPage />;

      // Trainer Views
      case 'trainer-dashboard':
      case 'trainer-members':
        return <TrainerDashboard onNavigate={handleNavigate} />;
      case 'trainer-workouts':
        return <AdminWorkoutPlansPage />;
      case 'trainer-attendance':
        return <AttendancePage />;
      case 'trainer-timetable':
        return <TimetablePublicPage />;
      case 'trainer-notices':
        return <NoticesPage />;

      // Member Views
      case 'member-dashboard':
        return <MemberDashboard onNavigate={handleNavigate} />;
      case 'member-profile':
        return <MemberProfilePage />;
      case 'member-workouts':
        return <MemberWorkoutsPage />;
      case 'member-attendance':
        return <MemberAttendancePage />;
      case 'member-timetable':
        return <TimetablePublicPage />;
      case 'member-payments':
        return <MemberPaymentsPage />;
      case 'member-notices':
        return <NoticesPage />;

      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col font-sans antialiased selection:bg-[#E50914] selection:text-white">
      {isDashboardView ? (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <Sidebar
            currentTab={currentTab}
            onNavigate={handleNavigate}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Main Dashboard Area */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              sidebarCollapsed ? 'ml-20' : 'ml-64'
            }`}
          >
            <Topbar
              title={getDashboardTitle().title}
              subtitle={getDashboardTitle().subtitle}
              collapsed={sidebarCollapsed}
              onNavigate={handleNavigate}
            />

            <main className="flex-1 mt-20 bg-[#0B0B0B] pb-12">
              {renderContent()}
            </main>
          </div>
        </div>
      ) : (
        <>
          <Navbar currentTab={currentTab} onNavigate={handleNavigate} />
          <main className="flex-1">
            {renderContent()}
          </main>
          <Footer onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
};

export default App;
