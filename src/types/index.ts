export type UserRole = 'ADMIN' | 'TRAINER' | 'MEMBER';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  memberProfile?: MemberProfile;
  trainerProfile?: TrainerProfile;
}

export interface MemberProfile {
  id: string;
  userId: string;
  memberId: string;
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'EXPIRED';
  assignedTrainerId?: string;
  assignedTrainer?: TrainerProfile;
  membershipPlanId?: string;
  membershipPlan?: MembershipPlan;
  membershipStartDate?: string;
  membershipExpiryDate?: string;
  attendances?: Attendance[];
  payments?: Payment[];
  workoutPlans?: WorkoutPlan[];
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    role: string;
  };
}

export interface TrainerProfile {
  id: string;
  userId: string;
  trainerId: string;
  fullName: string;
  phone: string;
  specialization: string;
  experienceYears: number;
  bio?: string;
  photoUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  assignedMembers?: MemberProfile[];
  workoutClasses?: WorkoutClass[];
  workoutPlans?: WorkoutPlan[];
  createdAt: string;
  user?: {
    email: string;
  };
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  durationMonths: number;
  price: number;
  benefits: string; // JSON string or comma-separated
  isActive: boolean;
  _count?: {
    members: number;
  };
}

export interface Attendance {
  id: string;
  memberProfileId: string;
  memberProfile?: {
    id: string;
    memberId: string;
    fullName: string;
    phone: string;
    status: string;
    membershipPlan?: { name: string };
  };
  date: string;
  checkInTime?: string;
  status: 'PRESENT' | 'ABSENT';
  notes?: string;
}

export interface WorkoutClass {
  id: string;
  title: string;
  trainerProfileId?: string;
  trainerProfile?: {
    id: string;
    fullName: string;
    trainerId: string;
    specialization: string;
  };
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxSlots: number;
  description?: string;
  roomOrArea: string;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  memberProfileId: string;
  memberProfile?: {
    id: string;
    fullName: string;
    memberId: string;
  };
  trainerProfileId?: string;
  trainerProfile?: {
    id: string;
    fullName: string;
    trainerId: string;
  };
  notes?: string;
  exercises: WorkoutExercise[];
  createdAt: string;
}

export interface WorkoutExercise {
  id?: string;
  workoutPlanId?: string;
  exerciseName: string;
  dayOfWeek: string;
  targetMuscle: string;
  sets: number;
  reps: string;
  weight?: string;
  restSeconds: number;
  order: number;
}

export interface Payment {
  id: string;
  receiptNo: string;
  memberProfileId: string;
  memberProfile: {
    id: string;
    memberId: string;
    fullName: string;
    phone: string;
    user?: { email: string };
  };
  membershipPlanId?: string;
  membershipPlan?: {
    id: string;
    name: string;
    price: number;
  };
  amount: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER';
  paymentDate: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING';
  notes?: string;
  recordedBy?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  targetRole: 'ALL' | 'MEMBER' | 'TRAINER';
  isPublished: boolean;
  publishedAt: string;
}

export interface GymSetting {
  id: string;
  gymName: string;
  ownerName: string;
  developerName: string;
  locationAddress: string;
  phone: string;
  email: string;
  openingHours: string;
  announcement?: string;
}

export interface DashboardStats {
  summary: {
    totalMembers: number;
    activeMembers: number;
    totalTrainers: number;
    expiringCount: number;
    todayAttendance: number;
    totalRevenue: number;
  };
  charts: {
    monthlyStats: { month: string; members: number; revenue: number }[];
    planDistribution: { name: string; value: number; price: number }[];
    attendanceTrends: { date: string; day: string; count: number }[];
  };
  recentMembers: any[];
  recentPayments: any[];
  expiringMemberships: any[];
}
