// Local storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: 'dsa_play_user_progress',
  CHALLENGES_COMPLETED: 'dsa_play_challenges_completed',
  ACTIVITY_HISTORY: 'dsa_play_activity_history',
  ACHIEVEMENTS: 'dsa_play_achievements',
  STUDY_SCHEDULE: 'dsa_play_study_schedule',
  CODE_SNIPPETS: 'dsa_play_code_snippets',
};

// Types
export type UserProgress = {
  level: number;
  xp: number;
  nextLevelXp: number;
  topicsProgress: Record<string, number>; // topicId -> progress percentage
  subTopicsCompleted: string[]; // array of subtopic IDs
  problemsSolved: number;
  dailyStreak: number;
  lastActivityDate: string;
  skillScores: Record<string, number>; // category -> score
};

export type Challenge = {
  id: string;
  completed: boolean;
  attempts: number;
  bestTime?: number; // in seconds
  lastAttemptDate?: string;
  code?: string; // saved code
  language: 'python' | 'javascript';
};

export type ActivityEntry = {
  id: string;
  type: 'challenge' | 'topic' | 'achievement' | 'review';
  name: string;
  result: 'Solved' | 'Attempted' | 'Completed' | 'Unlocked' | 'In Progress';
  timestamp: number;
  details?: {
    category?: string;
    difficulty?: string;
    xpGained?: number;
    timeSpent?: number;
  };
};

export type Achievement = {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  dateCompleted?: string;
  progress?: number; // for in-progress achievements
  maxProgress?: number;
  icon: string;
};

export type StudySchedule = {
  day: string;
  focus: string;
  duration: number;
  completed?: boolean;
  lastCompleted?: string;
};

export type CodeSnippet = {
  id: string;
  name: string;
  language: 'python' | 'javascript';
  code: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
};

// Default initial values
const DEFAULT_USER_PROGRESS: UserProgress = {
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  topicsProgress: {},
  subTopicsCompleted: [],
  problemsSolved: 0,
  dailyStreak: 0,
  lastActivityDate: '',
  skillScores: {
    'Arrays & Strings': 10,
    'Linked Lists': 5,
    'Trees & Graphs': 0,
    'Dynamic Programming': 0,
    'Recursion & Backtracking': 0,
    'Sorting & Searching': 5,
  },
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { 
    id: 1, 
    name: "First Problem", 
    description: "Solve your first coding challenge", 
    completed: false, 
    icon: "🎯" 
  },
  { 
    id: 2, 
    name: "Consistency Champion", 
    description: "Maintain a 7-day learning streak", 
    completed: false, 
    progress: 0,
    maxProgress: 7,
    icon: "🔥" 
  },
  { 
    id: 3, 
    name: "Array Master", 
    description: "Solve 15 array-related problems", 
    completed: false, 
    progress: 0,
    maxProgress: 15,
    icon: "📊" 
  },
  { 
    id: 4, 
    name: "Quick Learner", 
    description: "Complete 5 topics in a week", 
    completed: false,
    progress: 0,
    maxProgress: 5,
    icon: "🚀" 
  },
  { 
    id: 5, 
    name: "Algorithmic Thinker", 
    description: "Solve 10 medium difficulty problems", 
    completed: false,
    progress: 0,
    maxProgress: 10,
    icon: "🧠" 
  },
  { 
    id: 6, 
    name: "Python Expert", 
    description: "Solve 20 problems in Python", 
    completed: false,
    progress: 0,
    maxProgress: 20,
    icon: "🐍" 
  },
];

const DEFAULT_STUDY_SCHEDULE: StudySchedule[] = [
  { day: "Monday", focus: "Arrays & Strings", duration: 60 },
  { day: "Tuesday", focus: "Rest Day", duration: 0 },
  { day: "Wednesday", focus: "Linked Lists", duration: 45 },
  { day: "Thursday", focus: "Trees & Graphs", duration: 60 },
  { day: "Friday", focus: "Dynamic Programming", duration: 30 },
  { day: "Saturday", focus: "Mixed Practice", duration: 90 },
  { day: "Sunday", focus: "Rest Day", duration: 0 }
];

// Helper functions for local storage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

// User progress functions
export const getUserProgress = (): UserProgress => {
  return getFromStorage<UserProgress>(STORAGE_KEYS.USER_PROGRESS, DEFAULT_USER_PROGRESS);
};

export const saveUserProgress = (progress: Partial<UserProgress>): UserProgress => {
  const currentProgress = getUserProgress();
  const updatedProgress = { ...currentProgress, ...progress };
  saveToStorage(STORAGE_KEYS.USER_PROGRESS, updatedProgress);
  return updatedProgress;
};

