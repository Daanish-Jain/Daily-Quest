import Dexie, { Table } from 'dexie';
import { Task, Category, DayRecord, Achievement, UserProfile } from '../types';
import { INITIAL_ACHIEVEMENTS, DEFAULT_CATEGORIES, INITIAL_USER_PROFILE } from './storage';

export interface JourneyData {
  id: 'main';
  startedAt: string | null;
  createdAt: number;
  lastBackupAt: number | null;
}

export class DailyQuestDB extends Dexie {
  tasks!: Table<Task, string>;
  dayRecords!: Table<DayRecord, string>;
  achievements!: Table<Achievement, string>;
  journey!: Table<JourneyData, string>;
  userProfile!: Table<UserProfile & { id: string }, string>;
  categories!: Table<Category, string>;

  constructor() {
    super('DailyQuestDB');
    this.version(1).stores({
      tasks: 'id, date, status', // Primary key and indexed props
      dayRecords: 'date',
      achievements: 'id',
      journey: 'id',
      userProfile: 'id',
      categories: 'id'
    });
  }
}

export const db = new DailyQuestDB();

// Helper to initialize or migrate data
export async function initializeDatabase() {
  const journey = await db.journey.get('main');
  
  if (!journey) {
    // Check if we have localStorage data to migrate
    const lsTasks = localStorage.getItem('dailyquest_tasks_v2');
    if (lsTasks) {
      try {
        const parsedTasks = JSON.parse(lsTasks);
        if (parsedTasks.length > 0) {
          await db.tasks.bulkPut(parsedTasks);
          // Set journey start to the earliest task
          const sorted = [...parsedTasks].sort((a, b) => a.date.localeCompare(b.date));
          await db.journey.put({ id: 'main', startedAt: sorted[0].date, createdAt: Date.now(), lastBackupAt: null });
        } else {
          await db.journey.put({ id: 'main', startedAt: null, createdAt: Date.now(), lastBackupAt: null });
        }
      } catch (e) {
        await db.journey.put({ id: 'main', startedAt: null, createdAt: Date.now(), lastBackupAt: null });
      }
    } else {
      // Complete fresh start
      await db.journey.put({ id: 'main', startedAt: null, createdAt: Date.now(), lastBackupAt: null });
    }

    // Categories
    const lsCategories = localStorage.getItem('dailyquest_categories_v2');
    if (lsCategories) {
      try {
        const parsed = JSON.parse(lsCategories);
        if (parsed.length > 0) await db.categories.bulkPut(parsed);
        else await db.categories.bulkPut(DEFAULT_CATEGORIES);
      } catch (e) {
        await db.categories.bulkPut(DEFAULT_CATEGORIES);
      }
    } else {
      await db.categories.bulkPut(DEFAULT_CATEGORIES);
    }

    // Achievements
    const lsAchievements = localStorage.getItem('dailyquest_achievements_v2');
    if (lsAchievements) {
      try {
        const parsed = JSON.parse(lsAchievements);
        if (parsed.length > 0) await db.achievements.bulkPut(parsed);
        else await db.achievements.bulkPut(INITIAL_ACHIEVEMENTS);
      } catch (e) {
        await db.achievements.bulkPut(INITIAL_ACHIEVEMENTS);
      }
    } else {
      await db.achievements.bulkPut(INITIAL_ACHIEVEMENTS);
    }

    // Day Records
    const lsDayRecords = localStorage.getItem('dailyquest_day_records_v2');
    if (lsDayRecords) {
      try {
        const parsed = JSON.parse(lsDayRecords);
        if (parsed.length > 0) await db.dayRecords.bulkPut(parsed);
      } catch (e) {}
    }

    // User Profile
    const lsUserProfile = localStorage.getItem('dailyquest_user_profile_v2');
    if (lsUserProfile) {
      try {
        const parsed = JSON.parse(lsUserProfile);
        await db.userProfile.put({ ...parsed, id: 'main' });
      } catch (e) {
        await db.userProfile.put({ ...INITIAL_USER_PROFILE, id: 'main' });
      }
    } else {
      await db.userProfile.put({ ...INITIAL_USER_PROFILE, id: 'main' });
    }
  }
}
