import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, initializeDatabase, JourneyData } from '../services/db';
import {
  Task,
  Category,
  DayRecord,
  TaskStatus,
  RoutePath,
  Achievement,
  UserProfile,
  AppNotification
} from '../types';
import {
  getTodayDateString,
  getTomorrowDateString,
  calculateDailyScore,
  DEFAULT_CATEGORIES,
  INITIAL_USER_PROFILE
} from '../services/storage';

interface AppContextType {
  isInitialized: boolean;
  currentRoute: RoutePath;
  setCurrentRoute: (route: RoutePath) => void;
  activeDate: string;
  setActiveDate: (date: string) => void;
  tasks: Task[];
  categories: Category[];
  dayRecords: DayRecord[];
  achievements: Achievement[];
  userProfile: UserProfile;
  journey: JourneyData | null;
  notifications: AppNotification[];
  historicalUnlocked: Record<string, boolean>;
  addTask: (taskData: {
    title: string;
    date: string;
    category?: string;
    duration?: string;
    priority?: 'low' | 'medium' | 'high';
    notes?: string;
  }) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (reorderedDateTasks: Task[]) => void;
  cycleTaskStatus: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  migrateIncompleteToTomorrow: (fromDate: string) => void;
  saveDayReflection: (date: string, reflection: string) => void;
  toggleHistoricalLock: (date: string) => void;
  isDateLocked: (date: string) => boolean;
  claimWeeklyBossRewards: () => void;
  bossRewardClaimed: boolean;
  addNotification: (notification: Omit<AppNotification, 'id'>) => void;
  dismissNotification: (id: string) => void;
  addCategory: (category: { name: string; icon: string; color: string }) => void;
  deleteCategory: (id: string) => void;
  resetAllData: () => void;
  exportDataJSON: () => Promise<string>;
  importDataJSON: (jsonStr: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<RoutePath>('/today');
  const [activeDate, setActiveDate] = useState<string>(getTodayDateString());
  const [historicalUnlocked, setHistoricalUnlocked] = useState<Record<string, boolean>>({});
  const [bossRewardClaimed, setBossRewardClaimed] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    initializeDatabase().then(() => {
      setIsInitialized(true);
    });
  }, []);

  // Use Dexie live queries to stay fully reactive with the database
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) || [];
  const categories = useLiveQuery(() => db.categories.toArray(), []) || DEFAULT_CATEGORIES;
  const dayRecords = useLiveQuery(() => db.dayRecords.toArray(), []) || [];
  const achievements = useLiveQuery(() => db.achievements.toArray(), []) || [];
  const journey = useLiveQuery(() => db.journey.get('main'), []) || null;
  const userProfileRaw = useLiveQuery(() => db.userProfile.get('main'), []) || INITIAL_USER_PROFILE;

  // We map the Dexie DB userProfile (which has id) back to just UserProfile type
  const userProfile: UserProfile = {
    level: userProfileRaw.level,
    levelTitle: userProfileRaw.levelTitle,
    currentXP: userProfileRaw.currentXP,
    nextLevelXP: userProfileRaw.nextLevelXP,
    currentStreak: userProfileRaw.currentStreak,
    bestStreak: userProfileRaw.bestStreak,
    daysTracked: userProfileRaw.daysTracked,
    missionsCompleted: userProfileRaw.missionsCompleted,
    averageCompletion: userProfileRaw.averageCompletion,
  };

  const addNotification = (notif: Omit<AppNotification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newNotif: AppNotification = { ...notif, id };
    setNotifications(prev => [...prev.slice(-3), newNotif]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const isDateLocked = (date: string): boolean => {
    const todayStr = getTodayDateString();
    const isPast = date < todayStr;
    if (!isPast) return false;
    return !historicalUnlocked[date];
  };

  const toggleHistoricalLock = (date: string) => {
    setHistoricalUnlocked(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // Helper to dynamically calculate stats based on Tasks
  const recalculateStatsAndJourney = async (updatedTasks: Task[]) => {
    if (!journey) return;

    let startedAt = journey.startedAt;
    
    // 1. Check Journey start date
    if (updatedTasks.length > 0) {
      const allDates = updatedTasks.map(t => t.date).sort();
      const firstDate = allDates[0];
      if (!startedAt || startedAt > firstDate) {
        startedAt = firstDate;
        await db.journey.update('main', { startedAt });
      }
    } else {
      // No tasks means journey hasn't really started
      startedAt = null;
      await db.journey.update('main', { startedAt: null });
    }

    // 2. Recalculate Streak, Days Tracked, Avg Completion
    if (startedAt) {
      // Get unique days that have at least one task
      const daysWithTasks = Array.from(new Set(updatedTasks.map(t => t.date))).sort();
      
      let streak = 0;
      let maxStreak = userProfileRaw.bestStreak;
      let totalScore = 0;
      let daysEvaluated = 0;
      
      const today = getTodayDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Calculate streak by going backwards from today
      let checkDate = new Date();
      
      let streakActive = true;
      let currentStreakCount = 0;
      
      for (let i = 0; i < 365; i++) {
        const dStr = checkDate.toISOString().split('T')[0];
        
        if (dStr > today) {
           // future, skip
        } else {
          // If this date has tasks
          if (daysWithTasks.includes(dStr)) {
            const score = calculateDailyScore(updatedTasks, dStr);
            if (score.scorePercentage >= 50) {
              currentStreakCount++;
            } else {
              if (dStr !== today) { // Missing a past day breaks it
                streakActive = false;
              }
            }
          } else {
             if (dStr !== today) {
                streakActive = false; // Empty past day breaks streak
             }
          }
        }
        
        if (!streakActive) break;
        checkDate.setDate(checkDate.getDate() - 1);
      }

      streak = currentStreakCount;
      if (streak > maxStreak) maxStreak = streak;

      daysWithTasks.forEach(date => {
        const score = calculateDailyScore(updatedTasks, date);
        totalScore += score.scorePercentage;
        daysEvaluated++;
      });
      
      const avgCompletion = daysEvaluated > 0 ? Math.round(totalScore / daysEvaluated) : 0;
      
      await db.userProfile.update('main', {
        currentStreak: streak,
        bestStreak: maxStreak,
        daysTracked: daysEvaluated,
        averageCompletion: avgCompletion
      });
    } else {
       await db.userProfile.update('main', {
        currentStreak: 0,
        daysTracked: 0,
        averageCompletion: 0
      });
    }
  };

  const addTask = async (taskData: {
    title: string;
    date: string;
    category?: string;
    duration?: string;
    priority?: 'low' | 'medium' | 'high';
    notes?: string;
  }) => {
    const newTask: Task = {
      id: 'quest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      date: taskData.date,
      title: taskData.title.trim(),
      notes: taskData.notes?.trim() || undefined,
      category: taskData.category || 'Study',
      duration: taskData.duration || '30 MIN',
      priority: taskData.priority || 'medium',
      status: 'unmarked',
      order: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    // Shift orders
    const dateTasks = tasks.filter(t => t.date === taskData.date);
    for (const t of dateTasks) {
       await db.tasks.update(t.id, { order: (t.order ?? 0) + 1 });
    }
    await db.tasks.add(newTask);
    
    const updatedTasks = await db.tasks.toArray();
    await recalculateStatsAndJourney(updatedTasks);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    await db.tasks.update(id, { ...updates, updatedAt: Date.now() });
    const updatedTasks = await db.tasks.toArray();
    await recalculateStatsAndJourney(updatedTasks);
  };

  const deleteTask = async (id: string) => {
    const taskToDelete = await db.tasks.get(id);
    if (!taskToDelete) return;

    await db.tasks.delete(id);
    const updatedTasks = await db.tasks.toArray();
    await recalculateStatsAndJourney(updatedTasks);

    addNotification({
      message: `Removed "${taskToDelete.title}"`,
      type: 'info',
      undoLabel: 'Undo',
      undoAction: () => {
        db.tasks.add(taskToDelete).then(() => {
           db.tasks.toArray().then(recalculateStatsAndJourney);
        });
      }
    });
  };

  const reorderTasks = async (reorderedDateTasks: Task[]) => {
    for (let i = 0; i < reorderedDateTasks.length; i++) {
      const t = reorderedDateTasks[i];
      await db.tasks.update(t.id, { order: i, updatedAt: Date.now() });
    }
  };

  const cycleTaskStatus = async (id: string) => {
    const current = await db.tasks.get(id);
    if (!current) return;

    const nextStatusMap: Record<TaskStatus, TaskStatus> = {
      unmarked: 'done',
      done: 'partial',
      partial: 'incomplete',
      incomplete: 'unmarked'
    };

    await setTaskStatus(id, nextStatusMap[current.status]);
  };

  const setTaskStatus = async (id: string, status: TaskStatus) => {
    const currentTask = await db.tasks.get(id);
    if (!currentTask) return;
    
    const wasDone = currentTask.status === 'done';
    const isDone = status === 'done';
    
    await db.tasks.update(id, { status, updatedAt: Date.now() });
    
    const allTasks = await db.tasks.toArray();
    
    // XP reward calculation
    if (isDone && !wasDone) {
      const addedXP = 50;
      let newXP = userProfile.currentXP + addedXP;
      let newLevel = userProfile.level;
      let nextLevelXP = userProfile.nextLevelXP;
      
      if (newXP >= nextLevelXP) {
        addNotification({
          message: `🎉 LEVEL UP! You reached Level ${newLevel + 1}!`,
          type: 'achievement'
        });
        newLevel += 1;
        newXP = newXP - nextLevelXP;
        nextLevelXP = Math.round(nextLevelXP * 1.25);
      }
      
      await db.userProfile.update('main', {
        level: newLevel,
        currentXP: newXP,
        nextLevelXP: nextLevelXP,
        missionsCompleted: userProfile.missionsCompleted + 1
      });
    }

    // Check for 100% daily completion celebration
    if (isDone) {
      const date = currentTask.date;
      const dayScore = calculateDailyScore(allTasks, date);
      if (dayScore.scorePercentage === 100 && dayScore.total > 0) {
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#c49a45', '#2d7a4f', '#d99b26', '#ffffff']
          });
        } catch (e) { }
      }
    }
    
    await recalculateStatsAndJourney(allTasks);
  };

  const migrateIncompleteToTomorrow = async (fromDate: string) => {
    const tomorrowStr = getTomorrowDateString();
    
    const incompleteTasks = tasks.filter(
      t => t.date === fromDate && (t.status === 'incomplete' || t.status === 'partial' || t.status === 'unmarked')
    );

    if (incompleteTasks.length === 0) return 0;

    const existingTomorrowTasks = tasks.filter(t => t.date === tomorrowStr);
    let maxOrder = existingTomorrowTasks.reduce((max, t) => Math.max(max, t.order ?? 0), -1);

    const newMigratedTasks: Task[] = incompleteTasks.map(t => {
      maxOrder += 1;
      return {
        ...t,
        id: 'quest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        date: tomorrowStr,
        status: 'unmarked',
        order: maxOrder,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
    });

    await db.tasks.bulkAdd(newMigratedTasks);
    
    addNotification({
      message: `Carried over ${newMigratedTasks.length} quest${newMigratedTasks.length > 1 ? 's' : ''} to tomorrow!`,
      type: 'success'
    });
    
    const updatedTasks = await db.tasks.toArray();
    await recalculateStatsAndJourney(updatedTasks);
    
    return newMigratedTasks.length;
  };

  const saveDayReflection = async (date: string, reflection: string) => {
    const existing = await db.dayRecords.get(date);
    if (existing) {
       await db.dayRecords.update(date, { reflection, reviewedAt: Date.now() });
    } else {
       await db.dayRecords.add({ date, reflection, reviewedAt: Date.now() });
    }
    
    addNotification({
      message: 'Expedition reflection logged to your journal!',
      type: 'success'
    });
  };

  const claimWeeklyBossRewards = () => {
    if (bossRewardClaimed) return;
    setBossRewardClaimed(true);
    db.userProfile.update('main', {
      currentXP: userProfile.currentXP + 500
    });
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#c49a45', '#f59e0b', '#10b981']
      });
    } catch (e) { }
    addNotification({
      message: '👑 Claimed 500 XP & Titan Conqueror Crest!',
      type: 'achievement'
    });
  };

  const addCategory = async (category: { name: string; icon: string; color: string }) => {
    const id = category.name.toLowerCase().replace(/\s+/g, '-');
    const newCat: Category = {
      id,
      name: category.name.trim(),
      icon: category.icon || '✦',
      color: category.color || '#c49a45'
    };
    await db.categories.add(newCat);
    addNotification({ message: `Added "${newCat.name}" domain`, type: 'success' });
  };

  const deleteCategory = async (id: string) => {
    const cats = await db.categories.toArray();
    if (cats.length <= 1) return;
    await db.categories.delete(id);
  };

  const resetAllData = async () => {
    await db.delete();
    localStorage.clear();
    window.location.reload();
  };

  const exportDataJSON = async (): Promise<string> => {
    const allTasks = await db.tasks.toArray();
    const allCategories = await db.categories.toArray();
    const allDayRecords = await db.dayRecords.toArray();
    const allAchievements = await db.achievements.toArray();
    const curJourney = await db.journey.get('main');
    const curUserProfile = await db.userProfile.get('main');
    
    if (curJourney) {
      await db.journey.update('main', { lastBackupAt: Date.now() });
      curJourney.lastBackupAt = Date.now();
    }
    
    return JSON.stringify({ 
      tasks: allTasks, 
      categories: allCategories, 
      dayRecords: allDayRecords, 
      userProfile: curUserProfile, 
      achievements: allAchievements,
      journey: curJourney
    }, null, 2);
  };

  const importDataJSON = async (jsonStr: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonStr);
      
      const proceed = window.confirm(
        "Are you sure you want to import this backup? This will overwrite your current expedition data."
      );
      if (!proceed) return false;

      await db.transaction('rw', [db.tasks, db.categories, db.dayRecords, db.userProfile, db.achievements, db.journey], async () => {
        if (Array.isArray(data.tasks)) { await db.tasks.clear(); await db.tasks.bulkAdd(data.tasks); }
        if (Array.isArray(data.categories)) { await db.categories.clear(); await db.categories.bulkAdd(data.categories); }
        if (Array.isArray(data.dayRecords)) { await db.dayRecords.clear(); await db.dayRecords.bulkAdd(data.dayRecords); }
        if (Array.isArray(data.achievements)) { await db.achievements.clear(); await db.achievements.bulkAdd(data.achievements); }
        if (data.userProfile) { await db.userProfile.put(data.userProfile); }
        if (data.journey) { await db.journey.put(data.journey); }
      });
      
      addNotification({ message: 'Expedition records imported!', type: 'success' });
      return true;
    } catch (e) {
      console.error("Import error:", e);
      addNotification({ message: 'Failed to import backup.', type: 'warning' });
      return false;
    }
  };

  if (!isInitialized) {
     return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#fdfbf7', color: 'var(--text-muted)'}}>Loading Journal...</div>;
  }

  return (
    <AppContext.Provider
      value={{
        isInitialized,
        currentRoute,
        setCurrentRoute,
        activeDate,
        setActiveDate,
        tasks,
        categories,
        dayRecords,
        achievements,
        userProfile,
        journey,
        notifications,
        historicalUnlocked,
        addTask,
        updateTask,
        deleteTask,
        reorderTasks,
        cycleTaskStatus,
        setTaskStatus,
        migrateIncompleteToTomorrow,
        saveDayReflection,
        toggleHistoricalLock,
        isDateLocked,
        claimWeeklyBossRewards,
        bossRewardClaimed,
        addNotification,
        dismissNotification,
        addCategory,
        deleteCategory,
        resetAllData,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
