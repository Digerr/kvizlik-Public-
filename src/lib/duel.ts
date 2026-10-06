import type { DuelData } from "./quiz-store";
import { getQuestionsByIds } from "./quiz-data";
export function encodeDuel(data: DuelData): string {
  return btoa(encodeURIComponent(JSON.stringify(data)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
export function decodeDuel(value: string): DuelData | null {
  try {
    if (value.length > 8000) return null;
    const data = JSON.parse(
      decodeURIComponent(atob(value.replace(/-/g, "+").replace(/_/g, "/"))),
    );
    if (
      !Array.isArray(data.questions) ||
      data.questions.length !== 10 ||
      new Set(data.questions).size !== 10 ||
      !data.questions.every((id: unknown) => typeof id === "string")
    )
      return null;
    if (
      getQuestionsByIds(data.questions).length !== 10 ||
      !Number.isInteger(data.creatorScore) ||
      data.creatorScore < 0 ||
      data.creatorScore > 10 ||
      typeof data.creatorName !== "string"
    )
      return null;
    return {
      questions: data.questions,
      creatorScore: data.creatorScore,
      creatorName: data.creatorName.slice(0, 60),
      creatorReactions: [],
    };
  } catch {
    return null;
  }
}
export function duelUrl(data: DuelData): string {
  const origin =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "https://kvizlik-public.vercel.app"
      : window.location.origin;
  return `${origin}/?duel=${encodeDuel(data)}`;
}
