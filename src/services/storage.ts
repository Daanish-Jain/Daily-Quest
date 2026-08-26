import { Task, Category, DayRecord, DailyScore, TaskStatus, Achievement, UserProfile } from '../types';

const STORAGE_KEYS = {
  TASKS: 'dailyquest_tasks_v2',
  CATEGORIES: 'dailyquest_categories_v2',
  DAY_RECORDS: 'dailyquest_day_records_v2',
  ACHIEVEMENTS: 'dailyquest_achievements_v2',
  USER_PROFILE: 'dailyquest_user_profile_v2',
  INITIALIZED: 'dailyquest_seed_v2_initialized'
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'study', name: 'Study', icon: '📖', color: '#5a7a67' }, // sage green
  { id: 'project', name: 'Project', icon: '⌘', color: '#8b6f4e' }, // warm bronze/umber
  { id: 'fitness', name: 'Fitness', icon: '🏋️', color: '#3d6e52' }, // deep forest
  { id: 'personal', name: 'Personal', icon: '🧠', color: '#c4823f' }, // warm gold
  { id: 'learning', name: 'Learning', icon: '▣', color: '#4a6fa5' }, // slate sapphire
  { id: 'other', name: 'Other', icon: '✦', color: '#8c7a6b' }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  level: 1,
  levelTitle: 'Novice Adventurer',
  currentXP: 0,
  nextLevelXP: 100,
  currentStreak: 0,
  bestStreak: 0,
  daysTracked: 0,
  missionsCompleted: 0,
  averageCompletion: 0
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_expedition',
    title: 'First Expedition',
    description: 'Complete your first day of planned quests.',
    icon: '🏕️',
    unlocked: true,
    unlockedAt: Date.now() - 1000 * 3600 * 24 * 180,
    rewardXP: 100,
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'seven_day_trail',
    title: 'Seven-Day Trail',
    description: 'Maintain an unbroken streak of 7 active days.',
    icon: '🔥',
    unlocked: true,
    unlockedAt: Date.now() - 1000 * 3600 * 24 * 120,
    rewardXP: 300,
    progress: 7,
    maxProgress: 7
  },
  {
    id: 'mountain_climber',
    title: 'Mountain Climber',
    description: 'Reach 90% or higher completion on any expedition.',
    icon: '🏔️',
    unlocked: true,
    unlockedAt: Date.now() - 1000 * 3600 * 24 * 60,
    rewardXP: 450,
    progress: 90,
    maxProgress: 90
  },
  {
    id: 'constellation_keeper',
    title: 'Constellation Keeper',
    description: 'Record over 100 unique days into your starry vault.',
    icon: '🌟',
    unlocked: true,
    unlockedAt: Date.now() - 1000 * 3600 * 24 * 10,
    rewardXP: 800,
    progress: 187,
    maxProgress: 100
  },
  {
    id: 'perfect_expedition',
    title: 'Perfect Expedition',
    description: 'Execute 100% of planned missions in a single day.',
    icon: '🏆',
    unlocked: true,
    unlockedAt: Date.now() - 1000 * 3600 * 24 * 3,
    rewardXP: 500,
    progress: 100,
    maxProgress: 100
  },
  {
    id: 'weekly_boss_slayer',
    title: 'Titan Defeater',
    description: 'Overpower a Weekly Boss with 80%+ execution rate.',
    icon: '⚔️',
    unlocked: false,
    rewardXP: 1000,
    progress: 78,
    maxProgress: 100
  },
  {
    id: 'master_ascendant',
    title: 'Master Ascendant',
    description: 'Reach Level 30 and unlock the Golden Horizon compass.',
    icon: '👑',
    unlocked: false,
    rewardXP: 1500,
    progress: 27,
    maxProgress: 30
  }
];

export function getTodayDateString(): string {
  const d = new Date();
  return formatDateString(d);
}

export function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDateString(d);
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDateString(d);
}

export function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string): {
  dayName: string;
  monthName: string;
  dayNumber: number;
  year: number;
  formatted: string;
  relativeLabel: string;
} {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();
  const yesterdayStr = getYesterdayDateString();

  let relativeLabel = '';
  if (dateStr === todayStr) relativeLabel = 'Today';
  else if (dateStr === tomorrowStr) relativeLabel = 'Tomorrow';
  else if (dateStr === yesterdayStr) relativeLabel = 'Yesterday';

  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const dayNumber = dateObj.getDate();
  const year = dateObj.getFullYear();
  const formatted = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return { dayName, monthName, dayNumber, year, formatted, relativeLabel };
}

export function calculateDailyScore(tasks: Task[], date: string): DailyScore {
  const dayTasks = tasks.filter(t => t.date === date);
  const total = dayTasks.length;
  let done = 0;
  let partial = 0;
  let incomplete = 0;
  let unmarked = 0;

  for (const t of dayTasks) {
    if (t.status === 'done') done++;
    else if (t.status === 'partial') partial++;
    else if (t.status === 'incomplete') incomplete++;
    else unmarked++;
  }

  // Formula: (Done * 100 + Partial * 50 + Incomplete * 0) / Total Tasks
  const scorePercentage = total > 0 ? Math.round((done * 100 + partial * 50) / total) : 0;
  const dayPower = Math.round(scorePercentage * 10); // e.g. 76% -> 760 / 1000 DP
  const evaluatedTasksCount = done + partial + incomplete;

  return {
    date,
    total,
    done,
    partial,
    incomplete,
    unmarked,
    scorePercentage,
    dayPower,
    evaluatedTasksCount
  };
}

