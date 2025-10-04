// Dashboard types and interfaces
export interface DashboardStats {
  totalUsers: number;
  upcomingAppointments: number;
  completedSessions: number;
  totalCaloriesBurnt: number;
}

export interface User {
  _id: string;
  fullName: string;
  phone: string;
  gender: string;
  weight?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
  };
  isActive: boolean;
  createdAt: string;
}

export interface Appointment {
  _id: string;
  userId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  measurements?: {
    weight?: number;
    chest?: number;
    waist?: number;
    hips?: number;
  };
  caloriesBurnt?: number;
  sessionNotes?: string;
  createdAt: string;
  user?: User;
}

export interface Measurements {
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  caloriesBurnt: string;
  notes: string;
}

export interface LastFetchTime {
  users: number;
  appointments: number;
  stats: number;
}
