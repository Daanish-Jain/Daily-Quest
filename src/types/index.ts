export type TaskStatus = 'unmarked' | 'done' | 'partial' | 'incomplete';
export type PriorityLevel = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  notes?: string;
  category: string; // e.g. "Study", "Project", "Fitness", "Personal", "Learning"
  priority?: PriorityLevel;
  duration?: string; // e.g. "45 MIN", "2 HRS", "30 MIN"
  estimatedMinutes?: number;
  status: TaskStatus;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji or symbol
  color: string; // Hex color code
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  reflection?: string;
  reviewedAt?: number;
  isCustomLocked?: boolean;
}

export interface DailyScore {
  date: string;
  total: number;
  done: number;
  partial: number;
  incomplete: number;
  unmarked: number;
  scorePercentage: number; // 0 to 100
  dayPower: number; // e.g. 750 / 1000
  evaluatedTasksCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  rewardXP: number;
  progress: number;
  maxProgress: number;
}

export interface UserProfile {
  level: number;
  levelTitle: string; // e.g. "Explorer", "Focus Seeker", "Pathfinder", "Master Ascendant"
  currentXP: number;
  nextLevelXP: number;
  currentStreak: number;
  bestStreak: number;
  daysTracked: number;
  missionsCompleted: number;
  averageCompletion: number;
}

export type RoutePath =
  | '/today'
  | '/tomorrow'
  | '/constellation'
  | '/progress'
  | '/history'
  | '/rewards'
  | '/archive'
  | '/settings';

export interface AppNotification {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'achievement';
  undoAction?: () => void;
  undoLabel?: string;
}
