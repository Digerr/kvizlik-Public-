import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import {
  QUESTIONS,
  CATEGORIES,
  getMixedQuestions,
  getQuestionsByDifficulty,
  getQuestionsForCategory,
} from "../src/lib/quiz-data";
import { summarizeRound } from "../src/lib/round";
import { encodeDuel, decodeDuel } from "../src/lib/duel";
import { validateTelegramInitData } from "../src/lib/telegram-auth";
const memory = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (k: string) => memory.get(k) ?? null,
    setItem: (k: string, v: string) => memory.set(k, v),
    removeItem: (k: string) => memory.delete(k),
  },
  configurable: true,
});
const { useQuizStore: store } =
  // Import after installing browser storage in the Node test environment.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("../src/lib/quiz-store") as typeof import("../src/lib/quiz-store");
const initial = store.getState();
beforeEach(() => {
  store.setState({
    ...initial,
    syncToCloud: async () => {},
    syncFromCloud: async () => {},
  });
  memory.clear();
});
function play(correct = true) {
  let s = store.getState();
  s.selectOption(
    correct
      ? s.questions[s.currentQuestionIndex].correctIndex
      : (s.questions[s.currentQuestionIndex].correctIndex + 1) %
          s.questions[s.currentQuestionIndex].options.length,
  );
  store.getState().revealAnswer();
}
function fullRound() {
  store.getState().startGame(null, getMixedQuestions(10));
  for (let i = 0; i < 10; i++) {
    play();
    store.getState().nextQuestion();
  }
}
test("bank: unique IDs, valid answers, at least 10 questions per category", () => {
  assert.equal(new Set(QUESTIONS.map((q) => q.id)).size, QUESTIONS.length);
  for (const q of QUESTIONS) {
    assert.ok(q.question.length > 4);
    assert.ok([2, 4].includes(q.options.length));
    assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length);
    assert.ok([1, 2, 3].includes(q.difficulty));
    assert.equal(new Set(q.options).size, q.options.length);
  }
  for (const c of CATEGORIES)
    assert.ok(QUESTIONS.filter((q) => q.category === c.id).length >= 10, c.id);
});
test("unseen questions precede repeats; exact difficulty comes first", () => {
  for (const c of CATEGORIES) {
    const all = QUESTIONS.filter((q) => q.category === c.id);
    assert.equal(
      getQuestionsForCategory(
        c.id,
        1,
        all.slice(0, -1).map((q) => q.id),
      )[0].id,
      all.at(-1)!.id,
    );
    for (const d of [1, 2, 3]) {
      const count = all.filter((q) => q.difficulty === d).length;
      assert.ok(
        getQuestionsByDifficulty(c.id, d, 10)
          .slice(0, Math.min(10, count))
          .every((q) => q.difficulty === d),
      );
    }
  }
});
test("timeout resolves at 15 ticks; records seen and category stats; reveal is idempotent", () => {
  store.getState().startGame(null, getMixedQuestions(10));
  for (let i = 0; i < 14; i++) store.getState().tick();
  assert.equal(store.getState().isRevealed, false);
  store.getState().tick();
  assert.equal(store.getState().answers.length, 1);
  assert.equal(store.getState().answers[0].isCorrect, false);
  assert.ok(
    store.getState().seenQuestions.includes(store.getState().questions[0].id),
  );
  store.getState().revealAnswer();
  assert.equal(store.getState().answers.length, 1);
});
test("answer locks instantly and survives a last-second timer tick", () => {
  store.getState().startGame(null, getMixedQuestions(10));
  store.setState({ timerRemaining: 1 });
  const q = store.getState().questions[0];
  store.getState().selectOption(q.correctIndex);
  store.getState().selectOption((q.correctIndex + 1) % q.options.length);
  store.getState().tick();
  store.getState().revealAnswer();
  assert.equal(store.getState().answers[0].isCorrect, true);
});
test("round settles once; summary agrees with score; chest claims once", () => {
  fullRound();
  const s = store.getState();
  assert.equal(s.phase, "result");
  assert.equal(s.gamesPlayed, 1);
  assert.equal(s.roundSummary?.correct, 10);
  assert.equal(s.totalScore, s.roundSummary?.score);
  const coins = s.coins;
  store.getState().endGame();
  assert.equal(store.getState().coins, coins);
  store.getState().openChest();
  const total = store.getState().coins;
  store.getState().openChest();
  assert.equal(store.getState().coins, total);
});
test("historical best streak never adds points to an all-wrong round", () => {
  store.setState({ bestStreak: 50 });
  store.getState().startGame(null, getMixedQuestions(10));
  for (let i = 0; i < 10; i++) {
    play(false);
    store.getState().nextQuestion();
  }
  assert.equal(store.getState().roundSummary?.score, 0);
  assert.equal(store.getState().roundSummary?.bestStreak, 0);
});
test("survival remains playable after a mistake; continue deducts once and resets next round", async () => {
  store.setState({ coins: 300 });
  store.getState().startGame(null, getMixedQuestions(10), false, "survival");
  play(false);
  await new Promise((r) => setTimeout(r, 1100));
  assert.equal(store.getState().phase, "game");
  assert.equal(store.getState().useContinue(), true);
  assert.equal(store.getState().coins, 200);
  assert.equal(store.getState().currentQuestionIndex, 1);
  play(false);
  assert.equal(store.getState().useContinue(), false);
  store.getState().endGame();
  assert.equal(store.getState().phase, "result");
  store.getState().startGame(null, getMixedQuestions(10), false, "survival");
  assert.equal(store.getState().continueUsed, false);
});
test("survival extends the bank locally", () => {
  store.getState().startGame(null, getMixedQuestions(10), false, "survival");
  for (let i = 0; i < 10; i++) {
    play();
    store.getState().nextQuestion();
  }
  assert.equal(store.getState().phase, "game");
  assert.equal(store.getState().currentQuestionIndex, 10);
  assert.equal(store.getState().questions.length, 20);
});
test("duel round-trip keeps order and Unicode; rejects forged score and missing questions", () => {
  const data = {
    questions: getMixedQuestions(10).map((q) => q.id),
    creatorScore: 7,
    creatorName: "Сега 🤘",
    creatorReactions: [],
  };
  assert.deepEqual(decodeDuel(encodeDuel(data)), data);
  assert.equal(decodeDuel(encodeDuel({ ...data, creatorScore: 999 })), null);
  assert.equal(
    decodeDuel(encodeDuel({ ...data, questions: ["missing"] })),
    null,
  );
  assert.equal(decodeDuel("garbage"), null);
});
test("duel automatically settles; repeated finalization cannot award twice", () => {
  store.getState().startDuel(getMixedQuestions(10));
  for (let i = 0; i < 10; i++) {
    play();
    store.getState().nextQuestion();
  }
  assert.ok(store.getState().duelShareLink);
  const score = store.getState().totalScore;
  store.getState().finishDuelCreator();
  store.getState().finishDuelCreator();
  assert.equal(store.getState().totalScore, score);
  assert.equal(store.getState().duelsPlayed, 1);
});
test("daily chain cannot be collected before playing or seven times today", () => {
  store.getState().claimDailyChain(0);
  assert.equal(store.getState().dailyChainDay, 0);
  fullRound();
  store.getState().claimDailyChain(0);
  const coins = store.getState().coins;
  store.getState().claimDailyChain(1);
  assert.equal(store.getState().dailyChainDay, 1);
  assert.equal(store.getState().coins, coins);
});
test("referral is single-use; locked season rewards cannot be collected", async () => {
  store.setState({ telegramId: "123", coins: 0 });
  await store.getState().processReferral(456);
  const coins = store.getState().coins;
  await store.getState().processReferral(456);
  await store.getState().processReferral(789);
  assert.equal(store.getState().coins, coins);
  store.getState().claimSeasonPassTier(10);
  assert.equal(store.getState().seasonPassClaimed.length, 0);
});
test("account switch clears another identity balance and cloud-loaded state", () => {
  store.setState({ telegramId: "123", coins: 999, isCloudLoaded: true });
  store.getState().setTelegramId("456");
  assert.equal(store.getState().coins, 0);
  assert.equal(store.getState().isCloudLoaded, false);
});
test("zero answers earn no speed or perfection bonus", () =>
  assert.equal(summarizeRound([]).score, 0));
test("Telegram authentication checks signature and timestamp", () => {
  const token = "unit-test-token";
  const now = Date.now();
  const p = new URLSearchParams({
    auth_date: String(Math.floor(now / 1000)),
    user: JSON.stringify({ id: 123 }),
  });
  const check = [...p]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  const secret = createHmac("sha256", "WebAppData").update(token).digest();
  p.set("hash", createHmac("sha256", secret).update(check).digest("hex"));
  assert.equal(validateTelegramInitData(p.toString(), token, now), true);
  assert.equal(
    validateTelegramInitData(p.toString(), token, now + 90000000),
    false,
  );
  assert.equal(validateTelegramInitData(p.toString(), undefined, now), false);
  p.set("user", '{"id":999}');
  assert.equal(validateTelegramInitData(p.toString(), token, now), false);
});

test("navigation never makes an old balance look freshly saved", () => {
  store.setState({ savedAt: 123, coins: 100 });
  store.getState().setPhase("profile");
  assert.equal(store.getState().savedAt, 123);
  store.getState().setPlayerName("New name");
  store.getState().refreshDailyTasks();
  store.getState().checkSeason();
  assert.equal(store.getState().savedAt, 123);
  fullRound();
  assert.ok(store.getState().savedAt > 123);
});
