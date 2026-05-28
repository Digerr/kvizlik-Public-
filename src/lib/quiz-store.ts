import { create } from "zustand";
import { type Question, type League, getLeagueByScore } from "./quiz-data";

export type QuizPhase =
  | "home"
  | "category"
  | "game"
  | "result"
  | "leaderboard";

export interface AnswerRecord {
  questionId: string;
  selectedOption: number;
  correctOption: number;
  timeSpent: number;
  isCorrect: boolean;
}

export interface QuizState {
  phase: QuizPhase;
  // Player
  playerName: string;
  totalScore: number;
  gamesPlayed: number;
  totalCorrect: number;
  totalQuestions: number;
  bestStreak: number;
  currentStreak: number;
  // Current game
  categoryId: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: AnswerRecord[];
  timePerQuestion: number; // seconds
  timerRemaining: number;
  selectedOption: number | null;
  isRevealed: boolean;
  isTimerRunning: boolean;

  // Actions
  setPhase: (phase: QuizPhase) => void;
  setPlayerName: (name: string) => void;
  startGame: (categoryId: string | null, questions: Question[]) => void;
  selectOption: (optionIndex: number) => void;
  revealAnswer: () => void;
  nextQuestion: () => void;
  tick: () => void;
  endGame: () => void;
  playAgain: () => void;
  resetAll: () => void;
}

const INITIAL_STATE = {
  phase: "home" as QuizPhase,
  playerName: "",
  totalScore: 0,
  gamesPlayed: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  bestStreak: 0,
  currentStreak: 0,
  categoryId: null as string | null,
  questions: [] as Question[],
  currentQuestionIndex: 0,
  answers: [] as AnswerRecord[],
  timePerQuestion: 15,
  timerRemaining: 15,
  selectedOption: null as number | null,
  isRevealed: false,
  isTimerRunning: false,
};

export const useQuizStore = create<QuizState>((set, get) => ({
  ...INITIAL_STATE,

  setPhase: (phase) => set({ phase }),

  setPlayerName: (name) => set({ playerName: name }),

  startGame: (categoryId, questions) => {
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
    });
  },

  selectOption: (optionIndex) => {
    const state = get();
    if (state.isRevealed) return;
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

    set({
      isRevealed: true,
      isTimerRunning: false,
      answers: [...state.answers, answer],
      currentStreak: newStreak,
      bestStreak: Math.max(state.bestStreak, newStreak),
    });
  },

  nextQuestion: () => {
    const state = get();
    const nextIndex = state.currentQuestionIndex + 1;

    if (nextIndex >= state.questions.length) {
      // End game
      const correctCount = state.answers.filter(a => a.isCorrect).length;
      const avgTime = state.answers.reduce((sum, a) => sum + a.timeSpent, 0) / state.answers.length;
      const speedBonus = avgTime < 5 ? 3 : avgTime < 10 ? 1 : 0;
      const streakBonus = state.bestStreak >= 5 ? 5 : state.bestStreak >= 3 ? 2 : 0;
      const roundScore = correctCount * 10 + speedBonus + streakBonus;

      set({
        phase: "result",
        totalScore: state.totalScore + roundScore,
        gamesPlayed: state.gamesPlayed + 1,
        totalCorrect: state.totalCorrect + correctCount,
        totalQuestions: state.totalQuestions + state.questions.length,
      });
    } else {
      set({
        currentQuestionIndex: nextIndex,
        timerRemaining: 15,
        selectedOption: null,
        isRevealed: false,
        isTimerRunning: true,
      });
    }
  },

  tick: () => {
    const state = get();
    if (!state.isTimerRunning) return;
    if (state.timerRemaining <= 0) {
      // Time's up - auto reveal
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
    const correctCount = state.answers.filter(a => a.isCorrect).length;
    const avgTime = state.answers.reduce((sum, a) => sum + a.timeSpent, 0) / (state.answers.length || 1);
    const speedBonus = avgTime < 5 ? 3 : avgTime < 10 ? 1 : 0;
    const streakBonus = state.bestStreak >= 5 ? 5 : state.bestStreak >= 3 ? 2 : 0;
    const roundScore = correctCount * 10 + speedBonus + streakBonus;

    set({
      phase: "result",
      totalScore: state.totalScore + roundScore,
      gamesPlayed: state.gamesPlayed + 1,
      totalCorrect: state.totalCorrect + correctCount,
      totalQuestions: state.totalQuestions + state.questions.length,
    });
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
    });
  },

  resetAll: () => set(INITIAL_STATE),
}));
