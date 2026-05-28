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
  | "duel_result";

export interface DuelData {
  questions: string[];
  creatorScore: number;
  creatorName: string;
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
  type: "games" | "correct" | "streak" | "category";
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

  // Cloud sync
  isCloudLoaded: boolean;
  isCloudSyncing: boolean;
  lastCloudSync: number;

  // Leaderboard (real from cloud)
  leaderboard: LeaderboardEntry[];

  // Actions
  setPhase: (phase: QuizPhase) => void;
  setPlayerName: (name: string) => void;
  setTelegramId: (id: string | null) => void;
  setAvatar: (avatarId: string) => void;
  setDifficulty: (d: 1 | 2 | 3) => void;
  startGame: (categoryId: string | null, questions: Question[], aiMode?: boolean) => void;
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

  resetAll: () => void;
}

function generateDailyTasks(): DailyTaskProgress[] {
  const shuffled = [...DAILY_TASKS_TEMPLATE].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((t, i) => ({
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
  isCloudLoaded: false,
  isCloudSyncing: false,
  lastCloudSync: 0,
  leaderboard: [] as LeaderboardEntry[],
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
            // Cloud data is source of truth — merge with local (take the higher values)
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

            // Take the max between local and cloud (local might have newer data if cloud failed before)
            const merged = {
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
            };

            set({
              ...merged,
              isCloudLoaded: true,
              isCloudSyncing: false,
            });
          } else {
            // No cloud profile yet — this is first time, upload local data
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

        // Don't sync too often (at least 2 seconds between syncs)
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
          });

          // Also update leaderboard
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

      startGame: (categoryId, questions, aiMode = false) => {
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
        });
      },

      nextQuestion: () => {
        const state = get();
        const nextIndex = state.currentQuestionIndex + 1;

        if (nextIndex >= state.questions.length) {
          get().endGame();
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
        if (correctCount === totalQuestions) roundScore += 25;

        const coinsEarned = Math.ceil(roundScore / 2);

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

        set({
          phase: "result",
          totalScore: newTotalScore,
          gamesPlayed: state.gamesPlayed + 1,
          totalCorrect: state.totalCorrect + correctCount,
          totalQuestions: state.totalQuestions + totalQuestions,
          coins: state.coins + coinsEarned,
          currentLeague: newLeague.id,
          categoriesPlayed: newCategoriesPlayed,
          dailyStreak: newDailyStreak,
          lastDailyAt: today,
        });

        get().updateDailyProgress("games", 1);
        get().updateDailyProgress("correct", correctCount);
        if (state.bestStreak >= 3) get().updateDailyProgress("streak", 1);
        if (state.categoryId) get().updateDailyProgress("category", 1);

        get().checkAchievements();

        // Sync to cloud after game ends
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
        // Sync to cloud after purchase
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
        // Sync to cloud after purchase
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
        });
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

        set({
          duelMode: true,
          duelData,
          phase: 'result',
          totalScore: newTotalScore,
          gamesPlayed: state.gamesPlayed + 1,
          totalCorrect: state.totalCorrect + correctCount,
          totalQuestions: state.totalQuestions + state.questions.length,
          coins: state.coins + coinsEarned,
          currentLeague: newLeague.id,
          dailyStreak: newDailyStreak,
          lastDailyAt: today,
        });

        get().updateDailyProgress('games', 1);
        get().updateDailyProgress('correct', correctCount);
        get().checkAchievements();
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

        set({
          duelResult: {
            myScore: correctCount,
            opponentScore,
            opponentName,
            won,
          },
          phase: 'duel_result',
          totalScore: newTotalScore,
          gamesPlayed: state.gamesPlayed + 1,
          totalCorrect: state.totalCorrect + correctCount,
          totalQuestions: state.totalQuestions + state.questions.length,
          coins: state.coins + coinsEarned,
          currentLeague: newLeague.id,
          dailyStreak: newDailyStreak,
          lastDailyAt: today,
        });

        get().updateDailyProgress('games', 1);
        get().updateDailyProgress('correct', correctCount);
        get().checkAchievements();
        get().syncToCloud();
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
      }),
    }
  )
);

export { calcLevel, calcXpForLevel };
