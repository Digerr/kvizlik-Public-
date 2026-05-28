import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  type Question,
  type League,
  getLeagueByScore,
  getLeagueProgress,
  POWER_UPS,
  ACHIEVEMENTS,
  AVATARS,
  DAILY_TASKS_TEMPLATE,
  THEMES,
  CHEST_TYPES,
  SURVIVAL_MILESTONES,
  DAILY_CHAIN,
} from "./quiz-data";
import {
  loadProfile,
  saveProfile,
  updateLeaderboard,
  getLeaderboard as getCloudLeaderboard,
  type LeaderboardRow,
} from "./supabase";

export type QuizPhase =
  | "home"
  | "category"
  | "game"
  | "result"
  | "leaderboard"
  | "profile"
  | "achievements"
  | "shop"
  | "daily"
  | "duel"
  | "duel_result"
  | "themes"
  | "chest"
  | "tournament"
  | "faq";

export interface DuelData {
  questions: string[];
  creatorScore: number;
  creatorName: string;
  creatorReactions: string[];
}

export interface DuelResult {
  myScore: number;
  opponentScore: number;
  opponentName: string;
  won: boolean;
}

export interface AnswerRecord {
  questionId: string;
  selectedOption: number;
  correctOption: number;
  timeSpent: number;
  isCorrect: boolean;
}

export interface PowerUpState {
  freeze: number;
  fiftyFifty: number;
  hint: number;
}

export interface DailyTaskProgress {
  id: string;
  name: string;
  description: string;
  emoji: string;
  target: number;
  reward: number;
  type: "games" | "correct" | "streak" | "category" | "duel";
  progress: number;
  claimed: boolean;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: number;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  avatarId: string;
  league: string;
  isPlayer?: boolean;
  telegramId?: number;
}

export interface ChestReward {
  type: "common" | "silver" | "gold";
  rewards: {
    coins: number;
    avatarId?: string;
  };
}

export interface QuizState {
  phase: QuizPhase;

  // Player profile
  playerName: string;
  telegramId: string | null;
  totalScore: number;
  totalXP: number;
  gamesPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  bestStreak: number;
  currentStreak: number;
  coins: number;
  level: number;
  currentLeague: string;
  avatarId: string;
  dailyStreak: number;
  lastDailyAt: string | null;
  seenQuestions: string[];
  categoriesPlayed: string[];

  // Power-ups
  powerUps: PowerUpState;
  activePowerUp: string | null;

  // Unlocks
  unlockedAvatars: string[];
  unlockedAchievements: UnlockedAchievement[];

  // Daily tasks
  dailyTasks: DailyTaskProgress[];
  dailyTasksDate: string | null;

  // Current game
  categoryId: string | null;
  difficulty: 1 | 2 | 3;
  questions: Question[];
  currentQuestionIndex: number;
  answers: AnswerRecord[];
  timePerQuestion: number;
  timerRemaining: number;
  selectedOption: number | null;
  isRevealed: boolean;
  isTimerRunning: boolean;
  isFiftyFiftyActive: boolean;
  fiftyFiftyRemoved: number[];
  isHintActive: boolean;
  freezeTimeRemaining: number;

  // AI mode
  aiMode: boolean;
  isGeneratingQuestions: boolean;

  // New achievement notifications
  newAchievements: string[];

  // Duel mode
  duelMode: boolean;
  duelData: DuelData | null;
  duelResult: DuelResult | null;
  creatorReactions: string[];

  // Cloud sync
  isCloudLoaded: boolean;
  isCloudSyncing: boolean;
  lastCloudSync: number;

  // Leaderboard (real from cloud)
  leaderboard: LeaderboardEntry[];

  // ===== NEW FEATURES =====

  // Themes
  currentTheme: string;
  unlockedThemes: string[];

  // Duels tracking
  duelsWon: number;
  duelsPlayed: number;

  // Chests
  pendingChest: ChestReward | null;
  gamesPlayedToday: number;
  gamesPlayedTodayDate: string | null;

  // Survival mode
  gameMode: "normal" | "survival";
  survivalRecord: number;

  // Daily chain (7-day)
  dailyChainDay: number;
  dailyChainCompleted: boolean[];
  dailyChainDate: string | null;

  // Season/League
  seasonScore: number;
  seasonStart: string | null;

  // Profile statistics
  categoryStats: Record<string, { played: number; correct: number }>;
  gamesByDay: Record<string, number>;

  // Tournament
  tournamentData: TournamentEntry[];
  tournamentWeekKey: string | null;

  // Actions
  setPhase: (phase: QuizPhase) => void;
  setPlayerName: (name: string) => void;
  setTelegramId: (id: string | null) => void;
  setAvatar: (avatarId: string) => void;
  setDifficulty: (d: 1 | 2 | 3) => void;
  startGame: (categoryId: string | null, questions: Question[], aiMode?: boolean, gameMode?: "normal" | "survival") => void;
  selectOption: (optionIndex: number) => void;
  revealAnswer: () => void;
  nextQuestion: () => void;
  tick: () => void;
  endGame: () => void;
  playAgain: () => void;
  setAiMode: (enabled: boolean) => void;
  setIsGeneratingQuestions: (generating: boolean) => void;
  addQuestions: (newQuestions: Question[]) => void;

  // Power-ups
  usePowerUp: (id: string) => void;
  buyPowerUp: (id: string) => boolean;

  // Shop
  buyAvatar: (id: string) => boolean;

  // Daily tasks
  refreshDailyTasks: () => void;
  updateDailyProgress: (type: string, amount: number) => void;
  claimDailyReward: (taskId: string) => void;

  // Achievements check
  checkAchievements: () => void;

  // Cloud sync actions
  syncToCloud: () => Promise<void>;
  syncFromCloud: () => Promise<void>;
  fetchLeaderboard: () => Promise<void>;

  // Duel actions
  startDuel: (questions: Question[]) => void;
  joinDuel: (duelData: DuelData, questions: Question[]) => void;
  finishDuelCreator: () => string;
  finishDuelChallenger: () => void;
  addCreatorReaction: (emoji: string) => void;

  // Theme actions
  setTheme: (themeId: string) => void;
  unlockTheme: (themeId: string) => void;
  checkThemeUnlocks: () => void;

