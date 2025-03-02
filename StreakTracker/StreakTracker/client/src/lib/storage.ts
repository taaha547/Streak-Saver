import { Activity, Streak, activitySchema, streakSchema } from "@shared/schema";
import { format, isToday, isYesterday } from "date-fns";

const ACTIVITIES_KEY = "activities";
const STREAK_KEY = "streak";

export function getActivities(): Activity[] {
  const stored = localStorage.getItem(ACTIVITIES_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.map(item => activitySchema.parse(item)) : [];
  } catch {
    return [];
  }
}

export function saveActivity(activity: Activity) {
  const activities = getActivities();
  activities.push(activity);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  updateStreak(activity.date);
}

export function editActivity(date: string, newContent: string) {
  const activities = getActivities();
  const index = activities.findIndex(a => a.date === date);
  if (index !== -1) {
    activities[index].content = newContent;
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  }
}

export function deleteActivity(date: string) {
  const activities = getActivities().filter(a => a.date !== date);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  // Recalculate streak if we deleted today's or a recent activity
  if (activities.length > 0) {
    const lastActivity = activities[activities.length - 1];
    updateStreak(lastActivity.date);
  } else {
    localStorage.removeItem(STREAK_KEY);
  }
}

export function getStreak(): Streak {
  const stored = localStorage.getItem(STREAK_KEY);
  const defaultStreak: Streak = { count: 0, lastActivityDate: null };

  if (!stored) return defaultStreak;

  try {
    return streakSchema.parse(JSON.parse(stored));
  } catch {
    return defaultStreak;
  }
}

function updateStreak(activityDate: string) {
  const streak = getStreak();
  const today = format(new Date(), 'yyyy-MM-dd');

  if (!streak.lastActivityDate) {
    streak.count = 1;
    streak.lastActivityDate = today;
  } else if (isToday(new Date(streak.lastActivityDate))) {
    // Already logged today, streak stays same
  } else if (isYesterday(new Date(streak.lastActivityDate))) {
    streak.count += 1;
    streak.lastActivityDate = today;
  } else {
    // Streak broken
    streak.count = 1;
    streak.lastActivityDate = today;
  }

  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

export function getActivityForDate(date: string): Activity | undefined {
  return getActivities().find(activity => activity.date === date);
}