export function generateHistoricalSeedData(): {
  tasks: Task[];
  dayRecords: DayRecord[];
} {
  const tasks: Task[] = [];
  const dayRecords: DayRecord[] = [];
  const today = new Date();

  const taskPool = [
    { title: 'Finish ML Assignment', category: 'Study', duration: '45 MIN', priority: 'high' as const },
    { title: 'Practice SQL & Indexing', category: 'Study', duration: '30 MIN', priority: 'medium' as const },
    { title: 'Work on SentinelDesk Architecture', category: 'Project', duration: '2 HRS', priority: 'high' as const },
    { title: 'Gym Workout & Mobility', category: 'Fitness', duration: '60 MIN', priority: 'medium' as const },
    { title: 'System Design: Distributed Consensus', category: 'Learning', duration: '40 MIN', priority: 'medium' as const },
    { title: 'Evening Reflection & Stargazing', category: 'Personal', duration: '15 MIN', priority: 'low' as const },
    { title: 'Refactor Core State Machine', category: 'Project', duration: '90 MIN', priority: 'high' as const },
    { title: 'Read 20 pages of Deep Work', category: 'Learning', duration: '30 MIN', priority: 'low' as const }
  ];

  // Generate 187 days of historical consistency (for authentic Year Ring & Constellation)
  for (let i = 187; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateString(d);

    const count = 4 + ((i * 3) % 4); // 4 to 7 tasks per day
    const dayTemplates = taskPool.slice(0, count);

    dayTemplates.forEach((tmpl, idx) => {
      let status: TaskStatus = 'done';
      const pseudoRand = (i * 13 + idx * 7) % 100;
      if (pseudoRand < 68) status = 'done';
      else if (pseudoRand < 85) status = 'partial';
      else status = 'incomplete';

      tasks.push({
        id: `seed-${dateStr}-${idx}`,
        date: dateStr,
        title: tmpl.title,
        category: tmpl.category,
        duration: tmpl.duration,
        priority: tmpl.priority,
        status,
        order: idx,
        createdAt: d.getTime() + idx * 60000,
        updatedAt: d.getTime() + idx * 60000 + 3600000
      });
    });

    dayRecords.push({
      date: dateStr,
      reflection: i % 4 === 0 ? 'High focus block in the morning. Great momentum maintained!' : undefined,
      reviewedAt: d.getTime() + 72000000
    });
  }

  // Today's Missions matching the moodboard exactly
  const todayStr = formatDateString(today);
  const todayMissions = [
    { title: 'Finish ML Assignment', category: 'Study', duration: '45 MIN', priority: 'high' as const, status: 'done' as const },
    { title: 'Practice SQL', category: 'Study', duration: '30 MIN', priority: 'medium' as const, status: 'partial' as const },
    { title: 'Work on SentinelDesk', category: 'Project', duration: '2 HRS', priority: 'high' as const, status: 'incomplete' as const },
    { title: 'Gym Workout', category: 'Fitness', duration: '60 MIN', priority: 'medium' as const, status: 'unmarked' as const },
    { title: 'Read Systems Research Paper', category: 'Learning', duration: '35 MIN', priority: 'low' as const, status: 'unmarked' as const }
  ];

  todayMissions.forEach((m, idx) => {
    tasks.push({
      id: `today-mission-${idx}`,
      date: todayStr,
      title: m.title,
      category: m.category,
      duration: m.duration,
      priority: m.priority,
      status: m.status,
      order: idx,
      createdAt: today.getTime() + idx * 60000,
      updatedAt: today.getTime() + idx * 60000
    });
  });

  // Tomorrow Starter Missions
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = formatDateString(tomorrow);
  const tomorrowMissions = [
    { title: 'Review SentinelDesk Pull Requests', category: 'Project', duration: '45 MIN', priority: 'high' as const },
    { title: 'Complete Graph Algorithms Problem Set', category: 'Study', duration: '60 MIN', priority: 'high' as const },
    { title: 'Outdoor Trail Run 5KM', category: 'Fitness', duration: '40 MIN', priority: 'medium' as const }
  ];

  tomorrowMissions.forEach((m, idx) => {
    tasks.push({
      id: `tomorrow-mission-${idx}`,
      date: tomorrowStr,
      title: m.title,
      category: m.category,
      duration: m.duration,
      priority: m.priority,
      status: 'unmarked' as const,
      order: idx,
      createdAt: tomorrow.getTime() + idx * 60000,
      updatedAt: tomorrow.getTime() + idx * 60000
    });
  });

  return { tasks, dayRecords };
}

export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      const { tasks, dayRecords } = generateHistoricalSeedData();
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEYS.DAY_RECORDS, JSON.stringify(dayRecords));
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(INITIAL_ACHIEVEMENTS));
      return tasks;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}

export function loadCategoriesFromStorage(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
  } catch (e) {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategoriesToStorage(cats: Category[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(cats));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
}

export function loadDayRecordsFromStorage(): DayRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAY_RECORDS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveDayRecordsToStorage(records: DayRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAY_RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save day records', e);
  }
}

export function loadAchievementsFromStorage(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return raw ? JSON.parse(raw) : INITIAL_ACHIEVEMENTS;
  } catch (e) {
    return INITIAL_ACHIEVEMENTS;
  }
}

export function saveAchievementsToStorage(achievements: Achievement[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (e) {
    console.error('Failed to save achievements', e);
  }
}