// Add XP and update level if needed
export const addXP = (xpAmount: number): UserProgress => {
  const progress = getUserProgress();
  
  let { xp, level, nextLevelXp } = progress;
  xp += xpAmount;
  
  // Check for level up
  while (xp >= nextLevelXp) {
    level += 1;
    xp -= nextLevelXp;
    nextLevelXp = Math.round(nextLevelXp * 1.5); // Increase XP needed for next level
  }
  
  const updatedProgress = saveUserProgress({ xp, level, nextLevelXp });
  return updatedProgress;
};

// Challenges functions
export const getCompletedChallenges = (): Record<string, Challenge> => {
  return getFromStorage<Record<string, Challenge>>(STORAGE_KEYS.CHALLENGES_COMPLETED, {});
};

export const saveChallenge = (challengeId: string, data: Partial<Challenge>): void => {
  const challenges = getCompletedChallenges();
  const currentChallenge = challenges[challengeId] || { 
    id: challengeId, 
    completed: false, 
    attempts: 0,
    language: 'python' 
  };
  
  challenges[challengeId] = { ...currentChallenge, ...data };
  saveToStorage(STORAGE_KEYS.CHALLENGES_COMPLETED, challenges);
};

export const completeChallenge = (challengeId: string, language: 'python' | 'javascript'): void => {
  const challenges = getCompletedChallenges();
  const currentChallenge = challenges[challengeId] || { id: challengeId, completed: false, attempts: 0, language };
  
  // Update challenge
  currentChallenge.completed = true;
  currentChallenge.attempts += 1;
  currentChallenge.lastAttemptDate = new Date().toISOString();
  challenges[challengeId] = currentChallenge;
  
  // Save to storage
  saveToStorage(STORAGE_KEYS.CHALLENGES_COMPLETED, challenges);
  
  // Update user progress
  const progress = getUserProgress();
  progress.problemsSolved += 1;
  saveUserProgress(progress);
  
  // Add activity
  addActivity({
    id: `challenge-${challengeId}-${Date.now()}`,
    type: 'challenge',
    name: challengeId, // This should be replaced with the actual challenge name
    result: 'Solved',
    timestamp: Date.now(),
    details: {
      xpGained: 25, // Default XP
    }
  });
  
  // Check streak
  updateStreak();
  
  // Check achievements
  checkAchievements();
};

// Activity history functions
export const getActivityHistory = (): ActivityEntry[] => {
  return getFromStorage<ActivityEntry[]>(STORAGE_KEYS.ACTIVITY_HISTORY, []);
};

export const addActivity = (activity: ActivityEntry): void => {
  const activities = getActivityHistory();
  activities.unshift(activity); // Add to beginning of array
  
  // Keep only the last 100 activities to avoid storage issues
  const trimmedActivities = activities.slice(0, 100);
  saveToStorage(STORAGE_KEYS.ACTIVITY_HISTORY, trimmedActivities);
};

// Streak functions
export const updateStreak = (): void => {
  const progress = getUserProgress();
  const today = new Date().toISOString().split('T')[0];
  
  if (!progress.lastActivityDate) {
    // First activity
    progress.dailyStreak = 1;
  } else {
    const lastDate = new Date(progress.lastActivityDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isYesterday = lastDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];
    const isToday = lastDate.toISOString().split('T')[0] === today;
    
    if (isYesterday) {
      // Continuing streak
      progress.dailyStreak += 1;
    } else if (!isToday) {
      // Streak broken
      progress.dailyStreak = 1;
    }
  }
  
  progress.lastActivityDate = today;
  saveUserProgress(progress);
  
  // Check streak achievement
  const achievements = getAchievements();
  const streakAchievement = achievements.find(a => a.id === 2); // Consistency Champion
  
  if (streakAchievement && !streakAchievement.completed) {
    streakAchievement.progress = progress.dailyStreak;
    if (progress.dailyStreak >= 7) {
      streakAchievement.completed = true;
      streakAchievement.dateCompleted = new Date().toISOString();
      
      addActivity({
        id: `achievement-${streakAchievement.id}-${Date.now()}`,
        type: 'achievement',
        name: streakAchievement.name,
        result: 'Unlocked',
        timestamp: Date.now()
      });
    }
    saveAchievements(achievements);
  }
};

// Achievement functions
export const getAchievements = (): Achievement[] => {
  return getFromStorage<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS);
};

export const saveAchievements = (achievements: Achievement[]): void => {
  saveToStorage(STORAGE_KEYS.ACHIEVEMENTS, achievements);
};

