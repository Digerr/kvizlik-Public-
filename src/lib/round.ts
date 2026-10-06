import type { AnswerRecord } from "./quiz-store";
export interface RoundSummary {
  score: number;
  coins: number;
  correct: number;
  answered: number;
  bestStreak: number;
  accuracy: number;
}
export function summarizeRound(
  answers: AnswerRecord[],
  survival = false,
): RoundSummary {
  let streak = 0,
    bestStreak = 0;
  for (const answer of answers) {
    streak = answer.isCorrect ? streak + 1 : 0;
    bestStreak = Math.max(bestStreak, streak);
  }
  const correct = answers.filter((a) => a.isCorrect).length;
  const average =
    answers.reduce((n, a) => n + a.timeSpent, 0) / (answers.length || 1);
  let score = correct * 10;
  if (correct > 0 && average < 5) score += 5;
  if (bestStreak >= 5) score += 10;
  if (bestStreak >= 10) score += 20;
  if (answers.length > 0 && correct === answers.length) score += 25;
  if (survival)
    score = Math.round(score * Math.min(1 + Math.floor(correct / 5) * 0.5, 3));
  return {
    score,
    coins: Math.ceil(score / 2),
    correct,
    answered: answers.length,
    bestStreak,
    accuracy: answers.length ? Math.round((correct / answers.length) * 100) : 0,
  };
}
export function localDate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
