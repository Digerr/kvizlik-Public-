import { create } from "zustand";
import {
  type Player,
  type Location,
  AVATARS,
  generateId,
  getRandomLocation,
  getRandomSpyIndex,
  getShuffledLocations,
} from "./game-data";

export type GamePhase =
  | "home"
  | "setup"
  | "rules"
  | "roleReveal"
  | "questioning"
  | "voting"
  | "spyGuess"
  | "results";

export interface GameState {
  phase: GamePhase;
  players: Player[];
  location: Location | null;
  spyIndex: number;
  currentRevealIndex: number;
  revealedRoles: Set<number>;
  timerDuration: number;
  timerRemaining: number;
  votes: Record<string, string | null>; // voterId -> votedForId
  currentVoterIndex: number;
  spyGuessLocations: Location[];
  spyGuessedCorrectly: boolean | null;
  round: number;
  showRole: boolean;

  // Actions
  setPhase: (phase: GamePhase) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  setTimerDuration: (duration: number) => void;
  startGame: () => void;
  revealRole: () => void;
  nextReveal: () => void;
  setTimerRemaining: (time: number) => void;
  decrementTimer: () => void;
  castVote: (votedForId: string) => void;
  nextVoter: () => void;
  spyGuess: (locationId: string) => void;
  resetGame: () => void;
  newRound: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: "home",
  players: [],
  location: null,
  spyIndex: -1,
  currentRevealIndex: 0,
  revealedRoles: new Set<number>(),
  timerDuration: 420,
  timerRemaining: 420,
  votes: {},
  currentVoterIndex: 0,
  spyGuessLocations: [],
  spyGuessedCorrectly: null,
  round: 1,
  showRole: false,

  setPhase: (phase) => set({ phase }),

  addPlayer: (name) => {
    const state = get();
    if (state.players.length >= 8) return;
    const avatar = AVATARS[state.players.length % AVATARS.length];
    const newPlayer: Player = {
      id: generateId(),
      name,
      avatar,
      isSpy: false,
      score: 0,
    };
    set({ players: [...state.players, newPlayer] });
  },

  removePlayer: (id) => {
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    }));
  },

  setTimerDuration: (duration) => set({ timerDuration: duration, timerRemaining: duration }),

  startGame: () => {
    const state = get();
    const location = getRandomLocation();
    const spyIndex = getRandomSpyIndex(state.players.length);

    const players = state.players.map((p, i) => ({
      ...p,
      isSpy: i === spyIndex,
    }));

    set({
      phase: "roleReveal",
      location,
      spyIndex,
      players,
      currentRevealIndex: 0,
      revealedRoles: new Set<number>(),
      timerRemaining: state.timerDuration,
      votes: {},
      currentVoterIndex: 0,
      spyGuessedCorrectly: null,
      showRole: false,
    });
  },

  revealRole: () => {
    set({ showRole: true });
  },

  nextReveal: () => {
    const state = get();
    const nextIndex = state.currentRevealIndex + 1;
    const newRevealed = new Set(state.revealedRoles);
    newRevealed.add(state.currentRevealIndex);

    if (nextIndex >= state.players.length) {
      set({
        phase: "questioning",
        revealedRoles: newRevealed,
        currentRevealIndex: nextIndex,
        timerRemaining: state.timerDuration,
        showRole: false,
      });
    } else {
      set({
        currentRevealIndex: nextIndex,
        revealedRoles: newRevealed,
        showRole: false,
      });
    }
  },

  setTimerRemaining: (time) => set({ timerRemaining: time }),

  decrementTimer: () => {
    const state = get();
    if (state.timerRemaining <= 0) {
      set({ phase: "voting", currentVoterIndex: 0, votes: {} });
      return;
    }
    set({ timerRemaining: state.timerRemaining - 1 });
  },

  castVote: (votedForId) => {
    const state = get();
    const currentVoter = state.players[state.currentVoterIndex];
    if (!currentVoter) return;
    set({
      votes: { ...state.votes, [currentVoter.id]: votedForId },
    });
  },

  nextVoter: () => {
    const state = get();
    const nextIndex = state.currentVoterIndex + 1;

    if (nextIndex >= state.players.length) {
      // Tally votes
      const voteCounts: Record<string, number> = {};
      Object.values(state.votes).forEach((votedForId) => {
        if (votedForId) {
          voteCounts[votedForId] = (voteCounts[votedForId] || 0) + 1;
        }
      });

      // Find the most voted player
      let maxVotes = 0;
      let mostVotedId: string | null = null;
      Object.entries(voteCounts).forEach(([id, count]) => {
        if (count > maxVotes) {
          maxVotes = count;
          mostVotedId = id;
        }
      });

      const caughtPlayer = state.players.find((p) => p.id === mostVotedId);
      const isSpyCaught = caughtPlayer?.isSpy ?? false;

      if (isSpyCaught) {
        // Spy was caught - give them a chance to guess the location
        const fakeLocations = getShuffledLocations(state.location ?? undefined, 4);
        const spyGuessLocations = [state.location!, ...fakeLocations].sort(
          () => Math.random() - 0.5
        );
        set({
          phase: "spyGuess",
          spyGuessLocations,
          currentVoterIndex: nextIndex,
        });
      } else {
        // Spy wasn't caught - spy wins
        const updatedPlayers = state.players.map((p) => {
          if (p.isSpy) return { ...p, score: p.score + 2 };
          return p;
        });
        set({
          phase: "results",
          players: updatedPlayers,
          spyGuessedCorrectly: false,
          currentVoterIndex: nextIndex,
        });
      }
    } else {
      set({ currentVoterIndex: nextIndex });
    }
  },

  spyGuess: (locationId) => {
    const state = get();
    const correct = state.location?.id === locationId;
    const updatedPlayers = state.players.map((p) => {
      if (p.isSpy && correct) return { ...p, score: p.score + 1 };
      if (!p.isSpy && !correct) return { ...p, score: p.score + 1 };
      return p;
    });
    set({
      phase: "results",
      spyGuessedCorrectly: correct,
      players: updatedPlayers,
    });
  },

  resetGame: () => {
    set({
      phase: "home",
      players: [],
      location: null,
      spyIndex: -1,
      currentRevealIndex: 0,
      revealedRoles: new Set<number>(),
      timerDuration: 420,
      timerRemaining: 420,
      votes: {},
      currentVoterIndex: 0,
      spyGuessLocations: [],
      spyGuessedCorrectly: null,
      round: 1,
      showRole: false,
    });
  },

  newRound: () => {
    const state = get();
    const location = getRandomLocation();
    const spyIndex = getRandomSpyIndex(state.players.length);
    const players = state.players.map((p, i) => ({
      ...p,
      isSpy: i === spyIndex,
    }));

    set({
      phase: "roleReveal",
      location,
      spyIndex,
      players,
      currentRevealIndex: 0,
      revealedRoles: new Set<number>(),
      timerRemaining: state.timerDuration,
      votes: {},
      currentVoterIndex: 0,
      spyGuessedCorrectly: null,
      round: state.round + 1,
      showRole: false,
    });
  },
}));