export const checkAchievements = (): void => {
  const progress = getUserProgress();
  const achievements = getAchievements();
  const completedChallenges = getCompletedChallenges();
  
  // First Problem achievement
  const firstProblemAchievement = achievements.find(a => a.id === 1);
  if (firstProblemAchievement && !firstProblemAchievement.completed && progress.problemsSolved > 0) {
    firstProblemAchievement.completed = true;
    firstProblemAchievement.dateCompleted = new Date().toISOString();
    
    addActivity({
      id: `achievement-${firstProblemAchievement.id}-${Date.now()}`,
      type: 'achievement',
      name: firstProblemAchievement.name,
      result: 'Unlocked',
      timestamp: Date.now()
    });
  }
  
  // Array Master achievement
  const arrayMasterAchievement = achievements.find(a => a.id === 3);
  if (arrayMasterAchievement) {
    // Count array problems (this logic would need to be enhanced to actually check the problem type)
    const arrayProblemsCount = Object.values(completedChallenges).filter(c => 
      c.completed && ['two-sum', 'three-sum', 'max-subarray', 'subarray-sum'].includes(c.id)
    ).length;
    
    arrayMasterAchievement.progress = arrayProblemsCount;
    
    if (arrayProblemsCount >= 15 && !arrayMasterAchievement.completed) {
      arrayMasterAchievement.completed = true;
      arrayMasterAchievement.dateCompleted = new Date().toISOString();
      
      addActivity({
        id: `achievement-${arrayMasterAchievement.id}-${Date.now()}`,
        type: 'achievement',
        name: arrayMasterAchievement.name,
        result: 'Unlocked',
        timestamp: Date.now()
      });
    }
  }
  
  // Python Expert achievement
  const pythonExpertAchievement = achievements.find(a => a.id === 6);
  if (pythonExpertAchievement) {
    const pythonProblemsCount = Object.values(completedChallenges).filter(c => 
      c.completed && c.language === 'python'
    ).length;
    
    pythonExpertAchievement.progress = pythonProblemsCount;
    
    if (pythonProblemsCount >= 20 && !pythonExpertAchievement.completed) {
      pythonExpertAchievement.completed = true;
      pythonExpertAchievement.dateCompleted = new Date().toISOString();
      
      addActivity({
        id: `achievement-${pythonExpertAchievement.id}-${Date.now()}`,
        type: 'achievement',
        name: pythonExpertAchievement.name,
        result: 'Unlocked',
        timestamp: Date.now()
      });
    }
  }
  
  saveAchievements(achievements);
};

// Study schedule functions
export const getStudySchedule = (): StudySchedule[] => {
  return getFromStorage<StudySchedule[]>(STORAGE_KEYS.STUDY_SCHEDULE, DEFAULT_STUDY_SCHEDULE);
};

export const saveStudySchedule = (schedule: StudySchedule[]): void => {
  saveToStorage(STORAGE_KEYS.STUDY_SCHEDULE, schedule);
};

export const markStudySessionCompleted = (day: string): void => {
  const schedule = getStudySchedule();
  const dayIndex = schedule.findIndex(s => s.day === day);
  
  if (dayIndex !== -1) {
    schedule[dayIndex].completed = true;
    schedule[dayIndex].lastCompleted = new Date().toISOString();
    saveStudySchedule(schedule);
    
    // Add activity
    addActivity({
      id: `study-${day}-${Date.now()}`,
      type: 'topic',
      name: schedule[dayIndex].focus,
      result: 'Completed',
      timestamp: Date.now(),
      details: {
        category: schedule[dayIndex].focus,
      }
    });
    
    // Add XP
    addXP(schedule[dayIndex].duration);
  }
};

// Code snippets functions
export const getCodeSnippets = (): CodeSnippet[] => {
  return getFromStorage<CodeSnippet[]>(STORAGE_KEYS.CODE_SNIPPETS, []);
};

export const saveCodeSnippet = (snippet: CodeSnippet): void => {
  const snippets = getCodeSnippets();
  const existingIndex = snippets.findIndex(s => s.id === snippet.id);
  
  if (existingIndex !== -1) {
    snippets[existingIndex] = {
      ...snippet,
      updatedAt: Date.now()
    };
  } else {
    snippets.push({
      ...snippet,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
  
  saveToStorage(STORAGE_KEYS.CODE_SNIPPETS, snippets);
};

// Calculate level progress percentage
export const getLevelProgressPercentage = (): number => {
  const { xp, nextLevelXp } = getUserProgress();
  return Math.min(Math.round((xp / nextLevelXp) * 100), 100);
};

// Initialize data (call on app load)
export const initializeUserData = (): void => {
  // Make sure we have default data for a new user
  if (!localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)) {
    saveUserProgress(DEFAULT_USER_PROGRESS);
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)) {
    saveAchievements(DEFAULT_ACHIEVEMENTS);
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.STUDY_SCHEDULE)) {
    saveStudySchedule(DEFAULT_STUDY_SCHEDULE);
  }
}; 