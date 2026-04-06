export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  role: string;
  active: boolean;
  dailyGoal: number;
  currentStreak: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMePayload {
  fullName?: string;
  dailyGoal?: number;
}