  // Chest actions
  openChest: () => void;

  // Daily chain actions
  checkDailyChain: () => void;
  claimDailyChain: (day: number) => void;

  // Season actions
  checkSeason: () => void;

  // Tournament
  fetchTournament: () => Promise<void>;

  resetAll: () => void;
}

export interface TournamentEntry {
  rank: number;
  name: string;
  avatarId: string;
  score: number;
  isPlayer?: boolean;
}

function generateDailyTasks(): DailyTaskProgress[] {
  const shuffled = [...DAILY_TASKS_TEMPLATE].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).map((t, i) => ({
    id: `daily_${i}`,
    name: t.name,
    description: t.description,
    emoji: t.emoji,
    target: t.target,
    reward: t.reward,
    type: t.type,
    progress: 0,
    claimed: false,
  }));
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function calcLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

function calcXpForLevel(level: number): number {
  return (level - 1) * (level - 1) * 50;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getWeekKey(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneDay = 86400000;
  const dayOfYear = Math.floor(diff / oneDay);
  const weekNum = Math.ceil((dayOfYear + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function getBiweeklySeason(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneDay = 86400000;
  const dayOfYear = Math.floor(diff / oneDay);
  const weekNum = Math.ceil((dayOfYear + start.getDay() + 1) / 7);
  return Math.ceil(weekNum / 2);
}

const INITIAL_STATE = {
  phase: "home" as QuizPhase,
  playerName: "",
  telegramId: null as string | null,
  totalScore: 0,
  totalXP: 0,
  gamesPlayed: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  bestStreak: 0,
  currentStreak: 0,
  coins: 0,
  level: 1,
  currentLeague: "bronze",
  avatarId: "default",
  dailyStreak: 0,
  lastDailyAt: null as string | null,
  seenQuestions: [] as string[],
  categoriesPlayed: [] as string[],
  powerUps: { freeze: 1, fiftyFifty: 1, hint: 0 } as PowerUpState,
  activePowerUp: null as string | null,
  unlockedAvatars: ["default"] as string[],
  unlockedAchievements: [] as UnlockedAchievement[],
  dailyTasks: [] as DailyTaskProgress[],
  dailyTasksDate: null as string | null,
  categoryId: null as string | null,
  difficulty: 1 as 1 | 2 | 3,
  questions: [] as Question[],
  currentQuestionIndex: 0,
  answers: [] as AnswerRecord[],
  timePerQuestion: 15,
  timerRemaining: 15,
  selectedOption: null as number | null,
  isRevealed: false,
  isTimerRunning: false,
  isFiftyFiftyActive: false,
  fiftyFiftyRemoved: [] as number[],
  isHintActive: false,
  freezeTimeRemaining: 0,
  aiMode: false,
  isGeneratingQuestions: false,
  newAchievements: [] as string[],
  duelMode: false,
  duelData: null as DuelData | null,
  duelResult: null as DuelResult | null,
  creatorReactions: [] as string[],
  isCloudLoaded: false,
  isCloudSyncing: false,
  lastCloudSync: 0,
  leaderboard: [] as LeaderboardEntry[],
  // New features
  currentTheme: "neon",
  unlockedThemes: ["neon"] as string[],
  duelsWon: 0,
  duelsPlayed: 0,
  pendingChest: null as ChestReward | null,
  gamesPlayedToday: 0,
  gamesPlayedTodayDate: null as string | null,
  gameMode: "normal" as "normal" | "survival",
  survivalRecord: 0,
  dailyChainDay: 0,
  dailyChainCompleted: [false, false, false, false, false, false, false] as boolean[],
  dailyChainDate: null as string | null,
  seasonScore: 0,
  seasonStart: null as string | null,
  categoryStats: {} as Record<string, { played: number; correct: number }>,
  gamesByDay: {} as Record<string, number>,
  tournamentData: [] as TournamentEntry[],
  tournamentWeekKey: null as string | null,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setPhase: (phase) => set({ phase }),

      setPlayerName: (name) => set({ playerName: name }),
      setTelegramId: (id) => set({ telegramId: id }),
      setAvatar: (avatarId) => set({ avatarId }),
      setDifficulty: (d) => set({ difficulty: d }),

      // ===== CLOUD SYNC =====

      syncFromCloud: async () => {
        const state = get();
        const tid = state.telegramId;
        if (!tid) return;

        set({ isCloudSyncing: true });
        try {
          const profile = await loadProfile(Number(tid));
          if (profile) {
            const localState = {
              totalScore: state.totalScore,
              totalXP: state.totalXP,
              gamesPlayed: state.gamesPlayed,
              totalCorrect: state.totalCorrect,
              totalQuestions: state.totalQuestions,
              bestStreak: state.bestStreak,
              coins: state.coins,
              level: state.level,
              dailyStreak: state.dailyStreak,
            };

            // If cloud data is way ahead, just use cloud data entirely
            const shouldForceCloud = profile.level > localState.level + 2;

            const merged = shouldForceCloud ? {
              playerName: profile.player_name || state.playerName,
              avatarId: profile.avatar_id || state.avatarId,
              totalScore: profile.total_score,
              totalXP: profile.total_xp,
              gamesPlayed: profile.games_played,
              totalCorrect: profile.total_correct,
              totalQuestions: profile.total_questions,
              bestStreak: profile.best_streak,
              coins: profile.coins,
              level: profile.level,
              currentLeague: profile.current_league || state.currentLeague,
              dailyStreak: profile.daily_streak,
              lastDailyAt: profile.last_daily_at || state.lastDailyAt,
              unlockedAvatars: profile.unlocked_avatars?.length > 1 ? profile.unlocked_avatars : state.unlockedAvatars,
              unlockedAchievements: profile.unlocked_achievements?.length > 0 ? profile.unlocked_achievements : state.unlockedAchievements,
              powerUps: profile.power_ups || state.powerUps,
              seenQuestions: profile.seen_questions?.length > 0 ? profile.seen_questions : state.seenQuestions,
              categoriesPlayed: profile.categories_played?.length > 0 ? profile.categories_played : state.categoriesPlayed,
              currentTheme: (profile as any).current_theme || state.currentTheme,
              unlockedThemes: (profile as any).unlocked_themes?.length > 0 ? (profile as any).unlocked_themes : state.unlockedThemes,
              duelsWon: (profile as any).duels_won || 0,
              duelsPlayed: (profile as any).duels_played || 0,
              survivalRecord: (profile as any).survival_record || 0,
              seasonScore: (profile as any).season_score || 0,
              categoryStats: (profile as any).category_stats || state.categoryStats,
              gamesByDay: (profile as any).games_by_day || state.gamesByDay,
            } : {
              playerName: profile.player_name || state.playerName,
              avatarId: profile.avatar_id || state.avatarId,
              totalScore: Math.max(profile.total_score, localState.totalScore),
              totalXP: Math.max(profile.total_xp, localState.totalXP),
              gamesPlayed: Math.max(profile.games_played, localState.gamesPlayed),
              totalCorrect: Math.max(profile.total_correct, localState.totalCorrect),
              totalQuestions: Math.max(profile.total_questions, localState.totalQuestions),
              bestStreak: Math.max(profile.best_streak, localState.bestStreak),
              coins: Math.max(profile.coins, localState.coins),
              level: Math.max(profile.level, localState.level),
              currentLeague: profile.current_league || state.currentLeague,
              dailyStreak: Math.max(profile.daily_streak, localState.dailyStreak),
              lastDailyAt: profile.last_daily_at || state.lastDailyAt,
              unlockedAvatars: profile.unlocked_avatars?.length > 1 ? profile.unlocked_avatars : state.unlockedAvatars,
              unlockedAchievements: profile.unlocked_achievements?.length > 0 ? profile.unlocked_achievements : state.unlockedAchievements,
              powerUps: profile.power_ups || state.powerUps,
              seenQuestions: profile.seen_questions?.length > 0 ? profile.seen_questions : state.seenQuestions,
              categoriesPlayed: profile.categories_played?.length > 0 ? profile.categories_played : state.categoriesPlayed,
              // New fields from cloud
              currentTheme: (profile as any).current_theme || state.currentTheme,
              unlockedThemes: (profile as any).unlocked_themes?.length > 0 ? (profile as any).unlocked_themes : state.unlockedThemes,
              duelsWon: Math.max((profile as any).duels_won || 0, state.duelsWon),
              duelsPlayed: Math.max((profile as any).duels_played || 0, state.duelsPlayed),
              survivalRecord: Math.max((profile as any).survival_record || 0, state.survivalRecord),
              seasonScore: Math.max((profile as any).season_score || 0, state.seasonScore),
              categoryStats: (profile as any).category_stats || state.categoryStats,
              gamesByDay: (profile as any).games_by_day || state.gamesByDay,
            };

            set({
              ...merged,
              isCloudLoaded: true,
              isCloudSyncing: false,
            });
          } else {
            set({ isCloudLoaded: true, isCloudSyncing: false });
            await get().syncToCloud();
          }
        } catch (e) {
          console.error('Failed to sync from cloud:', e);
          set({ isCloudSyncing: false, isCloudLoaded: true });
        }
      },

      syncToCloud: async () => {
        const state = get();
        const tid = state.telegramId;
        if (!tid) return;

        // Don't sync until cloud data is loaded to prevent overwriting cloud with stale local data
        if (!state.isCloudLoaded) return;

        const now = Date.now();
        if (now - state.lastCloudSync < 2000) return;

        set({ isCloudSyncing: true, lastCloudSync: now });
        try {
          await saveProfile(Number(tid), {
            player_name: state.playerName || 'Игрок',
            avatar_id: state.avatarId,
            total_score: state.totalScore,
            total_xp: state.totalXP,
            level: state.level,
            coins: state.coins,
            games_played: state.gamesPlayed,
            total_correct: state.totalCorrect,
            total_questions: state.totalQuestions,
            best_streak: state.bestStreak,
            current_league: state.currentLeague,
            daily_streak: state.dailyStreak,
            last_daily_at: state.lastDailyAt,
            unlocked_avatars: state.unlockedAvatars,
            unlocked_achievements: state.unlockedAchievements as any,
            power_ups: state.powerUps,
            seen_questions: state.seenQuestions,
            categories_played: state.categoriesPlayed,
            current_theme: state.currentTheme,
            unlocked_themes: state.unlockedThemes,
            duels_won: state.duelsWon,
            duels_played: state.duelsPlayed,
            survival_record: state.survivalRecord,
            season_score: state.seasonScore,
            category_stats: state.categoryStats as any,
            games_by_day: state.gamesByDay as any,
          } as any);

          await updateLeaderboard(
            Number(tid),
            state.playerName || 'Игрок',
            state.avatarId,
            state.totalScore,
            state.currentLeague,
          );
        } catch (e) {
          console.error('Failed to sync to cloud:', e);
        }
        set({ isCloudSyncing: false });
      },

      fetchLeaderboard: async () => {
        try {
          const rows = await getCloudLeaderboard(50);
          const entries: LeaderboardEntry[] = rows.map((row) => ({
            name: row.player_name,
            score: row.score,
            avatarId: row.avatar_id,
            league: row.league,
            telegramId: row.telegram_id,
          }));
          set({ leaderboard: entries });
        } catch (e) {
          console.error('Failed to fetch leaderboard:', e);
        }
      },

      // ===== GAME ACTIONS =====

      startGame: (categoryId, questions, aiMode = false, gameMode = "normal") => {
        set({
          phase: "game",
          categoryId,
          questions,
          currentQuestionIndex: 0,
          answers: [],
          timerRemaining: 15,
          selectedOption: null,
          isRevealed: false,
          isTimerRunning: true,
          currentStreak: 0,
          isFiftyFiftyActive: false,
          fiftyFiftyRemoved: [],
          isHintActive: false,
          freezeTimeRemaining: 0,
          activePowerUp: null,
          aiMode,
          isGeneratingQuestions: false,
          gameMode,
          creatorReactions: [],
        });
      },

      selectOption: (optionIndex) => {
        const state = get();
        if (state.isRevealed) return;
        if (state.fiftyFiftyRemoved.includes(optionIndex)) return;
        set({ selectedOption: optionIndex });
      },

      revealAnswer: () => {
        const state = get();
        const question = state.questions[state.currentQuestionIndex];
        if (!question) return;

        const isCorrect = state.selectedOption === question.correctIndex;
        const timeSpent = state.timePerQuestion - state.timerRemaining;

        const answer: AnswerRecord = {
          questionId: question.id,
          selectedOption: state.selectedOption ?? -1,
          correctOption: question.correctIndex,
          timeSpent,
          isCorrect,
        };

        const newStreak = isCorrect ? state.currentStreak + 1 : 0;
        const newBestStreak = Math.max(state.bestStreak, newStreak);
        const newSeenQuestions = [...new Set([...state.seenQuestions, question.id])];

        let xpGain = 0;
        if (isCorrect) {
          xpGain = 10 + (question.difficulty * 5);
          if (timeSpent < 3) xpGain += 5;
        }

        // Update category stats
        const cat = question.category;
        const newCategoryStats = { ...state.categoryStats };
        if (!newCategoryStats[cat]) newCategoryStats[cat] = { played: 0, correct: 0 };
        newCategoryStats[cat] = {
          played: newCategoryStats[cat].played + 1,
          correct: newCategoryStats[cat].correct + (isCorrect ? 1 : 0),
        };

        set({
          isRevealed: true,
          isTimerRunning: false,
          isFiftyFiftyActive: false,
          fiftyFiftyRemoved: [],
          isHintActive: false,
          freezeTimeRemaining: 0,
          activePowerUp: null,
          answers: [...state.answers, answer],
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          totalXP: state.totalXP + xpGain,
          level: calcLevel(state.totalXP + xpGain),
          seenQuestions: newSeenQuestions,
          categoryStats: newCategoryStats,
        });

        // In survival mode, wrong answer = immediate game over
        if (state.gameMode === "survival" && !isCorrect) {
          setTimeout(() => get().endGame(), 1000);
        }
      },

      nextQuestion: () => {
        const state = get();
        const nextIndex = state.currentQuestionIndex + 1;

        if (nextIndex >= state.questions.length) {
          // In survival mode, we need more questions
          if (state.gameMode === "survival") {
            // Generate more questions for survival
            const { getMixedQuestions } = require("./quiz-data");
            const moreQs = getMixedQuestions(10, state.seenQuestions);
            if (moreQs.length > 0) {
              set({
                questions: [...state.questions, ...moreQs],
                currentQuestionIndex: nextIndex,
                timerRemaining: 15,
                selectedOption: null,
                isRevealed: false,
                isTimerRunning: true,
                isFiftyFiftyActive: false,
                fiftyFiftyRemoved: [],
                isHintActive: false,
                freezeTimeRemaining: 0,
                activePowerUp: null,
              });
            } else {
              get().endGame();
            }
          } else if (state.aiMode) {
            // AI mode generates more
            // The GameScreen will handle fetching
          } else {
            get().endGame();
          }
        } else {
          set({
            currentQuestionIndex: nextIndex,
            timerRemaining: 15,
            selectedOption: null,
            isRevealed: false,
            isTimerRunning: true,
            isFiftyFiftyActive: false,
            fiftyFiftyRemoved: [],
            isHintActive: false,
            freezeTimeRemaining: 0,
            activePowerUp: null,
          });
        }
      },

      tick: () => {
        const state = get();
        if (!state.isTimerRunning) return;

        if (state.freezeTimeRemaining > 0) {
          set({ freezeTimeRemaining: state.freezeTimeRemaining - 1 });
          return;
        }

        if (state.timerRemaining <= 0) {
          const question = state.questions[state.currentQuestionIndex];
          if (question && !state.isRevealed) {
            const answer: AnswerRecord = {
              questionId: question.id,
              selectedOption: state.selectedOption ?? -1,
              correctOption: question.correctIndex,
              timeSpent: state.timePerQuestion,
              isCorrect: false,
            };
            set({
              isRevealed: true,
              isTimerRunning: false,
              answers: [...state.answers, answer],
              currentStreak: 0,
            });
            // In survival mode, timeout = game over
            if (state.gameMode === "survival") {
              setTimeout(() => get().endGame(), 1000);
            }
          }
          return;
        }
        set({ timerRemaining: state.timerRemaining - 1 });
      },

      endGame: () => {
        const state = get();

        if (state.duelMode) {
          set({ phase: "result" });
          return;
        }

        const correctCount = state.answers.filter((a) => a.isCorrect).length;
        const totalQuestions = state.questions.length;
        const avgTime =
          state.answers.reduce((sum, a) => sum + a.timeSpent, 0) /
          (state.answers.length || 1);

        let roundScore = correctCount * 10;
        if (avgTime < 5) roundScore += 5;
        if (state.bestStreak >= 5) roundScore += 10;
        if (state.bestStreak >= 10) roundScore += 20;
        if (correctCount === totalQuestions && totalQuestions > 0) roundScore += 25;

        // Survival mode multiplier
        if (state.gameMode === "survival") {
          const multiplier = 1 + Math.floor(correctCount / 5) * 0.5;
          roundScore = Math.round(roundScore * Math.min(multiplier, 3));

          // Survival milestones
          for (const milestone of SURVIVAL_MILESTONES) {
            if (correctCount >= milestone.correct) {
              roundScore += milestone.coins;
            }
          }
        }

        let coinsEarned = Math.ceil(roundScore / 2);

        const newTotalScore = state.totalScore + roundScore;
        const newLeague = getLeagueByScore(newTotalScore);
        const newCategoriesPlayed = state.categoryId
          ? [...new Set([...state.categoriesPlayed, state.categoryId])]
          : state.categoriesPlayed;

        const today = getToday();
        let newDailyStreak = state.dailyStreak;
        if (state.lastDailyAt !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().slice(0, 10);
          newDailyStreak = state.lastDailyAt === yesterdayStr
            ? state.dailyStreak + 1
            : 1;
        }

        // Track games played today
        const newGamesPlayedTodayDate = today;
        const newGamesPlayedToday = state.gamesPlayedTodayDate === today
          ? state.gamesPlayedToday + 1
          : 1;

        // Track games by day
        const newGamesByDay = { ...state.gamesByDay };
        newGamesByDay[today] = (newGamesByDay[today] || 0) + 1;

        // Survival record
        const newSurvivalRecord = state.gameMode === "survival"
          ? Math.max(state.survivalRecord, correctCount)
          : state.survivalRecord;

        // Season score
        const newSeasonScore = state.seasonScore + roundScore;

        // Determine chest
        let pendingChest: ChestReward | null = null;

        // Common chest after every game
        const commonChest = CHEST_TYPES[0];
        const chestCoins = randomInt(commonChest.coinRange[0], commonChest.coinRange[1]);
        let chestAvatarId: string | undefined;
        if (Math.random() < commonChest.avatarChance) {
          const commonAvatars = AVATARS.filter(a => a.rarity === "common" && !state.unlockedAvatars.includes(a.id));
          if (commonAvatars.length > 0) {
            chestAvatarId = commonAvatars[Math.floor(Math.random() * commonAvatars.length)].id;
          }
        }
        pendingChest = { type: "common", rewards: { coins: chestCoins, avatarId: chestAvatarId } };

        // Silver chest for 5 games in a day
        if (newGamesPlayedToday >= 5 && newGamesPlayedToday % 5 === 0) {
          const silverChest = CHEST_TYPES[1];
          const silverCoins = randomInt(silverChest.coinRange[0], silverChest.coinRange[1]);
          let silverAvatarId: string | undefined;
          if (Math.random() < silverChest.avatarChance) {
            const rareAvatars = AVATARS.filter(a => a.rarity === "rare" && !state.unlockedAvatars.includes(a.id));
            if (rareAvatars.length > 0) {
              silverAvatarId = rareAvatars[Math.floor(Math.random() * rareAvatars.length)].id;
            }
          }
          // Replace with silver chest (better)
          pendingChest = { type: "silver", rewards: { coins: silverCoins, avatarId: silverAvatarId } };
        }

        // Gold chest for duel win will be handled in finishDuelChallenger

        set({
          totalScore: newTotalScore,
          gamesPlayed: state.gamesPlayed + 1,
          totalCorrect: state.totalCorrect + correctCount,
          totalQuestions: state.totalQuestions + totalQuestions,
          coins: state.coins + coinsEarned,
          currentLeague: newLeague.id,
          categoriesPlayed: newCategoriesPlayed,
          dailyStreak: newDailyStreak,
          lastDailyAt: today,
          gamesPlayedToday: newGamesPlayedToday,
          gamesPlayedTodayDate: newGamesPlayedTodayDate,
          gamesByDay: newGamesByDay,
          survivalRecord: newSurvivalRecord,
          seasonScore: newSeasonScore,
          pendingChest,
          phase: "chest",
        });

        get().updateDailyProgress("games", 1);
        get().updateDailyProgress("correct", correctCount);
        if (state.bestStreak >= 3) get().updateDailyProgress("streak", 1);
        if (state.categoryId) get().updateDailyProgress("category", 1);

        get().checkAchievements();
        get().checkThemeUnlocks();
        get().checkDailyChain();
        get().checkSeason();
        get().syncToCloud();
      },

      playAgain: () => {
        set({
          phase: "category",
          questions: [],
          currentQuestionIndex: 0,
          answers: [],
          timerRemaining: 15,
          selectedOption: null,
          isRevealed: false,
          isTimerRunning: false,
          currentStreak: 0,
          categoryId: null,
          isFiftyFiftyActive: false,
          fiftyFiftyRemoved: [],
          isHintActive: false,
          freezeTimeRemaining: 0,
          activePowerUp: null,
          aiMode: false,
          isGeneratingQuestions: false,
          duelMode: false,
          duelData: null,
          duelResult: null,
          gameMode: "normal",
          creatorReactions: [],
        });
      },

      setAiMode: (enabled) => set({ aiMode: enabled }),
      setIsGeneratingQuestions: (generating) => set({ isGeneratingQuestions: generating }),

      addQuestions: (newQuestions) => {
        const state = get();
        set({
          questions: [...state.questions, ...newQuestions],
          isGeneratingQuestions: false,
        });
      },

      usePowerUp: (id) => {
        const state = get();
        if (state.isRevealed) return;

        const pu = state.powerUps as PowerUpState;
        const key = id as keyof PowerUpState;
        if ((pu[key] || 0) <= 0) return;

        const newState: Partial<QuizState> = {
          powerUps: { ...pu, [key]: (pu[key] || 0) - 1 },
          activePowerUp: id,
        };

        if (id === "freeze") {
          newState.freezeTimeRemaining = 10;
        } else if (id === "fiftyFifty") {
          const question = state.questions[state.currentQuestionIndex];
          if (!question) return;
          const wrongOptions = question.options
            .map((_, i) => i)
            .filter((i) => i !== question.correctIndex);
          const shuffled = wrongOptions.sort(() => Math.random() - 0.5);
          const removed = shuffled.slice(0, 2);
          newState.isFiftyFiftyActive = true;
          newState.fiftyFiftyRemoved = removed;
          if (
            state.selectedOption !== null &&
            removed.includes(state.selectedOption)
          ) {
            newState.selectedOption = null;
          }
        } else if (id === "hint") {
          newState.isHintActive = true;
        }

        set(newState as any);
      },

      buyPowerUp: (id) => {
        const state = get();
        const pu = POWER_UPS.find((p) => p.id === id);
        if (!pu) return false;
        if (state.coins < pu.price) return false;
        const key = id as keyof PowerUpState;
        set({
          coins: state.coins - pu.price,
          powerUps: {
            ...state.powerUps,
            [key]: (state.powerUps[key] || 0) + 1,
          },
        });
        get().syncToCloud();
        return true;
      },

      buyAvatar: (id) => {
        const state = get();
        const avatar = AVATARS.find((a) => a.id === id);
        if (!avatar) return false;
        if (state.unlockedAvatars.includes(id)) return false;
        if (state.coins < avatar.price) return false;
        set({
          coins: state.coins - avatar.price,
          unlockedAvatars: [...state.unlockedAvatars, id],
          avatarId: id,
        });
        get().syncToCloud();
        return true;
      },

      refreshDailyTasks: () => {
        const state = get();
        const today = getToday();
        if (state.dailyTasksDate !== today) {
          set({
            dailyTasks: generateDailyTasks(),
            dailyTasksDate: today,
          });
        }
      },

      updateDailyProgress: (type, amount) => {
        const state = get();
        const updated = state.dailyTasks.map((t) =>
          t.type === type && !t.claimed
            ? { ...t, progress: Math.min(t.progress + amount, t.target) }
            : t
        );
        set({ dailyTasks: updated });
      },

      claimDailyReward: (taskId) => {
        const state = get();
        const task = state.dailyTasks.find((t) => t.id === taskId);
        if (!task || task.progress < task.target || task.claimed) return;
        const updated = state.dailyTasks.map((t) =>
          t.id === taskId ? { ...t, claimed: true } : t
        );
        set({
          dailyTasks: updated,
          coins: state.coins + task.reward,
        });
        get().syncToCloud();
      },

      checkAchievements: () => {
        const state = get();
        const unlocked = new Set(state.unlockedAchievements.map((a) => a.id));
        const newAchs: UnlockedAchievement[] = [];
        const now = Date.now();

        for (const ach of ACHIEVEMENTS) {
          if (unlocked.has(ach.id)) continue;
          let earned = false;

          switch (ach.id) {
            case "first_game": earned = state.gamesPlayed >= 1; break;
            case "ten_games": earned = state.gamesPlayed >= 10; break;
            case "fifty_games": earned = state.gamesPlayed >= 50; break;
            case "streak_3": earned = state.bestStreak >= 3; break;
            case "streak_5": earned = state.bestStreak >= 5; break;
            case "streak_10": earned = state.bestStreak >= 10; break;
            case "perfect": {
              const lastGame = state.answers.slice(-state.questions.length);
              earned = lastGame.length > 0 && lastGame.every((a) => a.isCorrect);
              break;
            }
            case "speed_demon": {
              earned = state.answers.some((a) => a.isCorrect && a.timeSpent <= 3);
              break;
            }
            case "league_silver": earned = state.totalScore >= 50; break;
            case "league_gold": earned = state.totalScore >= 150; break;
            case "league_platinum": earned = state.totalScore >= 350; break;
            case "league_diamond": earned = state.totalScore >= 700; break;
            case "daily_3": earned = state.dailyStreak >= 3; break;
            case "daily_7": earned = state.dailyStreak >= 7; break;
            case "daily_30": earned = state.dailyStreak >= 30; break;
            case "category_all": earned = state.categoriesPlayed.length >= 10; break;
            case "coins_100": earned = state.coins >= 100; break;
            case "level_5": earned = state.level >= 5; break;
            case "level_10": earned = state.level >= 10; break;
            case "hundred_correct": earned = state.totalCorrect >= 100; break;
            case "survival_10": earned = state.survivalRecord >= 10; break;
            case "survival_20": earned = state.survivalRecord >= 20; break;
            case "survival_50": earned = state.survivalRecord >= 50; break;
            case "duel_winner_10": earned = state.duelsWon >= 10; break;
            case "hundred_games": earned = state.gamesPlayed >= 100; break;
            case "streak_15": earned = state.bestStreak >= 15; break;
            case "streak_20": earned = state.bestStreak >= 20; break;
            case "coins_500": earned = state.coins >= 500; break;
            case "coins_1000": earned = state.coins >= 1000; break;
            case "level_15": earned = state.level >= 15; break;
            case "level_25": earned = state.level >= 25; break;
            case "five_hundred_correct": earned = state.totalCorrect >= 500; break;
            case "thousand_correct": earned = state.totalCorrect >= 1000; break;
            case "duel_first": earned = (state as any).duelsPlayed >= 1; break;
            case "duel_master": earned = (state as any).duelsWon >= 25; break;
            case "theme_collector": earned = (state as any).unlockedThemes?.length >= 4; break;
          }

          if (earned) {
            newAchs.push({ id: ach.id, unlockedAt: now });
          }
        }

        if (newAchs.length > 0) {
          const totalReward = newAchs.reduce((sum, a) => {
            const achData = ACHIEVEMENTS.find((ad) => ad.id === a.id);
            return sum + (achData?.reward || 0);
          }, 0);

          set({
            unlockedAchievements: [...state.unlockedAchievements, ...newAchs],
            newAchievements: [
              ...state.newAchievements,
              ...newAchs.map((a) => a.id),
            ],
            coins: state.coins + totalReward,
          });
        }
      },

      startDuel: (questions) => {
        set({
          phase: 'game',
          duelMode: true,
          categoryId: null,
          questions,
          currentQuestionIndex: 0,
          answers: [],
          timerRemaining: 15,
          selectedOption: null,
          isRevealed: false,
          isTimerRunning: true,
          currentStreak: 0,
          isFiftyFiftyActive: false,
          fiftyFiftyRemoved: [],
          isHintActive: false,
          freezeTimeRemaining: 0,
          activePowerUp: null,
          gameMode: "normal",
          creatorReactions: [],
        });
      },

      joinDuel: (duelData, questions) => {
        set({
          phase: 'game',
          duelMode: true,
          duelData,
          categoryId: null,
          questions,
          currentQuestionIndex: 0,
          answers: [],
          timerRemaining: 15,
          selectedOption: null,
          isRevealed: false,
          isTimerRunning: true,
          currentStreak: 0,
          isFiftyFiftyActive: false,
          fiftyFiftyRemoved: [],
          isHintActive: false,
          freezeTimeRemaining: 0,
          activePowerUp: null,
          gameMode: "normal",
          creatorReactions: [],
        });
      },

      addCreatorReaction: (emoji) => {
        const state = get();
        set({ creatorReactions: [...state.creatorReactions, emoji] });
      },

      finishDuelCreator: () => {
        const state = get();
        const correctCount = state.answers.filter((a) => a.isCorrect).length;
        const questionIds = state.questions.map((q) => q.id);
        const creatorName = state.playerName || 'Игрок';

        const duelData: DuelData = {
          questions: questionIds,
          creatorScore: correctCount,
          creatorName,
          creatorReactions: state.creatorReactions,
        };

        const encoded = btoa(encodeURIComponent(JSON.stringify(duelData)));
        const shareLink = `https://kvizlik-public.vercel.app/?duel=${encoded}`;

        const roundScore = correctCount * 10;
        const coinsEarned = Math.ceil(roundScore / 2);
        const newTotalScore = state.totalScore + roundScore;
        const newLeague = getLeagueByScore(newTotalScore);
        const today = getToday();
        let newDailyStreak = state.dailyStreak;
        if (state.lastDailyAt !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().slice(0, 10);
          newDailyStreak = state.lastDailyAt === yesterdayStr
            ? state.dailyStreak + 1
            : 1;
        }

        // Determine chest for duel creator
        const commonChest = CHEST_TYPES[0];
        const chestCoins = randomInt(commonChest.coinRange[0], commonChest.coinRange[1]);
        let chestAvatarId: string | undefined;
        if (Math.random() < commonChest.avatarChance) {
          const commonAvatars = AVATARS.filter(a => a.rarity === "common" && !state.unlockedAvatars.includes(a.id));
          if (commonAvatars.length > 0) {
            chestAvatarId = commonAvatars[Math.floor(Math.random() * commonAvatars.length)].id;
          }
        }

        const newGamesByDay = { ...state.gamesByDay };
        newGamesByDay[today] = (newGamesByDay[today] || 0) + 1;

        set({
          duelMode: true,
          duelData,
          totalScore: newTotalScore,
          gamesPlayed: state.gamesPlayed + 1,
          totalCorrect: state.totalCorrect + correctCount,
          totalQuestions: state.totalQuestions + state.questions.length,
          coins: state.coins + coinsEarned,
          currentLeague: newLeague.id,
          dailyStreak: newDailyStreak,
          lastDailyAt: today,
          duelsPlayed: state.duelsPlayed + 1,
          gamesByDay: newGamesByDay,
          pendingChest: { type: "common", rewards: { coins: chestCoins, avatarId: chestAvatarId } },
          phase: 'result',
        });

        get().updateDailyProgress('games', 1);
        get().updateDailyProgress('correct', correctCount);
        get().updateDailyProgress('duel', 1);
        get().checkAchievements();
        get().checkThemeUnlocks();
        get().syncToCloud();

        return shareLink;
      },

      finishDuelChallenger: () => {
        const state = get();
        const correctCount = state.answers.filter((a) => a.isCorrect).length;
        const opponentScore = state.duelData?.creatorScore ?? 0;
        const opponentName = state.duelData?.creatorName ?? 'Соперник';
        const won = correctCount > opponentScore;

        const roundScore = correctCount * 10;
        const bonusCoins = won ? 20 : 0;
        const coinsEarned = Math.ceil(roundScore / 2) + bonusCoins;
        const newTotalScore = state.totalScore + roundScore;
        const newLeague = getLeagueByScore(newTotalScore);
        const today = getToday();
        let newDailyStreak = state.dailyStreak;
        if (state.lastDailyAt !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().slice(0, 10);
          newDailyStreak = state.lastDailyAt === yesterdayStr
            ? state.dailyStreak + 1
            : 1;
        }

        // Track duels won
        const newDuelsWon = won ? state.duelsWon + 1 : state.duelsWon;
        const newDuelsPlayed = state.duelsPlayed + 1;

        // Gold chest for duel win
        let pendingChest: ChestReward | null = null;
        const commonChest = CHEST_TYPES[0];
        const chestCoins = randomInt(commonChest.coinRange[0], commonChest.coinRange[1]);
        let chestAvatarId: string | undefined;

        if (won) {
          const goldChest = CHEST_TYPES[2];
          const goldCoins = randomInt(goldChest.coinRange[0], goldChest.coinRange[1]);
          if (Math.random() < goldChest.avatarChance) {
            const epicAvatars = AVATARS.filter(a => a.rarity === "epic" && !state.unlockedAvatars.includes(a.id));
            if (epicAvatars.length > 0) {
              chestAvatarId = epicAvatars[Math.floor(Math.random() * epicAvatars.length)].id;
            }
          }
          pendingChest = { type: "gold", rewards: { coins: goldCoins, avatarId: chestAvatarId } };
        } else {
          if (Math.random() < commonChest.avatarChance) {
            const commonAvatars = AVATARS.filter(a => a.rarity === "common" && !state.unlockedAvatars.includes(a.id));
            if (commonAvatars.length > 0) {
              chestAvatarId = commonAvatars[Math.floor(Math.random() * commonAvatars.length)].id;
            }
          }
          pendingChest = { type: "common", rewards: { coins: chestCoins, avatarId: chestAvatarId } };
        }

        const newGamesByDay = { ...state.gamesByDay };
        newGamesByDay[today] = (newGamesByDay[today] || 0) + 1;

        set({
          duelResult: {
            myScore: correctCount,
            opponentScore,
            opponentName,
            won,
          },
          totalScore: newTotalScore,
          gamesPlayed: state.gamesPlayed + 1,
          totalCorrect: state.totalCorrect + correctCount,
          totalQuestions: state.totalQuestions + state.questions.length,
          coins: state.coins + coinsEarned,
          currentLeague: newLeague.id,
          dailyStreak: newDailyStreak,
          lastDailyAt: today,
          duelsWon: newDuelsWon,
          duelsPlayed: newDuelsPlayed,
          gamesByDay: newGamesByDay,
          pendingChest,
          phase: 'duel_result',
        });

        get().updateDailyProgress('games', 1);
        get().updateDailyProgress('correct', correctCount);
        get().updateDailyProgress('duel', 1);
        if (won) get().updateDailyProgress('duel', 1); // extra for win task
        get().checkAchievements();
        get().checkThemeUnlocks();
        get().syncToCloud();
      },

      // ===== THEME ACTIONS =====

      setTheme: (themeId) => {
        const state = get();
        if (!state.unlockedThemes.includes(themeId)) return;
        set({ currentTheme: themeId });
        get().syncToCloud();
      },

      unlockTheme: (themeId) => {
        const state = get();
        if (state.unlockedThemes.includes(themeId)) return;
        set({ unlockedThemes: [...state.unlockedThemes, themeId] });
        get().syncToCloud();
      },

      checkThemeUnlocks: () => {
        const state = get();
        for (const theme of THEMES) {
          if (state.unlockedThemes.includes(theme.id)) continue;
          let shouldUnlock = false;
          switch (theme.unlockCondition) {
            case "default": shouldUnlock = true; break;
            case "level": shouldUnlock = state.level >= theme.unlockValue; break;
            case "coins": shouldUnlock = state.coins >= theme.unlockValue; break;
            case "duels": shouldUnlock = state.duelsWon >= theme.unlockValue; break;
            case "streak": shouldUnlock = state.dailyStreak >= theme.unlockValue; break;
          }
          if (shouldUnlock) {
            get().unlockTheme(theme.id);
          }
        }
      },

      // ===== CHEST ACTIONS =====

      openChest: () => {
        const state = get();
        if (!state.pendingChest) return;

        const chest = state.pendingChest;
        let newUnlockedAvatars = [...state.unlockedAvatars];
        if (chest.rewards.avatarId && !newUnlockedAvatars.includes(chest.rewards.avatarId)) {
          newUnlockedAvatars.push(chest.rewards.avatarId);
        }

        set({
          coins: state.coins + chest.rewards.coins,
          unlockedAvatars: newUnlockedAvatars,
          pendingChest: null,
          phase: "result",
        });

        get().syncToCloud();
      },

      // ===== DAILY CHAIN =====

      checkDailyChain: () => {
        const state = get();
        const today = getToday();

        // Reset if missed a day
        if (state.dailyChainDate) {
          const lastDate = new Date(state.dailyChainDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / 86400000);
          if (diffDays > 1) {
            // Missed a day, reset chain
            set({
              dailyChainDay: 0,
              dailyChainCompleted: [false, false, false, false, false, false, false],
              dailyChainDate: today,
            });
            return;
          }
        }

        if (state.dailyChainDate !== today) {
          set({ dailyChainDate: today });
        }
      },

      claimDailyChain: (day: number) => {
        const state = get();
        if (day !== state.dailyChainDay) return;
        if (state.dailyChainCompleted[day]) return;

        const chainData = DAILY_CHAIN[day];
        if (!chainData) return;

        const newCompleted = [...state.dailyChainCompleted];
        newCompleted[day] = true;

        // Award rewards
        if (chainData.rewardType === "coins" && chainData.reward > 0) {
          set({
            dailyChainCompleted: newCompleted,
            dailyChainDay: day + 1,
            coins: state.coins + chainData.reward,
          });
        } else if (chainData.rewardType === "silver_chest") {
          // Award silver chest
          const silverChest = CHEST_TYPES[1];
          const silverCoins = randomInt(silverChest.coinRange[0], silverChest.coinRange[1]);
          let silverAvatarId: string | undefined;
          if (Math.random() < silverChest.avatarChance) {
            const rareAvatars = AVATARS.filter(a => a.rarity === "rare" && !state.unlockedAvatars.includes(a.id));
            if (rareAvatars.length > 0) {
              silverAvatarId = rareAvatars[Math.floor(Math.random() * rareAvatars.length)].id;
            }
          }
          set({
            dailyChainCompleted: newCompleted,
            dailyChainDay: day + 1,
            pendingChest: { type: "silver", rewards: { coins: silverCoins, avatarId: silverAvatarId } },
            phase: "chest",
          });
        }

        get().syncToCloud();
      },

      // ===== SEASON =====

      checkSeason: () => {
        const state = get();
        const currentSeason = getBiweeklySeason();
        const currentSeasonStart = `${new Date().getFullYear()}-S${currentSeason}`;

        if (state.seasonStart !== currentSeasonStart) {
          set({
            seasonStart: currentSeasonStart,
            seasonScore: 0,
          });
        }
      },

      // ===== TOURNAMENT =====

      fetchTournament: async () => {
        const state = get();
        const weekKey = getWeekKey();
        set({ tournamentWeekKey: weekKey });

        try {
          const { supabase } = await import('./supabase');
          const { data, error } = await supabase
            .from('weekly_leaderboard')
            .select('*')
            .eq('week_key', weekKey)
            .order('score', { ascending: false })
            .limit(10);

          if (!error && data) {
            const entries: TournamentEntry[] = data.map((row: any, i: number) => ({
              rank: i + 1,
              name: row.player_name,
              avatarId: row.avatar_id,
              score: row.score,
              isPlayer: row.telegram_id === Number(state.telegramId),
            }));
            set({ tournamentData: entries });
          }
        } catch (e) {
          console.error('Failed to fetch tournament:', e);
        }
      },

      resetAll: () => set(INITIAL_STATE),
    }),
    {
      name: "kvizlik-storage",
      partialize: (state) => ({
        playerName: state.playerName,
        telegramId: state.telegramId,
        totalScore: state.totalScore,
        totalXP: state.totalXP,
        gamesPlayed: state.gamesPlayed,
        totalCorrect: state.totalCorrect,
        totalQuestions: state.totalQuestions,
        bestStreak: state.bestStreak,
        coins: state.coins,
        level: state.level,
        currentLeague: state.currentLeague,
        avatarId: state.avatarId,
        dailyStreak: state.dailyStreak,
        lastDailyAt: state.lastDailyAt,
        seenQuestions: state.seenQuestions,
        categoriesPlayed: state.categoriesPlayed,
        powerUps: state.powerUps,
        unlockedAvatars: state.unlockedAvatars,
        unlockedAchievements: state.unlockedAchievements,
        dailyTasks: state.dailyTasks,
        dailyTasksDate: state.dailyTasksDate,
        isCloudLoaded: state.isCloudLoaded,
        // New persisted fields
        currentTheme: state.currentTheme,
        unlockedThemes: state.unlockedThemes,
        duelsWon: state.duelsWon,
        duelsPlayed: state.duelsPlayed,
        survivalRecord: state.survivalRecord,
        dailyChainDay: state.dailyChainDay,
        dailyChainCompleted: state.dailyChainCompleted,
        dailyChainDate: state.dailyChainDate,
        seasonScore: state.seasonScore,
        seasonStart: state.seasonStart,
        categoryStats: state.categoryStats,
        gamesByDay: state.gamesByDay,
        gamesPlayedToday: state.gamesPlayedToday,
        gamesPlayedTodayDate: state.gamesPlayedTodayDate,
      }),
    }
  )
);

export { calcLevel, calcXpForLevel };
