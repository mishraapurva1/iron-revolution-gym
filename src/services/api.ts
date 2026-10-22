const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('iron_revolution_token');
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('iron_revolution_token', token);
  } else {
    localStorage.removeItem('iron_revolution_token');
  }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (payload: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request<any>('/auth/me'),

  // Members
  getMembers: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params || {}).toString();
    return request<any>(`/members${query ? `?${query}` : ''}`);
  },
  getMemberById: (id: string) => request<any>(`/members/${id}`),
  createMember: (payload: any) => request<any>('/members', { method: 'POST', body: JSON.stringify(payload) }),
  updateMember: (id: string, payload: any) => request<any>(`/members/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteMember: (id: string) => request<any>(`/members/${id}`, { method: 'DELETE' }),
  exportMembersCsvUrl: () => `${API_BASE}/members/export/csv`,

  // Trainers
  getTrainers: () => request<any>('/trainers'),
  getTrainerById: (id: string) => request<any>(`/trainers/${id}`),
  createTrainer: (payload: any) => request<any>('/trainers', { method: 'POST', body: JSON.stringify(payload) }),
  updateTrainer: (id: string, payload: any) => request<any>(`/trainers/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteTrainer: (id: string) => request<any>(`/trainers/${id}`, { method: 'DELETE' }),

  // Plans
  getPlans: () => request<any>('/membership-plans'),
  createPlan: (payload: any) => request<any>('/membership-plans', { method: 'POST', body: JSON.stringify(payload) }),
  updatePlan: (id: string, payload: any) => request<any>(`/membership-plans/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePlan: (id: string) => request<any>(`/membership-plans/${id}`, { method: 'DELETE' }),

  // Attendance
  getAttendance: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params || {}).toString();
    return request<any>(`/attendance${query ? `?${query}` : ''}`);
  },
  recordAttendance: (payload: any) => request<any>('/attendance', { method: 'POST', body: JSON.stringify(payload) }),
  updateAttendance: (id: string, payload: any) => request<any>(`/attendance/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  getMemberAttendanceHistory: (memberId: string) => request<any>(`/attendance/member/${memberId}`),

  // Timetable & Workouts
  getClasses: (day?: string) => request<any>(`/workout/classes${day ? `?dayOfWeek=${day}` : ''}`),
  createClass: (payload: any) => request<any>('/workout/classes', { method: 'POST', body: JSON.stringify(payload) }),
  updateClass: (id: string, payload: any) => request<any>(`/workout/classes/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteClass: (id: string) => request<any>(`/workout/classes/${id}`, { method: 'DELETE' }),

  getWorkoutPlans: (memberProfileId?: string) =>
    request<any>(`/workout/plans${memberProfileId ? `?memberProfileId=${memberProfileId}` : ''}`),
  createWorkoutPlan: (payload: any) => request<any>('/workout/plans', { method: 'POST', body: JSON.stringify(payload) }),
  updateWorkoutPlan: (id: string, payload: any) => request<any>(`/workout/plans/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteWorkoutPlan: (id: string) => request<any>(`/workout/plans/${id}`, { method: 'DELETE' }),

  // Payments
  getPayments: (params?: Record<string, any>) => {
    const query = new URLSearchParams(params || {}).toString();
    return request<any>(`/payments${query ? `?${query}` : ''}`);
  },
  createPayment: (payload: any) => request<any>('/payments', { method: 'POST', body: JSON.stringify(payload) }),
  getReceipt: (id: string) => request<any>(`/payments/${id}/receipt`),
  exportPaymentsCsvUrl: () => `${API_BASE}/payments/export/csv`,

  // Notices
  getNotices: () => request<any>('/notices'),
  createNotice: (payload: any) => request<any>('/notices', { method: 'POST', body: JSON.stringify(payload) }),
  updateNotice: (id: string, payload: any) => request<any>(`/notices/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteNotice: (id: string) => request<any>(`/notices/${id}`, { method: 'DELETE' }),

  // Reports
  getDashboardStats: () => request<any>('/reports/dashboard'),

  // Settings
  getSettings: () => request<any>('/settings'),
  updateSettings: (payload: any) => request<any>('/settings', { method: 'PUT', body: JSON.stringify(payload) }),
};
